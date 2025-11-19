export type ProductSubOption = {
  id: string;
  name: string;
};

export type ProductOption = {
  id: string;
  name: string;
  suboptions: ProductSubOption[];
};

export type Product = {
  id: string;
  titulo: string;
  foto: string;
  descricao: string;
  preco: number;
  categoria: string;
  estoque: number;
  options?: ProductOption[];
  empresaId?: string;
};
