"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "../context/cartContext";
import { Product } from "../types/product";

interface AddToCartProps {
  product: Product;
  sellerId: string;
}

export function AddToCartButton({ product, sellerId }: AddToCartProps) {
  const { addToCart } = useCart();

  return (
    <Button
      className="w-full mt-4"
      onClick={() => addToCart(product, sellerId)}
    >
      Adicionar ao Carrinho
    </Button>
  );
}
