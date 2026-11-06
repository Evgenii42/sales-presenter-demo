async function localVideoDescription(peer, description) {
  await peer.setLocalDescription(description);
  if (peer.iceGatheringState !== "complete") {
    await new Promise((resolve) => {
      const timeout = setTimeout(finish, 3000);
      function finish() {
        clearTimeout(timeout);
        peer.removeEventListener("icegatheringstatechange", check);
        resolve();
      }
      function check() {
        if (peer.iceGatheringState === "complete") finish();
      }
      peer.addEventListener("icegatheringstatechange", check);
      check();
    });
  }
  return peer.localDescription?.toJSON();
}

function catalogVideoChannel(session) {
  return new BroadcastChannel(`presenter-video:${session}`);
}

function startCatalogPublisher(session) {
  const section = document.getElementById("catalog-share");
  const button = document.getElementById("share-catalog");
  const status = document.getElementById("catalog-share-status");
  const instructions = "Сначала откройте каталог или карту, затем выберите эту вкладку Chrome или Edge.";
  const available = Boolean(navigator.mediaDevices?.getDisplayMedia && window.RTCPeerConnection && window.BroadcastChannel);
  const channel = available ? catalogVideoChannel(session) : null;
  const events = new AbortController();
  const peers = new Map();
  let stream;
  let request = 0;

  function removePeer(viewer) {
    const peer = peers.get(viewer);
    peers.delete(viewer);
    peer?.close();
  }

  function stop(message = instructions) {
    request++;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      stream = undefined;
      channel.postMessage({ type: "stop" });
    }
    for (const viewer of peers.keys()) removePeer(viewer);
    button.disabled = !available;
    button.textContent = "Показать вкладку";
    status.textContent = available ? message : "Для показа вкладки откройте панель в Chrome или Edge.";
  }

  async function offerVideo(viewer) {
    if (!stream || peers.has(viewer)) return;
    const peer = new RTCPeerConnection();
    peers.set(viewer, peer);
    peer.onconnectionstatechange = () => {
      if (peer.connectionState === "failed" && peers.get(viewer) === peer) removePeer(viewer);
    };
    try {
      peer.addTrack(stream.getVideoTracks()[0], stream);
      const description = await localVideoDescription(peer, await peer.createOffer());
      if (description && peers.get(viewer) === peer) channel.postMessage({ type: "offer", viewer, description });
    } catch {
      if (peers.get(viewer) === peer) removePeer(viewer);
    }
  }

  if (channel) channel.onmessage = async ({ data }) => {
    if (typeof data?.viewer !== "string") return;
    if (data.type === "ready") await offerVideo(data.viewer);
    if (data.type === "leave") removePeer(data.viewer);
    if (data.type === "answer") {
      const peer = peers.get(data.viewer);
      if (peer?.signalingState !== "have-local-offer") return;
      try {
        await peer.setRemoteDescription(data.description);
      } catch {
        if (peers.get(data.viewer) === peer) removePeer(data.viewer);
      }
    }
  };

  button.addEventListener("click", async () => {
    if (stream) {
      stop("Показ вкладки завершён.");
      return;
    }
    const attempt = ++request;
    button.disabled = true;
    status.textContent = "Выберите вкладку с каталогом или картой.";
    try {
      const capture = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: "browser" },
        audio: false,
        selfBrowserSurface: "exclude",
        monitorTypeSurfaces: "exclude",
        surfaceSwitching: "exclude"
      });
      const track = capture.getVideoTracks()[0];
      if (attempt !== request || track?.getSettings().displaySurface !== "browser" || track.readyState !== "live") {
        capture.getTracks().forEach((item) => item.stop());
        if (attempt === request) stop("Выберите вкладку браузера с каталогом.");
        return;
      }
      stream = capture;
      track.addEventListener("ended", () => {
        if (stream === capture) stop("Показ вкладки завершён.");
      }, { once: true });
      button.disabled = false;
      button.textContent = "Остановить показ вкладки";
      status.textContent = "Показ включён для клиентских окон в этом профиле браузера.";
      channel.postMessage({ type: "available" });
    } catch {
      if (attempt === request) stop("Захват не запущен. Вы можете выбрать вкладку снова.");
    }
  }, { signal: events.signal });

  window.addEventListener("pagehide", () => stop(), { signal: events.signal });
  stop();
  return {
    show(active) {
      if (!active && !section.hidden) stop();
      section.hidden = !active;
    },
    close() {
      stop();
      events.abort();
      channel?.close();
    }
  };
}

function startCatalogViewer(session) {
  if (!window.RTCPeerConnection || !window.BroadcastChannel) return;
  const channel = catalogVideoChannel(session);
  const viewer = crypto.randomUUID();
  const overlay = document.getElementById("catalog-live");
  const video = document.getElementById("catalog-video");
  const stage = document.getElementById("stage");
  let peer;

  function reset() {
    const previous = peer;
    peer = undefined;
    previous?.close();
    video.srcObject = null;
    overlay.hidden = true;
    stage.inert = false;
  }

  function requestVideo() {
    channel.postMessage({ type: "ready", viewer });
  }

  channel.onmessage = async ({ data }) => {
    if (data?.type === "available") requestVideo();
    if (data?.type === "stop") reset();
    if (data?.type !== "offer" || data.viewer !== viewer) return;

    reset();
    const connection = new RTCPeerConnection();
    peer = connection;
    connection.ontrack = ({ streams }) => {
      if (peer !== connection || !streams[0]) return;
      video.srcObject = streams[0];
      overlay.hidden = false;
      stage.inert = true;
    };
    connection.onconnectionstatechange = () => {
      if (peer === connection && connection.connectionState === "failed") reset();
    };
    try {
      await connection.setRemoteDescription(data.description);
      const description = await localVideoDescription(connection, await connection.createAnswer());
      if (description && peer === connection) channel.postMessage({ type: "answer", viewer, description });
    } catch {
      if (peer === connection) reset();
    }
  };
  window.addEventListener("pagehide", () => {
    channel.postMessage({ type: "leave", viewer });
    reset();
  });
  window.addEventListener("pageshow", requestVideo);
  requestVideo();
}
