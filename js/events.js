import { state } from "./state.js";
import { getRefs } from "./refs.js";
import { addToCart, changeQty, handleUnitChange, renderCart } from "./cart.js";
import { isAdminUser } from "./channel.js";

export function bindEvents({ goTo, registerUser, loginUser, processPayment }) {
  const refs = getRefs();

  refs.menuToggle.addEventListener("click", () => refs.mainNav.classList.toggle("is-open"));
  refs.navButtons.forEach((button) => button.addEventListener("click", () => goTo(button.dataset.route)));

  refs.formCadastro.addEventListener("submit", (event) => registerUser(event, goTo));
  refs.formLogin.addEventListener("submit", (event) => loginUser(event, goTo));
  refs.formPagamento.addEventListener("submit", (event) => processPayment(event, goTo));
  refs.unitSelect.addEventListener("change", handleUnitChange);

  refs.menuGrid.addEventListener("click", (event) => {
    const add = event.target.closest("[data-add]");
    if (add) addToCart(add.dataset.add);
  });

  refs.cartList.addEventListener("click", (event) => {
    const plus = event.target.closest("[data-plus]");
    const minus = event.target.closest("[data-minus]");
    if (plus) return changeQty(plus.dataset.plus, 1);
    if (minus) changeQty(minus.dataset.minus, -1);
  });

  refs.usarFidelidade.addEventListener("change", renderCart);
  refs.couponSelect.addEventListener("change", (event) => {
    state.selectedCoupon = event.target.value;
    renderCart();
  });

  if (refs.modoSimulacao) {
    refs.modoSimulacao.addEventListener("change", () => {
      if (refs.gatewaySimGroup) refs.gatewaySimGroup.hidden = !isAdminUser() || !refs.modoSimulacao.checked;
      if (!refs.modoSimulacao.checked && refs.pagamentoGateway) refs.pagamentoGateway.value = "approved";
    });
  }
}
