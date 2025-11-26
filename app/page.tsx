"use client";

import { ProductCard } from "./components/productCard";
import { useProducts } from "@/app/context/productsContext";

export default function Home() {
  const { products } = useProducts();

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.length === 0 ? (
        <p className="text-center col-span-full">Carregando produtos...</p>
      ) : (
        products.map((product) => (
          <ProductCard key={product.id} id={product.id} product={product} />
        ))
      )}
    </main>
  );
}
