import { gerarCodigoPedido } from "../utils/formatters.js";

export const ETAPAS_CHECKOUT = {
  VALIDANDO: "validando",
  PROCESSANDO: "processando",
  CONFIRMANDO: "confirmando",
};

export const ROTULOS_ETAPA = {
  [ETAPAS_CHECKOUT.VALIDANDO]: "Conferindo os itens do carrinho",
  [ETAPAS_CHECKOUT.PROCESSANDO]: "Processando o pedido",
  [ETAPAS_CHECKOUT.CONFIRMANDO]: "Confirmando a compra",
};

const VALOR_MINIMO = 1;

const CHANCE_DE_FALHA = 0.15;

function aguardar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function validarCarrinho(itens, total) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(itens) || itens.length === 0) {
      reject(new Error("Seu carrinho está vazio. Adicione um produto antes de finalizar."));
      return;
    }

    const quantidadeInvalida = itens.some(
      (item) => !Number.isFinite(item.quantidade) || item.quantidade < 1
    );
    if (quantidadeInvalida) {
      reject(new Error("Há um item com quantidade inválida. Revise o carrinho."));
      return;
    }

    if (!Number.isFinite(total) || total < VALOR_MINIMO) {
      reject(new Error("O valor do pedido é inválido. Revise o carrinho."));
      return;
    }

    resolve({ itensValidados: itens.length });
  });
}

function processarPedido(total) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < CHANCE_DE_FALHA) {
        reject(
          new Error(
            "O pagamento não foi autorizado pela operadora. Nenhum valor foi cobrado — tente novamente."
          )
        );
        return;
      }
      resolve({ valorProcessado: total });
    }, 900);
  });
}

async function confirmarPedido(itens, total) {
  await aguardar(700);
  return {
    codigo: gerarCodigoPedido(),
    itens: itens.length,
    total,
    data: new Date().toISOString(),
  };
}

export async function finalizarCompra(itens, total, aoMudarEtapa = () => {}) {

  aoMudarEtapa(ETAPAS_CHECKOUT.VALIDANDO);
  await validarCarrinho(itens, total);
  await aguardar(600);

  aoMudarEtapa(ETAPAS_CHECKOUT.PROCESSANDO);
  await processarPedido(total);

  aoMudarEtapa(ETAPAS_CHECKOUT.CONFIRMANDO);
  const comprovante = await confirmarPedido(itens, total);

  return comprovante;
}
