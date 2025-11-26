/**
 * Traduz erros do Firebase em mensagens amigáveis para o usuário
 */
export function formatFirebaseError(error: unknown): string {
  if (!(error instanceof Error)) {
    return "Ocorreu um erro inesperado. Tente novamente.";
  }

  const message = error.message.toLowerCase();

  // Erros de autenticação
  if (message.includes("auth/user-not-found")) {
    return "Email não encontrado. Verifique o email ou crie uma nova conta.";
  }

  if (message.includes("auth/wrong-password")) {
    return "Senha incorreta. Tente novamente.";
  }

  if (message.includes("auth/invalid-credential")) {
    return "Credenciais inválidas. Verifique o formato e tente novamente.";
  }

  if (message.includes("auth/email-already-in-use")) {
    return "Este email já está registrado. Faça login ou use outro email.";
  }

  if (message.includes("auth/weak-password")) {
    return "Senha muito fraca. Use no mínimo 6 caracteres.";
  }

  if (message.includes("auth/operation-not-allowed")) {
    return "Operação não permitida. Tente novamente mais tarde.";
  }

  if (message.includes("auth/too-many-requests")) {
    return "Muitas tentativas de login. Tente novamente em alguns minutos.";
  }

  if (message.includes("auth/user-disabled")) {
    return "Esta conta foi desativada. Entre em contato com o suporte.";
  }

  if (message.includes("auth/invalid-api-key")) {
    return "Erro na configuração do Firebase. Entre em contato com o suporte.";
  }

  if (message.includes("auth/network-request-failed")) {
    return "Erro de conexão. Verifique sua internet e tente novamente.";
  }

  // Erros da API
  if (message.includes("api error") || message.includes("fetch")) {
    return "Erro ao conectar com o servidor. Tente novamente em alguns instantes.";
  }

  // Erro genérico
  return error.message || "Ocorreu um erro inesperado. Tente novamente.";
}
