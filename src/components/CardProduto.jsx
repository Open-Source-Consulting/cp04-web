import { useState, useRef, useEffect } from "react";
import { formatarPreco } from "../utils/formatters.js";
import { IconeMais, IconeCheck, IconeFolha } from "./Icones.jsx";
import "./CardProduto.css";

const DURACAO_CARIMBO = 1400;

export function CardProduto({ produto, quantidadeNoCarrinho, aoAdicionar }) {

  const [carimbado, setCarimbado] = useState(false);
  const temporizador = useRef(null);

  const [imagemCarregada, setImagemCarregada] = useState(false);
  const [imagemFalhou, setImagemFalhou] = useState(false);

  useEffect(() => {
    return () => {
      if (temporizador.current) clearTimeout(temporizador.current);
    };
  }, []);

  function adicionarAoCarrinho() {
    aoAdicionar(produto);

    setCarimbado(true);
    if (temporizador.current) clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => setCarimbado(false), DURACAO_CARIMBO);
  }

  const esgotado = produto.estoque === 0;

  return (
    <li className="card">
      <div className="card__moldura">
        {!imagemCarregada && !imagemFalhou && (
          <span className="card__placeholder" aria-hidden="true" />
        )}

        {imagemFalhou ? (

          <span className="card__sem-imagem" aria-hidden="true">
            <IconeFolha width={30} height={30} />
          </span>
        ) : (
          <img
            className={`card__imagem ${imagemCarregada ? "is-visivel" : ""}`}
            src={produto.imagem}
            alt={produto.nome}
            loading="lazy"
            decoding="async"
            width="640"
            height="480"
            onLoad={() => setImagemCarregada(true)}
            onError={() => setImagemFalhou(true)}
          />
        )}

        {produto.selo && (
          <span className="card__selo">
            <IconeFolha width={13} height={13} />
            {produto.selo}
          </span>
        )}

        {quantidadeNoCarrinho > 0 && (
          <span className="card__contador num">
            {quantidadeNoCarrinho} no carrinho
          </span>
        )}
      </div>

      <div className="card__corpo">
        <h3 className="card__nome">{produto.nome}</h3>

        <p className="card__descricao">{produto.descricao}</p>

        {produto.impacto && (
          <p className="card__impacto">
            <IconeFolha width={14} height={14} aria-hidden="true" />
            <span>{produto.impacto}</span>
          </p>
        )}

        <div className="card__rodape">
          <p className="card__preco num">
            <span className="sr-only">Preço:</span>

            {formatarPreco(produto.preco)}
          </p>

          <button
            type="button"
            className={`botao botao--primario card__botao ${
              carimbado ? "is-carimbado" : ""
            }`}
            onClick={adicionarAoCarrinho}
            disabled={esgotado}
            aria-label={`Adicionar ${produto.nome} ao carrinho`}
          >
            {carimbado ? (
              <>
                <IconeCheck width={17} height={17} />
                Adicionado
              </>
            ) : (
              <>
                <IconeMais width={17} height={17} />
                {esgotado ? "Esgotado" : "Adicionar"}
              </>
            )}
          </button>
        </div>
      </div>
    </li>
  );
}