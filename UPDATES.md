# Passo a passo dos commits — EcoTrend

O projeto está dividido em **10 commits**, em ordem de dependência: cada um usa apenas o que veio antes, e nenhum quebra o que já estava funcionando.

| # | Update | Camada | Responsável |
| --- | --- | --- | --- |
| 1 | Estrutura inicial do projeto | Fundação | Felipe Rossano Pedrol |
| 2 | Design system e tipografia | Fundação | Felipe Rossano Pedrol |
| 3 | Catálogo em JSON com imagens | Dados | Jecky Cossio |
| 4 | Consumo da Fake API com fetch | Dados | Jecky Cossio |
| 5 | Loading spinner e tela de erro | Interface | Daniel Roberto Ribeiro de Figueiredo |
| 6 | Vitrine renderizada do JSON | Interface | Daniel Roberto Ribeiro de Figueiredo |
| 7 | Filtros dinâmicos | Funcionalidade | Felipi Bandeira de Godoy |
| 8 | Carrinho com localStorage | Funcionalidade | Felipi Bandeira de Godoy |
| 9 | Drawer do carrinho e checkout | Funcionalidade | Leonardo Ferreira Barbosa |
| 10 | Montagem da aplicação | Montagem | Leonardo Ferreira Barbosa |

Para ver os hashes na sua máquina:

```bash
git log --oneline --reverse
```

---

## Divisão por integrante

| Integrante | RM | Commits |
| --- | --- | --- |
| Felipe Rossano Pedrol | 569631 | 1 e 2 — estrutura e design system |
| Jecky Cossio | 572226 | 3 e 4 — catálogo e consumo da API |
| Daniel Roberto Ribeiro de Figueiredo | 571746 | 5 e 6 — estados de carga e vitrine |
| Felipi Bandeira de Godoy | 573741 | 7 e 8 — filtros e carrinho |
| Leonardo Ferreira Barbosa | 571311 | 9 e 10 — checkout e montagem |

---

## 1. Estrutura inicial do projeto

**Responsável:** Felipe Rossano Pedrol

```
chore: estrutura inicial do projeto com Vite e React
```

**Arquivos:** `.gitignore` · `package.json` · `package-lock.json` · `vite.config.js` · `index.html`

O esqueleto: dependências (React 18 e Vite 6), scripts de `dev`, `build` e `preview`, e o HTML base.

O `vite.config.js` deixa o `base` parametrizável por variável de ambiente — é o que permite publicar na Vercel ou no GitHub Pages sem mexer no código.

---

## 2. Design system e tipografia

**Responsável:** Felipe Rossano Pedrol

```
feat: design system com tokens e tipografia Montserrat
```

**Arquivos:** `src/styles/tokens.css` · `src/styles/global.css` · `src/styles/botoes.css` · `src/styles/fonts.css` · `public/fonts/montserrat-latin.woff2` · `public/fonts/montserrat-latin-ext.woff2` · `public/favicon.svg`

Define o vocabulário visual antes de qualquer tela existir: paleta, escala tipográfica, espaçamento em múltiplos de 4px, raios, sombras e durações — tudo em CSS custom properties.

Inclui o reset global, as superfícies que o navegador desenha (seleção de texto, cursor, barra de rolagem, anel de foco) e as variantes de botão da aplicação.

A Montserrat entra como fonte variável hospedada localmente: dois arquivos `.woff2` cobrindo os pesos 400–900, sem depender do Google Fonts em produção.

> Vem logo no início porque todo componente consome esses tokens. Mudar uma cor aqui muda a aplicação inteira.

---

## 3. Catálogo em JSON com imagens

**Responsável:** Jecky Cossio

```
feat: catalogo de produtos em JSON com imagens locais
```

**Arquivos:** `public/api/produtos.json` · `public/img/produtos/produto-01.webp` · `public/img/produtos/produto-02.webp` · `public/img/produtos/produto-03.webp` · `public/img/produtos/produto-04.webp` · `public/img/produtos/produto-05.webp` · `public/img/produtos/produto-06.webp` · `public/img/produtos/produto-07.webp` · `public/img/produtos/produto-08.webp` · `public/img/produtos/produto-09.webp` · `public/img/produtos/produto-10.webp` · `public/img/produtos/produto-11.svg` · `public/img/produtos/produto-12.svg` · `public/img/produtos/produto-13.webp` · `public/img/produtos/produto-14.webp` · `public/img/produtos/produto-15.webp` · `public/img/produtos/produto-16.webp`

> **Requisito do CP04:** produtos via JSON.

16 produtos nas 4 categorias do enunciado. Cada um traz os campos obrigatórios — `id`, `nome`, `descricao`, `preco`, `categoria`, `imagem` — mais o atributo que o qualifica como sustentável.

Fica em `public/` de propósito: assim é servido como arquivo estático e o `fetch` faz uma requisição HTTP real, visível na aba Network do navegador.

As imagens também são locais (14 fotos em `.webp` e 2 ilustrações SVG autorais), para o site não aparecer quebrado se um serviço externo sair do ar.

---

## 4. Consumo da Fake API com fetch

**Responsável:** Jecky Cossio

```
feat: consumo da Fake API com fetch GET e async/await
```

**Arquivos:** `src/services/produtosService.js` · `src/utils/formatters.js` · `src/hooks/useProdutos.js`

> **Requisito do CP04:** requisição assíncrona com `fetch` (GET) e `async/await`.

