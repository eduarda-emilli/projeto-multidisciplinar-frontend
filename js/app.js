// Estrutura separada e organizada por pastas
const state = {
  route: "home",
  users: [],
  user: null,
  channel: "web",
  unit: "centro",
  consent: {
    required: false,
    marketing: false
  },
  cart: [],
  selectedCoupon: "none",
  points: 20,
  paymentDone: false,
  lastAddedId: null,
  orderInProgress: false
};

const menuByUnit = {
  centro: [
    {
      id: "c1",
      name: "Baião de dois",
      description: "Baião de dois com carne de sol e queijo coalho.",
      price: 31.9
    },
    {
      id: "c2",
      name: "Acarajé e Vatapá",
      description: "Bolinho de massa de feijão-fradinho frito no azeite.",
      price: 14.9
    },
    {
      id: "c3",
      name: "Escondidinho de Carne de Sol",
      description: "Uma camada de purê de macaxeira cobrindo um recheio generoso de carne-seca desfiada.",
      price: 6.5
    }
  ],
  shopping: [
    {
      id: "s1",
      name: "Tapioca Recheada",
      description: "Tipico lanche nordestino feito com goma de mandioca. Recheios de sua preferencia: opções salgadas ou doces",
      price: 28
    },
    {
      id: "s2",
      name: "Cuscuz com Queijo",
      description: "Delicioso cuscuz recheado com queijo e um toque especial de manteiga da terra e carne de sol.",
      price: 24.5
    },
    {
      id: "s3",
      name: "Brownie Quente",
      description: "Brownie com calda de chocolate.",
      price: 12.5
    }
  ],
  bairro: [
    {
      id: "b1",
      name: "Cuscuz Recheado",
      description: "Cuscuz com carne de sol desfiada e queijo coalho.",
      price: 19.9
    },
    {
      id: "b2",
      name: "Tapioca de Frango",
      description: "Tapioca na manteiga com frango e catupiry.",
      price: 17.9
    },
    {
      id: "b3",
      name: "Suco de Cajá",
      description: "Suco natural de cajá gelado.",
      price: 8.9
    }
  ]
};

let refs = {};

function cacheRefs() {
  refs = {
    screens: document.querySelectorAll(".screen"),
    navButtons: document.querySelectorAll("[data-route]"),
    mainNav: document.getElementById("main-nav"),
    menuToggle: document.getElementById("menu-toggle"),
    formCadastro: document.getElementById("form-cadastro"),
    formLogin: document.getElementById("form-login"),
    loginChannel: document.getElementById("login-canal"),
    formPagamento: document.getElementById("form-pagamento"),
    channelPill: document.getElementById("channel-pill"),
    footerYear: document.getElementById("footer-year"),
    unitSelect: document.getElementById("unit-select"),
    activeChannel: document.getElementById("active-channel"),
    channelNoteCardapio: document.getElementById("channel-note-cardapio"),
    channelNoteCarrinho: document.getElementById("channel-note-carrinho"),
    channelNotePagamento: document.getElementById("channel-note-pagamento"),
    feedbackCadastro: document.getElementById("feedback-cadastro"),
    feedbackLogin: document.getElementById("feedback-login"),
    feedbackPagamento: document.getElementById("feedback-pagamento"),
    feedbackStatus: document.getElementById("feedback-status"),
    menuGrid: document.getElementById("menu-grid"),
    cartList: document.getElementById("cart-list"),
    subtotal: document.getElementById("subtotal"),
    descontoCupom: document.getElementById("desconto-cupom"),
    desconto: document.getElementById("desconto"),
    total: document.getElementById("total"),
    couponSelect: document.getElementById("coupon-select"),
    quickItems: document.getElementById("quick-items"),
    quickTotal: document.getElementById("quick-total"),
    quickPayBtn: document.getElementById("quick-pay-btn"),
    pontos: document.getElementById("pontos"),
    fidelidadeInfo: document.getElementById("fidelidade-info"),
    usarFidelidade: document.getElementById("usar-fidelidade"),
    timeline: document.getElementById("timeline")
  };
  refs.cartNavButton = document.querySelector(".main-nav .nav-btn[data-route='carrinho']");
}

const coupons = {
  none: { type: "none", label: "Sem cupom" },
  bemvindo10: { type: "percent", value: 0.1, label: "BEMVINDO10" },
  nordeste15: { type: "percent", value: 0.15, minSubtotal: 60, label: "NORDESTE15" },
  menos5: { type: "fixed", value: 5, label: "MENOS5" }
};

