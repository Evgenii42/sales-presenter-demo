const livingProfiles = {
  "self-family": {
    label: "Для себя · с детьми",
    layout: "self-family",
    planTitle: "Вечером можно собраться вместе, а для уроков оставить отдельную комнату",
    planLabels: ["Собраться за общим столом", "Выделить ребёнку свою комнату", "Закрыть спальню, когда нужна тишина"],
    lifeTitle: "Ужин готовится, пока ребёнок заканчивает уроки",
    lifeLabels: ["Готовить ужин и быть рядом", "Закончить уроки в своей комнате", "Уйти отдыхать в спальню"],
    life: "Один готовит ужин, второй накрывает на стол, ребёнок заканчивает уроки у себя. Через несколько минут все собираются вместе.",
    fit: "Спросите, нужно ли детям спать и заниматься отдельно. На реальном плане сверьте место для стола и проход с расставленной мебелью."
  },
  "self-no-children": {
    label: "Для себя · без детей",
    layout: "self-no-children",
    planTitle: "Работа помещается дома, а спальня остаётся для отдыха",
    planLabels: ["Убрать вещи с прохода", "Разделить быт и отдых дверью", "Устроить место для ноутбука"],
    lifeTitle: "Последний созвон заканчивается, и начинается ваш вечер",
    lifeLabels: ["Переключиться на свои дела", "Закрыть ноутбук после работы", "Уйти отдыхать в отдельную комнату"],
    life: "Вы закрываете ноутбук, готовите ужин и переходите в спальню, когда хочется тишины.",
    fit: "Уточните, нужен ли постоянный стол или достаточно места для коротких звонков. Сверьте место и розетки по выбранному лоту."
  },
  upgrade: {
    label: "Переехать в квартиру побольше",
    layout: "upgrade",
    planTitle: "Дополнительная комната помогает, когда у всех разные планы",
    planLabels: ["Оставить место для общего ужина", "Выделить ещё одну комнату", "Заниматься своим делом за дверью"],
    lifeTitle: "Дома хватает места и общему вечеру, и личным делам",
    lifeLabels: ["Собрать всех за большим столом", "Уйти на звонок в свою комнату", "Оставить ребёнку место для игры"],
    life: "Пока семья накрывает на стол, один заканчивает звонок за дверью, а ребёнок продолжает играть у себя.",
    fit: "Уточните, чего именно не хватает сейчас: отдельной комнаты, места за столом или хранения. Сравните прибавку по этому условию."
  },
  parents: {
    label: "Для родителей",
    layout: "parents",
    planTitle: "Кухня, спальня и вход могут быть связаны коротким путём",
    planLabels: ["Оставить удобный проход от входа", "Поставить стол рядом с кухней", "Пройти из спальни к санузлу"],
    lifeTitle: "Вы заходите к родителям на чай после работы",
    lifeLabels: ["Пройти в дом с покупками", "Сесть за стол на кухне", "Оставить свободный путь по дому"],
    life: "Поставили покупки у входа, прошли на кухню и сели пить чай. То, чем родители пользуются каждый день, помещается рядом.",
    fit: "Попросите назвать одно бытовое неудобство. Сверьте вход в секцию, пороги, ширину проходов и место для поворота на плане или показе."
  },
  "child-home": {
    label: "Обеспечить ребёнка жильём",
    layout: "child-home",
    planTitle: "В первом самостоятельном доме есть место для учёбы и отдыха",
    planLabels: ["Оставить место для сна", "Готовить дома в своём ритме", "Поставить стол для учёбы"],
    lifeTitle: "После занятий можно поужинать и спокойно доделать работу",
    lifeLabels: ["Приготовить простой ужин", "Разложить свои вещи по местам", "Доделать работу за столом"],
    life: "После учёбы можно вернуться домой, приготовить ужин и сесть за стол с ноутбуком, пока вещи лежат на своих местах.",
    fit: "Уточните, кто и когда будет жить. Проверьте дорогу до учёбы или работы и возможность поставить стол с нормальным проходом."
  },
  rent: {
    label: "Сдавать в аренду",
    layout: "rent",
    planTitle: "В компактной квартире важно сразу найти место для сна, кухни и вещей",
    planLabels: ["Оставить место для чемодана", "Проверить место для сна и стола", "Устроить компактную кухню"],
    lifeTitle: "Арендатор приезжает с чемоданом и может обустроиться в первый вечер",
    lifeLabels: ["Убрать чемодан и одежду", "Разложить диван на ночь", "Приготовить ужин сразу после въезда"],
    life: "Человек возвращается с работы, убирает вещи, разогревает ужин и готовит спальное место. Так видно, что понадобится для сдачи.",
    fit: "Сверьте, для кого сдаёте, бюджет на мебель и расходы между арендаторами. Доход оценивайте по сопоставимым предложениям."
  },
  resale: {
    label: "Купить для перепродажи",
    layout: "resale",
    planTitle: "На просмотре легко понять, как использовать комнаты",
    planLabels: ["Оценить кухню и место для стола", "Проверить понятный проход", "Увидеть отдельную спальню"],
    lifeTitle: "На будущем просмотре покупатель сразу примеряет свой обычный день",
    lifeLabels: ["Представить, где завтракать", "Понять, куда убрать вещи", "Посмотреть отдельную комнату"],
    life: "На просмотре человек понимает, где будет завтракать, что поместится в прихожей и можно ли закрыть дверь спальни.",
    fit: "Согласуйте горизонт и допустимый риск. Сопоставьте площадь, корпус, отделку и цену с реальными аналогами на одну дату."
  },
  independent: {
    label: "Съехать от родных",
    layout: "independent",
    planTitle: "Первую квартиру можно обустроить под свой распорядок",
    planLabels: ["Убрать вещи с прохода", "Оставить место для готовки", "Отделить отдых расстановкой мебели"],
    lifeTitle: "Первый вечер в своём доме начинается с простого ужина",
    lifeLabels: ["Поставить коробки у входа", "Приготовить ужин на своей кухне", "Устроить угол для отдыха"],
    life: "Вы открываете коробку с посудой, готовите первый ужин и оставляете остальное на завтра. Уже понятно, чем пользоваться каждый день.",
    fit: "Сверьте предел полной стоимости и список вещей для первого месяца. Проверьте хранение, спальное место и проход в кухонной зоне."
  }
};

