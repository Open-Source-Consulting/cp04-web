import { IconeSacola, IconeFolha } from "./Icones.jsx";
import "./Cabecalho.css";

export function Cabecalho({ totalItens, aoAbrirCarrinho }) {
  return (
    <header className="cabecalho">
      <div className="container cabecalho__interno">
        <a className="marca" href="#vitrine">
          <span className="marca__simbolo" aria-hidden="true">
            <IconeFolha width={19} height={19} />
          </span>

          <span className="marca__nome">
            Eco<span className="marca__nome-forte">Trend</span>
          </span>
        </a>

        <button
          type="button"
          className="botao botao--secundario cabecalho__carrinho"
          onClick={aoAbrirCarrinho}
          aria-label={
            totalItens > 0
              ? `Abrir carrinho com ${totalItens} ${
                  totalItens === 1 ? "item" : "itens"
                }`
              : "Abrir carrinho, vazio"
          }
        >
          <IconeSacola width={18} height={18} />
          <span className="cabecalho__carrinho-texto">Carrinho</span>

          {totalItens > 0 && (
            <span className="cabecalho__badge num" aria-hidden="true">
              {totalItens}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
