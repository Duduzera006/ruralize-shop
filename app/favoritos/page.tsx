"use client";

import { useProducts } from "../context/productsContext";
import { useFavorites } from "../context/favoritesContext";
import { ProductCard } from "../components/productCard";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function FavoritesPage() {
  const { products } = useProducts();
  const { favorites } = useFavorites();

  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-green-800 flex items-center gap-2">
          <Heart size={28} className="fill-green-800" />
          Meus Favoritos
        </h1>
        <p className="text-gray-500 font-medium">
          {favoriteProducts.length} {favoriteProducts.length === 1 ? "item salvo" : "itens salvos"}
        </p>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="text-center py-24 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <div className="bg-white h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Heart className="text-gray-300" size={40} />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">Sua lista de favoritos está vazia</h3>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
            Gostou de algum produto? Toque no coração para salvá-lo aqui e encontrá-lo mais tarde.
          </p>
          <Button asChild className="bg-green-600 hover:bg-green-700 h-12 px-8">
            <Link href="/">Explorar Produtos</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} id={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
