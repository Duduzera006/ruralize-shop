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
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
      <nav className="max-w-6xl mx-auto h-16 flex items-center justify-between px-4">
       
        <Link href="/" className="flex items-center gap-1 group">
          <span className="text-xl font-extrabold text-green-800 tracking-tight">Ruralize</span>
          <span className="text-xl font-light text-gray-400 tracking-tight">Shop</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-[14px] font-semibold text-gray-500">
          <Link href="/" className="hover:text-green-700 transition-colors">Home</Link>
          <Link href="/favoritos" className="hover:text-green-700 transition-colors flex items-center gap-1.5">
            <Heart size={16} /> Favoritos
          </Link>
          <Link href="/mensagens" className="hover:text-green-700 transition-colors flex items-center gap-1.5">
            <MessageCircle size={16} /> Mensagens
          </Link>
          
          <Link href="/carrinho" className="hover:text-green-700 transition-colors flex items-center gap-2 relative">
            <ShoppingCart size={20} className="text-gray-400 group-hover:text-green-700 transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-600 text-white text-[10px] font-bold h-4 min-w-[16px] flex items-center justify-center rounded-full px-1">
                {cartCount}
              </span>
            )}
          </Link>

          {!loading && !user ? (
            <Button
              asChild
              className="bg-green-700 hover:bg-green-800 text-white rounded-lg px-5 h-9"
            >
              <Link href="/login">Entrar</Link>
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                  <Avatar className="h-8 w-8 border border-gray-200">
                    <AvatarFallback className="bg-gray-100 text-gray-600 font-bold text-xs uppercase">
                      {user?.email?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 rounded-xl p-1 shadow-lg border-gray-100" align="end">
                <DropdownMenuLabel className="font-normal px-2 py-2">
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Minha Conta</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                  <Link href="/perfil" className="flex items-center">
                    <UserIcon className="mr-2 h-4 w-4 text-gray-400" />
                    <span>Meu Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                  <Link href="/pedidos" className="flex items-center">
                    <ShoppingBag className="mr-2 h-4 w-4 text-gray-400" />
                    <span>Meus Pedidos</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="rounded-lg text-red-600 focus:text-red-600 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <Link href="/carrinho" className="relative">
            <ShoppingCart size={24} className="text-gray-500" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-600 text-white text-[10px] font-bold h-4 min-w-[16px] flex items-center justify-center rounded-full px-1">
                {cartCount}
              </span>
            )}
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <button className="text-gray-700">
                <Menu size={28} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <div className="flex flex-col gap-6 mt-8">
                <Link href="/" className="text-xl font-bold text-green-800">Home</Link>
                <Link href="/favoritos" className="text-gray-600 font-medium flex items-center gap-3">
                   <Heart size={20} /> Favoritos
                </Link>
                <Link href="/mensagens" className="text-gray-600 font-medium flex items-center gap-3">
                   <MessageCircle size={20} /> Mensagens
                </Link>
                
                <Separator />

                {!loading && !user ? (
                  <Button asChild className="bg-green-700 hover:bg-green-800 rounded-lg h-11">
                    <Link href="/login">Entrar</Link>
                  </Button>
                ) : (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gray-100 text-gray-600">
                          {user?.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-gray-900 truncate">{user?.email}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Cliente</span>
                      </div>
                    </div>
                    <Link href="/perfil" className="text-gray-600 font-medium flex items-center gap-3 py-1">
                      <UserIcon size={18} /> Meu Perfil
                    </Link>
                    <Link href="/pedidos" className="text-gray-600 font-medium flex items-center gap-3 py-1">
                      <ShoppingBag size={18} /> Meus Pedidos
                    </Link>
                    <Separator />
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="border-red-100 text-red-600 hover:bg-red-50 mt-2 rounded-lg"
                    >
                      <LogOut size={18} className="mr-2" />
                      Sair
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
