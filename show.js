const manager = document.body.dataset.role === "manager";
const stage = document.querySelector("#stage");
const byId = (id) => document.getElementById(id);

const routeArt = `
  <figure class="art story-block" data-anchor="visual">
    <svg viewBox="0 0 760 520" role="img" aria-label="Условная схема пути от двора через вход и лифт к квартире">
      <rect width="760" height="520" fill="#e9f0f9"/>
      <path d="M80 170H365V310H665" fill="none" stroke="#c2dcfa" stroke-width="37" stroke-linejoin="round" stroke-linecap="round"/>
      <path d="M80 170H365V310H665" fill="none" stroke="#007bfb" stroke-width="4" stroke-dasharray="9 9"/>
      <g stroke="#6c87aa" stroke-width="2">
        <path d="M80 155v-27M365 155v-27M365 325v31M665 325v31"/>
      </g>
      <g fill="#fff" stroke="#007bfb" stroke-width="5">
        <circle cx="80" cy="170" r="15"/><circle cx="365" cy="170" r="15"/>
        <circle cx="365" cy="310" r="15"/><circle cx="665" cy="310" r="15"/>
      </g>
      <g fill="#fff">
        <rect x="30" y="80" width="165" height="48" rx="14"/>
        <rect x="274" y="80" width="211" height="48" rx="14"/>
        <rect x="252" y="356" width="230" height="48" rx="14"/>
        <rect x="543" y="356" width="188" height="48" rx="14"/>
      </g>
      <g fill="#222735" font-size="17" font-weight="650">
        <text x="47" y="110">Зайти со двора</text>
        <text x="290" y="110">Проверить ступени</text>
        <text x="269" y="386">Развернуться у лифта</text>
        <text x="559" y="386">Доехать до двери</text>
      </g>
      <text x="35" y="479" fill="#596279" font-size="16">Условная схема маршрута · для репетиции</text>
    </svg>
  </figure>`;

const scenes = {
  U01: {
    name: "Знакомство",
    title: "Начнём с того, как вы хотите жить в новом доме",
    intro: "Посмотрим привычные маршруты и выберем, что стоит проверить в конкретных квартирах.",
    visual: `<section class="overview story-block" data-anchor="visual" aria-label="Ход встречи">
      <ol>
        <li><span aria-hidden="true">01</span> Уточним, что важно</li>
        <li><span aria-hidden="true">02</span> Проверим привычный маршрут</li>
        <li><span aria-hidden="true">03</span> Перейдём к квартирам</li>
      </ol>
    </section>`,
    detail: "Задачи встречи",
    result: "Согласуем, что для вас важно каждый день, и возьмём эти критерии в подбор."
  },
  U08: {
    name: "Возвращение домой",
    title: "Путь домой начинается во дворе",
    intro: "Сравним, как вы дойдёте от двора до квартиры в обычный день.",
    visual: routeArt,
    detail: "Что проверим на этом маршруте",
    result: "Где придётся открывать двери, обходить ступени или делать крюк с покупками."
  },
  H02: {
    name: "Маршрут с коляской",
    title: "От двора до квартиры с коляской",
    intro: "Пройдём по схеме и отметим места, где важно проверить ступени и ширину прохода.",
    visual: routeArt,
    detail: "Как это повлияет на подбор",
    result: "Если нужен маршрут без ступеней, сначала сравним секции по этому условию."
  },
  U19: {
    name: "Критерии",
    title: "Соберём условия для подбора",
    intro: "Отделим обязательные условия от тех, по которым можно сравнить варианты.",
    detail: "Что возьмём в сравнение",
    result: "Например, маршрут от входа до двери, планировку и комфортный платёж."
  },
  U20: {
    name: "Подбор",
    title: "Теперь посмотрим квартиры",
    intro: "В рабочем показе здесь откроются доступные варианты по согласованным критериям.",
    visual: `<div class="lots story-block" data-anchor="visual">
      <article><strong>Пример А</strong>Проверить путь от двора до двери</article>
      <article><strong>Пример Б</strong>Сравнить место для хранения в прихожей</article>
    </div>`,
    detail: "Учебная выдача",
    result: "Карточки иллюстрируют переход к подбору. Доступность и параметры лотов в демо условные."
  }
};

