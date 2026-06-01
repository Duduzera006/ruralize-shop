"use client";

import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { db } from "../services/firebase";
import { collection, query, where, onSnapshot, orderBy, limit, Timestamp } from "firebase/firestore";
import { useAuth } from "./authContext";
import { useToast } from "./toastContext";

const NotificationContext = createContext<undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    if (!user || !db) return;

    // Listen to notifications in the user's document subcollection
    // Path: users/{uid}/notifications
    const notificationsRef = collection(db, "users", user.uid, "notifications");
    
    // Query for recent unread notifications (created in the last minute to avoid old spam)
    const oneMinuteAgo = new Date(Date.now() - 60000);
    const q = query(
      notificationsRef,
      where("createdAt", ">=", Timestamp.fromDate(oneMinuteAgo)),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          // Avoid showing notification for the very first load if they are old
          // though the createdAt filter already handles most of it
          addToast(data.message || "Atualização no seu pedido!", "info");
        }
      });
    }, (error) => {
      console.error("Erro ao ouvir notificações:", error);
    });

  return () => unsubscribe();
  }, [user, addToast]);

  return (
    <NotificationContext.Provider value={undefined}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  // This hook is just for initialization, no state needed yet
  return useContext(NotificationContext);
};
