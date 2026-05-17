import { state } from "./state.js";
import { normalizeChannel, setFeedback } from "./utils.js";
import { getRefs } from "./refs.js";
import { screenFiles } from "./data.js";

export async function loadScreens() {
  const root = document.getElementById("app-root");
  const chunks = await Promise.all(screenFiles.map(async (file) => {
    const res = await fetch(file);
    if (!res.ok) throw new Error(`Falha ao carregar ${file}`);
    return res.text();
  }));
  root.innerHTML = chunks.join("\n");
}

export function detectInitialChannel() {
  const mobileByUA = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  const mobileByScreen = window.matchMedia("(max-width: 900px) and (pointer: coarse)").matches;
  return normalizeChannel(mobileByUA || mobileByScreen ? "app" : "web");
}

export function goTo(route, updateTimelineFn) {
  const refs = getRefs();
  state.route = route;

  refs.screens.forEach((screen) => {
    screen.classList.toggle("is-active", screen.dataset.screen === route);
  });

  refs.navButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.route === route);
  });

  if (route === "status" && !state.orderInProgress) {
    updateTimelineFn(0);
    setFeedback(refs.feedbackStatus, "Sem pedidos em andamento.", "#6c6458");
  }

  refs.mainNav.classList.remove("is-open");
}
