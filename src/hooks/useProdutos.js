import { useState, useEffect, useCallback, useRef } from "react";
import { buscarProdutos } from "../services/produtosService.js";

export function useProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const montado = useRef(true);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);

    try {
      const dados = await buscarProdutos();
      if (!montado.current) return;

      setProdutos(dados.produtos);
      setCategorias(dados.categorias);
    } catch (falha) {
      if (!montado.current) return;
      setErro(falha.message || "Erro inesperado ao carregar os produtos.");
      setProdutos([]);
    } finally {
      if (montado.current) setCarregando(false);
    }
  }, []);

  useEffect(() => {
    montado.current = true;
    carregar();
    return () => {
      montado.current = false;
    };
  }, [carregar]);

  return { produtos, categorias, carregando, erro, recarregar: carregar };
}
