import { useState, useRef, useCallback } from "react";

import { useProdutos } from "./hooks/useProdutos.js";
import { useFiltros } from "./hooks/useFiltros.js";
import { useCarrinho } from "./hooks/useCarrinho.js";

import { Cabecalho } from "./components/Cabecalho.jsx";
import { Hero } from "./components/Hero.jsx";
import { Vitrine } from "./components/Vitrine.jsx";
import { Filtros } from "./components/Filtros.jsx";
import { Carrinho } from "./components/Carrinho.jsx";
import { Rodape } from "./components/Rodape.jsx";

export default function App() {

  const { produtos, categorias, carregando, erro, recarregar } = useProdutos();

  const {
    filtros,
    precoMaximoCatalogo,
    produtosFiltrados,
    contagemPorCategoria,
    temFiltroAtivo,
    definirCategoria,
    definirPrecoMaximo,
    definirBusca,
    definirOrdenacao,
    limparFiltros,
  } = useFiltros(produtos);

  const carrinho = useCarrinho();

  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const abrirCarrinho = useCallback(() => setCarrinhoAberto(true), []);
  const fecharCarrinho = useCallback(() => setCarrinhoAberto(false), []);

  const vitrineRef = useRef(null);

  const rolarAteVitrine = useCallback(() => {
    vitrineRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <>
      <a className="skip-link" href="#vitrine">
        Pular para os produtos
      </a>

      <Cabecalho
        totalItens={carrinho.totalItens}
        aoAbrirCarrinho={abrirCarrinho}
      />

      <main id="conteudo">
        <Hero
          totalProdutos={produtos.length}
          carregando={carregando}
          aoVerProdutos={rolarAteVitrine}
        />

        <Vitrine
          ref={vitrineRef}
          carregando={carregando}
          erro={erro}
          aoRecarregar={recarregar}
          produtos={produtosFiltrados}
          quantidadeDoProduto={carrinho.quantidadeDoProduto}
          aoAdicionar={carrinho.adicionar}
          temFiltroAtivo={temFiltroAtivo}
          aoLimparFiltros={limparFiltros}
          painelFiltros={
            <Filtros
              categorias={categorias}
              filtros={filtros}
              precoMaximoCatalogo={precoMaximoCatalogo}
              contagemPorCategoria={contagemPorCategoria}
              temFiltroAtivo={temFiltroAtivo}
              totalResultados={produtosFiltrados.length}
              totalCatalogo={produtos.length}
              aoMudarCategoria={definirCategoria}
              aoMudarPreco={definirPrecoMaximo}
              aoMudarBusca={definirBusca}
              aoMudarOrdenacao={definirOrdenacao}
              aoLimpar={limparFiltros}
            />
          }
        />
      </main>

      <Rodape />

      <Carrinho
        aberto={carrinhoAberto}
        aoFechar={fecharCarrinho}
        itens={carrinho.itens}
        subtotal={carrinho.subtotal}
        frete={carrinho.frete}
        total={carrinho.total}
        totalItens={carrinho.totalItens}
        freteGratis={carrinho.freteGratis}
        faltaParaFreteGratis={carrinho.faltaParaFreteGratis}
        aoAlterarQuantidade={carrinho.alterarQuantidade}
        aoRemover={carrinho.remover}
        aoEsvaziar={carrinho.esvaziar}
      />
    </>
  );
}
