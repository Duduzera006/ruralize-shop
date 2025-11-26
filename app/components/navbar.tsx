"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Menu, LogOut } from "lucide-react";
import { useAuth } from "../context/authContext";
import { useToast } from "../context/toastContext";
import { formatFirebaseError } from "../utils/errorHandler";
import { signOut, auth } from "../services/firebase";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, loading } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      if (!auth) throw new Error("Firebase não inicializado");
      await signOut(auth);
      addToast("Você foi desconectado com sucesso", "info");
      router.push("/");
    } catch (error) {
      const message = formatFirebaseError(error);
      addToast(message, "error");
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <header className="w-full bg-white border-b">
      <nav className="max-w-6xl mx-auto h-16 flex items-center justify-between px-4">
       
        <Link href="/" className="text-2xl font-bold text-green-700">
          Ruralize<span className="text-green-500">Shop</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/" className="hover:text-green-600 transition">
            Home
          </Link>
          <Link href="/carrinho" className="hover:text-green-600 transition">
            Carrinho
          </Link>

          {!loading && !user ? (
            <Button
              asChild
              variant="outline"
              className="border-green-600 text-green-700 hover:bg-green-50"
            >
              <Link href="/login">Entrar</Link>
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700">{user?.email}</span>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-red-600 text-red-700 hover:bg-red-50"
              >
                <LogOut size={16} className="mr-1" />
                Sair
              </Button>
            </div>
          )}
        </div>

        <Sheet>
          <SheetTrigger className="md:hidden">
            <Menu size={26} />
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col gap-4 mt-8 text-lg">
              <Link href="/">Home</Link>
              <Separator />

              <Link href="/categorias">Categorias</Link>
              <Separator />

              <Link href="/carrinho">Carrinho</Link>
              <Separator />

              {!loading && !user ? (
                <Button asChild className="mt-4" variant="outline">
                  <Link href="/login">Entrar</Link>
                </Button>
              ) : (
                <div className="flex flex-col gap-3 mt-4">
                  <p className="text-sm text-gray-700">Conectado: {user?.email}</p>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="border-red-600 text-red-700 hover:bg-red-50"
                  >
                    <LogOut size={16} className="mr-1" />
                    Sair
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
