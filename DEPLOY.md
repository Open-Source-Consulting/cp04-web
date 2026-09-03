# Publicação — EcoTrend

A entrega acontece em duas fases:

1. **Os integrantes enviam os commits**, um de cada vez, na ordem definida em [UPDATES.md](UPDATES.md).
2. **Depois que todos enviarem**, a publicação é feita uma vez só, por uma pessoa.

Este documento cobre as duas.

---

# Fase 1 — Envio dos commits

## Antes de começar

Uma pessoa cria o repositório **vazio** no GitHub — sem README, sem `.gitignore`, sem licença. Qualquer arquivo criado por lá gera conflito no primeiro envio.

Depois, adiciona os outros quatro integrantes como colaboradores em **Settings → Collaborators**, senão eles não conseguem dar push.

Por fim, avisa a todos o endereço do repositório.

## A ordem importa

Os commits têm dependência entre si: o 4 usa o que o 3 criou, o 6 usa o que o 5 criou, e assim por diante. Por isso **cada integrante só envia depois que o anterior terminar**.

| Ordem | Integrante | Commits |
| --- | --- | --- |
| 1º | Felipe Rossano Pedrol | 1 e 2 |
| 2º | Jecky Cossio | 3 e 4 |
| 3º | Daniel Roberto Ribeiro de Figueiredo | 5 e 6 |
| 4º | Felipi Bandeira de Godoy | 7 e 8 |
| 5º | Leonardo Ferreira Barbosa | 9 e 10 |

> Combinem por mensagem: quem termina avisa o próximo. Se dois enviarem ao mesmo tempo, o segundo toma erro de push e vai precisar dar `git pull` antes.

## Roteiro de cada integrante

Cada um recebe a pasta do projeto e faz os **seus dois commits**. Os arquivos de cada commit estão listados em [UPDATES.md](UPDATES.md).

### Se você é o primeiro (Felipe)

```bash
# dentro da pasta do projeto
git init
git config user.name "Seu Nome"
git config user.email "seu@email.com"
git remote add origin https://github.com/USUARIO/cp04-web.git
git branch -M main
```

Depois faça os dois commits e envie:

```bash
# commit 1
git add .gitignore package.json package-lock.json vite.config.js index.html
git commit -m "chore: estrutura inicial do projeto com Vite e React"

# commit 2
git add src/styles public/fonts public/favicon.svg
git commit -m "feat: design system com tokens e tipografia Montserrat"

git push -u origin main
```

### Se você é do 2º ao 5º

Comece clonando o que já foi enviado — não use a pasta que recebeu por WhatsApp ou pen drive, senão o histórico não bate:

```bash
git clone https://github.com/USUARIO/cp04-web.git
cd cp04-web
git config user.name "Seu Nome"
git config user.email "seu@email.com"
```

Copie para dentro dessa pasta **apenas os arquivos dos seus dois commits** (a lista está em [UPDATES.md](UPDATES.md)), depois:

```bash
# seu primeiro commit
git add <arquivos do commit>
git commit -m "<mensagem do commit>"

# seu segundo commit
git add <arquivos do commit>
git commit -m "<mensagem do commit>"

git push
```

### Comandos por integrante

**Jecky Cossio — commits 3 e 4**

```bash
git add public/api public/img
git commit -m "feat: catalogo de produtos em JSON com imagens locais"

git add src/services/produtosService.js src/utils/formatters.js src/hooks/useProdutos.js
git commit -m "feat: consumo da Fake API com fetch GET e async/await"

git push
```

**Daniel Roberto Ribeiro de Figueiredo — commits 5 e 6**

```bash
git add src/components/Icones.jsx src/components/EstadosDeCarga.jsx src/components/EstadosDeCarga.css
git commit -m "feat: loading spinner, esqueletos e tela de erro"

git add src/components/CardProduto.jsx src/components/CardProduto.css src/components/Vitrine.jsx src/components/Vitrine.css
git commit -m "feat: vitrine renderizada dinamicamente a partir do JSON"

git push
```

**Felipi Bandeira de Godoy — commits 7 e 8**

