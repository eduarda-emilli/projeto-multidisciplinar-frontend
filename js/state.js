export const state = {
  route: "home",
  users: [
    { nome: "Administrador", email: "admin@raizes.com", senha: "admin1234", role: "admin" }
  ],
  user: null,
  channel: "web",
  unit: "centro",
  consent: { required: false, marketing: false },
  cart: [],
  selectedCoupon: "none",
  points: 20,
  paymentDone: false,
  lastAddedId: null,
  orderInProgress: false
};