function toBRL(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function setFeedback(target, text, tone = "") {
  target.textContent = text;
  target.style.color = tone;
}

function channelLabel(channel) {
  const labels = {
    totem: "Totem",
    web: "Web",
    app: "App"
  };
  return labels[channel] || "Web";
}

function normalizeChannel(channel) {
  const value = String(channel || "").toLowerCase();
  if (value === "web" || value === "app" || value === "totem") {
    return value;
  }
  return "web";
}

function applyChannelExperience() {
  state.channel = normalizeChannel(state.channel);
  document.body.dataset.channel = state.channel;
  refs.activeChannel.textContent = channelLabel(state.channel);
  refs.channelPill.textContent = `Modo ${channelLabel(state.channel)}`;

  if (state.channel === "totem") {
    refs.channelNoteCardapio.textContent = "Totem: fluxo rápido com foco em pedido presencial.";
    refs.channelNoteCarrinho.textContent = "Totem: cupons e fidelidade ficam indisponíveis neste canal.";
    refs.channelNotePagamento.textContent = "Totem: finalize no balcão, Pix ou cartão para agilizar a fila.";
    refs.couponSelect.value = "none";
    state.selectedCoupon = "none";
    refs.couponSelect.disabled = true;
  } else if (state.channel === "app") {
    refs.channelNoteCardapio.textContent = "App: resumo fixo no topo para checkout mais rápido no celular.";
    refs.channelNoteCarrinho.textContent = "App: cupons e fidelidade disponíveis no próprio carrinho.";
    refs.channelNotePagamento.textContent = "App: pagamento digital com confirmação imediata no status.";
    refs.couponSelect.disabled = false;
  } else {
    refs.channelNoteCardapio.textContent = "Web: experiência completa com todos os recursos liberados.";
    refs.channelNoteCarrinho.textContent = "Web: aplique cupons e combine com fidelidade.";
    refs.channelNotePagamento.textContent = "Web: conclua seu pedido com validação completa de dados.";
    refs.couponSelect.disabled = false;
  }
}

function detectInitialChannel() {
  const mobileByUA = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  const mobileByScreen = window.matchMedia("(max-width: 900px) and (pointer: coarse)").matches;
  return normalizeChannel(mobileByUA || mobileByScreen ? "app" : "web");
}

async function loadScreens() {
  const root = document.getElementById("app-root");
  const files = [
    "screens/home.html",
    "screens/login-cadastro.html",
    "screens/cardapio.html",
    "screens/carrinho.html",
    "screens/pagamento.html",
    "screens/status.html",
    "screens/fidelidade.html"
  ];
  const chunks = await Promise.all(
    files.map(async (file) => {
      const res = await fetch(file);
      if (!res.ok) {
        throw new Error(`Falha ao carregar ${file}`);
      }
      return res.text();
    })
  );
  root.innerHTML = chunks.join("\n");
}

function goTo(route) {
  state.route = route;

  refs.screens.forEach((screen) => {
    screen.classList.toggle("is-active", screen.dataset.screen === route);
  });

  refs.navButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.route === route);
  });

  if (route === "status" && !state.orderInProgress) {
    updateTimeline(0);
    setFeedback(refs.feedbackStatus, "Sem pedidos em andamento.", "#6c6458");
  }

  refs.mainNav.classList.remove("is-open");
}

function renderMenu() {
  refs.menuGrid.innerHTML = "";
  const unitMenu = menuByUnit[state.unit] || [];

  unitMenu.forEach((item) => {
    const card = document.createElement("article");
    card.className = "menu-item";
    card.innerHTML = `
      <div class="menu-top">
        <strong>${item.name}</strong>
        <strong>${toBRL(item.price)}</strong>
      </div>
      <p>${item.description}</p>
      <button class="btn btn--soft" type="button" data-add="${item.id}">Adicionar</button>
    `;
    refs.menuGrid.appendChild(card);
  });
}

function getCartItem(id) {
  return state.cart.find((item) => item.id === id);
}

function addToCart(id) {
  const unitMenu = menuByUnit[state.unit] || [];
  const product = unitMenu.find((item) => item.id === id);
  if (!product) {
    return;
  }

  const inCart = getCartItem(id);
  if (inCart) {
    inCart.qty += 1;
  } else {
    state.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      qty: 1,
      unit: state.unit
    });
  }

  state.lastAddedId = id;
  renderCart();
  animateAddToCart(id);
  setFeedback(refs.feedbackStatus, "Item adicionado ao carrinho.", "#13786d");
}

