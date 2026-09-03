# EcoTrend

Vitrine de e-commerce de produtos sustentáveis e ecológicos, desenvolvida em React para o **Check-Point 04** da disciplina *Web Development with JS* — FIAP.

O usuário navega um catálogo carregado de forma assíncrona, filtra por categoria, preço e texto, monta um carrinho que sobrevive ao fechamento do navegador e conclui um checkout simulado em três etapas.

---

## Objetivo

Demonstrar, de forma real e verificável no código, o domínio dos seguintes conceitos:

| Requisito do CP04 | Onde está implementado |
| --- | --- |
| **React** | Componentes em [src/components/](src/components/), hooks próprios em [src/hooks/](src/hooks/) |
| **Produtos via JSON** | [public/api/produtos.json](public/api/produtos.json) — 16 produtos, 4 categorias |
| **Renderização dinâmica** | [src/components/Vitrine.jsx](src/components/Vitrine.jsx) — `.map()` sobre os dados, nenhum produto escrito à mão |
| **Carrinho dinâmico** | [src/hooks/useCarrinho.js](src/hooks/useCarrinho.js) — reducer com fonte única da verdade |
| **Filtros sem reload** | [src/hooks/useFiltros.js](src/hooks/useFiltros.js) — lista derivada do estado |
| **localStorage** | [src/utils/storage.js](src/utils/storage.js) — leitura, escrita e tratamento de dados inválidos |
| **fetch GET** | [src/services/produtosService.js](src/services/produtosService.js) — `fetch(URL, { method: "GET" })` com `async/await` |
| **Loading spinner** | [src/components/EstadosDeCarga.jsx](src/components/EstadosDeCarga.jsx) — spinner + esqueletos de card |
| **Tratamento de erro** | [src/components/EstadosDeCarga.jsx](src/components/EstadosDeCarga.jsx) — tela de erro com "tentar novamente" |
| **Checkout com Promise** | [src/services/checkoutService.js](src/services/checkoutService.js) — 3 etapas encadeadas com `Promise` e `async/await` |

---

## Funcionalidades

### Catálogo
- 16 produtos carregados de um JSON por requisição HTTP GET.
- Quatro categorias: roupas e acessórios sustentáveis, beleza e cuidados naturais, casa sustentável e tecnologia verde.
- Cada produto declara o dado que o qualifica como sustentável (material, origem ou economia gerada).

### Filtros
- Por **categoria**, com contagem de itens em cada uma.
- Por **preço máximo**, em controle deslizante.
- Por **texto**, buscando em nome e descrição.
- **Ordenação** por relevância, menor preço, maior preço ou nome.
- Botão **limpar filtros**, exibido apenas quando há filtro ativo.
- A lista é atualizada imediatamente, sem recarregar a página.

### Carrinho
- Adicionar, remover e alterar quantidade de produtos.
- Quantidade total de itens, subtotal, frete e total.
- Regra de frete grátis acima de R$ 250, com barra de progresso.
- Abre e fecha em drawer lateral, com fechamento por `Esc` ou clique fora.
- Persistido em `localStorage`: recarregar ou reabrir o navegador restaura o carrinho.
- Tratamento de dados corrompidos: JSON inválido, estrutura inesperada ou itens malformados são descartados sem quebrar a aplicação.

### Checkout
- Fluxo simulado em três etapas visíveis: validação do carrinho → processamento do pedido → confirmação.
- Implementado com `Promise` e `async/await`.
- Feedback de sucesso com código do pedido, ou de erro com opção de nova tentativa.
- Nenhum pagamento real é processado.

### Estados de interface
Todos os caminhos não-felizes têm tratamento visual próprio: carregando, erro de carregamento, carrinho vazio, filtro sem resultado e falha no checkout.

---

## Tecnologias

- **React 18** — biblioteca de interface.
- **Vite 6** — build e servidor de desenvolvimento.
- **CSS puro** — design tokens em CSS custom properties, sem framework de estilo.
- **Montserrat** — fonte variável hospedada localmente em `public/fonts/`, sem dependência do Google Fonts em produção.

Nenhuma dependência além do React e do toolchain do Vite.

---

## Como executar localmente

Pré-requisitos: **Node.js 18+** e npm.

```bash
# 1. Instalar as dependências
npm install

# 2. Rodar em modo de desenvolvimento
npm run dev
```

