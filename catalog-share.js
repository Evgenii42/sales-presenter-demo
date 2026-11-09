const catalogFrameWait = 6500;

function catalogVideoChannel(session) {
  return new BroadcastChannel(`presenter-video:${session}`);
}

function startCatalogPublisher(session) {
  const section = document.getElementById("catalog-share");
  const button = document.getElementById("share-catalog");
  const status = document.getElementById("catalog-share-status");
  const available = Boolean(navigator.mediaDevices?.getDisplayMedia && window.MediaStreamTrackProcessor
    && window.OffscreenCanvas && window.BroadcastChannel);
  const channel = available ? catalogVideoChannel(session) : null;
  const events = new AbortController();
  let active;
  let kind;
  let sceneKey;
  let request = 0;

  function stop(message) {
    request++;
    const previous = active;
    active = undefined;
    if (previous) {
      clearTimeout(previous.waiting);
      previous.reader.cancel().catch(() => {});
      previous.stream.getTracks().forEach((track) => track.stop());
      channel.postMessage({ type: "stop" });
    }
    button.disabled = !available;
    button.textContent = kind === "map" ? "Показать карту клиенту" : "Показать вкладку";
    const instructions = kind === "map" ? "Откройте Яндекс Карты и выберите их вкладку."
      : "Откройте каталог или карту квартир, затем выберите эту вкладку Chrome или Edge.";
    status.textContent = available ? message || instructions : "Для показа вкладки откройте панель в Chrome или Edge.";
  }

  async function publishFrames(capture) {
    const canvas = new OffscreenCanvas(1, 1);
    const context = canvas.getContext("2d", { alpha: false });
    let stopMessage = "Показ вкладки завершён.";
    try {
      while (active === capture) {
        const { value: frame, done } = await capture.reader.read();
        if (done) break;
        try {
          if (active !== capture) break;
          const width = frame.displayWidth;
          const height = frame.displayHeight;
          const scale = Math.min(1, 1920 / width, 1080 / height);
          const outputWidth = Math.max(1, Math.round(width * scale));
          const outputHeight = Math.max(1, Math.round(height * scale));
          if (canvas.width !== outputWidth) canvas.width = outputWidth;
          if (canvas.height !== outputHeight) canvas.height = outputHeight;
          context.drawImage(frame, 0, 0, outputWidth, outputHeight);
        } finally {
          frame.close();
        }
        const image = await canvas.convertToBlob({ type: "image/webp", quality: 0.86 });
        if (active !== capture) break;
        if (!capture.image) {
          clearTimeout(capture.waiting);
          status.textContent = "Изображение вкладки передаётся в этом профиле браузера.";
        }
        capture.image = image;
        channel.postMessage({ type: "frame", image, kind: capture.kind });
      }
    } catch {
      stopMessage = "Не удалось передать изображение. Попробуйте снова выбрать вкладку.";
    } finally {
      if (active === capture) stop(stopMessage);
      capture.reader.releaseLock();
    }
  }

  if (channel) channel.onmessage = ({ data }) => {
    if (data?.type !== "ready" || typeof data.viewer !== "string" || !active) return;
    channel.postMessage(active.image
      ? { type: "frame", image: active.image, kind: active.kind, viewer: data.viewer }
      : { type: "start", kind: active.kind, viewer: data.viewer });
  };

  button.addEventListener("click", async () => {
    if (active) {
      stop("Показ вкладки завершён.");
      return;
    }
    const attempt = ++request;
    button.disabled = true;
    status.textContent = kind === "map" ? "Выберите вкладку с Яндекс Картами." : "Выберите вкладку с каталогом или картой квартир.";
    let stream;
    try {
      stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: "browser", frameRate: { max: 15 } },
        audio: false,
        selfBrowserSurface: "exclude",
        monitorTypeSurfaces: "exclude",
        surfaceSwitching: "exclude"
      });
      const track = stream.getVideoTracks()[0];
      if (attempt !== request || track?.getSettings().displaySurface !== "browser" || track.readyState !== "live") {
        stream.getTracks().forEach((item) => item.stop());
        if (attempt === request) stop("Выберите вкладку браузера.");
        return;
      }
      const reader = new MediaStreamTrackProcessor({ track, maxBufferSize: 1 }).readable.getReader();
      const waiting = setTimeout(() => {
        status.textContent = "Браузер пока не передаёт кадры. Перейдите в выбранную вкладку или запустите показ снова.";
      }, catalogFrameWait);
      const capture = { stream, reader, waiting, kind };
      active = capture;
      track.addEventListener("ended", () => {
        if (active === capture) stop("Показ вкладки завершён.");
      }, { once: true });
      button.disabled = false;
      button.textContent = "Остановить показ вкладки";
      status.textContent = "Ждём первый кадр из выбранной вкладки.";
      channel.postMessage({ type: "start", kind });
      void publishFrames(capture);
    } catch {
      stream?.getTracks().forEach((track) => track.stop());
      if (attempt === request) stop("Захват не запущен. Вы можете выбрать вкладку снова.");
    }
  }, { signal: events.signal });

  window.addEventListener("pagehide", () => stop(), { signal: events.signal });
  stop();
  return {
    show(nextKind, nextScene) {
      if (nextKind !== kind || nextScene !== sceneKey) {
        kind = nextKind;
        sceneKey = nextScene;
        stop();
      }
      section.hidden = !kind;
    },
    close() {
      stop();
      events.abort();
      channel?.close();
    }
  };
}

