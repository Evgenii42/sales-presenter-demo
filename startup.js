const showRelease = new URL(document.currentScript.src).searchParams.get("v");
const startupNotice = document.getElementById("startup-notice");
const recoveryUrl = new URL(location.href);
recoveryUrl.searchParams.set("reload", String(Date.now()));
startupNotice.querySelector("a").href = recoveryUrl.href;
let startupReady = false;
let startupFailed = false;

function showStartupError() {
  startupFailed = true;
  startupNotice.querySelector("p").textContent = "Показ не загрузился. Откройте свежую страницу.";
  startupNotice.hidden = false;
  const workspace = document.getElementById("workspace");
  if (workspace) workspace.hidden = true;
}

function showStartupReady() {
  if (startupFailed) {
    showStartupError();
    return;
  }
  startupReady = true;
  startupNotice.hidden = true;
}

addEventListener("error", (event) => {
  if (!(event.target instanceof HTMLScriptElement || event instanceof ErrorEvent)) return;
  if (!startupReady) {
    showStartupError();
  } else {
    startupNotice.classList.add("runtime-notice");
    startupNotice.querySelector("p").textContent = "Возникла ошибка показа. Поля встречи доступны. Перед обновлением сохраните нужные записи.";
    startupNotice.hidden = false;
  }
}, true);