A camada que fala com a API: `fetch(URL, { method: "GET" })` com `async/await`, timeout por `AbortController`, validação do payload e tradução de falhas em mensagens legíveis.

O hook traduz a requisição nos três estados que a interface precisa: carregando, erro (com função de recarregar) e a lista pronta.

> Nenhum componente chama `fetch` diretamente — toda comunicação externa passa por aqui.

---

## 5. Loading spinner e tela de erro

**Responsável:** Daniel Roberto Ribeiro de Figueiredo

```
feat: loading spinner, esqueletos e tela de erro
```

**Arquivos:** `src/components/Icones.jsx` · `src/components/EstadosDeCarga.jsx` · `src/components/EstadosDeCarga.css`

> **Requisito do CP04:** loading spinner e tratamento de erro.

O que a vitrine mostra enquanto não há produtos: spinner acompanhado de esqueletos de card — a tela nunca fica em branco, e o layout não "pula" quando os dados chegam. E a tela de erro, com ação de nova tentativa.

Traz também os 12 ícones da aplicação, desenhados em SVG com o mesmo traço, em vez de uma biblioteca externa.

---

## 6. Vitrine renderizada do JSON

**Responsável:** Daniel Roberto Ribeiro de Figueiredo

```
feat: vitrine renderizada dinamicamente a partir do JSON
```

**Arquivos:** `src/components/CardProduto.jsx` · `src/components/CardProduto.css` · `src/components/Vitrine.jsx` · `src/components/Vitrine.css`

> **Requisito do CP04:** renderização dinâmica a partir do JSON.

A grade é gerada por `.map()` sobre os dados — **nenhum produto está escrito à mão no JSX**.

A Vitrine decide o que exibir conforme o estado: carregando, erro, filtro sem resultado ou a grade de produtos. O card traz o selo de procedência, o dado de impacto, o preço, o contador de quantos já estão no carrinho e a confirmação visual ao adicionar.

---

## 7. Filtros dinâmicos

**Responsável:** Felipi Bandeira de Godoy

```
feat: filtros dinamicos sem recarregar a pagina
```

**Arquivos:** `src/hooks/useFiltros.js` · `src/components/Filtros.jsx` · `src/components/Filtros.css`

> **Requisito do CP04:** filtragem dinâmica sem recarregar a página.

Filtros por categoria, preço máximo, texto e ordenação, mais o botão de limpar — que só aparece quando existe algo a limpar.

A lista exibida é **derivada** do estado a cada renderização; não existe uma segunda lista guardada e sincronizada à mão. É isso que faz a vitrine responder na hora a qualquer mudança de filtro.

---

## 8. Carrinho com localStorage

**Responsável:** Felipi Bandeira de Godoy

```
feat: carrinho dinamico persistido em localStorage
```

**Arquivos:** `src/utils/storage.js` · `src/hooks/useCarrinho.js`

> **Requisito do CP04:** carrinho dinâmico e persistência em `localStorage`.

O estado do carrinho num reducer com **fonte única da verdade**: subtotal, frete, total e quantidade são calculados a partir dos itens, nunca guardados em paralelo. A persistência acompanha o estado automaticamente, em vez de ser uma cópia mantida a cada ação.

A camada de storage trata todos os casos ruins: chave inexistente, JSON corrompido, estrutura inesperada, itens malformados, `localStorage` indisponível (navegação privada) e cota excedida. Em qualquer falha o carrinho volta vazio e a loja continua funcionando.

---

## 9. Drawer do carrinho e checkout

**Responsável:** Leonardo Ferreira Barbosa

```
feat: drawer do carrinho e checkout com Promise
```

**Arquivos:** `src/services/checkoutService.js` · `src/components/Carrinho.jsx` · `src/components/Carrinho.css`

> **Requisito do CP04:** checkout com `Promise` / `async-await`.

As três etapas do enunciado — validação do carrinho, processamento do pedido e confirmação — cada uma sendo uma Promise própria que pode resolver ou rejeitar, orquestradas com `async/await`.

O caminho de erro é real, não decorativo: a validação rejeita carrinho vazio ou quantidade inválida, e o processamento simula falha de autorização em parte das tentativas.

O drawer lista os itens, controla quantidade, mostra os totais e apresenta as três fases do checkout: progresso, comprovante de sucesso e tela de falha. Fecha por `Esc` ou clique fora, com o foco preso no painel enquanto aberto.

---

## 10. Montagem da aplicação

**Responsável:** Leonardo Ferreira Barbosa

```
feat: montagem da aplicacao e configuracao de deploy
```

**Arquivos:** `src/components/Cabecalho.jsx` · `src/components/Cabecalho.css` · `src/components/Hero.jsx` · `src/components/Hero.css` · `src/components/Rodape.jsx` · `src/components/Rodape.css` · `src/App.jsx` · `src/main.jsx` · `vercel.json` · `README.md` · `DEPLOY.md` · `UPDATES.md`

O ponto em que as peças se encontram. Cabeçalho fixo com a marca e o botão do carrinho, abertura apresentando a proposta da loja, e rodapé com o aviso de projeto acadêmico.

O `App` consome os três hooks e distribui o estado aos componentes de apresentação — sem nenhuma regra de negócio própria.

Fecha com a configuração de build da Vercel e o README.

> É o último porque só faz sentido depois que todas as peças existem. **A aplicação roda de fato a partir daqui** — os commits anteriores constroem as partes.
