import { IconeFolha } from "./Icones.jsx";
import "./Rodape.css";

export function Rodape() {
  return (
    <footer className="rodape">
      <div className="container rodape__interno">
        <div className="rodape__marca">
          <span className="marca__simbolo" aria-hidden="true">
            <IconeFolha width={19} height={19} />
          </span>

          <div>
            <p className="rodape__nome">
              Eco<strong>Trend</strong>
            </p>

            <p className="rodape__tagline">Produtos sustentáveis com procedência declarada.</p>
          </div>
        </div>

        <p className="rodape__aviso">
          Projeto acadêmico desenvolvido para o Check-Point 04 da disciplina Web
          Development with JS — FIAP. O catálogo, os preços e o checkout são
          fictícios: nenhuma venda é realizada e nenhum pagamento é processado.
        </p>
      </div>
    </footer>
  );
}
