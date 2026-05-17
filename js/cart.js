import { state } from "./state.js";
import { menuByUnit, coupons } from "./data.js";
import { toBRL, setFeedback } from "./utils.js";
import { getRefs } from "./refs.js";

export function updateTimeline(step) {
  const refs = getRefs();
  const lines = refs.timeline.querySelectorAll("li");
  lines.forEach((li, index) => li.classList.toggle("is-done", index <= step));
}

export function getCartItem(id) {
  return state.cart.find((item) => item.id === id);
}

export function renderMenu() {
  const refs = getRefs();
  refs.menuGrid.innerHTML = "";
  const unitMenu = menuByUnit[state.unit] || [];

  unitMenu.forEach((item) => {
    const card = document.createElement("article");
    card.className = "menu-item";
    card.innerHTML = `
      <div class="menu-top"><strong>${item.name}</strong><strong>${toBRL(item.price)}</strong></div>
      <p>${item.description}</p>
      <button class="btn btn--soft" type="button" data-add="${item.id}">Adicionar</button>
    `;
    refs.menuGrid.appendChild(card);
  });
}

function animateAddToCart(id) {
  const refs = getRefs();
  const addButton = refs.menuGrid.querySelector(`[data-add="${id}"]`);
  if (addButton) {
    const originalText = addButton.textContent;
    addButton.classList.add("is-added");
    addButton.textContent = "Adicionado ✓";
    setTimeout(() => {
      addButton.classList.remove("is-added");
      addButton.textContent = originalText;
    }, 750);
  }

  if (refs.cartNavButton) {
    refs.cartNavButton.classList.remove("is-highlight");
    void refs.cartNavButton.offsetWidth;
    refs.cartNavButton.classList.add("is-highlight");
  }
}

export function addToCart(id) {
  const refs = getRefs();
  const unitMenu = menuByUnit[state.unit] || [];
  const product = unitMenu.find((item) => item.id === id);
  if (!product) return;

  const inCart = getCartItem(id);
  if (inCart) inCart.qty += 1;
  else state.cart.push({ id: product.id, name: product.name, price: product.price, qty: 1, unit: state.unit });

  state.lastAddedId = id;
  renderCart();
  animateAddToCart(id);
  setFeedback(refs.feedbackStatus, "Item adicionado ao carrinho.", "#13786d");
}

export function changeQty(id, delta) {
  const target = getCartItem(id);
  if (!target) return;

  target.qty += delta;
  if (target.qty <= 0) state.cart = state.cart.filter((item) => item.id !== id);
  renderCart();
}

export function calcTotals() {
  const refs = getRefs();
  const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const coupon = state.channel === "totem" ? coupons.none : (coupons[state.selectedCoupon] || coupons.none);

  let couponDiscount = 0;
  if (coupon.type === "percent") {
    const isEligible = coupon.minSubtotal ? subtotal >= coupon.minSubtotal : true;
    if (isEligible) couponDiscount = subtotal * coupon.value;
  }
  if (coupon.type === "fixed") couponDiscount = Math.min(coupon.value, subtotal);

  const subtotalAfterCoupon = Math.max(0, subtotal - couponDiscount);
  const canUseReward = state.channel !== "totem" && state.points >= 100;
  const useReward = canUseReward && refs.usarFidelidade.checked;
  const loyaltyDiscount = useReward ? Math.min(12, subtotalAfterCoupon) : 0;
  const total = Math.max(0, subtotalAfterCoupon - loyaltyDiscount);

  return { subtotal, couponDiscount, loyaltyDiscount, total, useReward };
}

export function renderCart() {
  const refs = getRefs();
  refs.cartList.innerHTML = "";

  if (state.cart.length === 0) {
    refs.cartList.innerHTML = '<p class="muted">Seu carrinho está vazio.</p>';
  } else {
    state.cart.forEach((item) => {
      const card = document.createElement("div");
      card.className = "cart-item";
      if (state.lastAddedId === item.id) card.classList.add("is-entering");
      card.innerHTML = `
        <div class="cart-row"><strong>${item.name}</strong><strong>${toBRL(item.price * item.qty)}</strong></div>
        <div class="cart-row"><span>Qtd: ${item.qty}</span>
          <div class="qty-actions">
            <button class="qty-btn" type="button" data-minus="${item.id}">-</button>
            <button class="qty-btn" type="button" data-plus="${item.id}">+</button>
          </div>
        </div>
      `;
      refs.cartList.appendChild(card);
    });
  }

  const summary = calcTotals();
  refs.subtotal.textContent = toBRL(summary.subtotal);
  refs.descontoCupom.textContent = `-${toBRL(summary.couponDiscount)}`;
  refs.desconto.textContent = `-${toBRL(summary.loyaltyDiscount)}`;
  refs.total.textContent = toBRL(summary.total);
  refs.quickItems.textContent = String(state.cart.reduce((sum, item) => sum + item.qty, 0));
  refs.quickTotal.textContent = toBRL(summary.total);
  refs.quickPayBtn.disabled = state.cart.length === 0;
  state.lastAddedId = null;
}

export function renderLoyalty() {
  const refs = getRefs();
  refs.pontos.textContent = String(state.points);

  if (state.channel === "totem") {
    refs.usarFidelidade.checked = false;
    refs.usarFidelidade.disabled = true;
    refs.fidelidadeInfo.textContent = "No canal Totem, fidelidade é consultiva e o desconto não é aplicado.";
  } else if (state.points >= 100) {
    refs.usarFidelidade.disabled = false;
    refs.fidelidadeInfo.textContent = "Desconto de R$ 12,00 disponível para uso no carrinho.";
  } else {
    refs.usarFidelidade.checked = false;
    refs.usarFidelidade.disabled = true;
    refs.fidelidadeInfo.textContent = `Faltam ${100 - state.points} pontos para liberar R$ 12,00 de desconto.`;
  }

  renderCart();
}

export function handleUnitChange(event) {
  const refs = getRefs();
  state.unit = event.target.value;
  state.cart = [];
  state.lastAddedId = null;
  renderMenu();
  renderCart();
  setFeedback(refs.feedbackStatus, "Unidade alterada. Carrinho reiniciado.", "#9a6700");
}
