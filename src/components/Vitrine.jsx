import { forwardRef } from "react";
import { CardProduto } from "./CardProduto.jsx";
import { CarregandoProdutos, ErroDeCarregamento } from "./EstadosDeCarga.jsx";
import { IconeBusca } from "./Icones.jsx";
import "./Vitrine.css";

export const Vitrine = forwardRef(function Vitrine(
  {
    carregando,
    erro,
    aoRecarregar,
    produtos,
    quantidadeDoProduto,
    aoAdicionar,
    temFiltroAtivo,
    aoLimparFiltros,
    painelFiltros,
  },
  ref
) {
  return (
    <section
      id="vitrine"
      ref={ref}
      className="vitrine container"
      aria-labelledby="vitrine-titulo"
      tabIndex={-1}
    >
      <div className="vitrine__cabecalho">
        <h2 id="vitrine-titulo" className="vitrine__titulo">
          Vitrine
        </h2>

        <p className="vitrine__subtitulo">
          Cada item traz o dado que o qualifica como sustentável.
        </p>
      </div>

      {erro ? (
        <ErroDeCarregamento mensagem={erro} aoTentarNovamente={aoRecarregar} />
      ) : (
        <>
          {!carregando && painelFiltros}

          {carregando ? (
            <CarregandoProdutos />
          ) : produtos.length === 0 ? (

            <div className="vazio" role="status">
              <span className="vazio__icone" aria-hidden="true">
                <IconeBusca width={28} height={28} />
              </span>

              <h3 className="vazio__titulo">Nenhum produto encontrado</h3>

              <p className="vazio__texto">
                Nenhum item corresponde aos filtros escolhidos. Tente ampliar a
                faixa de preço ou escolher outra categoria.
              </p>

              {temFiltroAtivo && (
                <button
                  type="button"
                  className="botao botao--secundario"
                  onClick={aoLimparFiltros}
                >
                  Limpar filtros
                </button>
              )}
            </div>
          ) : (

            <ul className="grade-produtos">
              {produtos.map((produto) => (
                <CardProduto
                  key={produto.id}
                  produto={produto}
                  quantidadeNoCarrinho={quantidadeDoProduto(produto.id)}
                  aoAdicionar={aoAdicionar}
                />
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
});