import { IconeAlerta, IconeFolha } from "./Icones.jsx";
import "./EstadosDeCarga.css";

export function Spinner({ rotulo = "Carregando" }) {
  return (
    <div className="spinner" role="status" aria-live="polite">
      <span className="spinner__disco" aria-hidden="true">
        <IconeFolha className="spinner__folha" />
      </span>

      <span className="sr-only">{rotulo}</span>
    </div>
  );
}

function EsqueletoCard() {
  return (
    <li className="esqueleto" aria-hidden="true">
      <div className="esqueleto__imagem" />
      <div className="esqueleto__linhas">
        <span className="esqueleto__linha esqueleto__linha--curta" />
        <span className="esqueleto__linha" />
        <span className="esqueleto__linha esqueleto__linha--media" />
        <span className="esqueleto__linha esqueleto__linha--preco" />
      </div>
    </li>
  );
}

export function CarregandoProdutos({ quantidade = 8 }) {
  return (
    <div className="carregando">
      <div className="carregando__aviso">
        <Spinner rotulo="Carregando os produtos da EcoTrend" />
        <p className="carregando__texto">Carregando a vitrine…</p>
      </div>

      <ul className="grade-produtos" aria-hidden="true">
        {Array.from({ length: quantidade }, (_, indice) => (
          <EsqueletoCard key={indice} />
        ))}
      </ul>
    </div>
  );
}

export function ErroDeCarregamento({ mensagem, aoTentarNovamente }) {
  return (
    <div className="erro-carga" role="alert">
      <span className="erro-carga__icone" aria-hidden="true">
        <IconeAlerta width={26} height={26} />
      </span>

      <h2 className="erro-carga__titulo">Não conseguimos carregar a vitrine</h2>

      <p className="erro-carga__mensagem">{mensagem}</p>

      <button
        type="button"
        className="botao botao--primario"
        onClick={aoTentarNovamente}
      >
        Tentar novamente
      </button>
    </div>
  );
}