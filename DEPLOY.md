# Publicação — EcoTrend

Este documento descreve como testar e publicar a versão final da aplicação.

## 1. Preparar o projeto

```bash
npm install
```

## 2. Testar localmente

```bash
npm run dev
```

Abra `http://localhost:5173` e confira:

- [ ] Os 16 produtos aparecem, com as imagens
- [ ] Os filtros de categoria e preço funcionam
- [ ] É possível adicionar produtos ao carrinho e alterar a quantidade
- [ ] O carrinho permanece após recarregar a página
- [ ] O botão de finalizar compra executa as três etapas
- [ ] A aplicação funciona corretamente no celular

Também valide o build de produção:

```bash
npm run build
npm run preview
```

## 3. Publicar na Vercel

O projeto já está configurado para a Vercel.

### Pela interface

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Importe o repositório
3. Confirme que a Vercel detectou o Vite e o arquivo `vercel.json`
4. Clique em **Deploy**

### Pelo terminal

```bash
npm i -g vercel
vercel --prod
```

## 4. Alternativa: GitHub Pages

O GitHub Pages serve o site em um subcaminho. Informe o nome do repositório em
`BASE_PATH`:

```bash
BASE_PATH="/cp04-web/" npm run build
npx gh-pages -d dist
```

Depois, em **Settings → Pages**, selecione a branch `gh-pages`.

Se o repositório tiver outro nome, ajuste o valor de `BASE_PATH` para evitar
erros no carregamento dos arquivos.

## 5. Conferir o site publicado

Abra o endereço gerado e repita a checklist do passo 2.

## Comandos úteis

```bash
npm install
npm run dev
npm run build
npm run preview
```
