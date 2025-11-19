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

interface ProductCardProps {
  id: string;
  product: {
    titulo: string;
    descricao?: string;
    fotos: string[];
    preco: number;
    estoque: number;
    categoria: string;
    empresaId: string;
  };
}

export function ProductCard({ id, product }: ProductCardProps) {
  return (
    <Card className="w-full max-w-sm overflow-hidden border rounded-xl shadow-sm hover:shadow-md transition">
      <Link href={`/produto/${product.empresaId}/${id}`}>
        <div className="w-full h-56 relative">
          <Image
            src={product.fotos?.[0] || "/placeholder.png"}
            alt={product.titulo}
            fill
            className="object-cover"
          />
        </div>
      </Link>

      <CardHeader className="px-4 pt-4 pb-2">
        <h3 className="font-semibold text-lg line-clamp-1">{product.titulo}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">
          {product.descricao}
        </p>
      </CardHeader>

      <CardContent className="px-4 pb-2">
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-green-700">
            R$ {product.preco?.toFixed(2)}
          </p>

          <Badge variant="outline" className="uppercase text-xs">
            {product.categoria}
          </Badge>
        </div>

        <p
          className={`text-sm mt-2 ${
            product.estoque > 0 ? "text-gray-600" : "text-red-600 font-medium"
          }`}
        >
          {product.estoque > 0
            ? `Estoque: ${product.estoque}`
            : "Fora de estoque"}
        </p>
      </CardContent>

      <CardFooter className="px-4 pb-4">
        <Button
          className="w-full bg-green-600 hover:bg-green-700"
          asChild
          disabled={product.estoque === 0}
        >
          <Link href={`/produto/${product.empresaId}/${id}`}>Ver detalhes</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
