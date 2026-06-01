"use client";

import { useCart } from "../context/cartContext";
import { useAuth } from "../context/authContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Store, X } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [storeNames, setStoreNames] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/stores`);
        if (res.ok) {
          const stores = await res.json();
          const mapping: Record<string, string> = {};
          stores.forEach((s: any) => mapping[s.uid || s.id] = s.displayName);
          setStoreNames(mapping);
        }
      } catch (err) {}
    };
    fetchStores();
  }, []);

  const visibleItems = cart.filter((item) => item.stock > 0);
  
  const groupedItems = useMemo(() => {
    const groups: Record<string, typeof cart> = {};
    visibleItems.forEach((item) => {
      const sellerId = item.sellerId || "unknown";
      if (!groups[sellerId]) groups[sellerId] = [];
      groups[sellerId].push(item);
    });
    return groups;
  }, [visibleItems]);

  const total = visibleItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 mb-20">
      <h1 className="text-3xl font-bold mb-8">Seu Carrinho</h1>

      {visibleItems.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed">
          <p className="text-muted-foreground text-lg mb-4">Seu carrinho está vazio 🛒</p>
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link href="/">Voltar para a Loja</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(groupedItems).map(([sellerId, items]) => (
            <div key={sellerId} className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Store className="text-green-600" size={20} />
                <h2 className="font-bold text-gray-700">
                  Produtos de: <span className="text-green-700">{storeNames[sellerId] || `Loja ${sellerId.slice(0, 5)}...`}</span>
                </h2>
              </div>
              
              <div className="space-y-3">
                {items.map((item) => (
                  <Card key={item.id} className="overflow-hidden border-green-50 shadow-none hover:border-green-200 transition">
                    <CardContent className="flex gap-4 p-4 items-center">
                      <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        <Image src={item.image || "/placeholder.png"} fill className="object-cover" alt={item.name} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">{item.name}</p>
                        <p className="text-sm text-green-700 font-medium">R$ {item.price.toFixed(2)}</p>

                        <div className="flex items-center gap-2 mt-2">
                          <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</Button>
                          <span className="w-6 text-center text-xs font-medium">{item.quantity}</span>
                          <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock}>+</Button>
                        </div>
                      </div>

                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => removeFromCart(item.id)}>
                        <X size={16} />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-white p-6 rounded-xl border-2 border-green-100 shadow-sm mt-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Subtotal ({visibleItems.length} itens):</span>
              <span className="text-lg font-medium">R$ {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-bold">Total Geral:</span>
              <span className="text-3xl font-bold text-green-700">R$ {total.toFixed(2)}</span>
            </div>

            <Button
              className="w-full h-14 text-xl bg-green-600 hover:bg-green-700 shadow-lg"
              onClick={() => {
                if (!user) {
                  router.push("/login?redirect=/checkout");
                  return;
                }
                router.push("/checkout");
              }}
            >
              Ir para Pagamento
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
