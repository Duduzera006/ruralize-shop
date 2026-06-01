# RuralizeSeller - Contexto do Projeto

Este documento fornece uma visão detalhada do aplicativo mobile **RuralizeSeller**, parte do ecossistema Ruralize (junto com RuralizeShop e ruralize_api). Ele serve como referência para desenvolvedores e agentes de IA entenderem a arquitetura, funcionalidades e integrações do app.

---

## 🚀 Visão Geral

O **RuralizeSeller** é um aplicativo Android desenvolvido para produtores rurais (vendedores) gerenciarem seus produtos, estoques, vendas e entregas de forma simplificada.

## 🛠 Stack Tecnológica
- **Linguagem Principal:** Java (com componentes em Kotlin).
- **Interface:** XML Layouts tradicional + Custom Views para Gráficos.
- **Autenticação:** Firebase Auth.
- **Networking:** Retrofit para chamadas REST à API customizada.
- **Persistência de Imagens:** Cloudinary (via API) + Glide para carregamento.
- **Serialização:** GSON.

## 🏗 Arquitetura
O app segue um padrão baseado em **Activities**, com uma `BaseDrawerActivity` que centraliza a navegação lateral (Navigation Drawer).

### Componentes Chave:
- `Activity.java`: Tela de login e ponto de entrada.
- `DashboardActivity.java`: Visão geral do negócio com gráficos de vendas e pedidos.
- `GerenciarProdutosActivity.java` & `NovoProdutoActivity.java`: CRUD completo de produtos.
- `EstoqueActivity.java`: Gerenciamento focado em níveis de estoque.
- `VendasActivity.java`: Histórico e resumo de transações (RF13).
- `EntregasActivity.java`: Gestão logística e atualização de status (RF14).
- `ChatActivity.java`: Interface de chat em tempo real com clientes (RF16).

### network/RetrofitClient.java & network/services/: Centraliza a comunicação com a API via Retrofit.

---

## 🔌 Integração com Notificações Push (RF18)
O app deve utilizar o Firebase Cloud Messaging (FCM). 
1. Ao fazer login ou atualizar o token, o app deve chamar `PATCH /auth/fcm-token` enviando o token do dispositivo.
2. O app deve estar preparado para receber notificações de "Nova Venda" mesmo em background.

---

## 🔌 Integração com API (ruralize_api)
O app se comunica com o backend hospedado em `https://ruralize-api.vercel.app`.
A documentação completa dos endpoints (Swagger) pode ser acessada em: `https://ruralize-api.vercel.app/api`.

### Principais Endpoints Consumidos:
- **Auth:** `/auth/signup`, `/auth/update`, `/auth/updatePassword`.
- **Produtos:** `/products/empresa/{uid}` (GET/POST/PUT/DELETE).
- **Vendas:** `/orders/totalVendas/{uid}`.
- **Entregas:** `/deliveries/{uid}`.

### Fluxo de Dados:
1. O usuário se autentica via Firebase.
2. O `uid` do Firebase é usado como identificador único nas chamadas para a `ruralize_api` via interfaces Retrofit.
3. As imagens são enviadas para a API, que processa o upload para o **Cloudinary** (não utilizamos Firebase Storage para imagens devido a custos).


---

## 📦 Modelos de Dados (Entidades)

- **Produto:** `id`, `titulo`, `descricao`, `preco`, `estoque`, `categoria`, `fotosUrls`.
- **Venda:** `id`, `cliente`, `valorTotal`, `data`, `status`, `metodoPagamento`, `enderecoEntrega`.
- **Entrega:** `id`, `endereco`, `prazo`, `status`, `compradorNome`.

## 🎨 Elementos Visuais e Temas

- **Temas:** Localizados em `res/values/themes.xml`. Utiliza Material Components.
- **Gráficos:** Implementados via `MiniBarChartView` e `MiniLineChartView` (Custom Views desenhadas em Canvas).
- **Cores:** Paleta focada em verde/rural (definida em `colors.xml`).

---

## 🚩 Pendências e Pontos de Atenção

- **Sincronização:** Garantir que as atualizações de estoque no app mobile reflitam instantaneamente no `RuralizeShop`.
- **Jetpack Compose:** Existe configuração para Compose, mas a interface atual é majoritariamente XML. Futuras features podem adotar Compose.

---

## 📌 TO-DO / Próximos Passos (App Mobile)
- [x] **Migração Retrofit:** Refatorar as chamadas OkHttp/JSONObject para interfaces Retrofit.
- [x] **Integração de Entregas:** Atualizar a `EntregasActivity` (ou criar `DeliveriesFragment`) assim que a API suportar `/deliveries`. (API Concluída)
- [x] **Central de Notificações:** Implementar a tela que abre ao clicar no ícone de "Sininho". (API Concluída com suporte a gatilhos de estoque e vendas)
- [ ] **Variações de Produtos:** Adicionar campos para tamanho/peso no formulário de `NovoProdutoActivity`.
- [x] **Charts Modernos:** Atualizar `MiniBarChartView` e `MiniLineChartView` para o estilo Agro-Modern.

---

Este arquivo deve ser mantido atualizado sempre que houver mudanças estruturais na comunicação com a API ou no modelo de dados do vendedor.
