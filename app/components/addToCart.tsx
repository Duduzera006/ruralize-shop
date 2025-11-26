"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "../context/cartContext";
import { Product } from "../types/product";
import { useEffect, useState } from "react";
import { useProducts } from "@/app/context/productsContext";

interface AddToCartProps {
  product: Product;
  sellerId: string;
}

export function AddToCartButton({ product, sellerId }: AddToCartProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  // prefer realtime product if available
  let realtimeProduct = undefined;
  try {
    const ctx = useProducts();
    realtimeProduct = ctx.getById(product.id);
  } catch (e) {
    realtimeProduct = undefined;
  }

  const currentStock = realtimeProduct?.estoque ?? product.estoque ?? 0;
  const outOfStock = currentStock <= 0;

  const handleAdd = () => {
    try {
      if (outOfStock) return;
      addToCart(product as Product, sellerId);
      setAdded(true);
    } catch (e) {
      // swallow — useCart should be available; could add logging
      console.error("Erro ao adicionar ao carrinho:", e);
    }
  };

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1500);
    return () => clearTimeout(t);
  }, [added]);

  return (
    <Button
      className={`w-full mt-4 ${added ? "bg-green-700 text-white" : ""}`}
      onClick={handleAdd}
      disabled={added || outOfStock}
      aria-pressed={added}
    >
      {outOfStock ? "Esgotado" : added ? "Adicionado ✓" : "Adicionar ao Carrinho"}
    </Button>
  );
}
