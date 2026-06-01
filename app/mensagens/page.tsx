"use client";

import { useState, useEffect } from "react";
import { db } from "../services/firebase";
import { collection, query, onSnapshot, doc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/authContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, ChevronRight, User } from "lucide-react";
import Link from "next/link";
import { ChatWindow } from "../components/chatWindow";

export default function MessagesPage() {
  const { user, loading } = useAuth();
  const [chats, setChats] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);

  useEffect(() => {
    if (!user || !db) return;

    // In a real app, you might want a separate 'user_chats' collection to find these easily
    // For now, we listen to the chats collection and filter client-side or use a convention
    // Let's assume a simplified structure for the buyer to find their chats
    const q = query(collection(db, "chats"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userChats = snapshot.docs
        .filter(d => d.id.startsWith(user.uid))
        .map(d => ({
          id: d.id,
          empresaId: d.id.split("_")[1],
          ...d.data()
        }));
      setChats(userChats);
    }, (error) => {
      console.warn("Firestore permission blocked reading chats:", error);
      // Suppress the error in the UI to avoid crashes
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) return <div className="p-20 text-center">Carregando mensagens...</div>;
  if (!user) return <div className="p-20 text-center">Faça login para ver suas mensagens.</div>;

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-green-800 flex items-center gap-2">
        <MessageCircle size={28} />
        Minhas Conversas
      </h1>

      {chats.length === 0 ? (
        <Card className="border-dashed border-2 py-20 text-center bg-gray-50/50">
          <CardContent>
            <p className="text-muted-foreground mb-6">Você ainda não iniciou nenhuma conversa com vendedores.</p>
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/">Ver Produtos</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {chats.map((chat) => (
            <Card 
              key={chat.id} 
              className="hover:shadow-md transition cursor-pointer border-green-50"
              onClick={() => setActiveChat({ id: chat.empresaId, name: chat.empresaName || "Vendedor" })}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <User className="text-green-700" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{chat.empresaName || "Vendedor Ruralize"}</h3>
                    <p className="text-xs text-gray-500">ID da Loja: {chat.empresaId.slice(0,8)}...</p>
                  </div>
                </div>
                <ChevronRight className="text-gray-300" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeChat && (
        <ChatWindow 
          empresaId={activeChat.id} 
          empresaName={activeChat.name} 
          onClose={() => setActiveChat(null)} 
        />
      )}
    </main>
  );
}
