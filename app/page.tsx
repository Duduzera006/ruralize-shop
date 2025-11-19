import { ProductCard } from "./components/productCard";


export default async function Home() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
    next: { revalidate: 5 },
  });

  const products = await res.json();

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} id={product.id} product={product} />
      ))}
    </main>
  );
}
