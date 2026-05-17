import { $ } from "./utils.js";

let refs = {};

export function cacheRefs() {
  refs = {
    screens: document.querySelectorAll(".screen"),
    navButtons: document.querySelectorAll("[data-route]"),
    mainNav: $("main-nav"),
    menuToggle: $("menu-toggle"),
    formCadastro: $("form-cadastro"),
    formLogin: $("form-login"),
    loginChannel: $("login-canal"),
    formPagamento: $("form-pagamento"),
    channelPill: $("channel-pill"),
    footerYear: $("footer-year"),
    unitSelect: $("unit-select"),
    activeChannel: $("active-channel"),
    channelNoteCardapio: $("channel-note-cardapio"),
    channelNoteCarrinho: $("channel-note-carrinho"),
    channelNotePagamento: $("channel-note-pagamento"),
    feedbackCadastro: $("feedback-cadastro"),
    feedbackLogin: $("feedback-login"),
    feedbackPagamento: $("feedback-pagamento"),
    simToggleGroup: $("sim-toggle-group"),
    modoSimulacao: $("modo-simulacao"),
    gatewaySimGroup: $("gateway-sim-group"),
    pagamentoGateway: $("pagamento-gateway"),
    feedbackStatus: $("feedback-status"),
    menuGrid: $("menu-grid"),
    cartList: $("cart-list"),
    subtotal: $("subtotal"),
    descontoCupom: $("desconto-cupom"),
    desconto: $("desconto"),
    total: $("total"),
    couponSelect: $("coupon-select"),
    quickItems: $("quick-items"),
    quickTotal: $("quick-total"),
    quickPayBtn: $("quick-pay-btn"),
    pontos: $("pontos"),
    fidelidadeInfo: $("fidelidade-info"),
    usarFidelidade: $("usar-fidelidade"),
    timeline: $("timeline")
  };
  refs.cartNavButton = document.querySelector(".main-nav .nav-btn[data-route='carrinho']");
}

export function getRefs() {
  return refs;
}
