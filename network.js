import { initializeApp } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js";
import { connectAuthEmulator, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js";
import { connectDatabaseEmulator, getDatabase, get, onValue, ref, remove, serverTimestamp, set } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-database.js";

const app = initializeApp(window.presenterConfig);
const database = getDatabase(app);
const emulators = ["localhost", "127.0.0.1"].includes(location.hostname) ? window.presenterEmulators : null;
if (emulators) connectDatabaseEmulator(database, location.hostname, emulators.database);
const showRef = (id) => ref(database, `shows/${id}`);

export function startNetworkClient(session) {
  watchClient((receive) => {
    onValue(ref(database, `shows/${session}/state`), (snapshot) => receive(snapshot.val()), () => receive(null));
  });
}

function statePublisher(target, onFailure) {
  let next;
  let timer;
  let writing = false;
  let closed = false;

  function schedule() {
    if (closed || writing || timer || !next) return;
    timer = setTimeout(async () => {
      timer = undefined;
      const state = next;
      next = undefined;
      writing = true;
      try {
        await set(target, state);
      } catch {
        if (!closed) onFailure();
      } finally {
        writing = false;
        schedule();
      }
    }, 90);
  }

  return {
    send(state) {
      next = state;
      schedule();
    },
    close() {
      closed = true;
      clearTimeout(timer);
      next = undefined;
    }
  };
}

export function startNetworkManager(startPresentation) {
  const auth = getAuth(app);
  if (emulators) connectAuthEmulator(auth, `http://${location.hostname}:${emulators.auth}`, { disableWarnings: true });
  const login = byId("login");
  const submit = byId("sign-in");
  const loginStatus = byId("login-status");
  const status = byId("status");
  const exit = byId("sign-out");
  let active;
  let generation = 0;
  let connected = false;

  function reportConnection() {
    status.textContent = connected ? "Показ активен · можно открыть ссылку" : "Нет связи · ждём подключения";
  }

  onValue(ref(database, ".info/connected"), (snapshot) => {
    connected = snapshot.val() === true;
    if (active) reportConnection();
  });

  byId("login-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    submit.disabled = true;
    loginStatus.textContent = "Проверяем вход…";
    try {
      await signInWithEmailAndPassword(auth, byId("email").value.trim(), byId("password").value);
      byId("password").value = "";
    } catch {
      loginStatus.textContent = "Войти не удалось. Проверьте данные или обратитесь к администратору.";
      submit.disabled = false;
    }
  });

  onAuthStateChanged(auth, async (user) => {
    const check = ++generation;
    if (active) {
      active.publisher.close();
      active.presentation.close();
      active = undefined;
    }
    login.hidden = false;
    byId("login-fields").disabled = Boolean(user);
    submit.disabled = Boolean(user);
    if (!user) {
      if (!loginStatus.dataset.error) loginStatus.textContent = "Войдите с выданной учётной записью.";
      return;
    }

    delete loginStatus.dataset.error;
    loginStatus.textContent = "Открываем показ…";
    try {
      const access = await get(ref(database, `operators/${user.uid}`));
      if (check !== generation) return;
      if (access.val() !== true) throw Error("Operator is not allowed");

      const session = crypto.randomUUID();
      const target = showRef(session);
      await set(target, {
        ownerUid: user.uid,
        createdAt: serverTimestamp(),
        state: { scene: "U01", position: { block: "intro", offset: 0 } }
      });
      if (check !== generation) return;
      const publisher = statePublisher(ref(database, `shows/${session}/state`), () => {
        status.textContent = "Изменения не передаются. Завершите показ и войдите снова.";
      });
      const presentation = startPresentation(session, publisher.send);
      active = { target, publisher, presentation };
      login.hidden = true;
      exit.hidden = false;
      exit.disabled = false;
      reportConnection();
    } catch {
      if (check !== generation) return;
      loginStatus.dataset.error = "true";
      loginStatus.textContent = "Показ не открылся. Проверьте подключение и доступ команды.";
      await signOut(auth);
    }
  });

  exit.addEventListener("click", async () => {
    if (!active) return;
    if (!connected) {
      status.textContent = "Для завершения показа восстановите подключение.";
      return;
    }
    exit.disabled = true;
    const show = active;
    try {
      await remove(show.target);
      show.publisher.close();
      await signOut(auth);
    } catch {
      status.textContent = "Завершить показ не удалось. Повторите попытку.";
      exit.disabled = false;
    }
  });
}