function startCatalogViewer(session) {
  if (!window.BroadcastChannel || !window.createImageBitmap) return;
  const channel = catalogVideoChannel(session);
  const viewer = crypto.randomUUID();
  const overlay = document.getElementById("catalog-live");
  const title = overlay.querySelector("h1");
  const canvas = document.getElementById("catalog-frame");
  const context = canvas.getContext("2d", { alpha: false });
  const stage = document.getElementById("stage");
  const status = document.getElementById("catalog-view-status");
  let waiting;
  let generation = 0;
  let pending;
  let drawing = false;

  function reset() {
    clearTimeout(waiting);
    status.hidden = true;
    generation++;
    pending = undefined;
    overlay.hidden = true;
    stage.inert = false;
    canvas.width = 1;
    canvas.height = 1;
  }

  function waitForFrames() {
    reset();
    status.textContent = "Подключаем показ вкладки…";
    status.hidden = false;
    waiting = setTimeout(() => {
      status.textContent = "Изображение вкладки пока не поступает.";
    }, catalogFrameWait);
  }

  async function drawFrames(image) {
    pending = image;
    if (drawing) return;
    drawing = true;
    while (pending) {
      const current = generation;
      const source = pending;
      pending = undefined;
      let frame;
      try {
        frame = await createImageBitmap(source);
        if (current !== generation) continue;
        if (canvas.width !== frame.width) canvas.width = frame.width;
        if (canvas.height !== frame.height) canvas.height = frame.height;
        context.drawImage(frame, 0, 0);
        clearTimeout(waiting);
        status.hidden = true;
        overlay.hidden = false;
        stage.inert = true;
      } catch {
        // Keep the current scene available while waiting for a valid frame.
      } finally {
        frame?.close();
      }
    }
    drawing = false;
  }

  function requestFrames() {
    channel.postMessage({ type: "ready", viewer });
  }

  channel.onmessage = ({ data }) => {
    if (!data || (data.viewer && data.viewer !== viewer)) return;
    if (data.type === "start") waitForFrames();
    if (data.type === "stop") reset();
    if (data.type === "frame" && data.image instanceof Blob) {
      title.textContent = data.kind === "map" ? "Маршрут на карте" : "Подбор квартир · Прямой показ";
      void drawFrames(data.image);
    }
  };
  window.addEventListener("pagehide", reset);
  window.addEventListener("pageshow", requestFrames);
  requestFrames();
}
