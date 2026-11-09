const routeDestinations = [
  ["Рядом с «Эко Бунино»", [
    ["school", "Школа №338 · площадка «Альфа»", "Москва, проспект Куприна, 30с3", "55.541922,37.458589"],
    ["daycare", "Детский сад «Краски детства»", "Москва, проспект Куприна, 40с4", "55.540487,37.452672"],
    ["stop", "Остановка «Бунино»", "Москва, проспект Куприна, остановка Бунино", "55.538349,37.453188"],
    ["arena", "Ледовая арена «Самолёт»", "Москва, Эко Бунино, Самолёт Арена", "55.538539,37.460029"]
  ]],
  ["Транспорт", [
    ["novomoskovskaya", "Метро «Новомосковская»", "Москва, метро Новомосковская", "55.560546,37.466562"],
    ["potapovo", "Метро «Потапово»", "Москва, метро Потапово", "55.552600,37.493100"],
    ["olhovaya", "Метро «Ольховая»", "Москва, метро Ольховая"],
    ["mkad", "Выезд на МКАД · Калужское шоссе", "Москва, МКАД, 41-й километр", "55.609858,37.493281"]
  ]],
  ["Городские ориентиры", [
    ["red-square", "Красная площадь", "Москва, Красная площадь", "55.753550,37.621090"],
    ["city", "Москва-Сити", "Москва, Московский международный деловой центр Москва-Сити"],
    ["mega", "МЕГА Тёплый Стан", "Москва, Калужское шоссе, 21-й километр, с1", "55.604484,37.489526"],
    ["airport", "Аэропорт Внуково · терминал А", "Москва, аэропорт Внуково, терминал А", "55.604911,37.285819"]
  ]]
];

const demoRouteOrigin = "Москва, проспект Куприна, 36к1";

