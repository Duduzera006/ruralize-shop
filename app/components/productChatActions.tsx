"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { ChatWindow } from "./chatWindow";

export function ProductChatActions({ empresaId, empresaName }: { empresaId: string, empresaName: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button 
        variant="outline" 
        className="w-full border-green-600 text-green-700 hover:bg-green-50 flex items-center gap-2"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle size={18} />
        Conversar com o Vendedor
      </Button>

      {isOpen && (
        <ChatWindow 
          empresaId={empresaId} 
          empresaName={empresaName} 
          onClose={() => setIsOpen(false)} 
        />
      )}
    </>
  );
}
