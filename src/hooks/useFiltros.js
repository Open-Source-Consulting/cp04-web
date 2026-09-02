import { useState, useMemo, useCallback } from "react";

export const CATEGORIA_TODAS = "todas";

export const ORDENACOES = [
  { id: "relevancia", rotulo: "Mais relevantes" },
  { id: "menor-preco", rotulo: "Menor preço" },
  { id: "maior-preco", rotulo: "Maior preço" },
  { id: "nome", rotulo: "Nome (A–Z)" },
];

function filtrosIniciais(precoMaximo) {
  return {
    categoria: CATEGORIA_TODAS,
    precoMaximo,
    busca: "",
    ordenacao: "relevancia",
  };
}

export function useFiltros(produtos) {

  const precoMaximo = useMemo(() => {
    if (produtos.length === 0) return 500;
    const maior = Math.max(...produtos.map((p) => p.preco));
    return Math.ceil(maior / 50) * 50;
  }, [produtos]);

  const [filtros, setFiltros] = useState(() => filtrosIniciais(500));

  const [precoTocado, setPrecoTocado] = useState(false);
  const precoAtual = precoTocado ? filtros.precoMaximo : precoMaximo;

  const definirCategoria = useCallback((categoria) => {
    setFiltros((atual) => ({ ...atual, categoria }));
  }, []);

  const definirPrecoMaximo = useCallback((valor) => {
    setPrecoTocado(true);
    setFiltros((atual) => ({ ...atual, precoMaximo: Number(valor) }));
  }, []);

  const definirBusca = useCallback((busca) => {
    setFiltros((atual) => ({ ...atual, busca }));
  }, []);

  const definirOrdenacao = useCallback((ordenacao) => {
    setFiltros((atual) => ({ ...atual, ordenacao }));
  }, []);

  const limparFiltros = useCallback(() => {
    setPrecoTocado(false);
    setFiltros(filtrosIniciais(precoMaximo));
  }, [precoMaximo]);

  const temFiltroAtivo =
    filtros.categoria !== CATEGORIA_TODAS ||
    filtros.busca.trim() !== "" ||
    (precoTocado && precoAtual < precoMaximo) ||
    filtros.ordenacao !== "relevancia";

  const produtosFiltrados = useMemo(() => {
    const termo = filtros.busca.trim().toLowerCase();

    const resultado = produtos.filter((produto) => {

      const passaCategoria =
        filtros.categoria === CATEGORIA_TODAS ||
        produto.categoria === filtros.categoria;

      const passaPreco = produto.preco <= precoAtual;

      const passaBusca =
        termo === "" ||
        produto.nome.toLowerCase().includes(termo) ||
        produto.descricao.toLowerCase().includes(termo);

      return passaCategoria && passaPreco && passaBusca;
    });

    switch (filtros.ordenacao) {
      case "menor-preco":
        return [...resultado].sort((a, b) => a.preco - b.preco);
      case "maior-preco":
        return [...resultado].sort((a, b) => b.preco - a.preco);
      case "nome":
        return [...resultado].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
      default:
        return resultado;
    }
  }, [produtos, filtros.categoria, filtros.busca, filtros.ordenacao, precoAtual]);

  const contagemPorCategoria = useMemo(() => {
    return produtos.reduce((contagem, produto) => {
      contagem[produto.categoria] = (contagem[produto.categoria] || 0) + 1;
      return contagem;
    }, {});
  }, [produtos]);

  return {
    filtros: { ...filtros, precoMaximo: precoAtual },
    precoMaximoCatalogo: precoMaximo,
    produtosFiltrados,
    contagemPorCategoria,
    temFiltroAtivo,
    definirCategoria,
    definirPrecoMaximo,
    definirBusca,
    definirOrdenacao,
    limparFiltros,
  };
}
