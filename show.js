const manager = document.body.dataset.role === "manager";
const byId = (id) => document.getElementById(id);
const stage = byId("stage");
let currentScene;
let currentProject = demoProject;
let currentLiving = "";
let currentLivingApproximate = false;
let currentAccent = 0;
let pointer;
let currentEdition = "";

const modelCopy = {
  kimi: { public: kimiCopy, private: manager ? kimiManagerCopy : null },
  gemini: { public: geminiCopy, private: manager ? geminiManagerCopy : null },
  deepseek: { public: deepseekCopy, private: manager ? deepseekManagerCopy : null }
};

function hasCopyEdition(edition) {
  return edition === "revised" || Object.hasOwn(modelCopy, edition);
}

function copyLine(value, edition, revised) {
  const working = edition !== "kimi" && hasCopyEdition(edition)
    ? revised || revisedCopy[value] || value : value;
  if (typeof working !== "string" || !Object.hasOwn(modelCopy, edition)) return working;
  const copy = modelCopy[edition];
  if (Object.hasOwn(copy.public, working)) return copy.public[working];
  if (copy.private && Object.hasOwn(copy.private, working)) return copy.private[working];
  if (working.startsWith("«") && working.endsWith("»")) {
    return `«${copyLine(working.slice(1, -1), edition)}»`;
  }
  return working;
}

