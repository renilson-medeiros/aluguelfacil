"use client";

import { useState } from "react";
import { PublicPropertyCard } from "@/components/public/PublicPropertyCard";
import { useFormFormatting } from "@/lib/hooks/useFormFormatting";
import { Search, Building2, MessageCircle, Home } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Property {
  id: string;
  titulo: string;
  endereco_rua: string;
  endereco_numero: string;
  endereco_bairro: string;
  endereco_cidade: string;
  valor_aluguel: number;
  fotos: string[];
  quartos?: number;
  banheiros?: number;
  area_m2?: number;
  comodos?: string[];
}

interface CatalogClientProps {
  ownerName: string;
  ownerPhone: string;
  initialProperties: any[];
}

export default function CatalogClient({ ownerName, ownerPhone, initialProperties }: CatalogClientProps) {
  const { formatarMoeda } = useFormFormatting();
  const [searchQuery, setSearchQuery] = useState("");

  const properties = initialProperties.map(p => ({
    id: p.id,
    title: p.titulo || `${p.endereco_rua}, ${p.endereco_numero}`,
    address: `${p.endereco_rua}, ${p.endereco_numero} - ${p.endereco_bairro}, ${p.endereco_cidade}`,
    rent: p.valor_aluguel || 0,
    image: p.fotos && p.fotos.length > 0 ? p.fotos[0] : "/preview.png",
    bedrooms: p.quartos,
    bathrooms: p.banheiros,
    area: p.area_m2,
    rooms: p.comodos || [],
  }));

  const filteredProperties = properties.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(`Olá ${ownerName}! Vi seus imóveis disponíveis no Lugo e gostaria de conversar.`);
    window.open(`https://wa.me/55${ownerPhone.replace(/\D/g, '')}?text=${message}`, "_blank");
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">

      <main className="flex-1">
        {/* Banner Section */}
        <section className="bg-tertiary pt-12 pb-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
          </div>

          <div className="container relative z-10 mx-auto text-center space-y-6">
            <div className="flex justify-center">
              <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors uppercase tracking-widest text-[10px] md:text-xs">
                Catálogo de Imóveis
              </Badge>
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
              Imóveis de {ownerName}
            </h1>
            
            <p className="text-white/70 max-w-2xl mx-auto text-sm md:text-lg font-medium leading-relaxed">
              Explore as melhores opções de locação direta com quem entende. 
              Imóveis verificados e prontos para morar.
            </p>

            {ownerPhone && (
              <div className="pt-4">
                <Button 
                  onClick={handleWhatsAppContact}
                  className="bg-green-500 hover:bg-green-600 text-white gap-2 h-12 px-8 rounded-lg shadow-lg shadow-green-500/20 active:scale-95 transition-all"
                >
                  <MessageCircle className="h-5 w-5" />
                  Falar com o proprietário
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Catalog Grid */}
        <section className="container mx-auto px-4 pb-20">
          <div className="p-2 md:p-8 space-y-8">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
              <div className="relative w-full mt-4 md:mt-0 flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, rua ou bairro..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 bg-white border rounded-lg focus-visible:ring-tertiary"
                />
              </div>
              <div className="flex bg-secondary/5 rounded-lg justify-center md:p-4 p-2 items-center gap-2 text-sm text-secondary font-medium">
                <Building2 className="h-4 w-4" />
                <span>{filteredProperties.length} imóveis disponíveis</span>
              </div>
            </div>

            {filteredProperties.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProperties.map((property) => (
                  <PublicPropertyCard 
                    key={property.id} 
                    property={property} 
                    formatarMoeda={formatarMoeda} 
                  />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center space-y-4">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-lg bg-primary/5 mb-2">
                  <Home className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-display">Nenhum imóvel encontrado</h3>
                <p className="text-muted-foreground max-w-xs mx-auto">
                  Tente ajustar sua busca ou entre em contato com o proprietário para saber de novidades.
                </p>
                <Button 
                  variant="destructive" 
                  onClick={() => setSearchQuery("")}
                  className="rounded-lg bg-red-600 px-8"
                >
                  Limpar busca
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

    </div>
  );
}
