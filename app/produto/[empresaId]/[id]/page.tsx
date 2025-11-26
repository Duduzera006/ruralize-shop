import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "@/app/components/addToCart";

interface Produto {
  id: string;
  titulo: string;
  descricao?: string;
  fotos: string[];
  preco: number;
  estoque: number;
  categoria: string;
  empresaId: string;
}

async function getProduto(empresaId: string, id: string): Promise<Produto | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${empresaId}/${id}`,
      {
        next: { revalidate: 5 },
      }
    );

    if (!res.ok) return null;

    return res.json();
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    return null;
  }
}

export default async function ProdutoPage({
  params,
}: {
  params: Promise<{ empresaId: string, id: string }>;
}) {
  const { empresaId, id } = await params;
  const produto = await getProduto(empresaId, id);

  if (!produto) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <h1 className="text-2xl font-bold mb-3">Produto não encontrado</h1>
        <p className="text-gray-500">Verifique se o ID está correto.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="relative w-full h-96 rounded-xl overflow-hidden shadow">
        <Image
          src={produto.fotos?.[0] ?? "/placeholder.png"}
          alt={produto.titulo}
          fill
          className="object-cover"
        />
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-2">{produto.titulo}</h1>

        <Badge variant="outline" className="uppercase mb-4">
          {produto.categoria}
        </Badge>

        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          {produto.descricao}
        </p>

        <p className="text-3xl font-bold text-green-700 mb-4">
          R$ {produto.preco.toFixed(2)}
        </p>

        <p
          className={`text-sm mb-6 ${
            produto.estoque > 0 ? "text-gray-600" : "text-red-600 font-semibold"
          }`}
        >
          {produto.estoque > 0
            ? `Estoque disponível: ${produto.estoque}`
            : "Produto esgotado"}
        </p>

        <AddToCartButton
          product={produto}
          sellerId={produto.empresaId ?? empresaId}
        />
      </div>
    </div>
  );
}
