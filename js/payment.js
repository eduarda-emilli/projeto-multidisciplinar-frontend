import { state } from "./state.js";
import { delay, setFeedback, toBRL } from "./utils.js";
import { getRefs } from "./refs.js";
import { isAdminUser } from "./channel.js";
import { calcTotals, renderLoyalty, updateTimeline } from "./cart.js";

export async function processPayment(event, goTo) {
  const refs = getRefs();
  event.preventDefault();

  const form = event.currentTarget;
  const submitButton = form.querySelector('button[type="submit"]');
  const data = new FormData(form);
  const simulationEnabled = isAdminUser() && refs.modoSimulacao ? refs.modoSimulacao.checked : false;
  const gatewayStatus = simulationEnabled ? String(data.get("gatewayStatus") || "approved") : "approved";

  if (!state.user) {
    setFeedback(refs.feedbackPagamento, "Faça login antes de pagar.", "#b42318");
    return;
  }

  if (state.cart.length === 0) {
    setFeedback(refs.feedbackPagamento, "Seu carrinho está vazio.", "#9a6700");
    return;
  }

  if (gatewayStatus === "declined") {
    state.paymentDone = false;
    setFeedback(refs.feedbackPagamento, "Pagamento recusado pelo serviço externo. Revise os dados ou escolha outro método para tentar novamente.", "#b42318");
    setFeedback(refs.feedbackStatus, "Pagamento não autorizado. Aguardando nova tentativa.", "#9a6700");
    if (submitButton) submitButton.disabled = false;
    return;
  }

  const summary = calcTotals();
  const earned = Math.floor(summary.total / 10);

  if (submitButton) submitButton.disabled = true;
  setFeedback(refs.feedbackPagamento, "Processando pagamento, aguarde alguns segundos...", "#9a6700");
  await delay(2200);

  state.paymentDone = true;
  state.orderInProgress = true;

  setFeedback(refs.feedbackPagamento, `Pagamento aprovado. Total: ${toBRL(summary.total)}. Foram adicionados ${earned} pontos.`, "#13786d");

  state.points += earned;
  if (summary.useReward) state.points = Math.max(0, state.points - 100);
  state.cart = [];
  renderLoyalty();

  await delay(900);
  updateTimeline(1);
  setFeedback(refs.feedbackStatus, "Pagamento confirmado.", "#13786d");
  goTo("status");

  await delay(1000);
  updateTimeline(2);
  setFeedback(refs.feedbackStatus, "Pedido em preparo na cozinha.", "#9a6700");

  await delay(1200);
  updateTimeline(3);
  setFeedback(refs.feedbackStatus, "Pedido pronto para retirada/entrega.", "#13786d");
  state.orderInProgress = false;
  if (submitButton) submitButton.disabled = false;
}
