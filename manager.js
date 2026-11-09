const sampleInputs = {
  none: {},
  partial: { purpose: "self" },
  family: { purpose: "self", topic: "school", children: "yes", rooms: "2", price: "17000000" },
  work: { purpose: "self", topic: "work", children: "no", rooms: "2", price: "17000000" },
  upgrade: { purpose: "upgrade", rooms: "3" },
  parents: { purpose: "relative", topic: "access", rooms: "1" },
  "child-home": { purpose: "child-home", rooms: "1" },
  rent: { purpose: "rent", rooms: "0" },
  resale: { purpose: "resale", rooms: "1" },
  independent: { purpose: "independent", topic: "finish", rooms: "0" },
  move: { purpose: "self", topic: "school", children: "yes", rooms: "2", price: "17000000", limit: "15", travel: "pd" }
};
const investmentGoals = { rent: "rent", resale: "sale" };
const crossDemoRoute = managerStory.main.filter((id) => !["U07", "U08", "U11", "U12", "U14", "U18"].includes(id));

const openingCues = {
  P01: {
    title: "Начните с цели покупки", seconds: 12,
    cue: "«Я … из „Самолёта“. Начнём с того, что вы хотите получить от покупки, а потом сравним адреса и планировки по вашей задаче».",
    action: "Представьтесь и согласуйте время встречи. Если цель уже известна, подтвердите её в разговоре при сверке запроса.",
    outcome: "Клиент понимает, что показ начнётся с его задачи."
  },
  P02: {
    title: "Что даёт Самолёт", seconds: 18,
    cue: "«Самолёт строит кварталы. Мы можем показать, как устроено место вокруг дома, сравнить квартиры на планах и разобрать, что будет после выбора».",
    action: "Назовите одну опору, которая полезна клиенту. При необходимости откройте официальный источник.",
    outcome: "Клиент понимает, что именно сможет увидеть и проверить с Самолётом."
  },
  P03: {
    title: "Покажите, как сравниваем", seconds: 15,
    cue: "«Вот две квартиры одного метража. В одной рабочий стол займёт гостиную. В другой можно закрыть дверь и созвониться, пока дома отдыхают».",
    action: "Используйте условный пример, чтобы показать, как одна бытовая задача меняет выбор планировки.",
    outcome: "Понятно, как проверим приоритет клиента на реальном варианте."
  },
  P04: {
    title: "Что повлияет на выбор", seconds: 30,
    cue: "«Для кого выбираете квартиру? Что сильнее всего повлияет на выбор?»",
    action: "Спросите только то, чего ещё не знаете. Начните проверку на первом подходящем варианте.",
    outcome: "Одна подтверждённая тема для показа или общий маршрут."
  }
};
const openingOrder = [...publicStory.companyOpening, "P04"];

const intakeTopics = {
  school: { label: "Дорога до школы", field: "school", value: "school" },
  daycare: { label: "Дорога до детского сада", field: "school", value: "daycare" },
  work: { label: "Место для работы из дома", field: "work", value: "yes" },
  commute: { label: "Время ежедневной дороги" },
  sale: { label: "Возможность продать при переезде", field: "future", value: "sale" },
  rent: { label: "Возможность сдавать квартиру", field: "future", value: "rent" },
  outdoors: { label: "Парки и прогулки" },
  health: { label: "Поликлиника и аптека" },
  shops: { label: "Магазины рядом с домом" },
  sport: { label: "Спорт рядом с домом" },
  parking: { label: "Парковка и выезд" },
  access: { label: "Удобный вход без ступеней" },
  storage: { label: "Место для коляски и крупных вещей" },
  finish: { label: "Отделка и сроки въезда" }
};

const hubCriteria = {
  [demoProject]: {
    school: "В квартале открыта площадка «Альфа» школы №338",
    daycare: "На проспекте Куприна работают дошкольные площадки",
    commute: "Есть пеший маршрут к метро «Новомосковская»",
    sport: "В квартале есть ледовая арена"
  },
  alhimovo: {
    commute: "Сравнить маршрут через МЦД Остафьево",
    sale: "Собрать сопоставимые предложения в Щербинке",
    rent: "Сравнить аренду у МЦД Остафьево"
  },
  ostafevo: {
    school: "В ЖК открывалась школа. Сверим корпус школы и пеший путь",
    daycare: "Сверить группу и маршрут в Щербинке",
    work: "Сравнить планировки с отдельной комнатой"
  },
  "prigorod-lesnoe": {
    school: "В квартале открывалась школа. Сравним маршрут до нужного здания",
    daycare: "Проверить маршрут до садов внутри квартала"
  }
};
const ecoVisualTopics = {
  U02: ["school", "daycare", "work"],
  U03: ["", "sale", "rent"],
  U06: ["commute", "school", "daycare"],
  U10: ["work"],
  U15: ["sale", "rent"]
};
const branchTopics = {
  T01: "commute", T02: "commute", F01: "school", F02: "daycare",
  L02: "work", I01: "sale", I02: "rent"
};
const topicScenes = {
  school: 1, daycare: 1, commute: 1, work: 2, sale: 3, rent: 3,
  outdoors: 1, health: 1, shops: 1, sport: 1, parking: 1, access: 1, storage: 2, finish: 3
};
const ecoTopicScenes = { school: "U06", daycare: "U06", commute: "U06", work: "U10", sale: "U15", rent: "U15" };
const comparisonCues = {
  X01: ["Представьте адрес", "«Сравним этот адрес по тем же условиям»."],
  X02: ["Продолжите разговор о дороге", "«Проверим, как выглядел бы тот же маршрут отсюда»."],
  X03: ["Примерьте планировку", "«Давайте проверим на плане, как бы это работало здесь»."],
  X04: ["Сверьте условия переезда", "«Посмотрим, как меняются сроки и расходы в этом варианте»."],
  X05: ["Откройте предложения проекта", "«Выберем вариант и проверим то, о чём договорились»."]
};
const travelCues = {
  T01: ["«Посмотрим, во сколько вам нужно выйти из подъезда, чтобы вовремя добраться до работы».", "Сверьте путь до метро, ожидание и пересадки для обычного времени выхода."],
  T02: ["«Давайте посмотрим, как будет выглядеть ваш обычный выезд отсюда».", "Сверьте путь до машины, удобный выезд из квартала и запас времени в пробках."]
};

const intakeExtra = ["lead-date", "lead-rooms", "lead-detail", "lead-route-limit", "lead-place", "lead-transport"];
const optionalEpisodes = {
  U03: ["sale", "rent"], U07: ["outdoors", "shops", "sport"], U08: ["access", "storage"],
  U11: ["storage"], U15: ["sale", "rent"]
};
const hubSchoolSources = {
  [demoProject]: "https://t.me/s/school338official/24648?q=%23%D0%92%D0%A1%D0%95%D0%9B%D0%95%D0%9D%D0%9D%D0%90%D0%AF338",
  ostafevo: "https://www.amom.ru/assets/files/bulletin/2022/28/%D0%9C%D0%BE%D1%81%D0%BA%D0%BE%D0%B2%D1%81%D0%BA%D0%B8%D0%B9%20%D0%BC%D1%83%D0%BD%D0%B8%D1%86%D0%B8%D0%BF%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9%20%D0%B2%D0%B5%D1%81%D1%82%D0%BD%D0%B8%D0%BA_%E2%84%96%2028%28329%29_10.11.2022_%D1%82%D0%BE%D0%BC_5.pdf",
  "prigorod-lesnoe": "https://minzhil.mosreg.ru/sobytiya/novosti-ministerstva/01-09-2023-14-36-44-1100-podmoskovnykh-shkolnikov-poshli-v-novuyu-shko"
};

