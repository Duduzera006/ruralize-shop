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
import { useFavorites } from "@/app/context/favoritesContext";
import { Heart, Star } from "lucide-react";

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
  const { toggleFavorite, isFavorite } = useFavorites();
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
  const favorite = isFavorite(id);

  return (
    <Card className="group w-full max-w-sm overflow-hidden border rounded-xl shadow-sm hover:shadow-md transition relative">
      <button 
        onClick={(e) => {
          e.preventDefault();
          toggleFavorite(id);
        }}
        className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition"
      >
        <Heart 
          size={18} 
          className={favorite ? "fill-red-500 text-red-500" : "text-gray-400"} 
        />
      </button>

      <Link href={`/produto/${display.empresaId}/${id}`}>
        <div className="w-full h-56 relative overflow-hidden">
          <Image
            src={display.fotos?.[0] || display.foto || "/placeholder.png"}
            alt={display.titulo}
            fill
            className="object-cover group-hover:scale-105 transition duration-300"
          />
        </div>
      </Link>

      <CardHeader className="px-4 pt-4 pb-1">
        <h3 className="font-semibold text-lg line-clamp-1">{display.titulo}</h3>
      </CardHeader>

      <CardContent className="px-4 pb-2">
        <div className="flex flex-col gap-1">
          <p className="text-xl font-bold text-green-700">
            R$ {display.preco?.toFixed(2)}
          </p>

          <Badge variant="outline" className="w-fit uppercase text-[10px] py-0">
            {display.categoria}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="px-4 pb-4 pt-2">
        <Button
          className="w-full bg-green-600 hover:bg-green-700 text-sm h-9"
          asChild
          disabled={display.estoque === 0}
        >
          <Link href={`/produto/${display.empresaId}/${id}`}>Ver detalhes</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
