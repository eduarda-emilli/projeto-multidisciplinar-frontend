import { state } from "./state.js";
import { normalizeChannel, setFeedback, $ } from "./utils.js";
import { getRefs } from "./refs.js";
import { applyChannelExperience, updateSimulationAccess } from "./channel.js";
import { renderLoyalty } from "./cart.js";

export function registerUser(event, goTo) {
  const refs = getRefs();
  event.preventDefault();

  const data = new FormData(event.currentTarget);
  const nome = String(data.get("nome") || "").trim();
  const email = String(data.get("email") || "").trim().toLowerCase();
  const senha = String(data.get("senha") || "");

  if (!nome || !email || senha.length < 4) {
    setFeedback(refs.feedbackCadastro, "Preencha nome, e-mail e senha válida.", "#b42318");
    return;
  }

  const exists = state.users.some((item) => item.email === email);
  if (exists) {
    setFeedback(refs.feedbackCadastro, "Este e-mail já está cadastrado.", "#9a6700");
    return;
  }

  state.users.push({ nome, email, senha, role: "cliente" });
  setFeedback(refs.feedbackCadastro, "Cadastro realizado com sucesso.", "#13786d");
  event.currentTarget.reset();
  goTo("login");
}

export function loginUser(event, goTo) {
  const refs = getRefs();
  event.preventDefault();

  const data = new FormData(event.currentTarget);
  const channel = normalizeChannel(data.get("canal"));
  const email = String(data.get("email") || "").trim().toLowerCase();
  const senha = String(data.get("senha") || "");
  const lgpdRequired = $("lgpd-obrigatorio").checked;
  const lgpdMarketing = $("lgpd-marketing").checked;

  if (!lgpdRequired) {
    setFeedback(refs.feedbackLogin, "Aceite o consentimento obrigatório LGPD para continuar.", "#b42318");
    return;
  }

  const account = state.users.find((item) => item.email === email && item.senha === senha);
  if (!account) {
    setFeedback(refs.feedbackLogin, "Credenciais inválidas ou conta não cadastrada.", "#b42318");
    return;
  }

  state.user = account;
  state.channel = channel;
  state.consent.required = true;
  state.consent.marketing = lgpdMarketing;

  applyChannelExperience();
  updateSimulationAccess();
  renderLoyalty();

  const roleLabel = account.role === "admin" ? " (Admin)" : "";
  setFeedback(refs.feedbackLogin, `Bem-vindo, ${account.nome}${roleLabel}.`, "#13786d");
  goTo("cardapio");
}
