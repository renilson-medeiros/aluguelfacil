"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  MapPin,
  Bed,
  Bath,
  Car,
  PawPrint,
  Users,
  Baby,
  Wifi,
  Droplets,
  Zap,
  Flame,
  MessageCircle,
  ArrowLeft,
  Home,
  Maximize,
  Loader2,
  ChevronLeft,
  Info,
  ChevronRight
} from "lucide-react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface Property {
  id: string;
  title: string;
  images: string[];
  address: {
    street: string;
    number: string;
    complement: string | null;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  details: {
    bedrooms: number | null;
    bathrooms: number | null;
    area: number | null;
    garage: boolean;
    garageSpots: number;
    acceptsPets: boolean;
    maxPeople: number | null;
    acceptsChildren: boolean;
  };
  rooms: string[];
  pricing: {
    rent: number;
    condominium: number;
    iptu: number;
    serviceFee: number;
  };
  included: {
    water: boolean;
    electricity: boolean;
    internet: boolean;
    gas: boolean;
  };
  observations: string | null;
  owner: {
    name: string;
    whatsapp: string;
  };
}

export default function PropertyDetail() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [mainApi, setMainApi] = useState<CarouselApi>();
  const [thumbApi, setThumbApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Sync carousels and update selected index
  useEffect(() => {
    if (!mainApi || !thumbApi) return;

    const onSelect = () => {
      const index = mainApi.selectedScrollSnap();
      setSelectedIndex(index);
      // Force thumb scroll to keep it in sync
      thumbApi.scrollTo(index);
    };

    const onThumbSelect = () => {
      const index = thumbApi.selectedScrollSnap();
      if (mainApi.selectedScrollSnap() !== index) {
        mainApi.scrollTo(index);
      }
    };

    mainApi.on("select", onSelect);
    thumbApi.on("select", onThumbSelect);

    // Initial index
    setSelectedIndex(mainApi.selectedScrollSnap());

    return () => {
      mainApi.off("select", onSelect);
      thumbApi.off("select", onThumbSelect);
    };
  }, [mainApi, thumbApi]);

  useEffect(() => {
    if (id) {
      loadProperty(id);
    }
  }, [id]);

  const loadProperty = async (propertyId: string) => {
    try {
      setLoading(true);

      // Buscar imóvel com dados do proprietário
      const { data: imovel, error } = await supabase
        .from('imoveis')
        .select(`
          *,
          profiles(nome_completo, telefone)
        `)
        .eq('id', propertyId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          setNotFound(true);
          return;
        }
        throw error;
      }

      if (!imovel) {
        setNotFound(true);
        return;
      }

      // Formatar dados para o formato do componente
      const formattedProperty: Property = {
        id: imovel.id,
        title: imovel.titulo || `${imovel.endereco_rua}, ${imovel.endereco_numero}`,
        images: imovel.fotos && imovel.fotos.length > 0
          ? imovel.fotos
          : ["/preview.png"],
        address: {
          street: imovel.endereco_rua,
          number: imovel.endereco_numero,
          complement: imovel.endereco_complemento,
          neighborhood: imovel.endereco_bairro,
          city: imovel.endereco_cidade,
          state: imovel.endereco_estado,
          zipCode: imovel.endereco_cep || '',
        },
        details: {
          bedrooms: imovel.quartos,
          bathrooms: imovel.banheiros,
          area: imovel.area_m2,
          garage: imovel.tem_garagem || false,
          garageSpots: imovel.tem_garagem ? 1 : 0,
          acceptsPets: imovel.aceita_pets || false,
          maxPeople: imovel.max_pessoas,
          acceptsChildren: imovel.aceita_criancas !== false,
        },
        rooms: imovel.comodos || [],
        pricing: {
          rent: imovel.valor_aluguel || 0,
          condominium: imovel.valor_condominio || 0,
          iptu: imovel.valor_iptu || 0,
          serviceFee: imovel.valor_taxa_servico || 0,
        },
        included: {
          water: imovel.inclui_agua || false,
          electricity: imovel.inclui_luz || false,
          internet: imovel.inclui_internet || false,
          gas: imovel.inclui_gas || false,
        },
        observations: imovel.descricao,
        owner: {
          name: imovel.profiles?.nome_completo || 'Proprietário',
          whatsapp: imovel.profiles?.telefone?.replace(/\D/g, '') || '',
        },
      };

      setProperty(formattedProperty);
    } catch (error) {
      console.error('Erro ao carregar imóvel:', error);
      toast.error('Erro ao carregar imóvel');
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppContact = () => {
    if (!property) return;

    const propertyLink = window.location.href;
    const message = encodeURIComponent(
      `Olá! Vi o imóvel\n\n*${property.title}*\n${propertyLink}\n\nE gostaria de mais informações.`
    );
    window.open(`https://wa.me/55${property.owner.whatsapp}?text=${message}`, "_blank");
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-16">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando imóvel...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Not found state
  if (notFound || !property) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-16">
            <Home className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Imóvel não encontrado</h2>
            <p className="text-muted-foreground mb-6">
              O imóvel que você procura não existe ou foi removido.
            </p>
            <Button
              className="bg-blue-500 hover:bg-blue-400"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const totalMonthly = property.pricing.rent + property.pricing.condominium + property.pricing.iptu + property.pricing.serviceFee;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 -px-4">
        {/* Navigation / Info text */}
        <div className="container px-4 py-4">
          {user ? (
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </button>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground py-2">
              <Info className="w-4 h-4 text-blue-500" />
              <span>Informações do Imóvel de {property.owner.name}</span>
            </div>
          )}
        </div>

        {/* Advanced Image Gallery */}
        <section className="container px-4 pb-8" aria-label="Galeria de fotos">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[300px] md:h-[500px] lg:h-[580px]">
            {/* Thumbnail Carousel (Left - Vertical) */}
            <div className="hidden lg:block lg:col-span-1 h-full overflow-hidden">
              <Carousel
                setApi={setThumbApi}
                orientation="vertical"
                className="w-full h-full"
                opts={{
                  loop: true,
                  align: "start",
                  containScroll: false
                }}
              >
                <CarouselContent className="h-full -mt-4">
                  {property.images.map((image, index) => (
                    <CarouselItem
                      key={index}
                      className="pt-4 basis-1/2 h-1/2"
                      onClick={() => mainApi?.scrollTo(index)}
                    >
                      <div className={cn(
                        "relative h-full w-full overflow-hidden rounded-xl border-2 transition-all duration-300 cursor-pointer",
                        selectedIndex === index
                          ? "border-blue-500 shadow-lg opacity-100"
                          : "border-transparent opacity-40 hover:opacity-100"
                      )}>
                        <img
                          src={image}
                          alt={`Miniatura ${index + 1}`}
                          className="w-[495px] h-[250px] object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}

                </CarouselContent>
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background/95 to-transparent"></div>
              </Carousel>
            </div>

            {/* Main Carousel (Right) */}
            <div className="lg:col-span-3 relative rounded-2xl overflow-hidden bg-muted shadow-xl border border-black/5 h-full">
              <Carousel
                setApi={setMainApi}
                className="w-full h-full group"
                opts={{
                  loop: true,
                  duration: 20
                }}
              >
                <CarouselContent className="h-full ml-0">
                  {property.images.map((image, index) => (
                    <CarouselItem key={index} className="h-full pl-0">
                      <div className="relative w-full h-full overflow-hidden">
                        <img
                          src={image}
                          alt={`Foto ${index + 1} do imóvel`}
                          className="w-full h-full md:h-[600px] lg:object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {/* Pagination Dots */}
                {property.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 transition-opacity opacity-100">
                    {property.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => mainApi?.scrollTo(index)}
                        className={cn(
                          "h-1.5 rounded-full transition-all duration-300",
                          selectedIndex === index
                            ? "w-6 bg-white shadow-sm"
                            : "w-1.5 bg-white/50 hover:bg-white/80"
                        )}
                        aria-label={`Ir para slide ${index + 1}`}
                      />
                    ))}
                  </div>
                )}

                {property.images.length > 1 && (
                  <>
                    <CarouselPrevious className="left-4 opacity-0 group-hover:opacity-100 transition-all bg-white/90 hover:bg-white border-none shadow-lg text-foreground h-11 w-11" />
                    <CarouselNext className="right-4 opacity-0 group-hover:opacity-100 transition-all bg-white/90 hover:bg-white border-none shadow-lg text-foreground h-11 w-11" />
                  </>
                )}
              </Carousel>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="container px-4 pb-16">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="animate-fade-in">
                <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
                  {property.title}
                </h1>
                <div className="mt-2 flex items-baseline gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-blue-500" aria-hidden="true" />
                  <span>
                    {property.address.street}, {property.address.number}
                    {property.address.complement && ` - ${property.address.complement}`}, {property.address.neighborhood}, {property.address.city} - {property.address.state}
                  </span>
                </div>

                {/* Quick Info */}
                <div className="mt-6 flex flex-wrap gap-3">
                  {property.details.bedrooms !== null && property.details.bedrooms > 0 && (
                    <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
                      <Bed className="h-4 w-4" aria-hidden="true" />
                      {property.details.bedrooms} quartos
                    </Badge>
                  )}
                  {property.details.bathrooms !== null && property.details.bathrooms > 0 && (
                    <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
                      <Bath className="h-4 w-4" aria-hidden="true" />
                      {property.details.bathrooms} banheiros
                    </Badge>
                  )}
                  {property.details.area !== null && property.details.area > 0 && (
                    <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
                      <Maximize className="h-4 w-4" aria-hidden="true" />
                      {property.details.area}m²
                    </Badge>
                  )}
                  {property.details.garage && (
                    <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
                      <Car className="h-4 w-4" aria-hidden="true" />
                      {property.details.garageSpots} vaga{property.details.garageSpots > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>

                {property.rooms.length > 0 && (
                  <>
                    <Separator className="my-8" />

                    {/* Rooms */}
                    <div>
                      <h2 className="font-display text-xl font-semibold">Cômodos</h2>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {property.rooms.map((room) => (
                          <Badge key={room} variant="outline" className="px-3 py-1.5">
                            {room}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <Separator className="my-8" />

                {/* Rules & Policies */}
                <div>
                  <h2 className="font-display text-xl font-semibold">Regras e políticas</h2>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${property.details.acceptsPets ? 'bg-blue-500/10' : 'bg-destructive/10'}`}>
                        <PawPrint className={`h-5 w-5 ${property.details.acceptsPets ? 'text-blue-500' : 'text-destructive'}`} aria-hidden="true" />
                      </div>
                      <span>{property.details.acceptsPets ? 'Aceita pets' : 'Não aceita pets'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${property.details.acceptsChildren ? 'bg-blue-500/10' : 'bg-destructive/10'}`}>
                        <Baby className={`h-5 w-5 ${property.details.acceptsChildren ? 'text-blue-500' : 'text-destructive'}`} aria-hidden="true" />
                      </div>
                      <span>{property.details.acceptsChildren ? 'Aceita crianças' : 'Não aceita crianças'}</span>
                    </div>
                    {property.details.maxPeople !== null && property.details.maxPeople > 0 && (
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                          <Users className="h-5 w-5 text-accent-foreground" aria-hidden="true" />
                        </div>
                        <span>Máximo {property.details.maxPeople} pessoas</span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator className="my-8" />

                {/* Included */}
                <div>
                  <h2 className="font-display text-xl font-semibold">Incluso no valor</h2>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${property.included.water ? 'bg-blue-500/10' : 'bg-muted'}`}>
                        <Droplets className={`h-5 w-5 ${property.included.water ? 'text-blue-500' : 'text-muted-foreground'}`} aria-hidden="true" />
                      </div>
                      <span className={property.included.water ? '' : 'text-muted-foreground'}>
                        Água {property.included.water ? 'inclusa' : 'não inclusa'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${property.included.electricity ? 'bg-blue-500/10' : 'bg-muted'}`}>
                        <Zap className={`h-5 w-5 ${property.included.electricity ? 'text-blue-500' : 'text-muted-foreground'}`} aria-hidden="true" />
                      </div>
                      <span className={property.included.electricity ? '' : 'text-muted-foreground'}>
                        Luz {property.included.electricity ? 'inclusa' : 'não inclusa'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${property.included.internet ? 'bg-blue-500/10' : 'bg-muted'}`}>
                        <Wifi className={`h-5 w-5 ${property.included.internet ? 'text-blue-500' : 'text-muted-foreground'}`} aria-hidden="true" />
                      </div>
                      <span className={property.included.internet ? '' : 'text-muted-foreground'}>
                        Internet {property.included.internet ? 'inclusa' : 'não inclusa'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${property.included.gas ? 'bg-blue-500/10' : 'bg-muted'}`}>
                        <Flame className={`h-5 w-5 ${property.included.gas ? 'text-blue-500' : 'text-muted-foreground'}`} aria-hidden="true" />
                      </div>
                      <span className={property.included.gas ? '' : 'text-muted-foreground'}>
                        Gás {property.included.gas ? 'incluso' : 'não incluso'}
                      </span>
                    </div>
                  </div>
                </div>

                {property.observations && (
                  <>
                    <Separator className="my-8" />
                    <div>
                      <h2 className="font-display text-xl font-semibold">Observações</h2>
                      <p className="mt-4 text-muted-foreground leading-relaxed">
                        {property.observations}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Sidebar - Pricing Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 animate-slide-in-right border-border/50 shadow-lg">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm text-muted-foreground">Aluguel</span>
                      <span className="text-2xl font-bold text-foreground">
                        R$ {property.pricing.rent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <Separator />

                    <div className="space-y-2 text-sm">
                      {property.pricing.condominium > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Condomínio</span>
                          <span>R$ {property.pricing.condominium.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </div>
                      )}
                      {property.pricing.iptu > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">IPTU</span>
                          <span>R$ {property.pricing.iptu.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </div>
                      )}
                      {property.pricing.serviceFee > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Taxa de serviço</span>
                          <span>R$ {property.pricing.serviceFee.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div className="flex items-baseline justify-between">
                      <span className="font-medium">Total mensal</span>
                      <span className="text-xl font-bold text-primary">
                        R$ {totalMonthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    {property.owner.whatsapp && (
                      <>
                        <Button
                          size="lg"
                          className="mt-4 w-full gap-2 text-base bg-blue-500 hover:bg-blue-400"
                          onClick={handleWhatsAppContact}
                        >
                          <MessageCircle className="h-5 w-5" aria-hidden="true" />
                          Falar com proprietário
                        </Button>

                        <p className="text-center text-xs text-muted-foreground">
                          Contato direto via WhatsApp
                        </p>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}