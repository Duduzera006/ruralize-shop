"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function ProductGallery({ fotos }: { fotos: string[] }) {
  return (
    <Carousel className="w-full max-w-md mx-auto">
      <CarouselContent>
        {fotos.map((src, index) => (
          <CarouselItem key={index}>
            <div className="relative w-full h-80 rounded-lg overflow-hidden">
              <Image
                src={src || "/placeholder.png"}
                alt={`Foto ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
