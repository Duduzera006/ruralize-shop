"use client";

import { useState, useEffect } from "react";
import { Star, User, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/app/context/authContext";
import { useToast } from "@/app/context/toastContext";

interface Review {
  id: string;
  userName?: string;
  buyerName?: string;
  rating: number;
  comment: string;
  date?: string;
  createdAt?: any;
}

// Helper to handle Firestore Timestamp objects { _seconds, _nanoseconds } or ISO strings
const formatReviewDate = (dateInput: any) => {
  if (!dateInput) return "";
  
  if (typeof dateInput === 'object' && dateInput !== null) {
    if (dateInput._seconds) return new Date(dateInput._seconds * 1000).toLocaleDateString('pt-BR');
    if (dateInput.seconds) return new Date(dateInput.seconds * 1000).toLocaleDateString('pt-BR');
  }

  const d = new Date(dateInput);
  return isNaN(d.getTime()) ? "" : d.toLocaleDateString('pt-BR');
};

export function ProductReviews({ productId, empresaId }: { productId: string; empresaId: string }) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load reviews from API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/${empresaId}/${productId}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        }
      } catch (err) {
        console.error("Erro ao buscar avaliações:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [productId, empresaId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      addToast("Você precisa estar logado para avaliar.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          empresaId,
          buyerId: user.uid,
          buyerName: user.displayName || user.email?.split("@")[0] || "Usuário",
          rating: newRating,
          comment: newComment,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || `Falha ao enviar avaliação (${res.status})`);
      }

      const savedReview = await res.json();
      setReviews((prev) => [savedReview, ...prev]);
      setNewComment("");
      setNewRating(5);
      addToast("Avaliação enviada com sucesso!", "success");
    } catch (err: any) {
      console.error("Erro na API de Reviews:", err);
      addToast(err.message || "Erro ao enviar avaliação. Tente novamente.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-16 border-t pt-10">
      <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <MessageSquare className="text-green-600" />
        Avaliações de Clientes
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Review Form */}
        <div className="lg:col-span-1">
          <Card className="shadow-sm border-green-50">
            <CardContent className="pt-6">
              <h3 className="font-bold mb-4">Deixe sua avaliação</h3>
              {!user ? (
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500 mb-3">Entre para compartilhar sua experiência</p>
                  <Button asChild size="sm" variant="outline" className="w-full border-green-600 text-green-700">
                    <a href="/login">Fazer Login</a>
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-2">Nota</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            size={24}
                            className={star <= newRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-2">Comentário</label>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      required
                      placeholder="Conte-nos o que achou do produto..."
                      className="w-full min-h-[100px] p-3 rounded-md border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm"
                    />
                  </div>
                  <Button type="submit" disabled={submitting} className="w-full bg-green-600 hover:bg-green-700">
                    {submitting ? "Enviando..." : "Enviar Avaliação"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-24 bg-gray-100 rounded-xl"></div>
              <div className="h-24 bg-gray-100 rounded-xl"></div>
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-gray-500 italic py-10 text-center border rounded-xl border-dashed">
              Nenhuma avaliação ainda. Seja o primeiro a avaliar!
            </p>
          ) : (
            reviews.map((review) => (
              <Card key={review.id} className="border-none bg-gray-50/50">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-green-100 p-2 rounded-full">
                        <User size={16} className="text-green-700" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{review.userName || review.buyerName || "Usuário"}</p>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={12}
                              className={star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {review.date || formatReviewDate(review.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mt-3">
                    {review.comment}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
