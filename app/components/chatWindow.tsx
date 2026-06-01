"use client";

import { useState, useEffect, useRef } from "react";
import { db } from "../services/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, setDoc, doc } from "firebase/firestore";
import { useAuth } from "../context/authContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, X, MessageCircle } from "lucide-react";

interface Message {
  id: string;
  text: string;
  senderId: string;
  createdAt: any;
}

export function ChatWindow({ empresaId, empresaName, onClose }: { empresaId: string, empresaName: string, onClose: () => void }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const chatId = user ? `${user.uid}_${empresaId}` : null;

  useEffect(() => {
    if (!chatId || !db) return;

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      })) as Message[];
      setMessages(msgs);
    }, (error) => {
      console.warn("Firestore permission blocked reading messages:", error);
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId || !user) return;

    const messageText = newMessage;
    setNewMessage(""); // Optimistic clear

    try {
      // Ensure the parent chat document exists so it can be queried in the messages list
      await setDoc(doc(db!, "chats", chatId), {
        buyerId: user.uid,
        empresaId: empresaId,
        buyerName: user.displayName || user.email,
        empresaName: empresaName,
        lastMessage: messageText,
        updatedAt: serverTimestamp()
      }, { merge: true });

      // Add the actual message to the subcollection
      await addDoc(collection(db!, "chats", chatId, "messages"), {
        text: messageText,
        senderId: user.uid,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setNewMessage(messageText); // Restore if failed
    }
  };

  if (!user) return null;

  return (
    <Card className="fixed bottom-4 right-4 w-80 h-96 shadow-2xl flex flex-col z-50 border-green-100">
      <CardHeader className="p-3 bg-green-600 text-white flex flex-row items-center justify-between rounded-t-lg">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <MessageCircle size={16} />
          {empresaName}
        </CardTitle>
        <button onClick={onClose} className="hover:bg-green-700 p-1 rounded transition">
          <X size={18} />
        </button>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.senderId === user.uid ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-2 rounded-lg text-sm shadow-sm ${
                msg.senderId === user.uid
                  ? "bg-green-600 text-white rounded-br-none"
                  : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </CardContent>

      <form onSubmit={handleSendMessage} className="p-2 bg-white border-t flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-1 text-sm border-none focus:ring-0 outline-none"
        />
        <Button type="submit" size="icon" className="h-8 w-8 bg-green-600 hover:bg-green-700">
          <Send size={14} />
        </Button>
      </form>
    </Card>
  );
}