let currentScene;
let pointer;

function renderScene(id) {
  if (currentScene === id) return;
  const scene = scenes[id];
  currentScene = id;
  stage.innerHTML = `<article class="story" data-scene="${id}">
    <div class="story-block scene-heading" data-anchor="intro">
      <h1>${scene.title}</h1>
      <p class="lead">${scene.intro}</p>
    </div>
    ${scene.visual || ""}
    <section class="detail story-block" data-anchor="detail">
      <h2>${scene.detail}</h2><p>${scene.result}</p>
    </section>
  </article><div class="pointer" aria-hidden="true"></div>`;
  pointer = stage.querySelector(".pointer");
  stage.scrollTop = 0;
}

function anchor(name) {
  return [...stage.querySelectorAll("[data-anchor]")].find((item) => item.dataset.anchor === name);
}

function stageTop() {
  return stage.getBoundingClientRect().top + stage.clientTop;
}

function currentPosition() {
  const top = stageTop();
  const blocks = [...stage.querySelectorAll("[data-anchor]")];
  const block = blocks.find((item) => item.getBoundingClientRect().bottom > top) || blocks.at(-1);
  const rect = block.getBoundingClientRect();
  return { block: block.dataset.anchor, offset: (top - rect.top) / rect.height };
}

function applyPublicState(state) {
  if (!state || !Object.hasOwn(scenes, state.scene)) return;
  renderScene(state.scene);
  const section = anchor(state.position?.block);
  if (section && Number.isFinite(state.position.offset)) {
    const rect = section.getBoundingClientRect();
    stage.scrollTop += rect.top - stageTop() + rect.height * state.position.offset;
  }

  const point = state.point;
  const target = anchor(point?.block);
  const valid = target && [point.x, point.y].every((value) => Number.isFinite(value) && value >= 0 && value <= 1);
  pointer.style.display = "none";
  if (valid) {
    const rect = target.getBoundingClientRect();
    const x = rect.left + rect.width * point.x;
    const y = rect.top + rect.height * point.y;
    const left = stage.getBoundingClientRect().left + stage.clientLeft;
    const top = stageTop();
    if (x >= left && x < left + stage.clientWidth && y >= top && y < top + stage.clientHeight) {
      pointer.style.left = `${x - left + stage.scrollLeft}px`;
      pointer.style.top = `${y - top + stage.scrollTop}px`;
      pointer.style.display = "block";
    }
  }
}

function showClientMessage(message) {
  currentScene = undefined;
  stage.innerHTML = '<p class="waiting" role="status"></p>';
  stage.firstElementChild.textContent = message;
}

function watchClient(subscribe) {
  let latest;
  subscribe((data) => {
    latest = data;
    if (data) applyPublicState(data);
    else showClientMessage("Показ завершён или ссылка недоступна.");
  });
  new ResizeObserver(() => { if (latest) applyPublicState(latest); }).observe(stage);
}

function startLocalClient(channel) {
  const viewer = crypto.randomUUID();
  watchClient((receive) => {
    channel.onmessage = ({ data }) => {
      if (data?.type === "state") receive(data);
    };
  });
  function requestState() {
    channel.postMessage({ type: "viewer-ready", viewer });
  }
  addEventListener("pagehide", () => channel.postMessage({ type: "viewer-leave", viewer }));
  addEventListener("pageshow", requestState);
  requestState();
  setInterval(requestState, 1500);
}

if (location.protocol === "file:") {
  if (manager) byId("workspace").hidden = false;
  showClientMessage("Запустите демо через локальный HTTP-сервер. Команда есть в инструкции рядом с файлами.");
} else if (!manager && /^[a-f\d-]{36}$/i.test(location.hash.slice(1))) {
  const session = location.hash.slice(1);
  if (window.presenterConfig) {
    import("./network.js").then(({ startNetworkClient }) => startNetworkClient(session))
      .catch(() => showClientMessage("Не удалось подключиться к показу. Обновите страницу."));
  } else {
    startLocalClient(new BroadcastChannel(`presenter:${session}`));
  }
} else if (!manager) {
  stage.querySelector(".waiting").textContent = "Откройте клиентский экран кнопкой из окна менеджера.";
}
