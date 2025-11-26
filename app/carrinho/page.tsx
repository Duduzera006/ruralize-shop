"use client";

import { useCart } from "../context/cartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useToast } from "@/app/context/toastContext";
import { formatFirebaseError } from "@/app/utils/errorHandler";
import { useAuth } from "@/app/context/authContext";
import { useState } from "react";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { addToast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const visibleItems = cart.filter((item) => item.stock > 0);
  const total = visibleItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Seu Carrinho</h1>

      {visibleItems.length === 0 ? (
        <p className="text-muted-foreground">Nenhum item disponível em estoque 🛒</p>
      ) : (
        <div className="space-y-4">
          {visibleItems.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex gap-4 p-4 items-center">
                <Image
                  src={item.image || "/placeholder.png"}
                  width={80}
                  height={80}
                  className="rounded"
                  alt={item.name}
                />

                <div className="flex-1">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    R$ {item.price.toFixed(2)}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </Button>

                    <span>{item.quantity}</span>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </Button>
                    <span className="text-sm text-muted-foreground ml-2">{item.stock} em estoque</span>
                  </div>
                </div>

                <Button
                  variant="destructive"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remover
                </Button>
              </CardContent>
            </Card>
          ))}

          <div className="text-right text-xl font-bold mt-6">
            Total: R$ {total.toFixed(2)}
          </div>

          <Button
            className="w-full mt-4"
            onClick={async () => {
              if (visibleItems.length === 0) return;
              setLoading(true);

              try {
                // Group cart items by seller (empresaId) to create one order per empresa
                const groups = new Map<string, typeof cart>();
                visibleItems.forEach((item) => {
                  const key = item.sellerId || "unknown";
                  const arr = groups.get(key) || [];
                  arr.push(item);
                  groups.set(key, arr);
                });

                const orders = Array.from(groups.entries()).map(([empresaId, items]) => {
                  const orderItems = items.map((it) => ({
                    productId: it.id,
                    titulo: it.name,
                    quantidade: it.quantity,
                    precoUnitario: it.price,
                    subtotal: Number((it.price * it.quantity).toFixed(2)),
                    foto: it.image || null,
                  }));

                  const totalOrder = orderItems.reduce((s, oi) => s + oi.subtotal, 0);

                  return {
                    empresaId,
                    compradorId: undefined,
                    status: "pending",
                    total: Number(totalOrder.toFixed(2)),
                    items: orderItems,
                    pagamento: { metodo: "pix", transactionId: null },
                    entrega: { tipo: "retirada", endereco: null },
                  } as const;
                });

                
                const compradorId = user?.uid;

                const payload = orders.map((o) => ({
                  ...o,
                  compradorId: compradorId ?? undefined,
                }));

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(payload),
                });

                if (!res.ok) {
                  const data = await res.json().catch(() => null);
                  const message = data?.message || `Erro ao criar pedido: ${res.status}`;
                  throw new Error(message);
                }

                addToast("Pedido(s) criado(s) com sucesso.", "success");
                clearCart();
              } catch (err) {
                const message = formatFirebaseError(err);
                addToast(message, "error");
                console.error("Erro no checkout:", err);
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
          >
            {loading ? "Processando..." : "Finalizar Compra"}
          </Button>
        </div>
      )}
    </div>
  );
}
