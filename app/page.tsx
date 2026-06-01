"use client";

import { useState, useMemo, useEffect } from "react";
import { ProductCard } from "./components/productCard";
import { useProducts } from "@/app/context/productsContext";
import { Button } from "@/components/ui/button";
import { Search, Store, ChevronLeft, ChevronRight, FilterX } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { products, loading } = useProducts();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStore, setSelectedStore] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [storeNames, setStoreNames] = useState<Record<string, string>>({});
  const itemsPerPage = 10;

  // Fetch real store names from API
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/stores`);
        if (res.ok) {
          const stores = await res.json();
          const mapping: Record<string, string> = {};
          stores.forEach((s: any) => {
            mapping[s.uid || s.id] = s.displayName;
          });
          setStoreNames(mapping);
        }
      } catch (err) {
        console.error("Erro ao buscar lojas:", err);
      }
    };
    fetchStores();
  }, []);

  // Extract unique stores from products
  const uniqueStores = useMemo(() => {
    const stores = Array.from(new Set(products.map((p) => p.empresaId).filter(Boolean)));
    return stores as string[];
  }, [products]);

  // Filter products based on selected store and search query
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesStore = selectedStore === "all" || p.empresaId === selectedStore;
      const matchesSearch = p.titulo.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStore && matchesSearch;
    });
  }, [products, selectedStore, searchQuery]);

  // Paginate filtered products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStore, searchQuery]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Search and Filters Header */}
      <div className="flex flex-col space-y-4 mb-8">
        {/* Search Bar */}
        <div className="relative w-full max-w-2xl mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por produtos rurais (sementes, ferramentas, etc)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-full border-2 border-green-100 focus:border-green-500 outline-none transition shadow-sm"
          />
        </div>

        {/* Store Filter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-green-50">
          <div className="flex items-center gap-2">
            <Store className="text-green-600" size={20} />
            <h2 className="font-semibold text-gray-700 text-sm">Loja:</h2>
            <select 
              value={selectedStore} 
              onChange={(e) => setSelectedStore(e.target.value)}
              className="ml-2 border-none bg-gray-50 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-green-500 outline-none font-medium text-gray-600"
            >
              <option value="all">Todas as Lojas</option>
              {uniqueStores.map((id) => (
                <option key={id} value={id}>
                  {storeNames[id] || `Loja ${id.slice(0, 5)}...`}
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
            Mostrando {paginatedProducts.length} de {filteredProducts.length} produtos
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3 p-4 border rounded-xl">
              <Skeleton className="h-56 w-full rounded-xl" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ))
        ) : products.length === 0 ? (
          <div className="col-span-full py-20 text-center flex flex-col items-center">
             <FilterX size={48} className="text-gray-300 mb-4" />
             <p className="text-gray-500 text-lg">Nenhum produto cadastrado no marketplace ainda.</p>
          </div>
        ) : paginatedProducts.length === 0 ? (
          <div className="col-span-full py-20 text-center flex flex-col items-center">
            <FilterX size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">Nenhum produto encontrado nesta loja.</p>
            <Button 
              variant="link" 
              onClick={() => setSelectedStore("all")}
              className="text-green-600"
            >
              Ver todos os produtos
            </Button>
          </div>
        ) : (
          paginatedProducts.map((product) => (
            <ProductCard key={product.id} id={product.id} product={product} />
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1"
          >
            <ChevronLeft size={16} /> Anterior
          </Button>
          
          <div className="flex items-center gap-1 px-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={currentPage === page ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1"
          >
            Próxima <ChevronRight size={16} />
          </Button>
        </div>
      )}
    </main>
  );
}
