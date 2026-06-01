"use client";

import { useState, useMemo, useEffect } from "react";
import { ProductCard } from "./components/productCard";
import { useProducts } from "@/app/context/productsContext";
import { Button } from "@/components/ui/button";
import { Search, Store, ChevronLeft, ChevronRight, FilterX, Leaf } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { products, loading } = useProducts();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStore, setSelectedStore] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [storeNames, setStoreNames] = useState<Record<string, string>>({});
  const itemsPerPage = 12;

  // Categories allowed in the mobile app (synchronized with RURALIZE_CONTEXT_SELLER.md)
  const allowedCategories = [
    "Rações e Concentrados",
    "Suplementos e Vitaminas",
    "Ferraduras e Ferramentas",
    "Selaria e Equipamentos",
    "Higiene e Cuidados",
    "Medicamentos Veterinários",
    "Acessórios para Estábulo",
    "Outros"
  ];

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

  const uniqueStores = useMemo(() => {
    const stores = Array.from(new Set(products.map((p) => p.empresaId).filter(Boolean)));
    return stores as string[];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesStore = selectedStore === "all" || p.empresaId === selectedStore;
      const matchesCategory = selectedCategory === "all" || p.categoria === selectedCategory;
      const matchesSearch = p.titulo.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStore && matchesCategory && matchesSearch;
    });
  }, [products, selectedStore, selectedCategory, searchQuery]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStore, selectedCategory, searchQuery]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      
      {/* Professional Hero Section */}
      <section className="mb-16">
        <div className="bg-green-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-xl shadow-green-900/10">
           {/* Background Decor */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-green-800 rounded-full -mr-20 -mt-20 opacity-50 blur-3xl"></div>
           <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-700 rounded-full -ml-20 -mb-20 opacity-30 blur-3xl"></div>

           <div className="relative z-10 max-w-2xl">
             <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
               O seu parceiro de confiança no <span className="text-green-300 underline underline-offset-8 decoration-4">campo</span>.
             </h1>
             <p className="text-lg text-green-100/80 font-medium mb-8">
               Acesse os melhores insumos, sementes e ferramentas diretamente dos produtores. Simples, rápido e profissional.
             </p>

             {/* Search Bar */}
             <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Busque por produtos, ferramentas ou lojas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-gray-900 border-none shadow-lg focus:ring-4 focus:ring-green-500/20 outline-none transition-all font-semibold"
                />
             </div>
           </div>
        </div>
      </section>

      {/* Filter Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2">
             <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">Loja:</span>
             <div className="relative">
                <select 
                  value={selectedStore} 
                  onChange={(e) => setSelectedStore(e.target.value)}
                  className="appearance-none bg-gray-100 border-none rounded-lg px-4 py-3 pr-10 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-green-500 outline-none cursor-pointer"
                >
                  <option value="all">Todas as Lojas</option>
                  {uniqueStores.map((id) => (
                    <option key={id} value={id}>
                      {storeNames[id] || `Loja ${id.slice(0, 5)}...`}
                    </option>
                  ))}
                </select>
                <Store className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
             </div>
          </div>

          <div className="flex items-center gap-2">
             <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">Categoria:</span>
             <div className="relative">
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-gray-100 border-none rounded-lg px-4 py-3 pr-10 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-green-500 outline-none cursor-pointer"
                >
                  <option value="all">Todas as Categorias</option>
                  {allowedCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <Leaf className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
             </div>
          </div>
        </div>

        <div className="text-sm font-bold text-gray-400">
           {filteredProducts.length} itens encontrados
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-52 w-full rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))
        ) : products.length === 0 ? (
          <div className="col-span-full py-20 text-center flex flex-col items-center">
             <FilterX size={48} className="text-gray-200 mb-4" />
             <h3 className="text-xl font-bold text-gray-900">Nenhum produto cadastrado</h3>
             <p className="text-gray-500">Estamos trabalhando para trazer novos itens em breve.</p>
          </div>
        ) : paginatedProducts.length === 0 ? (
          <div className="col-span-full py-20 text-center flex flex-col items-center">
            <FilterX size={48} className="text-gray-200 mb-4" />
            <p className="text-gray-500 font-bold text-lg">Nenhum resultado para os filtros aplicados.</p>
            <Button 
              variant="link" 
              onClick={() => { setSelectedStore("all"); setSelectedCategory("all"); setSearchQuery(""); }}
              className="text-green-700 font-bold"
            >
              Limpar todos os filtros
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
        <div className="flex justify-center items-center gap-2 mt-16">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="rounded-lg h-9 w-9 p-0"
          >
            <ChevronLeft size={18} />
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={`rounded-lg h-9 w-9 p-0 font-bold ${
                  currentPage === page ? "bg-green-700 text-white" : "text-gray-500 hover:text-green-700"
                }`}
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
            className="rounded-lg h-9 w-9 p-0"
          >
            <ChevronRight size={18} />
          </Button>
        </div>
      )}
    </main>
  );
}