function startRoutePlanner(options, onChange) {
  const form = byId("route-planner");
  const start = byId("route-origin");
  const destination = byId("route-destination");
  const custom = byId("route-custom");
  const mode = byId("route-travel");
  const status = byId("route-status");
  const open = byId("route-open");
  const search = byId("route-search");
  const reopen = byId("route-reopen");
  const via = byId("route-via");
  const originConfirmed = byId("route-confirm-origin");
  const minutes = byId("route-minutes");
  const departure = byId("route-departure");
  const note = byId("route-note");
  const saved = byId("route-saved");
  const origins = new Map();
  const places = new Map();
  const drafts = new Map();
  const presets = new Map();
  const checks = new Map();
  let project;
  let key;
  let limit;
  let limitTarget;
  let limitPlace;
  let signature;

  destination.replaceChildren(new Option("Выберите точку", ""));
  for (const [group, entries] of routeDestinations) {
    const choices = document.createElement("optgroup");
    choices.label = group;
    for (const [id, title, address, coordinates] of entries) {
      places.set(id, { address, coordinates });
      choices.append(new Option(title, id));
    }
    destination.append(choices);
  }
  destination.append(new Option("Другой адрес…", "custom"));

  function currentRoute() {
    const manual = destination.value === "custom";
    const place = manual ? { address: custom.value.trim() } : places.get(destination.value);
    return { from: start.value.trim(), place, mode: mode.value, via: via.value.trim(), focus: destination.value };
  }

  function routeUrl(route) {
    const url = new URL("https://yandex.ru/maps/");
    url.searchParams.set("mode", "routes");
    url.searchParams.set("rtt", route.mode);
    url.searchParams.set("rtext", [route.from, route.via, route.place.coordinates || route.place.address]
      .filter(Boolean).map((value) => value.replaceAll("~", " ")).join("~"));
    return url.href;
  }

  function update() {
    const route = currentRoute();
    const { from, place } = route;
    byId("route-custom-row").hidden = destination.value !== "custom";
    byId("route-via-note").hidden = !route.via;
    byId("route-departure-label").hidden = departure.hidden = route.mode === "pd";
    custom.required = destination.value === "custom";
    open.disabled = !from || !place?.address;
    byId("route-save").disabled = open.disabled;
    search.hidden = !place?.address;
    if (place?.address) {
      const url = new URL("https://yandex.ru/maps/");
      url.searchParams.set("text", place.coordinates || place.address);
      search.href = url.href;
    } else search.removeAttribute("href");
    const next = JSON.stringify(route);
    if (next !== signature) {
      signature = next;
      const check = checks.get(key);
      const sameRoute = check?.signature === signature;
      originConfirmed.checked = sameRoute && check.confirmed;
      minutes.value = sameRoute ? check.minutes : "";
      departure.value = sameRoute ? check.departure : "";
      note.value = sameRoute ? check.note : "";
      status.textContent = "";
      reopen.hidden = true;
      reopen.removeAttribute("href");
      if (key) drafts.set(key, { signature, origin: start.value, destination: destination.value, custom: custom.value, mode: mode.value, via: via.value });
    }
    byId("route-origin-note").textContent = from === demoRouteOrigin && !originConfirmed.checked
      ? "Учебная точка. Сверьте адрес корпуса выбранной квартиры." : "Сверьте точку с корпусом и входом на карте.";
    const check = checks.get(key);
    saved.hidden = !check || check.signature !== signature;
    const sameTarget = !route.via && (!limitTarget || limitTarget === route.focus)
      && (!limitPlace || limitPlace === route.place?.address);
    saved.textContent = saved.hidden ? "" : routeCheckText(check, sameTarget ? limit : undefined);
  }

  function openRoute(event) {
    event.preventDefault();
    if (open.disabled) return;
    const href = routeUrl(currentRoute());
    reopen.href = href;
    reopen.hidden = false;
    window.open(href, "_blank", "noopener,noreferrer");
    byId("route-result").open = true;
    status.textContent = "Сверьте точки в Картах и внесите результат в панель.";
  }

  form.addEventListener("submit", openRoute, options);
  form.addEventListener("input", (event) => {
    update();
    if ([start, destination, custom, mode, via].includes(event.target)) onChange();
  }, options);
  start.addEventListener("input", () => origins.set(project, start.value), options);
  byId("route-save").addEventListener("click", () => {
    if (!minutes.value) {
      minutes.focus();
      status.textContent = "Укажите время, которое показала карта.";
      return;
    }
    if (!minutes.reportValidity()) return;
    const route = currentRoute();
    checks.set(key, { ...route, signature, minutes: minutes.valueAsNumber,
      departure: route.mode === "pd" ? "" : departure.value.trim(),
      note: note.value.trim(), confirmed: originConfirmed.checked, url: routeUrl(route) });
    update();
    onChange();
  }, options);

  return {
    show(visible, selectedProject, setup = {}) {
      form.hidden = !visible;
      if (!visible) return;
      const next = `${selectedProject}/${setup.scope || "daily"}`;
      limit = setup.limit;
      limitTarget = setup.focus && (selectedProject === demoProject ? setup.focus : "custom");
      limitPlace = !setup.focus && setup.place;
      const preset = JSON.stringify([setup.focus, setup.place, setup.travel, setup.via]);
      const oldPreset = presets.get(next);
      const changed = oldPreset !== undefined && oldPreset !== preset;
      if (key !== next || changed || (setup.origin && start.value !== setup.origin)) {
        project = selectedProject;
        key = next;
        presets.set(key, preset);
        signature = undefined;
        const previous = drafts.get(key);
        const draft = changed ? undefined : previous;
        start.value = setup.origin || previous?.origin || (setup.scope?.startsWith("lot-") ? "" : origins.get(project) ?? (project === demoProject ? demoRouteOrigin : ""));
        const focus = project === demoProject && setup.focus ? setup.focus : "";
        destination.value = draft?.destination ?? (focus || (setup.place || setup.focus ? "custom" : ""));
        custom.value = draft?.custom ?? setup.place ?? "";
        mode.value = draft?.mode ?? setup.travel ?? "mt";
        via.value = draft?.via ?? setup.via ?? "";
        byId("route-result").open = false;
      }
      update();
    },
    selectMode(value) {
      if (value && !form.hidden) {
        mode.value = value;
        update();
      }
    },
    checksFor(projectId, scope) {
      return [...checks].filter(([id]) => scope ? id === `${projectId}/${scope}` : id.startsWith(`${projectId}/`))
        .map(([id, check]) => ({ ...check, current: check.signature === drafts.get(id)?.signature }));
    },
    clear(projectId, scope) {
      const removed = `${projectId}/${scope}`;
      checks.delete(removed);
      drafts.delete(removed);
      presets.delete(removed);
      if (key === removed) key = undefined;
    },
    reset() {
      origins.clear();
      drafts.clear();
      presets.clear();
      checks.clear();
      project = undefined;
      key = undefined;
      signature = undefined;
      start.value = "";
      destination.value = "";
      custom.value = "";
      mode.value = "mt";
      via.value = "";
      update();
    }
  };
}

function routeCheckText(check, limit) {
  const result = !check.confirmed ? "Адрес корпуса требует сверки"
    : check.mode !== "pd" && !check.departure ? "Для сравнения уточните время отправления"
    : limit ? (check.minutes <= limit ? `В пределах ${limit} мин по карте` : `Дольше ${limit} мин по карте`) : "Адрес корпуса сверен";
  const points = [check.from, check.via, check.place.address].filter(Boolean).join(" → ");
  return `${points} · ${check.minutes} мин${check.departure ? ` · ${check.departure}` : ""}. ${result}.${check.note ? ` ${check.note}` : ""}`;
}
