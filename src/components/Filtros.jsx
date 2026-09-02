import { formatarPreco } from "../utils/formatters.js";
import { CATEGORIA_TODAS, ORDENACOES } from "../hooks/useFiltros.js";
import { IconeBusca, IconeFiltro, IconeFechar } from "./Icones.jsx";
import "./Filtros.css";

export function Filtros({
  categorias,
  filtros,
  precoMaximoCatalogo,
  contagemPorCategoria,
  temFiltroAtivo,
  totalResultados,
  totalCatalogo,
  aoMudarCategoria,
  aoMudarPreco,
  aoMudarBusca,
  aoMudarOrdenacao,
  aoLimpar,
}) {
  return (
    <section className="filtros" aria-labelledby="titulo-filtros">
      <div className="filtros__topo">
        <h2 id="titulo-filtros" className="filtros__titulo">
          <IconeFiltro width={17} height={17} aria-hidden="true" />
          Filtrar produtos
        </h2>

        {temFiltroAtivo && (
          <button type="button" className="botao botao--discreto" onClick={aoLimpar}>
            <IconeFechar width={15} height={15} />
            Limpar filtros
          </button>
        )}
      </div>

      <div className="filtros__campos">
        <div className="campo campo--busca">
          <label className="campo__rotulo" htmlFor="filtro-busca">
            Buscar
          </label>

          <div className="campo__envolucro">
            <IconeBusca className="campo__icone" width={17} height={17} />
            <input
              id="filtro-busca"
              type="search"
              className="campo__entrada"
              placeholder="Nome ou descrição do produto"
              value={filtros.busca}
              onChange={(evento) => aoMudarBusca(evento.target.value)}
            />
          </div>
        </div>

        <div className="campo campo--preco">
          <label className="campo__rotulo" htmlFor="filtro-preco">
            Preço máximo:{" "}
            <strong className="campo__valor num">
              {formatarPreco(filtros.precoMaximo)}
            </strong>
          </label>

          <input
            id="filtro-preco"
            type="range"
            className="campo__faixa"
            min={0}
            max={precoMaximoCatalogo}
            step={10}
            value={filtros.precoMaximo}
            onChange={(evento) => aoMudarPreco(evento.target.value)}
          />
          <div className="campo__extremos num" aria-hidden="true">
            <span>{formatarPreco(0)}</span>

            <span>{formatarPreco(precoMaximoCatalogo)}</span>
          </div>
        </div>

        <div className="campo campo--ordem">
          <label className="campo__rotulo" htmlFor="filtro-ordem">
            Ordenar por
          </label>

          <select
            id="filtro-ordem"
            className="campo__selecao"
            value={filtros.ordenacao}
            onChange={(evento) => aoMudarOrdenacao(evento.target.value)}
          >
            {ORDENACOES.map((opcao) => (
              <option key={opcao.id} value={opcao.id}>
                {opcao.rotulo}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="categorias">
        <h3 className="sr-only" id="titulo-categorias">
          Categorias
        </h3>

        <div
          className="categorias__lista"
          role="group"
          aria-labelledby="titulo-categorias"
        >
          <button
            type="button"
            className={`chip ${
              filtros.categoria === CATEGORIA_TODAS ? "is-ativo" : ""
            }`}
            onClick={() => aoMudarCategoria(CATEGORIA_TODAS)}
            aria-pressed={filtros.categoria === CATEGORIA_TODAS}
          >
            Todas
            <span className="chip__contagem num">{totalCatalogo}</span>
          </button>

          {categorias.map((categoria) => (
            <button
              key={categoria.id}
              type="button"
              className={`chip ${
                filtros.categoria === categoria.id ? "is-ativo" : ""
              }`}
              onClick={() => aoMudarCategoria(categoria.id)}
              aria-pressed={filtros.categoria === categoria.id}
            >
              {categoria.nome}
              <span className="chip__contagem num">
                {contagemPorCategoria[categoria.id] || 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      <p className="filtros__resultado" role="status" aria-live="polite">
        <span className="num">{totalResultados}</span>{" "}

        {totalResultados === 1 ? "produto encontrado" : "produtos encontrados"}
      </p>
    </section>
  );
}
