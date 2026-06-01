"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/comprador/${user.uid}`);
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error("Erro ao buscar pedidos:", err);
      } finally {
        setLoading(false);
      }
    };
    if (!authLoading && user) {
      fetchOrders();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
        <p className="text-muted-foreground animate-pulse font-medium">Carregando seus pedidos...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center px-4">
        <h2 className="text-2xl font-bold mb-4">Acesso Negado</h2>
        <p className="text-muted-foreground mb-6">Você precisa estar logado para ver seus pedidos.</p>
        <Button asChild className="bg-green-600 hover:bg-green-700 h-11 px-8">
          <Link href="/login">Fazer Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8 pb-4 border-b">
        <h1 className="text-3xl font-bold text-green-800 flex items-center gap-2">
          <ShoppingBag size={28} />
          Meus Pedidos
        </h1>
        <Button asChild variant="ghost" size="sm" className="text-green-700 hover:text-green-800 hover:bg-green-50">
          <Link href="/">Continuar Comprando</Link>
        </Button>
      </div>

      <div className="space-y-6">
        {orders.length === 0 ? (
          <Card className="border-dashed border-2 bg-gray-50/50">
            <CardContent className="py-20 text-center">
              <div className="bg-white h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <ShoppingBag className="text-gray-300" size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">Você ainda não tem pedidos</h3>
              <p className="text-muted-foreground mb-8 max-w-sm mx-auto text-sm leading-relaxed">
                Explore nossa variedade de produtos rurais direto do produtor e faça seu primeiro pedido agora mesmo!
              </p>
              <Button asChild className="bg-green-600 hover:bg-green-700 h-11 px-8 shadow-sm">
                <Link href="/">Ver Produtos</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="overflow-hidden border-green-50 shadow-sm hover:shadow-md transition duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-gray-50/50 border-b">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-sm font-bold text-gray-700">Pedido #{order.id.slice(-6).toUpperCase()}</CardTitle>
                    <Badge variant="secondary" className="text-[10px] font-bold bg-green-100 text-green-700 hover:bg-green-100 uppercase">
                      {order.status || "Pendente"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    Realizado em {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric"
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-700">R$ {order.total.toFixed(2)}</p>
                  <p className="text-[10px] text-gray-500 font-medium">{order.items.length} {order.items.length === 1 ? "item" : "itens"}</p>
                </div>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="flex flex-wrap gap-3 mb-4">
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="relative h-14 w-14 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 group">
                      {item.foto ? (
                        <img 
                          src={item.foto} 
                          alt={item.titulo} 
                          className="h-full w-full object-cover group-hover:scale-110 transition duration-300"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-[10px] text-gray-400">
                          {item.titulo.charAt(0)}
                        </div>
                      )}
                      <div className="absolute bottom-0 right-0 bg-black/60 text-white text-[8px] px-1 rounded-tl-md font-bold">
                        x{item.quantidade}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                   <div className="text-[10px] text-gray-400">
                    ID: {order.id}
                   </div>
                   <Button variant="ghost" size="sm" className="text-xs h-8 text-green-700 hover:text-green-800 hover:bg-green-50 flex items-center gap-1 font-semibold">
                    Ver Detalhes <ChevronRight size={14} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </main>
  );
}
