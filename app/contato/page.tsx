import React from "react";

export default function ContatoPage() {
  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-4">Contato</h1>

      <p className="mb-4 text-gray-700">
        Tem alguma dúvida, sugestão ou precisa de suporte? Entre em contato
        conosco pelos canais abaixo e teremos prazer em ajudar.
      </p>

      <ul className="list-none space-y-2">
        <li>
          <strong>Email:</strong> <a className="text-green-700" href="mailto:suporte@ruralize.com">suporte@ruralize.com</a>
        </li>
        <li>
          <strong>Telefone:</strong> <span className="ml-2">(11) 99999-9999</span>
        </li>
        <li>
          <strong>Endereço:</strong> <span className="ml-2">Rua Exemplo, 123 - Cidade/UF</span>
        </li>
      </ul>

      <p className="mt-6 text-gray-700">Você também pode nos enviar uma mensagem através do formulário disponível na área do cliente em breve.</p>
    </div>
  );
}
