"use client";

import { Button } from "@/components/ui/button";

interface ProductProps {
  id: string;
  titulo: string;
  descricao?: string;
  fotos: string[];
  preco: number;
  estoque: number;
  categoria: string;
  empresaId: string;
}

export function ProductInfo({ produto }: { produto: ProductProps }) {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">{produto.titulo}</h1>

      <p className="text-sm text-muted-foreground">
        Categoria: <span className="font-medium">{produto.categoria}</span>
      </p>

      <p className="text-3xl font-bold text-orange-600">
        R$ {produto.preco.toFixed(2)}
      </p>

      <p className="text-sm text-green-600 font-semibold">
        {produto.estoque > 0
          ? `Em estoque (${produto.estoque} disponíveis)`
          : "Fora de estoque"}
      </p>

      <p className="text-base text-muted-foreground leading-relaxed">
        {produto.descricao}
      </p>

      <Button className="w-full text-lg py-6" disabled={produto.estoque === 0}>
        Comprar agora
      </Button>
    </div>
  );
}
