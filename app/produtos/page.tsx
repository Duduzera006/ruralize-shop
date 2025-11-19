import { ProductCard } from "@/app/components/productCard";

async function getAllProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar produtos.");
  }

  return res.json();
}

export default async function ProdutosPage() {
  const produtos = await getAllProducts();

  return (
    <main className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Catálogo de Produtos</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {produtos.map((p: any) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>
    </main>
  );
}