function escaped(value) {
  return String(value).replace(/[&<>"']/g, (character) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

function catalogUrl(filters, view) {
  const url = view === "samolet-plus"
    ? new URL("https://samoletplus.ru/msk-mo/flats/?projects=79eb4d23-10f4-46c2-8423-6108364b9362")
    : new URL("https://samolet.ru/flats/?nameType=sale&free=1&type=100000000&place=true&place_project=69110");
  if ([0, 1, 2, 3].includes(filters?.rooms)) url.searchParams.set("rooms", filters.rooms);
  const price = filters?.priceMax;
  if (Number.isSafeInteger(price) && price > 0 && price <= 1000000000) url.searchParams.set("price_max", price);
  if (view === "map") url.searchParams.set("view_mode", "map");
  return url.href;
}

function phaseFor(id) {
  if (id.startsWith("P")) return -1;
  if (Object.hasOwn(projectScenes, id)) return projectSceneOrder.indexOf(id);
  const scene = publicStory.scenes[id];
  return Math.floor((Number((scene.gate || id).slice(1)) - 1) / 4);
}

function externalLink(href, text, className = "source-link") {
  return `<a class="${className}" href="${escaped(href)}" target="_blank" rel="noopener noreferrer">${escaped(text)} ↗</a>`;
}

function renderSelection() {
    return `<section class="selection story-block" data-anchor="selection" aria-label="Подбор квартир">
      <div class="selection-grid">
        <a data-catalog="list" href="${escaped(catalogUrl())}" target="_blank" rel="noopener noreferrer">
          <strong>Каталог квартир ↗</strong><span>Сравнить варианты по согласованным условиям</span>
        </a>
        <a data-catalog="map" href="${escaped(catalogUrl(undefined, "map"))}" target="_blank" rel="noopener noreferrer">
          <strong>Карта квартир ↗</strong><span>Посмотреть, где находятся корпуса с предложениями</span>
        </a>
        <a data-catalog="samolet-plus" href="${escaped(catalogUrl(undefined, "samolet-plus"))}" target="_blank" rel="noopener noreferrer">
          <strong>Самолёт Плюс ↗</strong><span>Сверить предложения на другой витрине</span>
        </a>
      </div>
    </section>`;
}

function renderCompanyEvidence() {
  return `<section class="company-evidence story-block" data-anchor="visual" aria-label="Что Самолёт покажет на встрече">
    ${companyEvidence.map(({ eyebrow, title, caption, description, image, alt, url, link }) => `<article>
      <figure class="company-evidence-visual">
        <img class="company-evidence-image" src="media/${escaped(image)}" alt="${escaped(alt)}" width="1600" height="900">
        <figcaption>${escaped(copyLine(caption, currentEdition))}</figcaption>
      </figure>
      <div class="company-evidence-copy">
        <p class="scene-label">${escaped(eyebrow)}</p>
        <h2>${escaped(copyLine(title, currentEdition))}</h2>
        <p>${escaped(copyLine(description, currentEdition))}</p>
        ${externalLink(url, link)}
      </div>
    </article>`).join("")}
  </section>`;
}

function frameFor(scene) {
  if (!scene.gate) {
    const [title, artwork, captions] = audienceScenes[scene.id];
    return { title, artwork, captions, points: sceneFramePoints[scene.id] };
  }
  const [branch, part] = scene.id.split(".");
  const step = Number(part) - 1;
  const lifeProfile = { "I01.1": "resale", "I02.1": "rent" }[scene.id];
  if (lifeProfile) return { ...livingFrame("U10", lifeProfile), title: branchAudience[branch][step] };
  const artwork = branchArtwork[branch][step];
  const focus = [0, 1, 1, 2][step];
  const captions = ["", "", ""];
  captions[focus] = branchCaptions[branch][step];
  return { title: branchAudience[branch][step], artwork, captions, focus };
}

function artworkUrl(artwork) {
  const art = audienceArt[artwork];
  return `media/${art.file || `${artwork}.${art.type}`}`;
}

function frameCaptions(frame, option) {
  const captions = [...(option?.labels || frame.captions)];
  if (option?.label) captions[option.step - 1] = option.label;
  return captions;
}

function renderArtwork(frame, option) {
  const artwork = option?.artwork || frame.artwork;
  const art = audienceArt[artwork];
  const captions = frameCaptions(frame, option);
  const points = option ? option.points : frame.points;
  const focus = option ? option.step - 1 : frame.focus;
  const labels = captions.map((original, i) => {
    const caption = copyLine(original, currentEdition);
    if (!caption) return "";
    const active = i === focus ? " is-accent" : "";
    const point = points?.[i];
    if (!point) return `<li class="frame-note frame-note-free${active}"><span>${escaped(caption)}</span></li>`;
    const [x, y, labelX = x] = point;
    const shift = labelX - x;
    const leader = shift ? `<svg class="slanted-leader" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path d="${shift > 0 ? "M0 100L100 0" : "M100 100L0 0"}"/></svg>` : "";
    return `<li class="frame-note frame-note-pinned${active}${shift ? " has-shift" : ""}" style="--x:${x}%;--y:${y}%;--label-shift:${shift}cqw">
      ${leader}
      <span>${escaped(caption)}</span>
    </li>`;
  });
  return `<img src="${artworkUrl(artwork)}" alt="${escaped(art.alt || "")}" width="960" height="540">
    <ul class="frame-notes" aria-label="Подписи к изображению">${labels.join("")}</ul>`;
}

function renderScene(id, project = demoProject, living = "", approximate = false, edition = "") {
  const profile = project === demoProject && isLivingScene(id) && Object.hasOwn(livingProfiles, living)
    ? living : "";
  const livingApproximate = id === "U10" && Boolean(profile) && approximate === true;
  edition = hasCopyEdition(edition) ? edition : "";
  if (currentScene === id && currentProject === project && currentLiving === profile && currentLivingApproximate === livingApproximate && currentEdition === edition) return;
  const alternative = projectScenes[id];
  const scene = alternative || publicStory.scenes[id];
  const frame = profile ? livingFrame(id, profile) : alternative || frameFor(scene);
  currentEdition = edition;
  const artwork = id === "P02" ? null : renderArtwork(frame);
  const place = hubProjects[project];
  const phase = phaseFor(id);
  currentScene = id;
  currentProject = project;
  currentLiving = profile;
  currentLivingApproximate = livingApproximate;
  currentAccent = 0;
  const material = profile && frame.source ? externalLink(frame.source, "Источник плана")
    : alternative ? externalLink(place.page, id === "X05" ? "Открыть предложения проекта" : "Страница проекта") : {
    U01: externalLink(publicStory.projectPage, "Страница проекта"),
    U05: externalLink(publicStory.projectPage + "#block-genplan", "Генплан на сайте проекта"),
    U07: externalLink(publicStory.projectPage, "Посмотреть инфраструктуру проекта"),
    U20: externalLink("https://samolet.ru/lp/how-to-buy/", "Как купить онлайн")
  }[id] || "";
  const clientMode = byId("client-mode");
  if (clientMode) {
    clientMode.hidden = phase < 0;
    clientMode.textContent = phase < 0 ? "" : place.name;
    document.title = phase < 0 ? "Самолёт" : `Самолёт · ${place.name}`;
  }
  stage.innerHTML = `<article class="story eco-story${id === "P01" ? " company-cover" : ""}" data-scene="${id}" data-project="${project}"${profile ? ` data-living="${profile}"` : ""}>
    <header class="story-block scene-heading" data-anchor="intro">
      <h1>${escaped((id === "X01" ? `${place.name}. ` : "") + copyLine(frame.title, edition))}</h1>
      ${id === "P01" ? `<p class="company-intro">${escaped(copyLine(scene.context, edition))}</p>` : ""}
    </header>
    ${artwork ? `<figure class="scene-frame story-block${profile && id === "U09" ? " exact-layout" : ""}" data-anchor="visual" aria-live="polite">${artwork}</figure>` : renderCompanyEvidence()}
    ${id === "U20" ? renderSelection() : ""}
    ${id === "P01" ? "" : `<section class="detail story-block" data-anchor="detail">
      ${scene.gate ? "" : `<p data-scene-context>${livingApproximate ? "<strong>Пример на другой квартире той же комнатности.</strong> " : ""}${escaped((frame.contextPrefix || "") + copyLine(frame.context || scene.context, edition))}</p>`}
      ${material}
      ${id === "U01" ? '<span id="scene-evidence"></span>' : ""}
    </section>`}
  </article><div class="pointer" aria-hidden="true"></div>`;
  pointer = stage.querySelector(".pointer");
  stage.scrollTop = 0;
  if (!manager) showStartupReady();
}

function applyVisualAccent(index) {
  if (currentLiving) return;
  const alternative = projectScenes[currentScene];
  const scene = alternative || publicStory.scenes[currentScene];
  const option = Number.isInteger(index) && visualContexts[currentScene]?.[index - 1];
  const accent = option ? index : 0;
  if (currentAccent === accent) return;
  currentAccent = accent;
  const frame = alternative || frameFor(scene);
  anchor("intro").querySelector("h1").textContent = copyLine(option?.title || frame.title, currentEdition, option?.revisedTitle);
  anchor("visual").innerHTML = renderArtwork(frame, option);
  stage.querySelector("[data-scene-context]").textContent = copyLine(option?.context || scene.context, currentEdition, option?.revisedContext);
  if (currentScene === "U01") {
    byId("scene-evidence").innerHTML = option?.topic === "school" ? externalLink("https://t.me/s/school338official/24648?q=%23%D0%92%D0%A1%D0%95%D0%9B%D0%95%D0%9D%D0%9D%D0%90%D0%AF338", "Площадка «Альфа» · школа №338") : "";
  }
}

function comparisonFrameCopy() {
  const scene = projectScenes[currentScene] || publicStory.scenes[currentScene];
  const frame = currentLiving ? livingFrame(currentScene, currentLiving) : projectScenes[currentScene] || frameFor(scene);
  const option = currentAccent ? visualContexts[currentScene]?.[currentAccent - 1] : undefined;
  const items = [["Заголовок", option?.title || frame.title, "", option?.revisedTitle]];
  if (currentScene === "P02") {
    for (const card of companyEvidence) items.push(["Карточка", card.title], ["Подпись", card.caption], ["Текст", card.description]);
  } else {
    for (const caption of frameCaptions(frame, option)) if (caption) items.push(["Подпись", caption]);
  }
  const context = option?.context || frame.context || scene.context;
  if (!scene.gate && context) items.push(["Текст", context, frame.contextPrefix, option?.revisedContext]);
  return items;
}

function anchor(name) {
  return [...stage.querySelectorAll("[data-anchor]")].find((item) => item.dataset.anchor === name);
}

function updateCatalogLinks(filters) {
  for (const link of stage.querySelectorAll("[data-catalog]")) link.href = catalogUrl(filters, link.dataset.catalog);
}

function stageTop() {
  return stage.getBoundingClientRect().top + stage.clientTop;
}

function currentPosition() {
  const top = stageTop();
  const blocks = [...stage.querySelectorAll("[data-anchor]")];
  const block = blocks.find((item) => item.getBoundingClientRect().bottom > top) || blocks.at(-1);
  const rect = block.getBoundingClientRect();
  return { block: block.dataset.anchor, offset: Math.max(-1, Math.min(1, (top - rect.top) / rect.height)) };
}

function applyPublicState(state) {
  if (!state) return;
  const { scene, project } = state;
  if (Object.hasOwn(projectScenes, scene)) {
    if (!Object.hasOwn(hubProjects, project) || project === demoProject) return;
    renderScene(scene, project, "", false, state.edition);
  } else {
    if (!Object.hasOwn(publicStory.scenes, scene)) return;
    renderScene(scene, demoProject, state.living, state.livingApproximate, state.edition);
  }
  applyVisualAccent(state.accent);
  if (state.scene === "U20") updateCatalogLinks(state.catalog);
  const section = anchor(state.position?.block);
  if (section && Number.isFinite(state.position.offset)) {
    const rect = section.getBoundingClientRect();
    stage.scrollTop += rect.top - stageTop() + rect.height * state.position.offset;
  }
  const point = state.point;
  const target = anchor(point?.block);
  pointer.style.display = "none";
  if (!target || ![point.x, point.y].every((value) => Number.isFinite(value) && value >= 0 && value <= 1)) return;
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

function showClientMessage(message) {
  currentScene = undefined;
  const label = document.createElement("p");
  label.className = "waiting";
  label.setAttribute("role", "status");
  label.textContent = message;
  stage.replaceChildren(label);
  showStartupReady();
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
  const requestState = () => channel.postMessage({ type: "viewer-ready", viewer });
  addEventListener("pagehide", () => channel.postMessage({ type: "viewer-leave", viewer }));
  addEventListener("pageshow", requestState);
  requestState();
  setInterval(requestState, 1500);
}

function showCompanyPreview() {
  const navigation = byId("company-navigation");
  const buttons = [...navigation.querySelectorAll("[data-company-scene]")];
  const scenes = publicStory.companyOpening;
  function select(id) {
    renderScene(id);
    for (const button of buttons) {
      if (button.dataset.companyScene === id) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    }
  }
  for (const button of buttons) button.addEventListener("click", () => select(button.dataset.companyScene));
  navigation.hidden = false;
  document.body.classList.add("company-preview");
  const requested = location.hash.slice(1);
  select(scenes.includes(requested) ? requested : scenes[0]);
}

if (location.protocol === "file:") {
  if (manager) byId("workspace").hidden = false;
  showClientMessage("Откройте панель через локальный сервер Hugo.");
} else if (!manager && new URLSearchParams(location.search).get("show") === "company") {
  showCompanyPreview();
} else if (!manager) {
  const session = location.hash.slice(1);
  const requestedRelease = new URLSearchParams(location.search).get("v");
  if (requestedRelease && requestedRelease !== showRelease) {
    showClientMessage("Версия показа обновилась. Обновите панель менеджера и откройте клиентский экран заново.");
  } else if (!/^[a-f\d-]{36}$/i.test(session)) {
    showClientMessage("Откройте клиентский экран кнопкой из панели менеджера.");
  } else {
    startCatalogViewer(session);
    showStartupReady();
    if (window.presenterConfig) {
      import(`./network.js?v=${showRelease}`).then(({ startNetworkClient }) => startNetworkClient(session))
        .catch(() => showClientMessage("Не удалось подключиться к показу. Обновите страницу."));
    } else {
      startLocalClient(new BroadcastChannel(`eco-bunino:${session}`));
    }
  }
}
