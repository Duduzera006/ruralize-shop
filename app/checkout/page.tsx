"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/cartContext";
import { useAuth } from "../context/authContext";
import { useToast } from "../context/toastContext";
import { formatFirebaseError } from "../utils/errorHandler";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Truck, MapPin, CheckCircle2 } from "lucide-react";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  // Simulated form states
  const [address, setAddress] = useState({
    street: "",
    city: "",
    zip: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("pix");

  const visibleItems = cart.filter((item) => item.stock > 0);
  const total = visibleItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmitOrder = async () => {
    if (visibleItems.length === 0) return;
    if (!address.street || !address.city || !address.zip) {
      addToast("Por favor, preencha todos os campos de endereço.", "error");
      return;
    }

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
          compradorId: user?.uid,
          status: "pending",
          total: Number(totalOrder.toFixed(2)),
          items: orderItems,
          pagamento: { metodo: paymentMethod, transactionId: "simulated_" + Date.now() },
          entrega: { 
            tipo: "entrega", 
            endereco: `${address.street}, ${address.city} - CEP: ${address.zip}` 
          },
        };
      });

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orders),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || `Erro ao criar pedido: ${res.status}`);
      }

      setOrderComplete(true);
      clearCart();
      addToast("Pedido realizado com sucesso!", "success");
    } catch (err) {
      const message = formatFirebaseError(err);
      addToast(message, "error");
      console.error("Erro no checkout:", err);
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <CheckCircle2 size={80} className="text-green-600 mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Pedido Confirmado!</h1>
        <p className="text-lg text-gray-600 mb-8">
          Obrigado por comprar na RuralizeShop. Você receberá um e-mail com os detalhes do seu pedido em breve.
        </p>
        <Button asChild className="bg-green-600 hover:bg-green-700 h-12 px-8">
          <a href="/">Voltar para a Loja</a>
        </Button>
      </div>
    );
  }

  if (visibleItems.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <p className="text-lg text-gray-600 mb-6">Seu carrinho está vazio.</p>
        <Button asChild>
          <a href="/">Ir para a Loja</a>
        </Button>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-green-800">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Address Section */}
          <Card className="shadow-sm">
            <CardHeader className="bg-gray-50/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="text-green-600" size={20} />
                Endereço de Entrega
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium">Logradouro (Rua, Número, Bairro)</label>
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="Ex: Rua das Flores, 123 - Centro"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cidade / Estado</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="Ex: Rio Verde, GO"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">CEP</label>
                  <input
                    type="text"
                    value={address.zip}
                    onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="00000-000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Section */}
          <Card className="shadow-sm">
            <CardHeader className="bg-gray-50/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="text-green-600" size={20} />
                Método de Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => setPaymentMethod("pix")}
                  className={`p-4 border-2 rounded-lg text-center transition ${
                    paymentMethod === "pix" ? "border-green-600 bg-green-50" : "hover:border-gray-300"
                  }`}
                >
                  <p className="font-bold text-lg mb-1">PIX</p>
                  <p className="text-xs text-gray-500">Aprovação instantânea</p>
                </button>
                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`p-4 border-2 rounded-lg text-center transition ${
                    paymentMethod === "card" ? "border-green-600 bg-green-50" : "hover:border-gray-300"
                  }`}
                >
                  <p className="font-bold text-lg mb-1">Cartão</p>
                  <p className="text-xs text-gray-500">Crédito ou Débito</p>
                </button>
                <button
                  onClick={() => setPaymentMethod("boleto")}
                  className={`p-4 border-2 rounded-lg text-center transition ${
                    paymentMethod === "boleto" ? "border-green-600 bg-green-50" : "hover:border-gray-300"
                  }`}
                >
                  <p className="font-bold text-lg mb-1">Boleto</p>
                  <p className="text-xs text-gray-500">Até 3 dias úteis</p>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Summary */}
        <div className="space-y-6">
          <Card className="shadow-md border-green-100 h-fit">
            <CardHeader>
              <CardTitle className="text-xl">Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
                {visibleItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate max-w-[150px]">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-medium text-gray-800">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Frete</span>
                  <span className="text-green-600 font-medium">Grátis</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span className="text-green-700">R$ {total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={handleSubmitOrder}
                className="w-full h-12 bg-green-600 hover:bg-green-700 text-lg shadow-lg mt-4"
                disabled={loading}
              >
                {loading ? "Processando..." : "Confirmar Pedido"}
              </Button>
              <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 mt-2">
                <Truck size={12} />
                Entrega estimada em 2-5 dias úteis
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
