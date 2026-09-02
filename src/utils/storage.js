export const CHAVE_CARRINHO = "ecotrend:carrinho";

function storageDisponivel() {
  try {
    const teste = "__ecotrend_teste__";
    window.localStorage.setItem(teste, "1");
    window.localStorage.removeItem(teste);
    return true;
  } catch {
    return false;
  }
}

function itemValido(item) {
  return (
    item !== null &&
    typeof item === "object" &&
    (typeof item.id === "number" || typeof item.id === "string") &&
    typeof item.nome === "string" &&
    Number.isFinite(Number(item.preco)) &&
    Number.isInteger(Number(item.quantidade)) &&
    Number(item.quantidade) > 0
  );
}

export function carregarCarrinho() {
  if (!storageDisponivel()) return [];

  try {
    const bruto = window.localStorage.getItem(CHAVE_CARRINHO);

    if (bruto === null) return [];

    const dados = JSON.parse(bruto);

    if (!Array.isArray(dados)) {
      console.warn("[EcoTrend] Carrinho salvo em formato inválido. Recomeçando vazio.");
      window.localStorage.removeItem(CHAVE_CARRINHO);
      return [];
    }

    const itensLimpos = dados.filter(itemValido).map((item) => ({
      ...item,
      preco: Number(item.preco),
      quantidade: Number(item.quantidade),
    }));

    if (itensLimpos.length !== dados.length) {
      console.warn("[EcoTrend] Itens inválidos foram descartados do carrinho salvo.");
    }

    return itensLimpos;
  } catch (erro) {

    console.warn("[EcoTrend] Não foi possível ler o carrinho salvo:", erro.message);
    try {
      window.localStorage.removeItem(CHAVE_CARRINHO);
    } catch {

    }
    return [];
  }
}

export function salvarCarrinho(itens) {
  if (!storageDisponivel()) return false;

  try {
    window.localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(itens));
    return true;
  } catch (erro) {

    console.warn("[EcoTrend] Não foi possível salvar o carrinho:", erro.message);
    return false;
  }
}

export function limparCarrinhoSalvo() {
  if (!storageDisponivel()) return;
  try {
    window.localStorage.removeItem(CHAVE_CARRINHO);
  } catch {

  }
}
