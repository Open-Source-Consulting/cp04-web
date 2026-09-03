import { IconeFolha, IconeSeta, IconeCaminhao, IconeCheck } from "./Icones.jsx";
import "./Hero.css";

const COMPROMISSOS = [
  { icone: IconeFolha, texto: "Origem rastreada em todo o catálogo" },
  { icone: IconeCaminhao, texto: "Frete grátis acima de R$ 250" },
  { icone: IconeCheck, texto: "Embalagem sem plástico virgem" },
];

export function Hero({ totalProdutos, carregando, aoVerProdutos }) {
  return (
    <section className="hero" aria-labelledby="hero-titulo">
      <div className="container hero__interno">
        <p className="hero__linha-fina">
          <IconeFolha width={15} height={15} aria-hidden="true" />
          Loja de produtos sustentáveis
        </p>

        <h1 id="hero-titulo" className="hero__titulo">
          O que você compra
          <br />
          <em className="hero__enfase">deixa um rastro.</em>
        </h1>

        <p className="hero__texto">
          Na EcoTrend cada produto declara o que o torna sustentável — material,
          origem e fim de vida — para a escolha ser sua, com a informação na mão.
        </p>

        <div className="hero__acoes">
          <button
            type="button"
            className="botao botao--primario botao--grande"
            onClick={aoVerProdutos}
          >
            Ver a vitrine
            <IconeSeta width={17} height={17} />
          </button>

          {!carregando && totalProdutos > 0 && (
            <p className="hero__contagem">
              <strong className="num">{totalProdutos}</strong> produtos em

              4&nbsp;categorias
            </p>
          )}
        </div>
      </div>

      <ul className="compromissos container">
        {COMPROMISSOS.map(({ icone: Icone, texto }) => (
          <li key={texto} className="compromissos__item">
            <Icone width={16} height={16} aria-hidden="true" />
            {texto}
          </li>
        ))}
      </ul>
    </section>
  );
}
