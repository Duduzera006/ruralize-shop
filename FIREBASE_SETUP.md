# Configuração de Autenticação Firebase

## Pré-requisitos

1. Projeto Firebase criado em [Firebase Console](https://console.firebase.google.com/)
2. Autenticação por Email/Senha habilitada no Firebase

## Passos de Configuração

### 1. Obter Credenciais Firebase

1. Vá para [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto
3. Clique em **Configurações do Projeto** (ícone de engrenagem)
4. Na aba **Geral**, procure pela seção **Seus apps**
5. Clique em **Adicionar app** → **Web**
6. Copie as credenciais da configuração

### 2. Configurar Variáveis de Ambiente

1. Crie um arquivo `.env.local` na raiz do projeto (copie de `.env.local.example`)
2. Preencha com suas credenciais do Firebase:

```
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
NEXT_PUBLIC_API_URL=https://ruralize-api.vercel.app
```

### 3. Habilitar Autenticação por Email no Firebase

1. No Firebase Console, vá para **Autenticação** → **Método de login**
2. Habilite **Email/Senha**
3. Confirme as configurações

## Fluxo de Autenticação

### Login (`/login`)
- Usuário faz login com **email** e **senha**
- Firebase autentica o usuário
- Usuário é redirecionado para a homepage

### Registro (`/login` - aba de signup)
- Usuário preenche: **Nome**, **Email** e **Senha**
- Chama `https://ruralize-api.vercel.app/auth/signup`
- Envia: `{ email, password, displayName, role: "customer" }`
- O campo CNPJ deve ser omitido para usuários web (clientes) para evitar erros de validação.
- Após sucesso na API, Firebase cria a conta
- Usuário é redirecionado para a homepage

## Estrutura de Arquivos

```
app/
├── services/
│   └── firebase.ts              # Configuração do Firebase
├── context/
│   └── authContext.tsx          # Contexto global de autenticação
├── login/
│   └── page.tsx                 # Página de login/registro
└── layout.tsx                   # Inclui AuthProvider
```

## Uso em Componentes

### Acessar Usuário Autenticado

```tsx
"use client";

import { useAuth } from "@/app/context/authContext";

export function MyComponent() {
  const { user, loading, error } = useAuth();

  if (loading) return <p>Carregando...</p>;
  if (!user) return <p>Não autenticado</p>;

  return <p>Bem-vindo, {user.email}!</p>;
}
```

### Fazer Logout

```tsx
import { signOut } from "@/app/services/firebase";
import { auth } from "@/app/services/firebase";

const handleLogout = async () => {
  await signOut(auth);
  // Redirecionar conforme necessário
};
```

## Notas Importantes

- As variáveis `NEXT_PUBLIC_*` são públicas (acessíveis no cliente)
- O `.env.local` **não deve ser commitado** (já está em `.gitignore`)
- Use `.env.local.example` como referência
- A persistência de autenticação é automática (localStorage do navegador)

## Troubleshooting

### Erro: "useAuth must be inside AuthProvider"
- Certifique-se de que o componente está dentro de `<AuthProvider>` no layout
- Verifique se está marcado com `"use client"`

### Credenciais não funcionam
- Verifique se copiou corretamente de `Firebase Console`
- Confirme se a autenticação por Email está habilitada no Firebase
- Reinicie o servidor dev após atualizar `.env.local`

### API de signup retorna erro
- Verifique a URL: `https://ruralize-api.vercel.app/auth/signup`
- Confirme o formato do payload enviado
- Verifique logs do backend
