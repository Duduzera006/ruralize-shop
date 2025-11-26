"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  auth,
} from "@/app/services/firebase";
import { useToast } from "@/app/context/toastContext";
import { formatFirebaseError } from "@/app/utils/errorHandler";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { addToast } = useToast();

  const saveUserToFirestore = async (
    email: string,
    password: string,
    displayName: string,
    uid: string
  ) => {
    try {
      const response = await fetch(
        "https://ruralize-api.vercel.app/auth/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            displayName,
            uid,
            cnpj: null,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.message || `Erro do servidor: ${response.status}`
        );
      }

      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao salvar dados do usuário";
      console.error("Erro ao salvar no Firestore:", message);
      throw new Error(message);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!auth) throw new Error("Firebase não inicializado");
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      addToast(`Login bem-sucedido! Bem-vindo ${userCredential.user.email}`, "success");
      setTimeout(() => router.push("/"), 1500);
    } catch (err) {
      const message = formatFirebaseError(err);
      addToast(message, "error");
      console.error("Erro no login:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!auth) throw new Error("Firebase não inicializado");

      // Step 1: Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Step 2: Save user data to Firestore via API
      await saveUserToFirestore(
        email,
        password,
        displayName,
        userCredential.user.uid
      );

      addToast(
        `Cadastro bem-sucedido! Bem-vindo ${userCredential.user.email}`,
        "success"
      );
      setTimeout(() => router.push("/"), 1500);
    } catch (err) {
      const message = formatFirebaseError(err);
      addToast(message, "error");
      console.error("Erro no registro:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-green-100 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-center mb-2 text-green-700">
            Ruralize Shop
          </h1>
          <p className="text-center text-gray-600 mb-6">
            {isSignUp ? "Crie sua conta" : "Faça seu login"}
          </p>

          <form
            onSubmit={isSignUp ? handleSignUp : handleSignIn}
            className="space-y-4"
          >
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="Seu nome"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={loading}
            >
              {loading
                ? "Processando..."
                : isSignUp
                  ? "Criar Conta"
                  : "Fazer Login"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            {isSignUp ? (
              <>
                Já tem uma conta?{" "}
                <button
                  onClick={() => setIsSignUp(false)}
                  className="text-green-600 hover:underline font-medium"
                >
                  Faça login
                </button>
              </>
            ) : (
              <>
                Não tem uma conta?{" "}
                <button
                  onClick={() => setIsSignUp(true)}
                  className="text-green-600 hover:underline font-medium"
                >
                  Se cadastre
                </button>
              </>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <Link
              href="/"
              className="block text-center text-sm text-gray-600 hover:text-green-600"
            >
              Voltar para início
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