function startManager(session, send) {
  const events = new AbortController();
  const options = { signal: events.signal };
  const catalogShare = startCatalogPublisher(session);
  const routePlanner = startRoutePlanner(options, () => {
    showMeetingSummary();
    meetingSelection.refresh();
  });
  const meetingSelection = startMeetingSelection(options, {
    getProject: () => currentProject, getRequest: meetingRequest, preferredProfile: selectedLiving,
    getAdditionalGoal, usePracticeLots: () => intakeDraft === sampleInputs.move && currentProject === demoProject,
    getRoute: (lot) => routePlanner.checksFor(lot.project, lotRouteScope(lot)).at(-1),
    openRoute(lot) {
      route.at(-1).routeLot = lot;
      showRouteControls(currentScene, currentProject);
      byId("route-planner").scrollIntoView({ block: "nearest" });
      byId("route-origin").focus({ preventScroll: true });
    },
    openLife(preview) { go("U10", demoProject, { ...preview, fromShortlist: true }); },
    onRemove(lot) {
      routePlanner.clear(lot.project, lotRouteScope(lot));
      for (const step of route) {
        if (step.routeLot === lot) delete step.routeLot;
      }
      showRouteControls(currentScene, currentProject);
      showMeetingSummary();
    }
  });
  const layoutLibrary = initLayoutLibrary(options, selectedLiving, (preview) => {
    route.at(-1).librarySelection = preview.lot.id;
    go("U10", demoProject, preview);
  });
  const sceneSeconds = (id) => (openingCues[id] || managerStory.scenes[id]).seconds;
  const branchSteps = new Map();
  for (const [gate, branches] of Object.entries(managerStory.gates)) {
    for (const branch of branches) {
      branch.scenes.forEach((id, i) => branchSteps.set(id, { gate, branch, i }));
    }
  }
  const chapters = [["Общая презентация", "Самолёт и ваш запрос", openingOrder[0]], ...publicStory.phases].map(([title, detail, id], index) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chapter";
    button.innerHTML = `<span class="chapter-number">${String(index).padStart(2, "0")}</span><span><b>${escaped(title)}</b><small>${escaped(detail)}</small></span>`;
    button.addEventListener("click", () => {
      if (phaseFor(id) >= 0 && currentProject !== demoProject) go(projectSceneOrder[phaseFor(id)], currentProject);
      else go(id);
    }, options);
    item.append(button);
    return item;
  });
  byId("chapters").replaceChildren(...chapters);
  byId("client-link").href = `client.html?v=${showRelease}#${session}`;
  byId("workspace").hidden = false;
  byId("show-actions").hidden = false;
  byId("lead-topic").replaceChildren(new Option("Пока неизвестно или другое", ""),
    ...Object.entries(intakeTopics).map(([id, topic]) => new Option(topic.label, id)));
  byId("living-profile").replaceChildren(new Option("Общий сценарий", ""),
    ...Object.entries(livingProfiles).map(([id, profile]) => new Option(profile.label, id)));

  const get = (id) => byId(id).value;
  let route;
  let order = managerStory.main;
  let answers = {};
  let intakeDraft;
  let intakeEditing;
  let confirmedTopic;
  let recentTopic;
  let lastLeadBudget;
  let lastLeadRooms;
  let livingOverride;
  const notes = new Map();
  const admissions = new Map();
  const accents = new Map();
  let catalog;
  let usedGates = new Set();
  let began;
  let mouse;
  let frame = null;
  const hub = byId("project-hub");

  const sceneKey = (id = currentScene, project = currentProject) => project === demoProject ? id : `${project}/${id}`;

  function nextMain(id) {
    const index = order.indexOf(id);
    return index >= 0 ? order[index + 1] : undefined;
  }

  function nextFor(id) {
    if (Object.hasOwn(projectScenes, id)) return projectSceneOrder[phaseFor(id) + 1];
    const openingIndex = openingOrder.indexOf(id);
    if (openingIndex >= 0) return openingOrder[openingIndex + 1] || order[0];
    const step = branchSteps.get(id);
    if ((id === "U15" || (step?.gate === "U15" && step.i === step.branch.scenes.length - 1)) && futureReviewReturn()) {
      return futureReviewReturn();
    }
    return step ? step.branch.scenes[step.i + 1] || nextMain(step.gate) : nextMain(id);
  }

  function futureReviewReturn() {
    return route.findLast((step) => step.id === "U15")?.futureReturn;
  }

  function suggestedNext(id) {
    const next = nextFor(id);
    const branch = branchSteps.get(id);
    if (!next || currentProject !== demoProject || (branch && branch.i < branch.branch.scenes.length - 1)) return next;
    const topics = meetingTopics();
    let suggested = next;
    while (optionalEpisodes[suggested] && !(suggested === "U15" && intakeDraft === sampleInputs.move)
      && !optionalEpisodes[suggested].some((topic) => topics.includes(topic))) {
      suggested = nextMain(suggested);
    }
    return suggested;
  }

  function currentPoint() {
    if (!mouse) return null;
    const target = document.elementFromPoint(mouse.x, mouse.y)?.closest("[data-anchor]");
    if (!target || !stage.contains(target)) return null;
    const rect = target.getBoundingClientRect();
    return { block: target.dataset.anchor, x: (mouse.x - rect.left) / rect.width, y: (mouse.y - rect.top) / rect.height };
  }

  function publish() {
    const living = currentLiving;
    const accent = living ? 0 : accents.get(sceneKey());
    send({
      scene: currentScene, position: currentPosition(), point: currentPoint(),
      ...(currentProject !== demoProject && { project: currentProject }),
      ...(living && { living }),
      ...(currentLivingApproximate && { livingApproximate: true }),
      ...(accent && { accent }),
      ...(currentScene === "U20" && catalog ? { catalog } : {})
    });
  }

  function schedulePublish() {
    if (frame !== null) return;
    frame = requestAnimationFrame(() => {
      frame = null;
      publish();
    });
  }

  function allowed(branch) {
    return {
      F01: () => answers.children !== "no" && answers.school === "school",
      F02: () => answers.children !== "no" && answers.school === "daycare",
      L02: () => answers.work === "yes",
      L03: () => answers.children === "yes",
      I01: () => answers.future === "sale",
      I02: () => answers.future === "rent"
    }[branch.id]?.() ?? true;
  }

  function hasBranchTime(gate) {
    const elapsed = began === undefined ? 0 : Math.max(0, (performance.now() - began) / 1000);
    const pivot = order.indexOf(gate);
    const openingSeconds = openingOrder.reduce((sum, id) => sum + sceneSeconds(id), 0);
    const planned = order.slice(0, pivot + 1).reduce((sum, id) => sum + sceneSeconds(id), openingSeconds + usedGates.size * 75);
    const remaining = order.slice(pivot + 1).reduce((sum, id) => sum + sceneSeconds(id), 0);
    return Math.max(planned, elapsed) + remaining + 75 + 20 <= 720;
  }

  function showBranches(id) {
    const box = byId("branch-options");
    const transport = id === "U05" && visualContexts.U05[accents.get(id) - 1]?.branch;
    const choices = managerStory.gates[id]?.filter((branch) => allowed(branch) && (id !== "U05" || branch.id === transport)) || [];
    box.replaceChildren();
    box.hidden = !choices.length;
    if (box.hidden) return;
    const heading = document.createElement("p");
    heading.className = "eyebrow";
    heading.textContent = "Готовые ветки · 1:15";
    box.append(heading);
    if (order.length < managerStory.main.length || !hasBranchTime(id)) {
      const status = document.createElement("p");
      status.className = "footnote";
      status.textContent = "Если открываете разбор, можно пропустить менее важный эпизод дальше по истории.";
      box.append(status);
    }
    for (const branch of choices) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "branch-option";
      button.dataset.branch = branch.id;
      button.innerHTML = `<b>${escaped(branch.title)}</b><small>${escaped(branch.condition)}</small>`;
      button.addEventListener("click", () => {
        if (currentScene !== id) return;
        usedGates.add(id);
        go(branch.scenes[0]);
      }, { once: true });
      box.append(button);
    }
  }

  function showSelectionResult() {
    const outcome = get("selection-result");
    byId("selection-guide").textContent = {
      found: "Сравните одну или две квартиры по цене и главному условию. Затем согласуйте просмотр или проверку условий брони.",
      empty: "Если клиент согласен изменить одно условие, вернитесь к фильтрам.",
      price: "Сохраните предел цены. Уточните, какую одну характеристику можно изменить, или предложите сравнить проект в хабе.",
      timing: "Уточните предельную дату въезда. Сверьте готовый корпус или вернитесь к проектам для сравнения.",
      error: "Сохраните условия, дайте ссылку и договоритесь о повторной проверке.",
      visit: "Назовите одну квартиру или корпус и предложите два времени для просмотра. Запишите, что проверите на месте.",
      booking: "Откройте карточку выбранного лота. Сверьте актуальную цену, условия и срок брони перед решением клиента."
    }[outcome] || "Актуальные цены и наличие проверяются на сайте.";
    const fallback = byId("selection-fallback");
    fallback.hidden = !["empty", "error"].includes(outcome);
    fallback.innerHTML = fallback.hidden ? "" : `<p class="footnote">Проверьте другую витрину с теми же фильтрами. У витрин разная выдача.</p>
      ${externalLink(catalogUrl(catalog), "Список Самолёта")} ${externalLink(catalogUrl(catalog, "samolet-plus"), "Самолёт Плюс")}`;
    if (currentScene === "U20") byId("back").textContent = outcome === "empty" ? "Уточнить фильтры" : "К критериям";
  }

  function showVisualControls(id) {
    const choices = ["P04", "U15"].includes(id) || currentLiving ? undefined : visualContexts[id];
    byId("visual-controls").hidden = !choices;
    const options = byId("visual-options");
    options.replaceChildren();
    if (!choices) return;
    const selected = accents.get(sceneKey(id)) || 0;
    byId("visual-guide").textContent = id === "U05" ? "Как клиент обычно ездит в будни? Выбор сразу меняет историю."
      : "Выберите, что важнее клиенту. История подстроится.";
    if (id === "U05") showTravelCue();
    for (const [index, title] of [id === "U05" ? "Пока не уточнили" : "Общий сценарий", ...choices.map(({ control }) => control)].entries()) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = title;
      button.setAttribute("aria-pressed", String(index === selected));
      button.addEventListener("click", () => {
        accents.set(sceneKey(id), index);
        if (index) recentTopic = "";
        for (const item of options.children) item.setAttribute("aria-pressed", String(item === button));
        applyVisualAccent(index);
        if (id === "U05") {
          const transport = { T01: get("lead-transport") === "pd" ? "pd" : "mt", T02: "auto" }[choices[index - 1]?.branch] || "";
          byId("lead-transport").value = transport;
          routePlanner.selectMode(transport);
          showTravelCue();
          showBranches(id);
        }
        if (id === "U06" || id === "X02") showRouteControls(id, currentProject);
        showHubSuggestions();
        showMeetingSummary();
        publish();
      });
      options.append(button);
    }
  }

  function showTravelCue() {
    const choice = visualContexts.U05[accents.get("U05") - 1];
    const [cue, action] = travelCues[choice?.branch] || [managerStory.scenes.U05.cue, managerStory.scenes.U05.action];
    byId("cue").textContent = cue;
    byId("cue-action").textContent = action;
  }

  function selectedIntroAccent() {
    if (!byId("tailor-intro").checked) return 0;
    return visualContexts.U01.findIndex(({ topic }) => topic === get("lead-topic")) + 1;
  }

  function showIntakePreview() {
    const option = visualContexts.U01[selectedIntroAccent() - 1];
    const artwork = option?.artwork || audienceScenes.U01[1];
    byId("intake-preview-image").src = artworkUrl(artwork);
    byId("intake-preview-label").textContent = option?.labels[option.step - 1] || "Общий вид квартала";
  }

  function updateIntakeArtwork() {
    const topic = get("lead-topic");
    const purpose = get("lead-purpose");
    const artworkPurpose = { upgrade: "self", "child-home": "relative", independent: "self", rent: "investment", resale: "investment" }[purpose] || purpose;
    byId("intake-children").hidden = purpose !== "self" || (!intakeEditing && Boolean(intakeDraft.children));
    const accent = visualContexts.P04.findIndex((option) => topic ? option.topic === topic : option.purpose === artworkPurpose) + 1;
    accents.set("P04", accent);
    applyVisualAccent(accent);
    showIntakePreview();
    publish();
  }

  function showIntake() {
    const verify = !intakeEditing && intakeDraft.purpose && intakeDraft.topic;
    byId("intake-title").textContent = verify ? "Сверить то, что уже известно" : "Уточнить только недостающее";
    byId("intake-purpose").hidden = !intakeEditing && Boolean(intakeDraft.purpose);
    byId("intake-topic").hidden = !intakeEditing && Boolean(intakeDraft.topic);
    byId("intake-children").hidden = get("lead-purpose") !== "self" || (!intakeEditing && Boolean(intakeDraft.children));
    byId("intake-edit").hidden = intakeEditing || (!intakeDraft.purpose && !intakeDraft.topic);
    const purpose = intakeDraft.purpose && byId("lead-purpose").querySelector(`option[value="${intakeDraft.purpose}"]`).textContent;
    const topic = intakeTopics[intakeDraft.topic]?.label;
    const household = intakeDraft.children === "yes" ? "С детьми" : intakeDraft.children === "no" ? "Без детей" : "";
    const summary = [purpose, household, topic].filter(Boolean).join(" · ");
    byId("intake-summary").textContent = summary ? `Из учебной заявки · ${summary}` : "";
    byId("intake-summary").hidden = !summary || intakeEditing;
    byId("cue").textContent = verify ? `«Правильно понимаю, что сейчас главное — ${topic.toLowerCase()}?»`
      : byId("intake-purpose").hidden ? "«Что сильнее всего повлияет на выбор?»"
      : byId("intake-topic").hidden ? "«Для кого выбираете квартиру?»" : openingCues.P04.cue;
    byId("cue-action").textContent = verify ? "Подтвердите одну задачу в разговоре. Если она изменилась, уточните вводные." : openingCues.P04.action;
    byId("next").textContent = route.at(-1).editingRequest ? "Сохранить и вернуться"
      : verify ? "Подтвердить и выбрать проект" : "К выбору проекта";
    showIntakePreview();
  }

  function confirmIntake() {
    const previous = intakeTopics[confirmedTopic];
    const previousPurpose = answers.purpose;
    const previousGoal = getAdditionalGoal();
    answers.purpose = get("lead-purpose");
    livingOverride = undefined;
    const budget = get("lead-budget");
    if (budget || get("price-limit") === lastLeadBudget) byId("price-limit").value = budget;
    lastLeadBudget = budget;
    const rooms = get("lead-rooms");
    if (rooms || get("room-count") === lastLeadRooms) byId("room-count").value = rooms;
    lastLeadRooms = rooms;
    if (answers.purpose === "self") {
      answers.children = get("lead-children");
      byId("children").value = answers.children;
    }
    confirmedTopic = get("lead-topic");
    const topic = intakeTopics[confirmedTopic];
    if (previous?.field && previous.field !== topic?.field && answers[previous.field] === previous.value) {
      delete answers[previous.field];
      if (get(previous.field) === previous.value) byId(previous.field).value = "";
    }
    if (topic?.field) {
      answers[topic.field] = topic.value;
      byId(topic.field).value = topic.value;
    }
    const future = investmentGoals[answers.purpose];
    if (future) setFutureGoal(future);
    else if (previousPurpose && previousPurpose !== answers.purpose && topic?.field !== "future") setFutureGoal("");
    if (previousGoal && previousGoal !== getAdditionalGoal()) meetingSelection.clearFuture(previousGoal);
    if (get("lead-detail").trim() || !get("priority").trim() || get("priority") === previous?.label) {
      byId("priority").value = get("lead-detail").trim() || topic?.label || "";
    }
    const transport = get("lead-transport");
    if (transport) accents.set("U05", transport === "auto" ? 2 : 1);
    if (["school", "daycare", "work"].includes(confirmedTopic)) {
      accents.set("U02", ecoVisualTopics.U02.indexOf(confirmedTopic) + 1);
    }
    accents.set("U01", selectedIntroAccent());
    syncSchoolControl();
  }

  function getAdditionalGoal() {
    return answers.purpose && !investmentGoals[answers.purpose] && answers.purpose !== "investment"
      && ["sale", "rent"].includes(answers.future) ? answers.future : "";
  }

  function setFutureGoal(value) {
    answers.future = value;
    byId("future").value = value;
    if (recentTopic === "sale" || recentTopic === "rent") recentTopic = "";
  }

  function meetingRequest() {
    const topic = confirmedTopic || meetingTopics()[0];
    return {
      topic, budget: Number(get("price-limit")), rooms: get("room-count"),
      priority: get("priority").trim(), limit: Number(get("lead-route-limit")),
      deadline: get("lead-date"),
      place: get("lead-place").trim(),
      travel: get("lead-transport") || ({ 1: "mt", 2: "auto" })[accents.get("U05")],
      timing: get("lead-date") ? `Въезд до ${displayMeetingDate(get("lead-date"))}`
        : get("lead-when") ? byId("lead-when").selectedOptions[0].textContent : ""
    };
  }

  function criteriaFor(request) {
    return [
      request.priority || intakeTopics[request.topic]?.label,
      request.rooms && byId("room-count").selectedOptions[0].textContent,
      request.budget > 0 && `До ${request.budget.toLocaleString("ru-RU")} ₽`,
      request.timing,
      request.limit > 0 && `Дорога до ${request.limit} мин`,
      request.place && `Дальше или напрямую · ${request.place}`,
      request.travel && ({ mt: "Общественный транспорт", auto: "На машине", pd: "Пешком" })[request.travel]
    ].filter(Boolean);
  }

  function admissionKey(project, topic) {
    return `${project}/${topic}`;
  }

  function showMeetingSummary() {
    const request = meetingRequest();
    const items = criteriaFor(request).map((item) => `<li>${escaped(item)}</li>`);
    const checks = routePlanner.checksFor(currentProject);
    for (const check of checks) {
      const sameTarget = ["school", "daycare"].includes(request.topic)
        ? check.focus === request.topic : !request.place || check.place.address === request.place;
      const limit = !check.via && sameTarget ? request.limit : undefined;
      const text = check.current ? routeCheckText(check, limit) : `Ранее проверяли: ${routeCheckText(check)}`;
      items.push(`<li>${escaped(text)} ${externalLink(check.url, "Карта")}</li>`);
    }
    if (["school", "daycare"].includes(request.topic)) {
      const admission = admissions.get(admissionKey(currentProject, request.topic));
      const text = admission?.status === "yes" ? "Приём подтверждён учреждением"
        : admission?.status === "no" ? "Учреждение пока не подтвердило приём" : "Приём нужно уточнить";
      items.push(`<li>${escaped([text, admission?.institution, admission?.intake].filter(Boolean).join(" · "))}</li>`);
    }
    byId("meeting-summary").hidden = phaseFor(currentScene) < 0;
    byId("meeting-criteria").innerHTML = items.length ? items.join("") : "<li>Условия ещё уточняются.</li>";
  }

  function showRouteControls(id, project) {
    const request = meetingRequest();
    const lot = route.at(-1).routeLot;
    const checkedProject = lot?.project || project;
    const branch = branchTopics[id.split(".")[0]];
    const accent = accents.get(sceneKey(id, project)) || 0;
    const comparisonTopic = id === "X02" ? visualContexts.X02[accent - 1]?.topic || request.topic : "";
    const focus = branch || (lot ? request.topic : id === "U06" ? ({ 2: "school", 3: "daycare" })[accent] : comparisonTopic);
    const school = ["school", "daycare"].includes(focus) ? focus : "";
    const via = id === "U06" && school && request.place ? routeDestinations[0][1].find(([key]) => key === school)[2] : "";
    const isRoute = Boolean(lot || school || ["U05", "U06", "X02"].includes(id) || branch === "commute");
    const admissionsVisible = Boolean(school && (lot || ["F01", "F02"].includes(id.split(".")[0]) || id === "X02"));
    const scope = lot ? lotRouteScope(lot) : via ? `via-${school}` : school || "daily";
    routePlanner.show(isRoute, checkedProject, {
      scope, focus: via ? "" : school, place: school && !via ? "" : request.place, via,
      travel: school && !via ? "pd" : (id === "U06" && accent === 4 ? "auto" : request.travel),
      limit: !via && (!["school", "daycare"].includes(request.topic) || school) ? request.limit : undefined,
      origin: lot?.origin
    });
    byId("school-check").hidden = !admissionsVisible;
    if (admissionsVisible) {
      const key = admissionKey(checkedProject, school);
      byId("school-check").dataset.key = key;
      byId("school-check-title").textContent = school === "school" ? "Приём в школу" : "Приём в детский сад";
      const saved = admissions.get(key);
      const institution = checkedProject === demoProject ? (school === "school" ? "Школа №338 · площадка «Альфа»" : "Детский сад «Краски детства»") : "";
      byId("school-institution").value = saved?.institution ?? institution;
      byId("school-intake").value = saved?.intake || "";
      byId("school-admission").value = saved?.status || "";
      byId("school-admission").disabled = !saved?.intake || !byId("school-institution").value;
    }
    catalogShare.show(id === "U20" || id === "X05" ? "catalog" : isRoute ? "map" : "", `${project}/${id}`);
  }

  function selectedLiving() {
    return livingOverride ?? profileForPurpose(answers.purpose, answers.children, answers.future);
  }

  function showLivingControls(id, project) {
    const { lifePreview, librarySelection } = route.at(-1);
    const show = project === demoProject && isLivingScene(id) && !lifePreview;
    const key = project === demoProject ? selectedLiving() : "";
    const profile = livingProfiles[key];
    const lot = profile ? livingLayouts[profile.layout] : undefined;
    layoutLibrary.show(project === demoProject && (id === "U09" || id === "U19"), lot, librarySelection);
    byId("living-profile-fields").hidden = !show;
    byId("living-profile").value = key;
    byId("living-fit").textContent = profile?.fit || "Уточните, кто будет жить и какой сценарий для него важен.";
    byId("living-suggestion").hidden = id !== "U19" || !profile;
    if (lot) {
      byId("living-suggestion-text").textContent = `Для этой задачи рассмотрите вариант: ${lot.type.toLowerCase()}.`;
      byId("use-living-rooms").disabled = get("room-count") === String(lot.rooms);
    }
  }

  function meetingTopics() {
    const school = get("children") !== "no" && get("school");
    const work = get("work") === "yes" && "work";
    const future = ["sale", "rent"].includes(get("future")) && get("future");
    const chosen = intakeTopics[confirmedTopic]?.field ? "" : confirmedTopic;
    const eligible = [school, work, future, chosen, get("lead-place").trim() && "commute"].filter(Boolean);
    const accent = accents.get(sceneKey()) - 1;
    const shown = visualContexts[currentScene]?.[accent]?.topic || ecoVisualTopics[currentScene]?.[accent];
    const branch = branchTopics[currentScene.split(".")[0]];
    const valid = (topic) => !((topic === "school" || topic === "daycare") && get("children") === "no")
      && !(topic === "work" && get("work") === "no")
      && !((topic === "sale" || topic === "rent") && get("future") === "none");
    return [...new Set([eligible.includes(recentTopic) && recentTopic, shown, branch,
      eligible.includes(confirmedTopic) && confirmedTopic, ...eligible].filter((topic) => topic && valid(topic)))];
  }

  function rankedProjects(topics) {
    const byCar = visualContexts.U05[accents.get("U05") - 1]?.branch === "T02";
    const fallback = byCar && topics.includes("commute")
      ? "Сравнить выезд и время в пути в привычный час"
      : "Сравнить район, планировки и доступные предложения";
    return Object.keys(hubProjects).map((id) => {
      const checks = hubCriteria[id] || {};
      const matches = topics.filter((topic) => checks[topic] && !(byCar && topic === "commute"));
      return {
        id,
        score: topics.reduce((score, topic, index) => score + (matches.includes(topic) ? 2 ** (topics.length - index) : 0), 0),
        reason: matches.length ? checks[matches[0]] : fallback
      };
    }).sort((a, b) => a.score === b.score ? 0 : b.score - a.score);
  }

  function showHubSuggestions() {
    const box = byId("hub-suggestions");
    const inProject = phaseFor(currentScene) >= 0;
    byId("open-hub").hidden = !inProject;
    box.hidden = !inProject;
    if (!inProject) return;
    const topics = meetingTopics();
    const suggestions = rankedProjects(topics).filter(({ id }) => id !== currentProject).slice(0, 2);
    box.innerHTML = `<p class="eyebrow">Проекты для сравнения</p>${suggestions.map(({ id, reason }) =>
      `<button class="hub-suggestion" type="button" data-hub-choice="${id}"><b>${escaped(hubProjects[id].name)} <span aria-hidden="true">↗</span></b><small>${escaped(id === demoProject ? "Вернуться к полной истории" : reason)}</small></button>`).join("")}`;
  }

  function openProjectHub(focusProject) {
    const topics = meetingTopics();
    const request = meetingRequest();
    const inProject = phaseFor(currentScene) >= 0;
    const first = request.topic || topics[0];
    const priorities = criteriaFor(request);
    byId("hub-priority").textContent = priorities.length ? `Сравниваем по запросу · ${priorities.join(" · ")}` : "Общий обзор по Москве и области";
    byId("hub-resume").hidden = !inProject;
    if (inProject) {
      const [phase] = publicStory.phases[comparisonPhase(first)];
      byId("hub-resume").textContent = `Продолжение откроет раздел «${phase}» в выбранном проекте.`;
    }
    const ranked = rankedProjects([...new Set([first, ...topics].filter(Boolean))]);
    const projects = [ranked.find(({ id }) => id === demoProject), ...ranked.filter(({ id }) => id !== demoProject)];
    byId("hub-projects").innerHTML = projects.map(({ id, reason }, index) => {
      const { name, area, page } = hubProjects[id];
      const isDemo = id === demoProject;
      const isActive = inProject && id === currentProject;
      const check = routePlanner.checksFor(id, first === "school" || first === "daycare" ? first : "daily").at(-1);
      const sameTarget = first === "school" || first === "daycare"
        ? check?.focus === first : !request.place || check?.place.address === request.place;
      const routeSummary = check?.confirmed && check.current && !check.via ? routeCheckText(check, sameTarget ? request.limit : undefined)
        : "Маршрут от нужного корпуса ещё не сверили";
      const schoolSource = first === "school" && hubSchoolSources[id];
      const source = schoolSource ? externalLink(schoolSource, "Источник по школе") : "";
      const needsSchool = ["school", "daycare"].includes(first);
      const admission = needsSchool && admissions.get(admissionKey(id, first));
      const badge = isActive ? "Сейчас в показе" : isDemo ? "Основной показ · демо" : `Для сравнения · ${String(index).padStart(2, "0")}`;
      const actions = inProject && !isActive
        ? `<button type="button" class="primary" data-hub-project="${id}" data-continue>Продолжить с этой темы</button>
           <button type="button" class="secondary" data-hub-project="${id}">С начала проекта</button>`
        : !inProject && isDemo ? `<button type="button" class="primary" data-hub-project="${id}">Начать показ</button>` : "";
      return `<article class="hub-project${isDemo ? " hub-featured" : ""}" id="hub-card-${id}">
        <div class="hub-card-copy">
          <p class="scene-label">${escaped(badge)}</p><h3>${escaped(name)}</h3><p class="hub-area">${escaped(area)}</p>
          <p class="hub-reason">${escaped(reason)}</p>
          <ul class="check-list">
            <li>${escaped(routeSummary)}</li>
            ${needsSchool ? `<li>${admission?.status === "yes" ? "Есть отметка о приёме" : "Приём нужно сверить"}</li>` : ""}
            <li>${escaped(meetingSelection.reviewFor(id))}</li>
          </ul>
          <div class="hub-card-actions">${actions}</div>
          <div class="cue-sources">${externalLink(page, "Официальная страница")} ${source}</div>
        </div>
        ${isDemo ? '<img src="media/hero.webp" alt="Визуализация квартала Эко Бунино">' : ""}
      </article>`;
    }).join("");
    hub.showModal();
    if (focusProject) byId(`hub-card-${focusProject}`)?.querySelector("button, a")?.focus();
  }

  function comparisonPhase(topic) {
    const phase = phaseFor(currentScene);
    return topicScenes[topic] ?? (currentScene === "U03" ? 3 : phase);
  }

  function switchProject(project, resume) {
    saveCurrentAnswers();
    const topic = meetingRequest().topic;
    const target = resume ? comparisonPhase(topic) : 0;
    if (project === demoProject) {
      const themed = ecoTopicScenes[topic];
      const matching = resume && order.includes(themed) && phaseFor(themed) === target ? themed : undefined;
      const id = matching || order.find((scene) => phaseFor(scene) === target) || order[0];
      if (matching) accents.set(id, (ecoVisualTopics[id]?.indexOf(topic) ?? -1) + 1);
      if (id === "U01") {
        const index = byId("tailor-intro").checked ? visualContexts.U01.findIndex((item) => item.topic === topic) + 1 : 0;
        accents.set(id, index);
      }
      go(id);
    } else {
      const id = projectSceneOrder[target];
      const index = resume ? visualContexts[id]?.findIndex((item) => item.topic === topic) ?? -1 : -1;
      accents.set(sceneKey(id, project), index + 1);
      go(id, project);
    }
  }

  function show() {
    const current = route.at(-1);
    const { id, project, lifePreview, librarySelection } = current;
    const comparison = comparisonCues[id];
    const living = lifePreview?.key || (project === demoProject && isLivingScene(id) ? selectedLiving() : "");
    const profile = livingProfiles[living];
    const scene = profile ? livingCue(id, profile) : comparison ? {
      title: comparison[0], cue: comparison[1], seconds: 20,
      action: "Возьмите уже согласованный критерий. Сверьте детали на сайте проекта, карте или плане.",
      outcome: "Клиент может сравнить оба адреса по одному условию."
    } : openingCues[id] || managerStory.scenes[id];
    const branch = branchSteps.get(id);
    const phase = phaseFor(id);
    mouse = undefined;
    byId("manager-mode").textContent = phase < 0 ? "Самолёт · Общая презентация" : `Проект · ${hubProjects[project].name}`;
    renderScene(id, project, living, lifePreview?.approximate);
    if (id === "U15") accents.set("U15", { sale: 1, rent: 2 }[answers.future] || 0);
    applyVisualAccent(accents.get(sceneKey()));
    if (id === "U20") {
      const rooms = get("room-count");
      const price = byId("price-limit");
      const priceMax = price.validity.valid ? price.valueAsNumber : NaN;
      catalog = {
        ...(rooms && { rooms: Number(rooms) }),
        ...(priceMax > 0 && { priceMax })
      };
      if (!Object.keys(catalog).length) catalog = undefined;
      updateCatalogLinks(catalog);
    }
    chapters.forEach((item, index) => {
      const button = item.firstElementChild;
      if (index === phase + 1) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });
    const index = order.indexOf(branch?.gate || id);
    byId("run-progress").textContent = phase < 0 ? `Вступление · ${openingOrder.indexOf(id) + 1}/${openingOrder.length}` : branch
      ? `Ветка · ${branch.i + 1}/${branch.branch.scenes.length}`
      : comparison ? `Сравнение · ${phase + 1}/${projectSceneOrder.length}`
      : `Сцена ${index + 1} из ${order.length}`;
    byId("cue-meta").textContent = `Только у менеджера · ${scene.seconds} с`;
    byId("cue-title").textContent = scene.title;
    byId("cue").textContent = scene.cue;
    byId("cue-action").textContent = scene.action;
    byId("cue-outcome").textContent = scene.outcome;
    byId("cue-proof").textContent = scene.proof || "";
    if (lifePreview?.approximate) {
      byId("cue-proof").textContent = `Выбрали №${lifePreview.lot.id}. На экране пример для №${lifePreview.plan.id} · ${lifePreview.plan.area} м². Расстановку сверяйте по выбранному плану.`;
    }
    const request = meetingRequest();
    if (id === "U01") {
      byId("cue").textContent = "«Это Эко Бунино в Новой Москве, на проспекте Куприна. Начнём с того, что для вас важно, и проверим это на конкретном варианте».";
    }
    const sources = byId("cue-sources");
    sources.hidden = !(id === "U01" || id === "X02" || branch?.branch.id === "F01");
    if (!sources.hidden) {
      const focus = branch?.branch.id === "F01" ? "school" : request.topic;
      const fact = hubCriteria[project]?.[focus];
      if (fact && (!branch || id === "F01.1")) {
        byId("cue-proof").textContent = fact + ". Маршрут, доступ и применимость к корпусу сверяем отдельно.";
      }
      const schoolSource = focus === "school" && hubSchoolSources[project];
      sources.innerHTML = externalLink(hubProjects[project].page, "Справка о квартале")
        + (schoolSource ? externalLink(schoolSource, "Источник по школе") : "");
    }
    if ((id === "U13" || id === "U19") && request.timing) {
      byId("cue-proof").textContent += ` Условие клиента · ${request.timing.toLowerCase()}.`;
    }
    byId("confirmed").value = notes.get(sceneKey()) || "";
    byId("confirmed").closest(".answer").hidden = phase < 0 && id !== "P04";
    byId("back").disabled = route.length === 1;
    byId("back").hidden = Boolean(lifePreview);
    byId("back").textContent = "Назад";
    byId("jump-to-selection").hidden = Boolean(lifePreview) || project !== demoProject || phase < 1 || id === "U19" || id === "U20";
    const next = nextFor(id);
    const isSelection = id === "U20" || id === "X05";
    byId("next").hidden = !next && !lifePreview && !isSelection;
    byId("next").textContent = {
      P01: "О Самолёте", P02: "Показать пример", P03: "К запросу", U02: "Сохранить и далее", U03: "Далее", U19: "Открыть подбор",
      U20: "К кандидатам", X05: "К кандидатам"
    }[id] || (branch && branch.i === branch.branch.scenes.length - 1 ? "Вернуться к истории" : "Далее");
    if (lifePreview) byId("next").textContent = lifePreview.fromShortlist ? "К списку кандидатов" : "К выбранной планировке";
    else if (id === "U09" && next === "U10") byId("next").textContent = "Показать жизнь дома";
    const skipped = suggestedNext(id);
    const skip = byId("skip-scene");
    skip.hidden = Boolean(lifePreview) || project !== demoProject || !skipped || (!optionalEpisodes[id] && skipped === next);
    skip.textContent = optionalEpisodes[id] && skipped === next ? "Пропустить эпизод" : "Дальше по запросу";
    const recommendSkip = !skip.hidden && skipped !== next;
    skip.className = recommendSkip ? "primary" : "secondary";
    byId("next").className = recommendSkip ? "secondary" : "primary";
    if (recommendSkip) byId("next").textContent = branch ? "Вернуться к полной истории" : "Показать следующий эпизод";
    byId("intake-fields").hidden = id !== "P04";
    if (id === "P04") showIntake();
    if (id === "U02" && confirmedTopic) {
      byId("cue").textContent = "«Покажу, как это влияет на ваш обычный день».";
      byId("cue-action").textContent = "Вернитесь к уже подтверждённой задаче. Уточните только деталь, которая меняет маршрут или планировку.";
      byId("next").textContent = "Далее";
    }
    if (id === "U03" && (confirmedTopic === "sale" || confirmedTopic === "rent")) {
      byId("cue").textContent = "«Возьмём этот вопрос с собой и проверим его, когда дойдём до конкретных вариантов».";
      byId("cue-action").textContent = "Горизонт уже обсудили. Продолжите, если планы не изменились.";
    } else if (id === "U03" && answers.purpose === "investment") {
      byId("cue").textContent = "«Что важнее для покупки — оценить аренду или будущую продажу?»";
      byId("cue-action").textContent = "Сохраните выбранную задачу для подходящей ветки. Если клиент ещё выбирает, оставьте оба варианта для обсуждения.";
    }
    if (id === "U15" && !["sale", "rent"].includes(get("future"))) {
      byId("cue").textContent = "«Если понадобится переехать, к этому вопросу можно вернуться отдельно».";
      byId("cue-action").textContent = "Пропустите эпизод, если клиент не поднимал вопрос о продаже или аренде.";
    }
    const isInvestment = answers.purpose === "investment" || Boolean(investmentGoals[answers.purpose]);
    if (["U03", "U15"].includes(id) && isInvestment) {
      byId("cue").textContent = "«Сверим, какие данные нужны вам для решения о покупке».";
      byId("cue-action").textContent = id === "U15" ? "Откройте ветку по основной цели покупки. Сопоставимые предложения дают ориентир на дату проверки."
        : "Подтвердите цель. Подробности можно обсудить после примерки планировки.";
    }
    if (id === "U16" && request.budget > 0) {
      byId("cue").textContent = `«За квартиру берём предел ${request.budget.toLocaleString("ru-RU")} ₽. Отдельно проверим, сколько понадобится на въезд».`;
    }
    byId("household-fields").hidden = id !== "U02";
    byId("future-fields").hidden = !["U03", "U15"].includes(id) || Boolean(investmentGoals[answers.purpose]);
    byId("future-title").textContent = isInvestment ? "Цель покупки" : "Дополнительная цель";
    byId("future-label").textContent = isInvestment ? "Какие данные нужны покупателю" : "Что будет важно при переезде";
    byId("future-guide").textContent = isInvestment ? "Выберите, что покупатель хочет проверить в первую очередь."
      : intakeDraft === sampleInputs.move && id === "U15"
        ? "Вводная: семья может переехать через четыре года. Если она хочет учесть продажу, выберите её и откройте разбор."
        : "Основной запрос сохраняется. Добавьте проверку, если покупатель подтвердил, что она влияет на выбор.";
    byId("withdraw-future").hidden = branch?.gate !== "U15" || !getAdditionalGoal();
    byId("review-future").hidden = project !== demoProject || !["U19", "U20"].includes(id) || isInvestment;
    byId("priority-fields").hidden = id !== "U04" && id !== "U19";
    byId("catalog-filters").hidden = id !== "U19";
    byId("selection-fields").hidden = id !== "U20";
    if (id === "U20") {
      byId("selection-priority").hidden = !get("priority").trim();
      byId("selection-priority").textContent = get("priority").trim();
      const profile = livingProfiles[selectedLiving()];
      const link = byId("selection-plan");
      link.hidden = !profile;
      if (profile) link.href = livingLayouts[profile.layout].url;
      else link.removeAttribute("href");
      showSelectionResult();
    }
    meetingSelection.show(isSelection, criteriaFor(request).join(" · "));
    if (isSelection) byId("meeting-summary").open = false;
    showVisualControls(id);
    showLivingControls(id, project);
    showBranches(id);
    showHubSuggestions();
    showRouteControls(id, project);
    showMeetingSummary();
    if (["F01.4", "F02.4"].includes(id)) byId("meeting-summary").open = true;
    document.querySelector(".tools-fields").scrollTop = 0;
    if (librarySelection) {
      delete current.librarySelection;
      const previewButton = byId("layout-library-life");
      previewButton.scrollIntoView({ block: "nearest" });
      previewButton.focus({ preventScroll: true });
    }
    publish();
  }

  function go(id, project = demoProject, lifePreview, editingRequest = false, futureReturn) {
    if (!id || (id === currentScene && project === currentProject)) return;
    began ??= performance.now();
    route.at(-1).accent = accents.get(sceneKey());
    route.push({ id, project, lifePreview, editingRequest, futureReturn });
    show();
  }

  function continueAfterFuture() {
    const target = futureReviewReturn() || nextMain("U15");
    while (branchSteps.get(route.at(-1).id)?.gate === "U15") route.pop();
    const gate = route.at(-1);
    if (gate.futureReturn) route.pop();
    if (route.at(-1).id === target) show();
    else go(target);
  }

  function advanceComparison(id) {
    if (!id) return;
    const topics = meetingTopics();
    const controls = visualContexts[id] || [];
    const topic = topics.find((item) => controls.some((control) => control.topic === item));
    accents.set(sceneKey(id), controls.findIndex((control) => control.topic === topic) + 1);
    go(id, currentProject);
  }

  function restart() {
    const sample = sampleInputs[get("practice")] || sampleInputs.none;
    order = get("route-mode") === "short" ? (sample === sampleInputs.move ? crossDemoRoute : managerStory.short) : managerStory.main;
    route = [{ id: openingOrder[0], project: demoProject }];
    answers = {};
    intakeDraft = sample;
    const guide = byId("practice-guide");
    guide.hidden = sample === sampleInputs.none || sample === sampleInputs.partial;
    guide.textContent = sample === sampleInputs.move
      ? "Школа → план и вечер семьи → возможная продажа → два учебных варианта в подборе."
      : "Подтвердите вводные, выберите проект и покажите план и сценарий жизни.";
    intakeEditing = false;
    confirmedTopic = "";
    recentTopic = "";
    lastLeadBudget = "";
    lastLeadRooms = "";
    livingOverride = undefined;
    notes.clear();
    admissions.clear();
    accents.clear();
    usedGates = new Set();
    catalog = undefined;
    routePlanner.reset();
    meetingSelection.reset();
    byId("meeting-summary").open = false;
    began = undefined;
    for (const key of ["children", "school", "work", "future", "priority"]) byId(key).value = sample[key] || "";
    byId("lead-purpose").value = sample.purpose || "";
    byId("lead-children").value = sample.children || "";
    byId("lead-budget").value = sample.price || "";
    for (const key of intakeExtra) byId(key).value = "";
    byId("lead-rooms").value = sample.rooms || "";
    byId("lead-route-limit").value = sample.limit || "";
    byId("lead-transport").value = sample.travel || "";
    byId("lead-when").value = "";
    byId("lead-topic").value = sample.topic || "";
    byId("tailor-intro").checked = true;
    byId("room-count").value = sample.rooms || "";
    byId("price-limit").value = sample.price || "";
    byId("selection-result").value = "";
    syncSchoolControl();
    stage.scrollTop = 0;
    show();
  }

  function syncSchoolControl() {
    byId("school").disabled = get("children") === "no";
  }

  function saveCurrentAnswers() {
    if (currentScene === "U02") {
      answers = { ...answers, children: get("children"), school: get("school"), work: get("work") };
    }
    if (currentScene === "U03" || currentScene === "U15") answers.future = get("future");
  }

  function moveForward(skipEpisodes = false) {
    if (route.at(-1).lifePreview) {
      back();
      return;
    }
    if (currentScene === "U20" || currentScene === "X05") {
      meetingSelection.focus();
      return;
    }
    if (currentScene === "P04") {
      const invalid = ["lead-budget", "lead-route-limit"].map(byId).find((input) => !input.checkValidity());
      if (invalid) {
        invalid.closest("details").open = true;
        invalid.reportValidity();
        return;
      }
      confirmIntake();
      if (route.at(-1).editingRequest) {
        const previous = route.at(-2);
        previous.accent = accents.get(sceneKey(previous.id, previous.project));
        back();
      } else openProjectHub();
      return;
    }
    saveCurrentAnswers();
    const branch = branchSteps.get(currentScene);
    if ((currentScene === "U15" && futureReviewReturn())
      || (branch?.gate === "U15" && branch.i === branch.branch.scenes.length - 1 && futureReviewReturn())) {
      continueAfterFuture();
      return;
    }
    if (currentScene === "U19") {
      if (!byId("price-limit").reportValidity()) return;
    }
    const next = skipEpisodes ? suggestedNext(currentScene) : nextFor(currentScene);
    if (next === "U06" && (currentScene === "U05" || branchSteps.get(currentScene)?.gate === "U05")) {
      const transport = visualContexts.U05[accents.get("U05") - 1]?.branch;
      const option = ({ school: "Путь через школу", daycare: "Путь через детский сад" })[get("school")]
        || ({ T01: "Прямой путь", T02: "На машине" })[transport];
      accents.set("U06", visualContexts.U06.findIndex(({ control }) => control === option) + 1);
    }
    if (currentProject === demoProject) go(next);
    else advanceComparison(next);
  }
  byId("next").addEventListener("click", () => moveForward(), options);
  byId("skip-scene").addEventListener("click", () => moveForward(true), options);
  function back() {
    if (route.length > 1) {
      const previous = route.pop();
      while (branchSteps.get(route.at(-1).id)?.gate === "U15" && !allowed(branchSteps.get(route.at(-1).id).branch)) {
        route.pop();
      }
      const { id, project, accent } = route.at(-1);
      accents.set(sceneKey(id, project), accent);
      show();
      if (previous.lifePreview?.fromShortlist) meetingSelection.focus();
    }
  }
  byId("back").addEventListener("click", back, options);
  byId("restart-story").addEventListener("click", restart, options);
  byId("jump-to-selection").addEventListener("click", () => go("U19"), options);
  byId("review-future").addEventListener("click", () => {
    go("U15", demoProject, undefined, false, currentScene);
  }, options);
  byId("withdraw-future").addEventListener("click", () => {
    const removed = getAdditionalGoal();
    setFutureGoal("none");
    meetingSelection.clearFuture(removed);
    continueAfterFuture();
  }, options);
  byId("intake-edit").addEventListener("click", () => { intakeEditing = true; showIntake(); }, options);
  byId("edit-meeting").addEventListener("click", () => {
    intakeEditing = true;
    go("P04", demoProject, undefined, true);
  }, options);
  for (const field of ["school-institution", "school-intake", "school-admission"]) {
    byId(field).addEventListener("input", () => {
      const key = byId("school-check").dataset.key;
      const intake = get("school-intake").trim();
      const institution = get("school-institution").trim();
      const select = byId("school-admission");
      const previous = admissions.get(key);
      if (previous?.intake !== intake || previous?.institution !== institution) select.value = "";
      select.disabled = !intake || !institution;
      admissions.set(key, { intake, institution, status: select.value });
      showMeetingSummary();
    }, options);
  }
  byId("priority").addEventListener("input", () => {
    byId("lead-detail").value = get("priority");
    showMeetingSummary();
  }, options);
  byId("lead-purpose").addEventListener("change", updateIntakeArtwork, options);
  byId("lead-topic").addEventListener("change", updateIntakeArtwork, options);
  byId("tailor-intro").addEventListener("change", showIntakePreview, options);
  for (const field of ["children", "school", "work"]) {
    byId(field).addEventListener("change", () => {
      syncSchoolControl();
      recentTopic = field === "work" && get(field) === "yes" ? "work" : get(field);
      showHubSuggestions();
      showMeetingSummary();
    }, options);
  }
  byId("future").addEventListener("change", () => {
    const previous = getAdditionalGoal();
    const value = get("future");
    setFutureGoal(value);
    if (previous && previous !== getAdditionalGoal()) meetingSelection.clearFuture(previous);
    if (currentScene === "U15") {
      const index = { sale: 1, rent: 2 }[value] || 0;
      accents.set("U15", index);
      applyVisualAccent(index);
      showBranches(currentScene);
      publish();
    }
    showHubSuggestions();
    showMeetingSummary();
  }, options);
  byId("open-hub").addEventListener("click", () => openProjectHub(), options);
  byId("hub-suggestions").addEventListener("click", (event) => {
    const button = event.target.closest("[data-hub-choice]");
    if (button) openProjectHub(button.dataset.hubChoice);
  }, options);
  hub.addEventListener("click", (event) => {
    const button = event.target.closest("[data-hub-project]");
    if (!button) return;
    hub.close();
    switchProject(button.dataset.hubProject, button.hasAttribute("data-continue"));
  }, options);
  byId("confirmed").addEventListener("input", () => notes.set(sceneKey(), get("confirmed")), options);
  byId("selection-result").addEventListener("change", showSelectionResult, options);
  byId("living-profile").addEventListener("change", () => {
    livingOverride = get("living-profile");
    show();
  }, options);
  byId("use-living-rooms").addEventListener("click", () => {
    const profile = livingProfiles[selectedLiving()];
    if (!profile || currentScene !== "U19") return;
    byId("room-count").value = String(livingLayouts[profile.layout].rooms);
    byId("lead-rooms").value = get("room-count");
    showLivingControls(currentScene, currentProject);
    showMeetingSummary();
  }, options);
  byId("room-count").addEventListener("change", () => {
    byId("lead-rooms").value = get("room-count");
    showLivingControls(currentScene, currentProject);
    showMeetingSummary();
  }, options);
  byId("price-limit").addEventListener("input", () => {
    byId("lead-budget").value = get("price-limit");
    showMeetingSummary();
  }, options);
  stage.addEventListener("scroll", schedulePublish, { ...options, passive: true });
  stage.addEventListener("pointermove", (event) => {
    mouse = { x: event.clientX, y: event.clientY };
    schedulePublish();
  }, options);
  stage.addEventListener("pointerleave", () => { mouse = undefined; schedulePublish(); }, options);
  const observer = new ResizeObserver(schedulePublish);
  observer.observe(stage);
  restart();
  showStartupReady();

  return {
    publish,
    close() {
      hub.close();
      routePlanner.reset();
      meetingSelection.reset();
      admissions.clear();
      catalogShare.close();
      events.abort();
      observer.disconnect();
      if (frame !== null) cancelAnimationFrame(frame);
      byId("workspace").hidden = true;
      byId("show-actions").hidden = true;
      byId("practice").value = "none";
      byId("route-mode").value = "full";
      for (const key of [...intakeExtra, "lead-purpose", "lead-topic", "lead-children", "lead-budget", "lead-when", "children", "school", "work", "future", "priority", "room-count", "price-limit", "confirmed", "selection-result"]) {
        byId(key).value = "";
      }
      currentScene = undefined;
      stage.replaceChildren();
    }
  };
}

function startLocalManager() {
  const session = crypto.randomUUID();
  const channel = new BroadcastChannel(`eco-bunino:${session}`);
  const viewers = new Map();
  const presentation = startManager(session, (state) => channel.postMessage({ type: "state", ...state }));
  function connectionStatus() {
    for (const [id, seen] of viewers) if (Date.now() - seen > 5000) viewers.delete(id);
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
    import(`./network.js?v=${showRelease}`).then(({ startNetworkManager }) => startNetworkManager(startManager))
      .then(showStartupReady)
      .catch(showStartupError);
  } else if (["localhost", "127.0.0.1"].includes(location.hostname)
      || new URLSearchParams(location.search).get("demo") === "1") {
    startLocalManager();
  } else {
    byId("login").hidden = false;
    byId("login-status").textContent = "Для командного входа подключите Firebase. Сценарий можно пройти в режиме демо.";
    byId("open-demo").hidden = false;
    showStartupReady();
  }
}
