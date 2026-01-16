"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Bed, Bath, Maximize } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface PublicPropertyCardProps {
  property: {
    id: string;
    title: string;
    address: string;
    rent: number;
    image: string;
    area?: number;
    rooms: string[];
  };
  formatarMoeda: (value: string) => string;
}

export function PublicPropertyCard({ property, formatarMoeda }: PublicPropertyCardProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollPrev(scrollLeft > 5);
      setCanScrollNext(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [property.rooms]);

  return (
    <Card className="group overflow-hidden border-none shadow-sm transition-all duration-300 hover:shadow-xl bg-white">
      <Link href={`/imovel/${property.id}`} className="block relative aspect-4/3 overflow-hidden">
        <Image
          src={property.image}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Badge className="absolute left-3 top-3 bg-success/90 hover:bg-success/70 backdrop-blur-sm text-white border-none shadow-sm">
          Disponível
        </Badge>
      </Link>
      
      <CardContent className="p-4 space-y-3">
        <div>
          <Link href={`/imovel/${property.id}`}>
            <h3 className="font-display font-bold text-lg leading-tight text-foreground line-clamp-1 group-hover:text-tertiary transition-colors">
              {property.title}
            </h3>
          </Link>
          <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-tertiary/70 shrink-0" />
            <span className="line-clamp-1">{property.address}</span>
          </div>
        </div>

        {property.rooms.length > 0 && (
          <div className="relative py-3 border-y border-border/50 group/scroll">
            {/* Left Gradient Mask */}
            <div 
              className={cn(
                "absolute top-0 left-0 bottom-0 w-8 z-10 pointer-events-none transition-opacity duration-300 bg-linear-to-r from-white to-transparent",
                canScrollPrev ? "opacity-100" : "opacity-0"
              )} 
            />

            <div 
              ref={scrollRef}
              onScroll={checkScroll}
              className="flex flex-nowrap gap-1.5 overflow-x-auto no-scrollbar scroll-smooth p-0.5"
            >
              {property.rooms.map((room) => (
                <Badge 
                  key={room} 
                  variant="outline" 
                  className="px-2 py-0.5 text-[10px] capitalize font-medium border-slate-200 text-slate-600 flex-none"
                >
                  {room}
                </Badge>
              ))}
            </div>

            {/* Right Gradient Mask */}
            <div 
              className={cn(
                "absolute top-0 right-0 bottom-0 w-8 z-10 pointer-events-none transition-opacity duration-300 bg-linear-to-l from-white to-transparent",
                canScrollNext ? "opacity-100" : "opacity-0"
              )} 
            />
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Por mês</span>
          <span className="text-xl font-bold text-tertiary">
            {formatarMoeda((property.rent * 100).toString())}
          </span>
        </div>
        <Link href={`/imovel/${property.id}`}>
          <Button size="sm" className="bg-tertiary hover:bg-tertiary/90 text-white font-semibold">
            Ver detalhes
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
