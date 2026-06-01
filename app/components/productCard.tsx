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
import { Heart } from "lucide-react";

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
  
  let realtime = undefined;
  try {
    const ctx = useProducts();
    realtime = ctx.getById(id);
  } catch (e) {
    realtime = undefined;
  }

  const display = realtime ?? product;
  const favorite = isFavorite(id);

  return (
    <div className="group relative h-full">
      <Card className="w-full h-full overflow-hidden border border-gray-100 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
        
        {/* Favorite Trigger Overlay */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(id);
          }}
          className="absolute top-3 right-3 z-20 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all transform active:scale-90"
        >
          <Heart 
            size={16} 
            className={favorite ? "fill-red-500 text-red-500" : "text-gray-300"} 
          />
        </button>

        {/* Image Section */}
        <Link href={`/produto/${display.empresaId}/${id}`} className="block overflow-hidden h-52 relative bg-gray-50">
          <Image
            src={display.fotos?.[0] || display.foto || "/placeholder.png"}
            alt={display.titulo}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Content Section */}
        <div className="p-4 flex flex-col flex-1">
          <CardHeader className="p-0 mb-1">
             <div className="flex items-center gap-2 mb-1.5">
                <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-50 border-none text-[10px] font-bold uppercase tracking-wide px-2 py-0">
                  {display.categoria}
                </Badge>
             </div>
            <h3 className="text-[15px] font-bold text-gray-800 leading-snug line-clamp-2 group-hover:text-green-700 transition-colors">
              {display.titulo}
            </h3>
          </CardHeader>

          <CardContent className="p-0 mb-4 flex-1">
            <div className="flex flex-col">
              <p className="text-xl font-extrabold text-gray-900 tracking-tight">
                R$ {display.preco?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className={`text-[11px] font-bold mt-1 ${display.estoque > 0 ? 'text-red-600' : 'text-red-500'}`}>
                {display.estoque > 0 ? `${display.estoque} em estoque` : "Esgotado"}
              </p>
            </div>
          </CardContent>

          <CardFooter className="p-0">
            <Button
              className="w-full bg-green-700 hover:bg-green-800 text-white font-bold text-xs h-10 rounded-xl transition-colors shadow-sm"
              asChild
              disabled={display.estoque === 0}
            >
              <Link href={`/produto/${display.empresaId}/${id}`}>Ver Detalhes</Link>
            </Button>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
}