const livingArtworkPoints = {
  "self-family": [[23, 43, 18], [45, 40, 50], [73, 41, 82]],
  "self-no-children": [null, [71, 69, 82], [59, 32, 55]],
  upgrade: [[25, 39, 19], [79, 33, 80], [76, 72, 78]],
  parents: [[28, 65, 19], [62, 35, 66], null],
  "child-home": [[70, 53, 80], null, [62, 72, 43]],
  rent: [[37, 34, 19], [35, 65, 43], [67, 62, 80]],
  resale: [[39, 66, 20], null, [62, 69, 80]],
  independent: [[25, 72, 18], [64, 30, 52], [68, 73, 82]]
};

const exactPlanPoints = {
  "self-family": [[34, 38, 18], [50, 41, 50], [68, 39, 82]],
  "self-no-children": [[40, 34, 18], [59, 37, 50], [65, 69, 82]],
  upgrade: [[32, 41, 18], [35, 61, 50], [65, 58, 82]],
  parents: [[38, 55, 18], [61, 38, 50], [57, 60, 82]],
  "child-home": [[39, 69, 18], [65, 59, 50], [55, 74, 82]],
  rent: [[43, 48, 18], [45, 70, 50], [57, 70, 82]],
  resale: [[41, 67, 18], [50, 47, 50], [61, 69, 82]],
  independent: [[40, 61, 18], [62, 36, 50], [62, 65, 82]]
};

for (const [key, lot] of Object.entries(livingLayouts)) {
  audienceArt[`exact-${lot.id}`] = {
    file: `living/plans/${lot.id}.svg`, label: "Пример планировки из каталога",
    alt: `План квартиры. ${lot.type}, ${lot.area} м²`
  };
  audienceArt[`life-${key}`] = {
    file: `living/${key}.webp`, label: "Возможный сценарий жизни на примере плана"
  };
}

function matchLivingExample(lot, preferred) {
  const entries = Object.entries(livingLayouts);
  const exact = entries.find(([, plan]) => plan.id === lot.id);
  if (exact) return { key: exact[0], plan: exact[1], approximate: false };
  const candidates = entries.filter(([, plan]) => plan.rooms === lot.rooms);
  const match = candidates.find(([key]) => key === preferred)
    || candidates.sort(([, a], [, b]) => Math.abs(a.area - lot.area) - Math.abs(b.area - lot.area))[0];
  return match && { key: match[0], plan: match[1], approximate: true };
}

