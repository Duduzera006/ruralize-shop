import React from "react";

export default function PoliticaPage() {
  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-4">Política de Privacidade</h1>

      <p className="mb-4 text-gray-700">
        Na Ruralize Shop levamos sua privacidade a sério. Coletamos apenas as
        informações necessárias para processar pedidos, gerenciar contas e
        melhorar nossa plataforma. Não compartilhamos dados pessoais com terceiros
        sem o seu consentimento, exceto quando necessário para completar uma
        transação (por exemplo, entrega) ou quando exigido por lei.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">Dados e uso</h2>
      <p className="text-gray-700 mb-4">
        Utilizamos as informações fornecidas para processar compras, enviar
        notificações sobre o pedido e oferecer suporte ao cliente. Também
        podemos usar dados agregados para melhorar nossos serviços.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">Contato</h2>
      <p className="text-gray-700">Se tiver dúvidas sobre nossa política, entre em contato via a página de contato.</p>
    </div>
  );
}
