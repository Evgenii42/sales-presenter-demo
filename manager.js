function startManager(session, send) {
  const cues = {
    U01: "Скажите, что уже знаете из заявки, и спросите, актуально ли это. Уточните, что клиент хочет решить к концу встречи.",
    U08: "Уточните, как человек обычно возвращается домой. Если он назвал коляску и хочет посмотреть маршрут, откройте ветку.",
    H02: "Попросите назвать самый неудобный участок привычного пути. Покажите, какие места проверите в конкретной секции.",
    U19: "Повторите обязательные условия словами клиента и попросите подтвердить их перед подбором.",
    U20: "Покажите, какой критерий закрывает каждый вариант и что ещё нужно проверить."
  };
  const nextScene = { U01: "U08", U08: "U19", H02: "U19", U19: "U20" };
  const route = ["U01"];
  const steps = document.querySelectorAll("[data-step]");
  const events = new AbortController();
  const options = { signal: events.signal };
  let mouse = null;
  let frame = null;

  byId("client-link").href = `client.html#${session}`;
  byId("workspace").hidden = false;
  byId("show-actions").hidden = false;

  function publicPoint() {
    if (!mouse) return null;
    const target = document.elementFromPoint(mouse.x, mouse.y)?.closest("[data-anchor]");
    if (!target || !stage.contains(target)) return null;
    const rect = target.getBoundingClientRect();
    return { block: target.dataset.anchor, x: (mouse.x - rect.left) / rect.width, y: (mouse.y - rect.top) / rect.height };
  }

  function publish() {
    send({
      scene: currentScene,
      position: currentPosition(),
      point: publicPoint()
    });
  }

  function schedulePublish() {
    if (frame !== null) return;
    frame = requestAnimationFrame(() => {
      frame = null;
      publish();
    });
  }

  function show() {
    const id = route.at(-1);
    mouse = null;
    renderScene(id);
    for (const step of steps) {
      if (step.dataset.step === id) step.setAttribute("aria-current", "step");
      else step.removeAttribute("aria-current");
    }
    byId("cue-title").textContent = scenes[id].name;
    byId("cue").textContent = cues[id];
    byId("back").disabled = route.length === 1;
    byId("next").disabled = !nextScene[id];
    const nextLabel = { H02: "Вернуться к универсальной истории", U19: "Открыть подбор" };
    byId("next").textContent = nextLabel[id] || "Далее";
    byId("branch").hidden = id !== "U08";
    publish();
  }

  byId("next").addEventListener("click", () => { route.push(nextScene[currentScene]); show(); }, options);
  byId("branch").addEventListener("click", () => { route.push("H02"); show(); }, options);
  byId("back").addEventListener("click", () => { route.pop(); show(); }, options);
  stage.addEventListener("scroll", schedulePublish, { ...options, passive: true });
  stage.addEventListener("pointermove", (event) => {
    mouse = { x: event.clientX, y: event.clientY };
    schedulePublish();
  }, options);
  stage.addEventListener("pointerleave", () => { mouse = null; schedulePublish(); }, options);
  const observer = new ResizeObserver(schedulePublish);
  observer.observe(stage);
  show();

  return {
    publish,
    close() {
      events.abort();
      observer.disconnect();
      if (frame !== null) cancelAnimationFrame(frame);
      byId("workspace").hidden = true;
      byId("show-actions").hidden = true;
      byId("confirmed").value = "";
      currentScene = undefined;
      stage.replaceChildren();
    }
  };
}

function startLocalManager() {
  const session = crypto.randomUUID();
  const channel = new BroadcastChannel(`presenter:${session}`);
  const viewers = new Map();
  const presentation = startManager(session, (state) => channel.postMessage({ type: "state", ...state }));

  function connectionStatus() {
    for (const [id, seen] of viewers) {
      if (Date.now() - seen > 5000) viewers.delete(id);
    }
    byId("status").textContent = viewers.size ? "Клиентский экран подключён" : "Клиентский экран закрыт";
  }

  channel.onmessage = ({ data }) => {
    if (typeof data?.viewer !== "string") return;
    if (data.type === "viewer-ready") {
      viewers.set(data.viewer, Date.now());
      presentation.publish();
    }
    if (data.type === "viewer-leave") viewers.delete(data.viewer);
    connectionStatus();
  };
  setInterval(connectionStatus, 1500);

}

if (location.protocol !== "file:") {
  if (window.presenterConfig) {
    byId("login").hidden = false;
    import("./network.js").then(({ startNetworkManager }) => startNetworkManager(startManager))
      .catch(() => { byId("login-status").textContent = "Не удалось подключить вход. Обновите страницу."; });
  } else if (["localhost", "127.0.0.1"].includes(location.hostname)
      || new URLSearchParams(location.search).get("demo") === "1") {
    startLocalManager();
  } else {
    byId("login").hidden = false;
    byId("login-status").textContent = "Командный вход будет доступен после подключения Firebase. Интерфейс можно проверить в демо.";
    byId("open-demo").hidden = false;
  }
}