```bash
git add src/hooks/useFiltros.js src/components/Filtros.jsx src/components/Filtros.css
git commit -m "feat: filtros dinamicos sem recarregar a pagina"

git add src/utils/storage.js src/hooks/useCarrinho.js
git commit -m "feat: carrinho dinamico persistido em localStorage"

git push
```

**Leonardo Ferreira Barbosa — commits 9 e 10**

```bash
git add src/services/checkoutService.js src/components/Carrinho.jsx src/components/Carrinho.css
git commit -m "feat: drawer do carrinho e checkout com Promise"

git add src/components/Cabecalho.jsx src/components/Cabecalho.css \
        src/components/Hero.jsx src/components/Hero.css \
        src/components/Rodape.jsx src/components/Rodape.css \
        src/App.jsx src/main.jsx vercel.json \
        README.md UPDATES.md DEPLOY.md
git commit -m "feat: montagem da aplicacao e configuracao de deploy"

git push
```

## Antes de passar a vez

Confira se o push funcionou: abra o repositório no GitHub e veja se seus dois commits aparecem. Depois avise o próximo da fila.

> **A aplicação só roda depois do commit 10.** Antes disso, `npm run dev` vai dar erro de importação — é esperado, porque as peças ainda não estão todas no lugar. Não é motivo para se preocupar nem para tentar consertar.

---

# Fase 2 — Publicação

**Só comece depois que os 10 commits estiverem no GitHub.**

Esta parte é feita uma vez, por uma pessoa só.

## 1. Baixar a versão final

```bash
git clone https://github.com/USUARIO/cp04-web.git
cd cp04-web
npm install
```

## 2. Testar localmente antes de publicar

```bash
npm run dev
```

Abra `http://localhost:5173` e confira:

- [ ] Os 16 produtos aparecem, com as imagens
- [ ] Os filtros de categoria e preço funcionam
- [ ] Dá para adicionar ao carrinho e alterar a quantidade
- [ ] Recarregando a página, o carrinho continua lá
- [ ] O botão de finalizar compra roda as três etapas
- [ ] Abre bem no celular

Se algo falhar aqui, é melhor resolver antes de publicar.

## 3. Publicar na Vercel

O projeto já vem configurado para ela, sem ajuste de caminho.

### Pela interface (recomendado)

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Importe o repositório
3. A Vercel detecta o Vite sozinho e usa o `vercel.json` do projeto
4. Clique em **Deploy**

### Pelo terminal

```bash
npm i -g vercel
vercel --prod
```

A partir daí, todo `git push` republica sozinho.

## 4. Alternativa: GitHub Pages

O GitHub Pages serve o site num subcaminho (`usuario.github.io/cp04-web/`), então o `base` precisa ser o nome do repositório:

```bash
BASE_PATH="/cp04-web/" npm run build
npx gh-pages -d dist
```

Depois, em **Settings → Pages**, aponte a origem para a branch `gh-pages`.

> Se o repositório tiver outro nome, troque o valor de `BASE_PATH` — senão os arquivos não são encontrados e a página abre em branco.

## 5. Conferir o site publicado

Abra o link gerado e repita a checklist do passo 2. O erro mais comum no GitHub Pages é imagem não carregando, quase sempre por `BASE_PATH` errado.

## 6. Entregar

Enviar no Teams:

- **Link da página publicada**
- **Link do repositório**

O vídeo no LinkedIn é opcional e não vale nota.

---

## Se algo der errado

**"Updates were rejected"** no push — alguém enviou antes de você. Resolva com:

```bash
git pull --rebase
git push
```

**Commit no nome errado** — o `git config user.name` não foi ajustado antes de commitar. Se ainda não deu push:

```bash
git commit --amend --author="Nome Correto <email@correto.com>" --no-edit
```

**Enviou arquivo que não era do seu commit** — desfaça mantendo os arquivos e refaça o `git add` só com os certos:

```bash
git reset --soft HEAD~1
```

## Comandos úteis

```bash
npm install      # instalar dependências
npm run dev      # rodar localmente (localhost:5173)
npm run build    # gerar a versão de produção em dist/
npm run preview  # conferir o build antes de publicar
```
