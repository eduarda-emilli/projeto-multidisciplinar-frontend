import { state } from "./state.js";
import { cacheRefs, getRefs } from "./refs.js";
import { loadScreens, detectInitialChannel, goTo as baseGoTo } from "./navigation.js";
import { applyChannelExperience, updateSimulationAccess } from "./channel.js";
import { renderMenu, renderCart, renderLoyalty, updateTimeline } from "./cart.js";
import { registerUser, loginUser } from "./auth.js";
import { processPayment } from "./payment.js";
import { bindEvents } from "./events.js";

function goTo(route) {
  baseGoTo(route, updateTimeline);
}

async function init() {
  await loadScreens();
  cacheRefs();

  const refs = getRefs();
  state.channel = detectInitialChannel();
  refs.unitSelect.value = state.unit;

  if (refs.loginChannel) refs.loginChannel.value = state.channel;
  if (refs.footerYear) refs.footerYear.textContent = String(new Date().getFullYear());

  updateSimulationAccess();
  applyChannelExperience();
  renderMenu();
  renderCart();
  renderLoyalty();

  bindEvents({ goTo, registerUser, loginUser, processPayment });
  goTo("home");
}

init();
