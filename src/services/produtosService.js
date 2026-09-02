const URL_API = `${import.meta.env.BASE_URL}api/produtos.json`;

const ATRASO_SIMULADO = 700;

const TIMEOUT = 10000;

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function validarPayload(dados) {
  if (!dados || typeof dados !== "object") {
    throw new Error("Resposta da API em formato inesperado.");
  }
  if (!Array.isArray(dados.produtos)) {
    throw new Error("A resposta da API não contém a lista de produtos.");
  }
  if (!Array.isArray(dados.categorias)) {
    throw new Error("A resposta da API não contém a lista de categorias.");
  }
  return dados;
}

function resolverImagem(caminho) {
  const valor = String(caminho ?? "");
  if (valor === "" || /^https?:\/\//i.test(valor)) return valor;
  return `${import.meta.env.BASE_URL}${valor.replace(/^\//, "")}`;
}

function normalizarProduto(produto) {
  return {
    id: produto.id,
    nome: String(produto.nome ?? "Produto sem nome"),
    descricao: String(produto.descricao ?? ""),
    preco: Number(produto.preco) || 0,
    categoria: String(produto.categoria ?? ""),
    imagem: resolverImagem(produto.imagem),
    selo: produto.selo ?? null,
    impacto: produto.impacto ?? null,
    estoque: Number(produto.estoque) || 0,
  };
}

export async function buscarProdutos() {

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT);

  try {

    const resposta = await fetch(URL_API, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });

    if (!resposta.ok) {
      throw new Error(
        `Não foi possível carregar os produtos (HTTP ${resposta.status}).`
      );
    }

    const dados = await resposta.json();
    validarPayload(dados);

    await esperar(ATRASO_SIMULADO);

    return {
      produtos: dados.produtos.map(normalizarProduto),
      categorias: dados.categorias,
    };
  } catch (erro) {
    if (erro.name === "AbortError") {
      throw new Error(
        "A conexão demorou demais para responder. Verifique sua internet e tente novamente."
      );
    }

    if (erro instanceof TypeError) {
      throw new Error(
        "Não foi possível conectar à loja. Verifique sua conexão e tente novamente."
      );
    }
    throw erro;
  } finally {
    clearTimeout(timer);
  }
}
