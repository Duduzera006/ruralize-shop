"use client";

import { useProducts } from "../context/productsContext";
import { useFavorites } from "../context/favoritesContext";
import { ProductCard } from "../components/productCard";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Link from "next/link";

export default function FavoritesPage() {
  const { products } = useProducts();
  const { favorites } = useFavorites();

  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <main className="max-w-6xl mx-auto px-4 py-12 animate-reveal">
      <div className="flex flex-col sm:flex-row items-baseline justify-between gap-2 mb-10 pb-6 border-b border-gray-100">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
          <div className="bg-red-50 p-2 rounded-xl">
             <Heart size={28} className="fill-red-500 text-red-500" />
          </div>
          Meus Favoritos
        </h1>
        <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">
          {favoriteProducts.length} {favoriteProducts.length === 1 ? "item salvo" : "itens salvos"}
        </p>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="text-center py-32 bg-gray-50 rounded-3xl border border-gray-100 border-dashed">
          <div className="bg-white h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
            <Heart className="text-gray-200" size={40} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Sua lista está vazia</h3>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto font-medium">
            Gostou de algum insumo ou ferramenta? Salve-os aqui para facilitar sua próxima compra.
          </p>
          <Button asChild className="bg-green-700 hover:bg-green-800 h-11 px-8 rounded-xl font-bold transition-all shadow-lg shadow-green-900/10">
            <Link href="/">Explorar Loja</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} id={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
