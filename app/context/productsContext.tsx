"use client";

import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { Product } from "@/app/types/product";

type ProductsContextType = {
  products: Product[];
  getById: (id: string) => Product | undefined;
};

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const etagRef = useRef<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      try {
        const headers: Record<string, string> = {};
        if (etagRef.current) headers["If-None-Match"] = etagRef.current;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
          headers,
          cache: "no-store",
        });

        if (res.status === 304) return;

        if (!res.ok) {
          console.error("Failed to fetch products", res.status);
          return;
        }

        const json = await res.json();
        if (!mounted) return;

        setProducts(Array.isArray(json) ? json : []);
        const newEtag = res.headers.get("ETag");
        if (newEtag) etagRef.current = newEtag;
      } catch (err) {
        console.error("Error fetching products poll:", err);
      }
    };

    // initial fetch
    fetchProducts();

    // poll every 10s
    intervalRef.current = window.setInterval(fetchProducts, 10000);

    return () => {
      mounted = false;
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  const getById = (id: string) => products.find((p) => p.id === id);

  return (
    <ProductsContext.Provider value={{ products, getById }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used inside ProductsProvider");
  return ctx;
};

export default ProductsProvider;
