export const $ = (id) => document.getElementById(id);
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function toBRL(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function setFeedback(target, text, tone = "") {
  target.textContent = text;
  target.style.color = tone;
}

export function channelLabel(channel) {
  const labels = { totem: "Totem", web: "Web", app: "App" };
  return labels[channel] || "Web";
}

export function normalizeChannel(channel) {
  const value = String(channel || "").toLowerCase();
  return ["web", "app", "totem"].includes(value) ? value : "web";
}
