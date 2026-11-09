function catalogLotReference(value, project) {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" || url.port || url.username || url.password) return null;
    const official = url.hostname === "samolet.ru";
    const lot = official ? url.pathname.match(/^\/project\/([^/]+)\/flats\/(\d+)\/?$/)
      : url.hostname === "samoletplus.ru" && url.pathname.match(/^\/flats-id\/(\d+)\/?$/);
    if (!lot || (official && lot[1] !== project)) return null;
    return { url: `${url.origin}${url.pathname.replace(/\/$/, "")}/`, id: Number(lot.at(-1)), official, project };
  } catch {
    return null;
  }
}

function startMeetingSelection(options, { getProject, getRequest, getRoute, openRoute, openLife, onRemove, preferredProfile, getAdditionalGoal, usePracticeLots }) {
  const section = byId("meeting-selection");
  const cards = byId("shortlist-cards");
  const form = byId("shortlist-add");
  const input = byId("lot-url");
  const status = byId("shortlist-status");
  const candidates = [];
  const sampleButton = byId("sample-candidates");
  const comparison = byId("future-comparison");
  const readyForComparison = "Данные собраны";
  let active;
  const paymentOptions = ["", "Полная оплата", "Ипотека", "Рассрочка", "Другое"];
  const finishOptions = ["", "Без отделки", "Предчистовая", "Готовая отделка"];
  const resultOptions = ["", "Подходит", "Не подходит"];
  const followUpFields = ["follow-up", "follow-up-date", "follow-up-note"].map(byId);

  const optionsFor = (values, value, fallback) => values.map((item) =>
    `<option value="${escaped(item)}"${item === value ? " selected" : ""}>${escaped(item || fallback)}</option>`).join("");
  const field = (key, label, value, attrs) =>
    `<label>${escaped(label)}<input data-lot-field="${key}" value="${escaped(value || "")}" ${attrs}></label>`;
  const select = (key, label, value, values, fallback) =>
    `<label>${escaped(label)}<select data-lot-field="${key}">${optionsFor(values, value || "", fallback)}</select></label>`;

  function criterionKey({ priority, topic, limit, place, travel }) {
    return JSON.stringify([priority, topic, limit, place, travel]);
  }

  function lifeExample(candidate) {
    if (candidate.practice) return null;
    if (candidate.verifiedProject === "Другой ЖК") return null;
    if (!candidate.official && candidate.project === demoProject) {
      const exact = ecoLayouts.find(({ id }) => id === candidate.id);
      if (exact && Object.values(livingLayouts).some((plan) => plan.id === exact.id)) return matchLivingExample(exact);
    }
    if (candidate.project !== demoProject || !candidate.rooms) return null;
    return matchLivingExample({ rooms: Number(candidate.rooms), area: Number(candidate.area) || 0 }, preferredProfile());
  }

  function render() {
    sampleButton.hidden = !usePracticeLots() || candidates.length > 0;
    const goal = getAdditionalGoal();
    cards.innerHTML = candidates.map((lot, index) => `<details class="candidate" data-lot-index="${index}"${active === lot ? " open" : ""}>
      <summary>${escaped(lot.practice || `${hubProjects[lot.project].name} · карточка №${lot.id}`)}</summary>
      ${lot.practice ? '<p class="footnote">Вымышленные данные для репетиции.</p>' : externalLink(lot.url, "Открыть квартиру")}
      ${!lot.official ? select("verifiedProject", "ЖК в карточке", lot.verifiedProject, ["", "Совпадает", "Другой ЖК"], "Сверить") : ""}
      ${lot.practice ? "" : `
      ${field("origin", "Адрес корпуса или подъезда", lot.origin, 'maxlength="180"')}
      <button type="button" class="secondary" data-lot-action="route">Проверить путь от корпуса</button>
      <p data-lot-route class="footnote"></p>`}
      <div class="candidate-grid">
        ${select("available", "Наличие по карточке", lot.available, ["", "Доступна", "Недоступна"], "Сверить")}
        ${select("rooms", "Комнатность по карточке", lot.rooms, ["", "0", "1", "2", "3"], "Уточнить")}
        ${field("area", "Площадь, м²", lot.area, 'type="number" min="1" max="1000" step="0.1"')}
        ${field("price", "Проверенная цена, ₽", lot.price, 'type="number" min="1" max="1000000000" step="1"')}
        ${select("payment", "Способ покупки для этой цены", lot.payment, paymentOptions, "Уточнить")}
        ${field("keys", "Передача ключей по источнику", lot.keys, 'type="date"')}
        ${select("finish", "Отделка по карточке", lot.finish, finishOptions, "Уточнить")}
        ${select("move", "Въезд в срок с учётом работ", lot.move, resultOptions, "Проверить")}
        ${select("fit", "Главное условие", lot.fit, resultOptions, "Проверить")}
      </div>
      ${goal && lot.project === getProject() ? select("futureStatus", goal === "sale" ? "Сравнение для возможной продажи" : "Сравнение для возможной аренды", lot.future?.[goal],
        ["", readyForComparison, "Нужны данные"], "Не проверено") : ""}
      <p data-lot-future-notice class="footnote" hidden></p>
      ${field("note", "Что осталось подтвердить", lot.note, 'maxlength="180"')}
      <p data-lot-summary class="manager-outcome"></p>
      <div class="candidate-actions">
        <button type="button" class="secondary" data-lot-action="life">Примерить сценарий жизни</button>
        <button type="button" class="secondary" data-lot-action="remove">Убрать из списка</button>
      </div>
    </details>`).join("");
    refresh();
    form.hidden = candidates.length >= 2 || candidates.some((lot) => lot.practice);
    if (candidates.some((lot) => lot.practice)) status.textContent = "Учебные варианты. Чтобы добавить реальные квартиры, сначала уберите примеры.";
    else if (form.hidden) status.textContent = "В списке две квартиры для сравнения.";
  }

  function assessment(lot) {
    const request = getRequest();
    const { budget, rooms, deadline, timing } = request;
    const price = Number(lot.price);
    const missesBudget = budget && price > budget;
    const missesRooms = rooms && lot.rooms && rooms !== lot.rooms;
    const move = lot.timing === timing ? lot.move : "";
    const fit = lot.criterion === criterionKey(request) ? lot.fit : "";
    const open = [
      (!lot.available || (!lot.official && !lot.verifiedProject)) && "наличие и ЖК",
      (rooms && !lot.rooms) && "комнатность",
      (!price || !lot.payment) && "цену и способ покупки",
      (!lot.keys || !lot.finish || !move) && "ключи, отделку и срок въезда",
      !fit && "главное условие"
    ].filter(Boolean);
    const blocked = lot.available === "Недоступна" ? "Квартира недоступна по карточке."
      : lot.verifiedProject === "Другой ЖК" ? "Квартира относится к другому ЖК."
      : missesBudget && lot.payment ? "Выше согласованного бюджета."
      : missesRooms ? "Комнатность отличается от согласованной."
      : deadline && lot.keys && lot.keys > deadline ? "Ключи позже предельной даты въезда."
      : move === "Не подходит" || fit === "Не подходит" ? "Есть расхождение с запросом." : "";
    return { passed: !blocked && !open.length, text: blocked || (open.length ? `Уточнить: ${open.join(", ")}.` : "Внесённые проверки по запросу пройдены.") };
  }

  function updateCard(card, lot) {
    card.querySelector("[data-lot-summary]").textContent = assessment(lot).text;
    const check = getRoute(lot);
    const route = card.querySelector("[data-lot-route]");
    if (route) route.textContent = !check ? "" : check.current && (!lot.origin || lot.origin === check.from)
      ? routeCheckText(check) : `Ранее проверяли: ${routeCheckText(check)}`;
    const action = card.querySelector('[data-lot-action="life"]');
    const example = lifeExample(lot);
    action.hidden = lot.project !== demoProject || Boolean(lot.practice);
    action.disabled = !example;
    action.textContent = example && !example.approximate ? "Показать сценарий этой планировки" : "Показать похожий сценарий";
    const futureNotice = card.querySelector("[data-lot-future-notice]");
    futureNotice.hidden = !lot.futureAddressChanged || !getAdditionalGoal() || lot.project !== getProject();
    futureNotice.textContent = "Адрес или ЖК в карточке изменился. Соберите сопоставимые данные заново.";
  }

  function refresh() {
    for (const card of cards.children) updateCard(card, candidates[Number(card.dataset.lotIndex)]);
    const goal = getAdditionalGoal();
    comparison.hidden = !goal;
    if (!goal) return;
    const matching = candidates.filter((lot) => lot.project === getProject() && assessment(lot).passed);
    const ready = matching.filter((lot) => lot.future?.[goal] === readyForComparison);
    comparison.textContent = matching.length === 2 && ready.length === 1
      ? `При равных основных условиях можно первым обсудить ${ready[0].practice || `вариант №${ready[0].id}`}. По нему собраны данные для сравнения.`
      : matching.length === 2 && ready.length === 2 ? "Данные есть по обеим квартирам. Сравните их вместе с покупателем."
      : "Дополнительную цель учитываем при сравнении двух вариантов, которые прошли основные проверки.";
  }

  sampleButton.addEventListener("click", () => {
    if (!usePracticeLots() || candidates.length) return;
    const request = getRequest();
    const { budget, rooms, timing, deadline } = request;
    const goal = getAdditionalGoal();
    for (const [index, label] of ["А", "Б"].entries()) {
      candidates.push({
        id: -(index + 1), practice: `Учебный вариант ${label}`, project: getProject(), official: true,
        available: "Доступна", rooms: rooms || "2", price: String(Math.min(budget || 17000000, 17000000)),
        payment: "Полная оплата", keys: deadline || "2027-06-01", finish: "Готовая отделка", move: "Подходит",
        fit: "Подходит", criterion: criterionKey(request), timing,
        future: goal ? { [goal]: index === 0 ? "Нужны данные" : readyForComparison } : {}
      });
    }
    render();
    (comparison.hidden ? cards.firstElementChild : comparison).scrollIntoView({ block: "nearest" });
  }, options);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const lot = catalogLotReference(input.value, getProject());
    if (!lot) {
      status.textContent = "Вставьте ссылку на карточку этого ЖК из «Самолёта» или «Самолёт Плюс».";
      return;
    }
    if (candidates.length >= 2 || candidates.some((candidate) => candidate.practice)) return;
    if (candidates.some(({ url }) => url === lot.url)) {
      status.textContent = "Эта квартира уже в списке.";
      return;
    }
    candidates.push(lot);
    active = lot;
    input.value = "";
    status.textContent = "Квартира добавлена. Сверьте её условия по карточке.";
    render();
    cards.querySelector("details[open]")?.querySelector("summary")?.focus();
  }, options);
  cards.addEventListener("input", (event) => {
    const field = event.target;
    const key = field.dataset.lotField;
    if (!key) return;
    const card = field.closest("details");
    const lot = candidates[Number(card.dataset.lotIndex)];
    if (key === "futureStatus") {
      const goal = getAdditionalGoal();
      if (goal) (lot.future ??= {})[goal] = field.value;
      if (field.value) lot.futureAddressChanged = false;
      refresh();
      return;
    }
    const previous = lot[key];
    lot[key] = field.validity.valid ? field.value.trim() : "";
    const request = getRequest();
    if (key === "move") lot.timing = request.timing;
    if (key === "fit") lot.criterion = criterionKey(request);
    if (previous && previous !== lot[key]) {
      if (key === "payment") lot.price = card.querySelector('[data-lot-field="price"]').value = "";
      if (key === "keys" || key === "finish") lot.move = card.querySelector('[data-lot-field="move"]').value = "";
    }
    if (previous !== lot[key] && (key === "origin" || key === "verifiedProject")) {
      lot.fit = card.querySelector('[data-lot-field="fit"]').value = "";
      lot.futureAddressChanged ||= Object.values(lot.future || {}).some(Boolean);
      lot.future = {};
      const futureField = card.querySelector('[data-lot-field="futureStatus"]');
      if (futureField) futureField.value = "";
    }
    active = lot;
    refresh();
  }, options);
  cards.addEventListener("click", (event) => {
    const button = event.target.closest("[data-lot-action]");
    if (!button) return;
    const index = Number(button.closest("details").dataset.lotIndex);
    const lot = candidates[index];
    if (button.dataset.lotAction === "remove") {
      candidates.splice(index, 1);
      if (active === lot) active = undefined;
      onRemove(lot);
      status.textContent = "Квартира убрана из списка.";
      render();
    } else if (button.dataset.lotAction === "route") {
      active = lot;
      openRoute(lot);
    } else {
      const example = lifeExample(lot);
      if (example) {
        active = lot;
        openLife({ ...example, lot });
      }
    }
  }, options);
  function updateFollowUp() {
    const [action, date, note] = followUpFields.map(({ value }) => value);
    byId("follow-up-status").textContent = !action ? "Выберите следующее действие после разговора."
      : !date ? "Добавьте согласованную дату." : `В этой встрече записано: ${action} · ${displayMeetingDate(date)}${note ? ` · ${note}` : ""}.`;
  }
  for (const field of followUpFields) field.addEventListener("input", updateFollowUp, options);

  return {
    clearFuture(goal) {
      for (const lot of candidates) {
        if (lot.future) delete lot.future[goal];
      }
      if (!section.hidden) render();
    },
    focus() {
      const target = cards.querySelector("details[open] summary") || input;
      target.scrollIntoView({ block: "nearest" });
      target.focus({ preventScroll: true });
    },
    refresh() {
      if (!section.hidden) refresh();
    },
    reviewFor(project) {
      const lots = candidates.filter((lot) => lot.project === project && !lot.practice);
      return lots.length ? `Квартир в списке: ${lots.length}. Проверки по запросу пройдены: ${lots.filter((lot) => assessment(lot).passed).length}.`
        : "Цену, отделку и въезд сверяем по выбранному лоту";
    },
    show(visible, criteria) {
      section.hidden = !visible;
      if (!visible) return;
      byId("shortlist-criteria").textContent = criteria;
      render();
      updateFollowUp();
    },
    reset() {
      candidates.length = 0;
      active = undefined;
      input.value = "";
      status.textContent = "";
      for (const field of followUpFields) field.value = "";
    }
  };
}

function displayMeetingDate(value) {
  return value.split("-").reverse().join(".");
}

function lotRouteScope(lot) {
  return `lot-${lot.official ? "main" : "plus"}-${lot.id}`;
}
