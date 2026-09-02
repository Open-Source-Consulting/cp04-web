import { useReducer, useEffect, useMemo, useCallback, useRef } from "react";
import { carregarCarrinho, salvarCarrinho } from "../utils/storage.js";

export const QTD_MAXIMA = 99;

export const LIMITE_FRETE_GRATIS = 250;

export const VALOR_FRETE = 24.9;

const Acao = {
  ADICIONAR: "adicionar",
  REMOVER: "remover",
  ALTERAR_QTD: "alterar_qtd",
  ESVAZIAR: "esvaziar",
};

function carrinhoReducer(itens, acao) {
  switch (acao.tipo) {
    case Acao.ADICIONAR: {
      const { produto, quantidade = 1 } = acao;
      const existente = itens.find((item) => item.id === produto.id);

      if (existente) {
        return itens.map((item) =>
          item.id === produto.id
            ? {
                ...item,
                quantidade: Math.min(item.quantidade + quantidade, QTD_MAXIMA),
              }
            : item
        );
      }

      return [
        ...itens,
        {
          id: produto.id,
          nome: produto.nome,
          preco: produto.preco,
          imagem: produto.imagem,
          categoria: produto.categoria,
          quantidade: Math.min(quantidade, QTD_MAXIMA),
        },
      ];
    }

    case Acao.REMOVER:
      return itens.filter((item) => item.id !== acao.id);

    case Acao.ALTERAR_QTD: {
      const novaQtd = Number(acao.quantidade);

      if (!Number.isFinite(novaQtd) || novaQtd < 1) {
        return itens.filter((item) => item.id !== acao.id);
      }

      return itens.map((item) =>
        item.id === acao.id
          ? { ...item, quantidade: Math.min(novaQtd, QTD_MAXIMA) }
          : item
      );
    }

    case Acao.ESVAZIAR:
      return [];

    default:
      return itens;
  }
}

function estadoInicial() {
  return carregarCarrinho();
}

export function useCarrinho() {
  const [itens, dispatch] = useReducer(carrinhoReducer, undefined, estadoInicial);

  const primeiraRenderizacao = useRef(true);

  useEffect(() => {
    if (primeiraRenderizacao.current) {
      primeiraRenderizacao.current = false;
      return;
    }
    salvarCarrinho(itens);
  }, [itens]);

  const adicionar = useCallback((produto, quantidade = 1) => {
    dispatch({ tipo: Acao.ADICIONAR, produto, quantidade });
  }, []);

  const remover = useCallback((id) => {
    dispatch({ tipo: Acao.REMOVER, id });
  }, []);

  const alterarQuantidade = useCallback((id, quantidade) => {
    dispatch({ tipo: Acao.ALTERAR_QTD, id, quantidade });
  }, []);

  const esvaziar = useCallback(() => {
    dispatch({ tipo: Acao.ESVAZIAR });
  }, []);

  const totais = useMemo(() => {
    const subtotal = itens.reduce(
      (soma, item) => soma + item.preco * item.quantidade,
      0
    );
    const totalItens = itens.reduce((soma, item) => soma + item.quantidade, 0);

    const frete = subtotal > 0 && subtotal < LIMITE_FRETE_GRATIS ? VALOR_FRETE : 0;

    return {
      subtotal,
      frete,
      total: subtotal + frete,
      totalItens,
      freteGratis: subtotal >= LIMITE_FRETE_GRATIS,
      faltaParaFreteGratis: Math.max(0, LIMITE_FRETE_GRATIS - subtotal),
    };
  }, [itens]);

  const quantidadeDoProduto = useCallback(
    (id) => itens.find((item) => item.id === id)?.quantidade ?? 0,
    [itens]
  );

  return {
    itens,
    ...totais,
    adicionar,
    remover,
    alterarQuantidade,
    esvaziar,
    quantidadeDoProduto,
  };
}
