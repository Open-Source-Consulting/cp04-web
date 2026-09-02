const formatadorBRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatarPreco(valor) {
  const numero = Number(valor);
  if (!Number.isFinite(numero)) return formatadorBRL.format(0);
  return formatadorBRL.format(numero);
}

export function pluralizar(quantidade, singular, plural) {
  return quantidade === 1 ? singular : plural;
}

export function gerarCodigoPedido() {
  const aleatorio = Math.floor(Math.random() * 9000) + 1000;
  const ano = new Date().getFullYear();
  return `ECO-${ano}-${aleatorio}`;
}