function initLayoutLibrary(options, preferred, openLife) {
  const details = byId("layout-library");
  const select = byId("layout-library-plan");
  const image = byId("layout-library-image");
  const source = byId("layout-library-source");
  const button = byId("layout-library-life");
  const note = byId("layout-library-life-note");
  const selected = () => ecoLayouts.find(({ id }) => id === Number(select.value));
  details.querySelector("summary").textContent = `Планировки и сценарии жизни · ${ecoLayouts.length} схем`;
  select.replaceChildren();
  for (const [index, name] of [...ecoLayoutTypes, "Комнатность требует сверки"].entries()) {
    const group = document.createElement("optgroup");
    group.label = name;
    for (const lot of ecoLayouts.filter(({ rooms }) => (rooms ?? 4) === index)) {
      group.append(new Option(`${lot.area} м² · этаж ${lot.floor} · №${lot.id}`, lot.id));
    }
    select.append(group);
  }
  function preview() {
    if (!details.open) return;
    const lot = selected();
    if (!lot) return;
    image.src = `media/living/plans/${lot.id}.svg`;
    image.alt = `План квартиры площадью ${lot.area} м²`;
    source.href = lot.url;
    const match = matchLivingExample(lot, preferred());
    button.disabled = !match;
    button.textContent = match?.approximate ? "Показать похожий сценарий" : "Показать сценарий жизни";
    note.textContent = !match ? "Сначала сверим комнатность в карточке."
      : match.approximate ? `Пример на другой квартире той же комнатности · ${match.plan.area} м².`
      : "Сценарий обустройства для выбранной планировки.";
  }
  button.addEventListener("click", () => {
    const lot = selected();
    const match = lot && matchLivingExample(lot, preferred());
    if (match) openLife({ ...match, lot });
  }, options);
  details.addEventListener("toggle", preview, options);
  select.addEventListener("change", preview, options);
  return {
    show(visible, lot, restore) {
      details.hidden = !visible;
      if (!visible) details.open = false;
      if (restore) {
        select.value = String(restore);
        details.open = true;
      } else if (!details.open) {
        select.selectedIndex = 0;
        if (lot) select.value = String(lot.id);
      }
      preview();
    }
  };
}

function isLivingScene(id) {
  return id === "U09" || id === "U10";
}

function profileForPurpose(purpose, children, future) {
  if (purpose === "self") {
    return { yes: "self-family", no: "self-no-children" }[children] || "";
  }
  if (purpose === "relative") return "parents";
  if (purpose === "investment") return { rent: "rent", sale: "resale" }[future] || "";
  return Object.hasOwn(livingProfiles, purpose) ? purpose : "";
}

function livingFrame(id, key, approximate) {
  const profile = livingProfiles[key];
  const lot = livingLayouts[profile.layout];
  if (id === "U09") {
    return {
      title: profile.planTitle, artwork: `exact-${lot.id}`, captions: profile.planLabels,
      points: exactPlanPoints[key],
      source: lot.url, context: `${lot.type} · ${lot.area} м². На примере посмотрим, как помещается то, что вам важно.`
    };
  }
  return {
    title: profile.lifeTitle, artwork: `life-${key}`, captions: profile.lifeLabels,
    points: livingArtworkPoints[key],
    artLabel: approximate ? "Пример на другой квартире той же комнатности" : undefined,
    context: profile.life
  };
}

function livingCue(id, profile) {
  const lot = livingLayouts[profile.layout];
  return id === "U09" ? {
    title: `${lot.type} · ${lot.area} м²`, seconds: 30,
    cue: "«Вот план из каталога. Давайте примерим к нему ваше главное условие».",
    action: profile.fit,
    proof: "Это пример для разговора о планировке. Конкретное предложение выбираем в каталоге по запросу.",
    outcome: "Понятно, какой формат проверять первым и почему."
  } : {
    title: "Покажите один момент будущей жизни", seconds: 25,
    cue: `«${profile.life}»`,
    action: "Спросите, что в этой сцене близко клиенту. Зафиксируйте одну деталь для подбора.",
    proof: "Интерьер показывает вариант обустройства. Комплектацию сверяйте по карточке квартиры.",
    outcome: "Клиент может назвать, что хочет сохранить в подборе."
  };
}
