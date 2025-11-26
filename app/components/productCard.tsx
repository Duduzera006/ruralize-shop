"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/app/context/productsContext";

interface ProductCardProps {
  id: string;
  product: {
    titulo: string;
    descricao?: string;
    fotos?: string[];
    foto?: string;
    preco: number;
    estoque: number;
    categoria: string;
    empresaId?: string;
  };
}

export function ProductCard({ id, product }: ProductCardProps) {
  // prefer real-time product from Firestore if available
  let realtime = undefined;
  try {
    const ctx = useProducts();
    realtime = ctx.getById(id);
  } catch (e) {
    // if provider is not mounted, fall back to prop
    realtime = undefined;
  }

  const display = realtime ?? product;
  return (
    <Card className="w-full max-w-sm overflow-hidden border rounded-xl shadow-sm hover:shadow-md transition">
      <Link href={`/produto/${display.empresaId}/${id}`}>
        <div className="w-full h-56 relative">
          <Image
            src={display.fotos?.[0] || display.foto || "/placeholder.png"}
            alt={display.titulo}
            fill
            className="object-cover"
          />
        </div>
      </Link>

      <CardHeader className="px-4 pt-4 pb-2">
        <h3 className="font-semibold text-lg line-clamp-1">{display.titulo}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">
          {display.descricao}
        </p>
      </CardHeader>

      <CardContent className="px-4 pb-2">
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-green-700">
            R$ {display.preco?.toFixed(2)}
          </p>

          <Badge variant="outline" className="uppercase text-xs">
            {display.categoria}
          </Badge>
        </div>
        <p
          className={`text-sm mt-2 ${
            display.estoque > 0 ? "text-gray-600" : "text-red-600 font-medium"
          }`}
        >
          {display.estoque > 0
            ? `Estoque: ${display.estoque}`
            : "Fora de estoque"}
        </p>
      </CardContent>

      <CardFooter className="px-4 pb-4">
        <Button
          className="w-full bg-green-600 hover:bg-green-700"
          asChild
          disabled={display.estoque === 0}
        >
          <Link href={`/produto/${display.empresaId}/${id}`}>Ver detalhes</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
