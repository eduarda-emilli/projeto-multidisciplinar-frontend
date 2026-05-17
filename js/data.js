export const menuByUnit = {
  centro: [
    { id: "c1", name: "Baião de dois", description: "Baião de dois com carne de sol e queijo coalho.", price: 31.9 },
    { id: "c2", name: "Acarajé e Vatapá", description: "Bolinho de massa de feijão-fradinho frito no azeite.", price: 14.9 },
    { id: "c3", name: "Escondidinho de Carne de Sol", description: "Uma camada de purê de macaxeira cobrindo um recheio generoso de carne-seca desfiada.", price: 6.5 }
  ],
  shopping: [
    { id: "s1", name: "Tapioca Recheada", description: "Tipico lanche nordestino feito com goma de mandioca. Recheios de sua preferencia: opções salgadas ou doces", price: 28 },
    { id: "s2", name: "Cuscuz com Queijo", description: "Delicioso cuscuz recheado com queijo e um toque especial de manteiga da terra e carne de sol.", price: 24.5 },
    { id: "s3", name: "Brownie Quente", description: "Brownie com calda de chocolate.", price: 12.5 }
  ],
  bairro: [
    { id: "b1", name: "Cuscuz Recheado", description: "Cuscuz com carne de sol desfiada e queijo coalho.", price: 19.9 },
    { id: "b2", name: "Tapioca de Frango", description: "Tapioca na manteiga com frango e catupiry.", price: 17.9 },
    { id: "b3", name: "Suco de Cajá", description: "Suco natural de cajá gelado.", price: 8.9 }
  ]
};

export const coupons = {
  none: { type: "none", label: "Sem cupom" },
  bemvindo10: { type: "percent", value: 0.1, label: "BEMVINDO10" },
  nordeste15: { type: "percent", value: 0.15, minSubtotal: 60, label: "NORDESTE15" },
  menos5: { type: "fixed", value: 5, label: "MENOS5" }
};

export const channelConfig = {
  totem: {
    cardapio: "Totem: fluxo rápido com foco em pedido presencial.",
    carrinho: "Totem: cupons e fidelidade ficam indisponíveis neste canal.",
    pagamento: "Totem: finalize no balcão, Pix ou cartão para agilizar a fila.",
    disableCoupon: true
  },
  app: {
    cardapio: "App: resumo fixo no topo para checkout mais rápido no celular.",
    carrinho: "App: cupons e fidelidade disponíveis no próprio carrinho.",
    pagamento: "App: pagamento digital com confirmação imediata no status.",
    disableCoupon: false
  },
  web: {
    cardapio: "Web: experiência completa com todos os recursos liberados.",
    carrinho: "Web: aplique cupons e combine com fidelidade.",
    pagamento: "Web: conclua seu pedido com validação completa de dados.",
    disableCoupon: false
  }
};

export const screenFiles = [
  "screens/home.html",
  "screens/login-cadastro.html",
  "screens/cardapio.html",
  "screens/carrinho.html",
  "screens/pagamento.html",
  "screens/status.html",
  "screens/fidelidade.html"
];
