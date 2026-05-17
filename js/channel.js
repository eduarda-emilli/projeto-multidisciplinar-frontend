import { state } from "./state.js";
import { channelConfig } from "./data.js";
import { channelLabel, normalizeChannel } from "./utils.js";
import { getRefs } from "./refs.js";

export function isAdminUser() {
  return Boolean(state.user && state.user.role === "admin");
}

export function updateSimulationAccess() {
  const refs = getRefs();
  const canSimulate = isAdminUser();

  if (refs.simToggleGroup) refs.simToggleGroup.hidden = !canSimulate;
  if (!canSimulate && refs.modoSimulacao) refs.modoSimulacao.checked = false;
  if (refs.gatewaySimGroup) refs.gatewaySimGroup.hidden = !canSimulate || !refs.modoSimulacao?.checked;
  if (!canSimulate && refs.pagamentoGateway) refs.pagamentoGateway.value = "approved";
}

export function applyChannelExperience() {
  const refs = getRefs();
  state.channel = normalizeChannel(state.channel);
  const config = channelConfig[state.channel] || channelConfig.web;

  document.body.dataset.channel = state.channel;
  refs.activeChannel.textContent = channelLabel(state.channel);
  refs.channelPill.textContent = `Modo ${channelLabel(state.channel)}`;

  refs.channelNoteCardapio.textContent = config.cardapio;
  refs.channelNoteCarrinho.textContent = config.carrinho;
  refs.channelNotePagamento.textContent = config.pagamento;
  refs.couponSelect.disabled = config.disableCoupon;

  if (config.disableCoupon) {
    refs.couponSelect.value = "none";
    state.selectedCoupon = "none";
  }
}