A aplicação abre em `http://localhost:5173`.

---

## Build de produção

```bash
npm run build
```

Os arquivos finais são gerados na pasta `dist/`.

Para conferir o resultado do build localmente antes de publicar:

```bash
npm run preview
```

---

## Como publicar

O projeto está configurado para a Vercel. O passo a passo de publicação e
conferência antes da entrega está em [DEPLOY.md](DEPLOY.md).

---

## Estrutura do projeto

```
cp04-web/
├── public/
│   ├── api/
│   │   └── produtos.json        # Fake API: fonte dos produtos (fetch GET)
│   ├── fonts/                   # Montserrat variável (woff2), hospedada localmente
│   ├── img/produtos/            # Imagens do catálogo
│   └── favicon.svg
├── src/
│   ├── components/              # Componentes de apresentação
│   │   ├── Cabecalho.jsx        # Header: marca e botão do carrinho
│   │   ├── Hero.jsx             # Abertura da loja
│   │   ├── Vitrine.jsx          # Decide entre loading, erro, vazio e grade
│   │   ├── CardProduto.jsx      # Card de um produto
│   │   ├── Filtros.jsx          # Painel de filtros
│   │   ├── Carrinho.jsx         # Drawer do carrinho e fluxo de checkout
│   │   ├── EstadosDeCarga.jsx   # Spinner, esqueletos e tela de erro
│   │   ├── Rodape.jsx           # Rodapé
│   │   └── Icones.jsx           # Ícones em SVG autoral
│   ├── hooks/
│   │   ├── useProdutos.js       # fetch, loading e erro
│   │   ├── useFiltros.js        # filtros e lista derivada
│   │   └── useCarrinho.js       # estado do carrinho + persistência
│   ├── services/
│   │   ├── produtosService.js   # fetch GET na Fake API
│   │   └── checkoutService.js   # checkout em 3 etapas com Promise
│   ├── utils/
│   │   ├── storage.js           # localStorage com tratamento de dados inválidos
│   │   └── formatters.js        # formatação de preço e textos
│   ├── styles/
│   │   ├── tokens.css           # design tokens (cor, tipografia, espaçamento)
│   │   ├── fonts.css            # @font-face da Montserrat
│   │   ├── global.css           # reset e base
│   │   └── botoes.css           # vocabulário de botões
│   ├── App.jsx                  # componente raiz: conecta os hooks
│   └── main.jsx                 # ponto de entrada
├── index.html
├── vite.config.js
├── vercel.json
└── DEPLOY.md                    # como publicar
```

### Separação de responsabilidades

- **`services/`** — comunicação externa e regras de processo. Nenhum componente chama `fetch` diretamente.
- **`hooks/`** — estado e regras de negócio. É onde vivem o carrinho, os filtros e o ciclo da requisição.
- **`components/`** — apresentação. Recebem dados por props e avisam mudanças por callback.
- **`utils/`** — funções puras, sem dependência de React.

---

## Acessibilidade

- HTML semântico (`header`, `main`, `section`, `aside`, `footer`, listas e `dl` para os totais).
- `alt` descritivo em todas as imagens.
- Botões reais (`<button>`) para todas as ações.
- Todos os inputs têm `<label>` associado.
- Foco visível e consistente; foco preso dentro do carrinho enquanto ele está aberto.
- Link "pular para os produtos" como primeiro item da tabulação.
- Mudanças de estado anunciadas por `role="status"` e `aria-live`.
- Suporte a `prefers-reduced-motion`.

---

## Responsividade

Layout verificado em desktop (1440px), tablet (768px) e celular (390px), sem overflow horizontal em nenhum deles. A grade de produtos, os filtros, o cabeçalho e o carrinho se adaptam a cada faixa.

---

## Integrantes do grupo

| Nome | RM |
| --- | --- |
| Felipe Rossano Pedrol | 569631 |
| Jecky Cossio | 572226 |
| Daniel Roberto Ribeiro de Figueiredo | 571746 |
| Felipi Bandeira de Godoy | 573741 |
| Leonardo Ferreira Barbosa | 571311 |

---

## Observação

Projeto acadêmico. O catálogo, os preços e o checkout são fictícios: nenhuma venda é realizada e nenhum pagamento é processado. As imagens dos produtos vêm do banco livre Unsplash, exceto duas ilustrações autorais em SVG.
