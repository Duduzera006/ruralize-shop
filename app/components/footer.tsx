import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="w-full bg-white mt-10 border-t">
      <div className="max-w-6xl mx-auto py-6 text-center text-sm">
        <p className="text-gray-600">
          © {new Date().getFullYear()} Ruralize Shop — Todos os direitos
          reservados.
        </p>

        <Separator className="my-4" />

        <div className="flex justify-center gap-6 text-gray-500">
          <a href="/sobre" className="hover:text-green-600 transition">
            Sobre
          </a>
          <a href="/politica" className="hover:text-green-600 transition">
            Política
          </a>
          <a href="/contato" className="hover:text-green-600 transition">
            Contato
          </a>
        </div>
      </div>
    </footer>
  );
}
