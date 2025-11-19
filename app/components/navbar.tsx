"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Menu } from "lucide-react";

export default function Navbar() {
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
          <Link href="/categorias" className="hover:text-green-600 transition">
            Categorias
          </Link>
          <Link href="/carrinho" className="hover:text-green-600 transition">
            Carrinho
          </Link>

          <Button
            asChild
            variant="outline"
            className="border-green-600 text-green-700 hover:bg-green-50"
          >
            <Link href="/login">Entrar</Link>
          </Button>
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

              <Button asChild className="mt-4" variant="outline">
                <Link href="/login">Entrar</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
