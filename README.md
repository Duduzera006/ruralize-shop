# Ruralize Shop — README

Projeto: marketplace Next.js (App Router) em TypeScript focado em produtos rurais.

Este README documenta como configurar, rodar e entender rapidamente a arquitetura do projeto — ideal para avaliação da organização do repositório.

----

## Estrutura principal

- `app/` — App Router (páginas, layouts e componentes do lado do servidor/cliente).
  - `app/page.tsx` — página inicial (lista de produtos).
  - `app/produto/[empresaId]/[id]/page.tsx` — detalhe do produto.
  - `app/carrinho/page.tsx` — página do carrinho e checkout.
  - `app/sobre`, `app/politica`, `app/contato` — páginas estáticas adicionadas.
- `app/components/` — componentes reutilizáveis (cartões, botões, navbar, etc.).
- `app/context/` — providers e hooks: `cartContext`, `authContext`, `productsContext`, `toastContext`.
- `app/services/` — inicialização do Firebase (`firebase.ts`) e integrações.
- `app/types/` — tipos TypeScript (ex.: `product.ts`).
- `public/` — imagens estáticas, favicon e ícones gerados.
- `scripts/` — utilitários (ex.: `generate-favicons.js`).

----

## Requisitos

- Node.js 18+ recomendável
- npm (ou pnpm/yarn)

----

## Variáveis de ambiente

Crie um arquivo `.env.local` na raiz com ao menos:

```
NEXT_PUBLIC_API_URL=https://seu-backend.exemplo
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

OBS: se você não usar Firebase em produção, o app faz fallback para a API REST para listar produtos.

----

## Scripts úteis

- `npm run dev` — roda em modo desenvolvimento (http://localhost:3000)
- `npm run build` — build de produção
- `npm start` — roda build em produção
- `npm run lint` — executa ESLint
- `npm run generate:favicons` — gera ícones a partir de `public/ic_default_logo3.png` (requer dependências dev `sharp` e `png-to-ico`)

----

## Fluxo principal e decisões de arquitetura

- Server/Client: usa Next.js App Router; páginas que precisam de interatividade são "use client".
- Cart: `CartProvider` gerencia estado do carrinho em client components.
- Produtos: provider em polling (ETag + intervalo de 10s) para manter compatibilidade com APIs REST e evitar que regras do Firestore bloqueiem a aplicação. Pode-se alternar para Firestore `onSnapshot` ou SSE/Socket conforme necessidade.
- Autenticação: Firebase Auth (cliente) com `AuthProvider` (opcional para rotas protegidas). Signup cria usuário no Firebase e chama API externa para persistir perfil.
- Checkout: `app/carrinho/page.tsx` constrói payloads compatíveis com DTOs do backend e faz POST para `${NEXT_PUBLIC_API_URL}/orders`.

----

## Como testar rapidamente

1. Instale dependências:

```cmd
npm install
```

2. Rodar em dev:

```cmd
npm run dev
```

3. Abra `http://localhost:3000` e verifique:
- Lista de produtos, detalhes, adicionar ao carrinho.
- Páginas estáticas: `/sobre`, `/politica`, `/contato`.

4. Para validar ícones (favicon):

```cmd
npm run generate:favicons
```

----

## Pontos importantes para avaliação do repositório

- Organização clara de responsabilidades (`app/`, `components/`, `context/`, `services/`, `public/`, `scripts/`).
- Convenções TS + Next.js (tipagem em `app/types`, separação server/client).
- Scripts e utilitários úteis (gerar favicons, lint, build).
- Documentação: este README, comentários nos componentes, e páginas estáticas.

Para a avaliação, procure por:
- clareza na arquitetura e como executar o projeto;
- presença de scripts úteis (`generate:favicons`, `dev`, `build`);
- separação entre lógica de UI e lógica de negócio;
- tipagem TypeScript e uso de providers para estado global.

----

## Contribuição / Contato

Sinta-se à vontade para abrir issues ou pull requests. Para dúvidas rápidas, use `suporte@ruralize.com` (placeholder no projeto).

----

## Licença

Este repositório é fornecido sem licença explícita (adicione uma `LICENSE` se desejar). Comentários/alterações para avaliação podem ser feitas em branches separadas.

----

Se quiser que eu adicione um checklist de avaliação no README (itens que o avaliador deve conferir), eu adiciono em seguida.