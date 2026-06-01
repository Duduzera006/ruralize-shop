"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { useToast } from "../context/toastContext";
import { useFavorites } from "../context/favoritesContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { updateProfile, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../services/firebase";
import { User, Mail, Shield, Save, ShoppingCart, Heart, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const { favorites } = useFavorites();
  const { addToast } = useToast();
  const [displayName, setDisplayName] = useState("");
  const [updating, setUpdating] = useState(false);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      // Fetch order count
      const fetchOrderCount = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/comprador/${user.uid}`);
          if (res.ok) {
            const data = await res.json();
            setOrderCount(data.length);
          }
        } catch (err) {
          console.error("Erro ao buscar contagem de pedidos:", err);
        }
      };
      fetchOrderCount();
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setUpdating(true);
    try {
      await updateProfile(user, { displayName });
      addToast("Perfil atualizado com sucesso!", "success");
    } catch (error: any) {
      addToast(error.message || "Erro ao atualizar perfil", "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleResetPassword = async () => {
    if (!user?.email) return;
    try {
      await sendPasswordResetEmail(auth!, user.email);
      addToast("Email de redefinição de senha enviado com sucesso!", "success");
    } catch (error: any) {
      addToast(error.message || "Erro ao enviar email de redefinição", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-muted-foreground animate-pulse">Carregando dados do perfil...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Acesso Negado</h2>
        <p className="text-muted-foreground mb-6">Você precisa estar logado para acessar esta página.</p>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link href="/login">Fazer Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      {/* Consumer Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <Card className="border-green-100 bg-green-50/30 shadow-none">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Meus Pedidos</p>
                <h3 className="text-2xl font-bold text-green-900">{orderCount}</h3>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <ShoppingCart className="text-green-700" size={24} />
              </div>
            </div>
            <Button asChild variant="link" className="p-0 h-auto text-xs text-green-700 mt-2">
              <Link href="/pedidos">Ver histórico</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-red-100 bg-red-50/30 shadow-none">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">Favoritos</p>
                <h3 className="text-2xl font-bold text-red-900">{favorites.length}</h3>
              </div>
              <div className="bg-red-100 p-2 rounded-lg">
                <Heart className="text-red-700" size={24} />
              </div>
            </div>
            <Button asChild variant="link" className="p-0 h-auto text-xs text-red-700 mt-2">
              <Link href="/favoritos">Ver lista</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-blue-100 bg-blue-50/30 shadow-none">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Mensagens</p>
                <h3 className="text-2xl font-bold text-blue-900">Ativas</h3>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <MessageSquare className="text-blue-700" size={24} />
              </div>
            </div>
            <Button asChild variant="link" className="p-0 h-auto text-xs text-blue-700 mt-2">
              <Link href="/mensagens">Abrir chat</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar/Overview */}
        <Card className="w-full md:w-1/3 shadow-sm border-green-50">
          <CardContent className="pt-8 flex flex-col items-center">
            <Avatar className="h-24 w-24 border-2 border-green-100 mb-4">
              <AvatarFallback className="bg-green-100 text-green-700 text-3xl font-bold">
                {user.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold text-gray-800">{user.displayName || "Usuário"}</h2>
            <p className="text-sm text-muted-foreground mb-4">{user.email}</p>
            
            <div className="w-full space-y-2 mt-4 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield size={16} className="text-green-600" />
                <span>Tipo de conta: <strong>Cliente</strong></span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail size={16} className="text-green-600" />
                <span>Email verificado: <strong>{user.emailVerified ? "Sim" : "Não"}</strong></span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="flex-1 w-full space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-green-700 flex items-center gap-2">
                <User size={24} />
                Editar Perfil
              </CardTitle>
              <CardDescription>
                Mantenha suas informações de contato atualizadas para uma melhor experiência.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Nome Completo
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Seu nome completo"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium leading-none">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={user.email || ""}
                    disabled
                    className="flex h-10 w-full rounded-md border border-input bg-gray-50 px-3 py-2 text-sm cursor-not-allowed text-gray-500"
                  />
                  <p className="text-[0.8rem] text-muted-foreground">O email da conta não pode ser alterado por aqui.</p>
                </div>

                <Button 
                  type="submit" 
                  disabled={updating}
                  className="bg-green-600 hover:bg-green-700 text-white w-full md:w-auto"
                >
                  {updating ? (
                    "Salvando..."
                  ) : (
                    <>
                      <Save size={18} className="mr-2" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-red-50 bg-red-50/20">
            <CardHeader>
              <CardTitle className="text-lg text-red-700">Zona de Perigo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Caso deseje excluir sua conta ou alterar sua senha, por favor entre em contato com o suporte ou utilize as opções de recuperação de senha.
              </p>
              <Button 
                onClick={handleResetPassword}
                variant="outline" 
                className="border-red-200 text-red-700 hover:bg-red-100 hover:text-red-800"
              >
                Redefinir Senha
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