function animateAddToCart(id) {
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

function changeQty(id, delta) {
  const target = getCartItem(id);
  if (!target) {
    return;
  }

  target.qty += delta;
  if (target.qty <= 0) {
    state.cart = state.cart.filter((item) => item.id !== id);
  }

  renderCart();
}

function calcTotals() {
  const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const coupon = state.channel === "totem" ? coupons.none : (coupons[state.selectedCoupon] || coupons.none);
  let couponDiscount = 0;

  if (coupon.type === "percent") {
    const isEligible = coupon.minSubtotal ? subtotal >= coupon.minSubtotal : true;
    if (isEligible) {
      couponDiscount = subtotal * coupon.value;
    }
  }

  if (coupon.type === "fixed") {
    couponDiscount = Math.min(coupon.value, subtotal);
  }

  const subtotalAfterCoupon = Math.max(0, subtotal - couponDiscount);
  const canUseReward = state.channel !== "totem" && state.points >= 100;
  const useReward = canUseReward && refs.usarFidelidade.checked;
  const loyaltyDiscount = useReward ? Math.min(12, subtotalAfterCoupon) : 0;
  const total = Math.max(0, subtotalAfterCoupon - loyaltyDiscount);

  return { subtotal, couponDiscount, loyaltyDiscount, total, useReward };
}

function renderCart() {
  refs.cartList.innerHTML = "";

  if (state.cart.length === 0) {
    refs.cartList.innerHTML = '<p class="muted">Seu carrinho está vazio.</p>';
  } else {
    state.cart.forEach((item) => {
      const card = document.createElement("div");
      card.className = "cart-item";
      if (state.lastAddedId === item.id) {
        card.classList.add("is-entering");
      }
      card.innerHTML = `
        <div class="cart-row">
          <strong>${item.name}</strong>
          <strong>${toBRL(item.price * item.qty)}</strong>
        </div>
        <div class="cart-row">
          <span>Qtd: ${item.qty}</span>
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

function renderLoyalty() {
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

function registerUser(event) {
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

  state.users.push({ nome, email, senha });
  setFeedback(refs.feedbackCadastro, "Cadastro realizado com sucesso.", "#13786d");
  event.currentTarget.reset();
  goTo("login");
}

function loginUser(event) {
  event.preventDefault();

  const data = new FormData(event.currentTarget);
  const channel = normalizeChannel(data.get("canal"));
  const email = String(data.get("email") || "").trim().toLowerCase();
  const senha = String(data.get("senha") || "");
  const lgpdRequired = document.getElementById("lgpd-obrigatorio").checked;
  const lgpdMarketing = document.getElementById("lgpd-marketing").checked;

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
  renderLoyalty();
  setFeedback(refs.feedbackLogin, `Bem-vindo, ${account.nome}.`, "#13786d");
  goTo("cardapio");
}

function updateTimeline(step) {
  const lines = refs.timeline.querySelectorAll("li");
  lines.forEach((li, index) => {
    li.classList.toggle("is-done", index <= step);
  });
}

function processPayment(event) {
  event.preventDefault();

  if (!state.user) {
    setFeedback(refs.feedbackPagamento, "Faça login antes de pagar.", "#b42318");
    return;
  }

  if (state.cart.length === 0) {
    setFeedback(refs.feedbackPagamento, "Seu carrinho está vazio.", "#9a6700");
    return;
  }

  const summary = calcTotals();
  state.paymentDone = true;
  state.orderInProgress = true;

  setFeedback(refs.feedbackPagamento, `Pagamento aprovado. Total: ${toBRL(summary.total)}.`, "#13786d");

  updateTimeline(1);
  setTimeout(() => {
    updateTimeline(2);
    setFeedback(refs.feedbackStatus, "Pedido em preparo na cozinha.", "#9a6700");
  }, 1000);

  setTimeout(() => {
    updateTimeline(3);
    setFeedback(refs.feedbackStatus, "Pedido pronto para retirada/entrega.", "#13786d");
    state.orderInProgress = false;
  }, 2200);

  const earned = Math.floor(summary.total / 4);
  state.points += earned;
  if (summary.useReward) {
    state.points = Math.max(0, state.points - 100);
  }

  state.cart = [];
  renderLoyalty();
  goTo("status");
}

function handleUnitChange(event) {
  state.unit = event.target.value;
  state.cart = [];
  state.lastAddedId = null;
  renderMenu();
  renderCart();
  setFeedback(refs.feedbackStatus, "Unidade alterada. Carrinho reiniciado.", "#9a6700");
}

function bindEvents() {
  refs.menuToggle.addEventListener("click", () => {
    refs.mainNav.classList.toggle("is-open");
  });

  refs.navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      goTo(button.dataset.route);
    });
  });

  refs.formCadastro.addEventListener("submit", registerUser);
  refs.formLogin.addEventListener("submit", loginUser);
  refs.formPagamento.addEventListener("submit", processPayment);
  refs.unitSelect.addEventListener("change", handleUnitChange);

  refs.menuGrid.addEventListener("click", (event) => {
    const add = event.target.closest("[data-add]");
    if (add) {
      addToCart(add.dataset.add);
    }
  });

  refs.cartList.addEventListener("click", (event) => {
    const plus = event.target.closest("[data-plus]");
    const minus = event.target.closest("[data-minus]");

    if (plus) {
      changeQty(plus.dataset.plus, 1);
      return;
    }

    if (minus) {
      changeQty(minus.dataset.minus, -1);
    }
  });

  refs.usarFidelidade.addEventListener("change", renderCart);
  refs.couponSelect.addEventListener("change", (event) => {
    state.selectedCoupon = event.target.value;
    renderCart();
  });
}

async function init() {
  await loadScreens();
  cacheRefs();
  state.channel = detectInitialChannel();
  refs.unitSelect.value = state.unit;
  if (refs.loginChannel) {
    refs.loginChannel.value = state.channel;
  }
  if (refs.footerYear) {
    refs.footerYear.textContent = String(new Date().getFullYear());
  }
  applyChannelExperience();
  renderMenu();
  renderCart();
  renderLoyalty();
  bindEvents();
  goTo("home");
}

init();

