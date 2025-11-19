"use client";

import { useCart } from "../context/cartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Seu Carrinho</h1>

      {cart.length === 0 ? (
        <p className="text-muted-foreground">Seu carrinho está vazio 🛒</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
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
                    >
                      +
                    </Button>
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

          <Button className="w-full mt-4" onClick={clearCart}>
            Finalizar Compra
          </Button>
        </div>
      )}
    </div>
  );
}
