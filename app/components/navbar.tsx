"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Menu, LogOut, User as UserIcon, ShoppingBag, Heart, MessageCircle, ShoppingCart } from "lucide-react";
import { useAuth } from "../context/authContext";
import { useToast } from "../context/toastContext";
import { useCart } from "../context/cartContext";
import { formatFirebaseError } from "../utils/errorHandler";
import { signOut, auth } from "../services/firebase";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Navbar() {
  const { user, loading } = useAuth();
  const { cart } = useCart();
  const { addToast } = useToast();
  const router = useRouter();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

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
    <header className="w-full bg-white border-b sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto h-16 flex items-center justify-between px-4">
       
        <Link href="/" className="text-2xl font-bold text-green-700">
          Ruralize<span className="text-green-500">Shop</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-green-600 transition">
            Home
          </Link>
          <Link href="/favoritos" className="hover:text-green-600 transition flex items-center gap-1">
            Favoritos
          </Link>
          <Link href="/mensagens" className="hover:text-green-600 transition flex items-center gap-1">
            Mensagens
          </Link>
          <Link href="/carrinho" className="hover:text-green-600 transition flex items-center gap-1 relative">
            <ShoppingCart size={18} />
            Carrinho
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-bold h-4 min-w-[16px] flex items-center justify-center rounded-full px-1">
                {cartCount}
              </span>
            )}
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border border-green-100">
                    <AvatarFallback className="bg-green-100 text-green-700">
                      {user?.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Minha Conta</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/perfil" className="cursor-pointer w-full flex items-center">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Meu Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/favoritos" className="cursor-pointer w-full flex items-center">
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Meus Favoritos</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/mensagens" className="cursor-pointer w-full flex items-center">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    <span>Mensagens</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/pedidos" className="cursor-pointer w-full flex items-center">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    <span>Meus Pedidos</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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

              <Link href="/favoritos">Favoritos</Link>
              <Separator />

              <Link href="/mensagens">Mensagens</Link>
              <Separator />

              <Link href="/carrinho" className="flex items-center justify-between">
                Carrinho
                {cartCount > 0 && (
                  <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {cartCount} itens
                  </span>
                )}
              </Link>
              <Separator />

              {!loading && !user ? (
                <Button asChild className="mt-4" variant="outline">
                  <Link href="/login">Entrar</Link>
                </Button>
              ) : (
                <div className="flex flex-col gap-3 mt-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-10 w-10 border border-green-100">
                      <AvatarFallback className="bg-green-100 text-green-700">
                        {user?.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user?.email}</span>
                      <span className="text-xs text-muted-foreground italic">Cliente</span>
                    </div>
                  </div>
                  <Link href="/perfil" className="text-sm hover:text-green-600 py-1 flex items-center">
                    <UserIcon size={18} className="mr-2" /> Meu Perfil
                  </Link>
                  <Link href="/favoritos" className="text-sm hover:text-green-600 py-1 flex items-center">
                    <Heart size={18} className="mr-2" /> Meus Favoritos
                  </Link>
                  <Link href="/mensagens" className="text-sm hover:text-green-600 py-1 flex items-center">
                    <MessageCircle size={18} className="mr-2" /> Mensagens
                  </Link>
                  <Link href="/pedidos" className="text-sm hover:text-green-600 py-1 flex items-center">
                    <ShoppingBag size={18} className="mr-2" /> Meus Pedidos
                  </Link>
                  <Separator />
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="border-red-600 text-red-700 hover:bg-red-50 mt-2"
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
