"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "../types/product";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
  sellerId: string;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product, sellerId: string) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product, sellerId: string) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);

      if (exists) {
        // only increase quantity if it does not exceed stock
        const max = product.estoque ?? exists.stock ?? 0;
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, max) }
            : item
        );
      }

      return [
        ...prev,
        {
          id: product.id,
          name: product.titulo,
          price: product.preco,
          image:
            // prefer `foto`, fall back to first `fotos` entry if available
            // some server responses use `fotos: string[]` instead of `foto`
            (product as any).foto ?? (product as any).fotos?.[0] ?? "/placeholder.png",
          quantity: 1,
          stock: product.estoque ?? 0,
          sellerId,
        },
      ];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be inside CartProvider");
  return context;
};
