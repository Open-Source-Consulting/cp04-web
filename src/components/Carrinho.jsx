import { useState, useEffect, useRef } from "react";
import { formatarPreco, pluralizar } from "../utils/formatters.js";
import {
  finalizarCompra,
  ETAPAS_CHECKOUT,
  ROTULOS_ETAPA,
} from "../services/checkoutService.js";
import { QTD_MAXIMA, LIMITE_FRETE_GRATIS } from "../hooks/useCarrinho.js";
import { Spinner } from "./EstadosDeCarga.jsx";
import {
  IconeFechar,
  IconeMais,
  IconeMenos,
  IconeLixeira,
  IconeSacola,
  IconeCheck,
  IconeAlerta,
  IconeCaminhao,
} from "./Icones.jsx";
import "./Carrinho.css";

const Fase = {
  COMPRANDO: "comprando",
  PROCESSANDO: "processando",
  SUCESSO: "sucesso",
  ERRO: "erro",
};

export function Carrinho({
  aberto,
  aoFechar,
  itens,
  subtotal,
  frete,
  total,
  totalItens,
  freteGratis,
  faltaParaFreteGratis,
  aoAlterarQuantidade,
  aoRemover,
  aoEsvaziar,
}) {
  const [fase, setFase] = useState(Fase.COMPRANDO);
  const [etapaAtual, setEtapaAtual] = useState(null);
  const [comprovante, setComprovante] = useState(null);
  const [mensagemErro, setMensagemErro] = useState("");

  const painelRef = useRef(null);
  const botaoFecharRef = useRef(null);

  useEffect(() => {
    if (!aberto) return;

    function aoTeclar(evento) {
      if (evento.key === "Escape" && fase !== Fase.PROCESSANDO) {
        aoFechar();
      }
    }

    document.addEventListener("keydown", aoTeclar);
    return () => document.removeEventListener("keydown", aoTeclar);
  }, [aberto, aoFechar, fase]);

  useEffect(() => {
    if (!aberto) return;
    const overflowOriginal = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflowOriginal;
    };
  }, [aberto]);

  useEffect(() => {
    if (!aberto) return;

    let segundoQuadro;
    const primeiroQuadro = requestAnimationFrame(() => {
      segundoQuadro = requestAnimationFrame(() => {
        botaoFecharRef.current?.focus();
      });
    });

    return () => {
      cancelAnimationFrame(primeiroQuadro);
      cancelAnimationFrame(segundoQuadro);
    };
  }, [aberto]);

  useEffect(() => {
    if (!aberto) return;

    function prenderFoco(evento) {
      if (evento.key !== "Tab" || !painelRef.current) return;

      const focaveis = [
        ...painelRef.current.querySelectorAll(
          'button:not([disabled]), input:not([disabled]), select, a[href], [tabindex]:not([tabindex="-1"])'
        ),
      ].filter((elemento) => elemento.offsetParent !== null);

      if (focaveis.length === 0) return;

      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];
      const focoAtual = document.activeElement;

      if (!painelRef.current.contains(focoAtual)) {
        evento.preventDefault();
        (evento.shiftKey ? ultimo : primeiro).focus();
        return;
      }

      if (evento.shiftKey && focoAtual === primeiro) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && focoAtual === ultimo) {
        evento.preventDefault();
        primeiro.focus();
      }
    }

    document.addEventListener("keydown", prenderFoco);
    return () => document.removeEventListener("keydown", prenderFoco);
  }, [aberto, fase]);

  useEffect(() => {
    if (aberto && fase === Fase.SUCESSO) return;
    if (!aberto && fase !== Fase.COMPRANDO && fase !== Fase.PROCESSANDO) {
      setFase(Fase.COMPRANDO);
      setMensagemErro("");
      setComprovante(null);
    }
  }, [aberto, fase]);

  async function processarCheckout() {
    setFase(Fase.PROCESSANDO);
    setMensagemErro("");
    setEtapaAtual(ETAPAS_CHECKOUT.VALIDANDO);

    try {
      const recibo = await finalizarCompra(itens, total, setEtapaAtual);

      setComprovante(recibo);
      setFase(Fase.SUCESSO);
      aoEsvaziar();
    } catch (falha) {
      setMensagemErro(falha.message);
      setFase(Fase.ERRO);
    } finally {
      setEtapaAtual(null);
    }
  }

  function voltarAsCompras() {
    setFase(Fase.COMPRANDO);
    setComprovante(null);
    setMensagemErro("");
    aoFechar();
  }

  const carrinhoVazio = itens.length === 0;

  return (
    <>
      <div
        className={`carrinho-fundo ${aberto ? "is-aberto" : ""}`}
        onClick={fase === Fase.PROCESSANDO ? undefined : aoFechar}
        aria-hidden="true"
      />

      <aside
        ref={painelRef}
        className={`carrinho ${aberto ? "is-aberto" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Carrinho de compras"
        aria-hidden={!aberto}

        inert={!aberto ? "" : undefined}
      >
        <header className="carrinho__cabecalho">
          <h2 className="carrinho__titulo">
            <IconeSacola width={19} height={19} aria-hidden="true" />
            Seu carrinho
            {totalItens > 0 && (
              <span className="carrinho__contagem num">{totalItens}</span>
            )}
          </h2>

          <button
            ref={botaoFecharRef}
            type="button"
            className="botao botao--discreto botao--icone"
            onClick={aoFechar}
            disabled={fase === Fase.PROCESSANDO}
            aria-label="Fechar carrinho"
          >
            <IconeFechar />
          </button>
        </header>

        {fase === Fase.SUCESSO && comprovante && (
          <div className="carrinho__resultado" role="status">
            <span className="carrinho__resultado-icone carrinho__resultado-icone--ok">
              <IconeCheck width={30} height={30} />
            </span>

            <h3 className="carrinho__resultado-titulo">Pedido confirmado</h3>

            <p className="carrinho__resultado-texto">
              Obrigado pela compra. Enviamos os detalhes para o seu e-mail.
            </p>

            <dl className="comprovante">
              <div className="comprovante__linha">
                <dt>Código do pedido</dt>

                <dd className="num">{comprovante.codigo}</dd>
              </div>

              <div className="comprovante__linha">
                <dt>Itens</dt>

                <dd className="num">
                  {comprovante.itens}{" "}
                  {pluralizar(comprovante.itens, "produto", "produtos")}
                </dd>
              </div>

              <div className="comprovante__linha comprovante__linha--total">
                <dt>Total pago</dt>

                <dd className="num">{formatarPreco(comprovante.total)}</dd>
              </div>
            </dl>

            <button
              type="button"
              className="botao botao--primario botao--bloco botao--grande"
              onClick={voltarAsCompras}
            >
              Continuar comprando
            </button>
          </div>
        )}

        {fase === Fase.PROCESSANDO && (
          <div className="carrinho__resultado" role="status" aria-live="polite">
            <Spinner rotulo="Processando seu pedido" />

            <h3 className="carrinho__resultado-titulo">Finalizando sua compra</h3>

            <ol className="etapas">
              {Object.values(ETAPAS_CHECKOUT).map((etapa) => {
                const ordem = Object.values(ETAPAS_CHECKOUT);
                const indiceAtual = ordem.indexOf(etapaAtual);
                const indiceEtapa = ordem.indexOf(etapa);
                const concluida = indiceEtapa < indiceAtual;
                const ativa = etapa === etapaAtual;

                return (
                  <li
                    key={etapa}
                    className={`etapa ${concluida ? "is-concluida" : ""} ${
                      ativa ? "is-ativa" : ""
                    }`}
                  >
                    <span className="etapa__marca" aria-hidden="true">
                      {concluida ? <IconeCheck width={14} height={14} /> : null}
                    </span>

                    {ROTULOS_ETAPA[etapa]}
                  </li>
                );
              })}
            </ol>
          </div>
        )}

        {fase === Fase.ERRO && (
          <div className="carrinho__resultado" role="alert">
            <span className="carrinho__resultado-icone carrinho__resultado-icone--erro">
              <IconeAlerta width={28} height={28} />
            </span>

            <h3 className="carrinho__resultado-titulo">Não foi possível concluir</h3>

            <p className="carrinho__resultado-texto">{mensagemErro}</p>

            <div className="carrinho__resultado-acoes">
              <button
                type="button"
                className="botao botao--primario botao--bloco botao--grande"
                onClick={processarCheckout}
                disabled={carrinhoVazio}
              >
                Tentar novamente
              </button>

              <button
                type="button"
                className="botao botao--secundario botao--bloco"
                onClick={() => setFase(Fase.COMPRANDO)}
              >
                Revisar o carrinho
              </button>
            </div>
          </div>
        )}

        {fase === Fase.COMPRANDO && (
          <>
            {carrinhoVazio ? (
              <div className="carrinho__vazio">
                <span className="carrinho__vazio-icone" aria-hidden="true">
                  <IconeSacola width={30} height={30} />
                </span>

                <h3 className="carrinho__vazio-titulo">Seu carrinho está vazio</h3>

                <p className="carrinho__vazio-texto">
                  Escolha produtos na vitrine e eles aparecem aqui.
                </p>

                <button
                  type="button"
                  className="botao botao--secundario"
                  onClick={aoFechar}
                >
                  Ver a vitrine
                </button>
              </div>
            ) : (
              <>
                <ul className="carrinho__itens">
                  {itens.map((item) => (
                    <li key={item.id} className="item">
                      <img
                        className="item__imagem"
                        src={item.imagem}
                        alt={item.nome}
                        width="72"
                        height="72"
                        loading="lazy"
                      />

                      <div className="item__dados">
                        <h4 className="item__nome">{item.nome}</h4>

                        <p className="item__preco num">
                          {formatarPreco(item.preco)} <span>a unidade</span>
                        </p>

                        <div className="item__controles">
                          <div className="quantidade">
                            <button
                              type="button"
                              className="quantidade__botao"
                              onClick={() =>
                                aoAlterarQuantidade(item.id, item.quantidade - 1)
                              }
                              aria-label={`Diminuir quantidade de ${item.nome}`}
                            >
                              <IconeMenos width={15} height={15} />
                            </button>

                            <label className="sr-only" htmlFor={`qtd-${item.id}`}>
                              Quantidade de {item.nome}
                            </label>

                            <input
                              id={`qtd-${item.id}`}
                              type="number"
                              className="quantidade__valor num"
                              value={item.quantidade}
                              min={1}
                              max={QTD_MAXIMA}
                              onChange={(evento) =>
                                aoAlterarQuantidade(item.id, evento.target.value)
                              }
                            />

                            <button
                              type="button"
                              className="quantidade__botao"
                              onClick={() =>
                                aoAlterarQuantidade(item.id, item.quantidade + 1)
                              }
                              disabled={item.quantidade >= QTD_MAXIMA}
                              aria-label={`Aumentar quantidade de ${item.nome}`}
                            >
                              <IconeMais width={15} height={15} />
                            </button>
                          </div>

                          <button
                            type="button"
                            className="botao botao--discreto item__remover"
                            onClick={() => aoRemover(item.id)}
                            aria-label={`Remover ${item.nome} do carrinho`}
                          >
                            <IconeLixeira width={16} height={16} />
                          </button>
                        </div>
                      </div>

                      <p className="item__subtotal num">
                        <span className="sr-only">Subtotal do item:</span>

                        {formatarPreco(item.preco * item.quantidade)}
                      </p>
                    </li>
                  ))}
                </ul>

                <footer className="carrinho__rodape">
                  <div className="frete">
                    <p className="frete__texto">
                      <IconeCaminhao width={16} height={16} aria-hidden="true" />
                      {freteGratis ? (
                        <span>
                          <strong>Frete grátis</strong> aplicado ao seu pedido.

                        </span>
                      ) : (
                        <span>
                          Faltam{" "}
                          <strong className="num">
                            {formatarPreco(faltaParaFreteGratis)}
                          </strong>{" "}

                          para o frete grátis.
                        </span>
                      )}
                    </p>

                    <div
                      className="frete__barra"
                      role="progressbar"
                      aria-valuenow={Math.min(subtotal, LIMITE_FRETE_GRATIS)}
                      aria-valuemin={0}
                      aria-valuemax={LIMITE_FRETE_GRATIS}
                      aria-label="Progresso para o frete grátis"
                    >
                      <span
                        className="frete__preenchimento"
                        style={{
                          transform: `scaleX(${Math.min(
                            subtotal / LIMITE_FRETE_GRATIS,
                            1
                          )})`,
                        }}
                      />
                    </div>
                  </div>

                  <dl className="totais">
                    <div className="totais__linha">
                      <dt>
                        Subtotal{" "}
                        <span className="totais__itens num">
                          ({totalItens} {pluralizar(totalItens, "item", "itens")})
                        </span>
                      </dt>

                      <dd className="num">{formatarPreco(subtotal)}</dd>
                    </div>

                    <div className="totais__linha">
                      <dt>Frete</dt>

                      <dd className="num">
                        {freteGratis ? (
                          <span className="totais__gratis">Grátis</span>
                        ) : (
                          formatarPreco(frete)
                        )}
                      </dd>
                    </div>

                    <div className="totais__linha totais__linha--total">
                      <dt>Total</dt>

                      <dd className="num">{formatarPreco(total)}</dd>
                    </div>
                  </dl>

                  <button
                    type="button"
                    className="botao botao--primario botao--bloco botao--grande"
                    onClick={processarCheckout}
                    disabled={carrinhoVazio}
                  >
                    Finalizar compra
                  </button>

                  <button
                    type="button"
                    className="botao botao--discreto botao--bloco"
                    onClick={aoEsvaziar}
                  >
                    Esvaziar carrinho
                  </button>
                </footer>
              </>
            )}
          </>
        )}
      </aside>
    </>
  );
}
