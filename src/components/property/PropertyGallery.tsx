"use client";

import { useState, useEffect } from "react";
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface PropertyGalleryProps {
    images: string[];
    title: string;
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
    const [mainApi, setMainApi] = useState<CarouselApi>();
    const [thumbApi, setThumbApi] = useState<CarouselApi>();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    // Sync carousels and update selected index
    useEffect(() => {
        if (!mainApi || !thumbApi) return;

        const onSelect = () => {
            const index = mainApi.selectedScrollSnap();
            setSelectedIndex(index);
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
        setSelectedIndex(mainApi.selectedScrollSnap());

        return () => {
            mainApi.off("select", onSelect);
            thumbApi.off("select", onThumbSelect);
        };
    }, [mainApi, thumbApi]);

    return (
        <>
            <section className="container px-4 pb-8" aria-label="Galeria de fotos">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[300px] md:h-[500px] lg:h-[580px]">
                    {/* Main Carousel (Left) */}
                    <div className="lg:col-span-3 relative rounded-lg overflow-hidden bg-muted shadow-sm border border-black/5 h-full">
                        <Carousel
                            setApi={setMainApi}
                            className="w-full h-full group"
                            opts={{ loop: true, duration: 20 }}
                        >
                            <CarouselContent className="h-full ml-0">
                                {images.map((image, index) => (
                                    <CarouselItem key={index} className="h-full pl-0">
                                        <div
                                            className="relative w-full h-full overflow-hidden cursor-zoom-in"
                                            onClick={() => {
                                                setSelectedIndex(index);
                                                setIsLightboxOpen(true);
                                            }}
                                        >
                                            <Image
                                                src={image}
                                                alt={`Foto ${index + 1} de ${title}`}
                                                fill
                                                className="object-cover hover:scale-105 transition-transform duration-500"
                                                priority={index === 0}
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw"
                                            />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>

                            {images.length > 1 && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 transition-opacity opacity-100">
                                    {images.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => mainApi?.scrollTo(index)}
                                            className={cn(
                                                "h-1.5 rounded-full transition-all duration-300",
                                                selectedIndex === index
                                                    ? "w-6 bg-tertiary shadow-sm"
                                                    : "w-1.5 bg-white/50 hover:bg-white/80"
                                            )}
                                            aria-label={`Ir para slide ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            )}

                            {images.length > 1 && (
                                <>
                                    <CarouselPrevious className="left-4 opacity-0 group-hover:opacity-100 transition-all bg-white/90 hover:bg-white border-none shadow-lg text-foreground h-11 w-11" />
                                    <CarouselNext className="right-4 opacity-0 group-hover:opacity-100 transition-all bg-white/90 hover:bg-white border-none shadow-lg text-foreground h-11 w-11" />
                                </>
                            )}
                        </Carousel>
                    </div>

                    {/* Thumbnail Carousel (Right - Vertical) */}
                    <div className="hidden lg:block lg:col-span-1 h-full overflow-hidden">
                        <Carousel
                            setApi={setThumbApi}
                            orientation="vertical"
                            className="w-full h-full"
                            opts={{ loop: true, align: "start", containScroll: false }}
                        >
                            <CarouselContent className="h-full -mt-4">
                                {images.map((image, index) => (
                                    <CarouselItem
                                        key={index}
                                        className="pt-4 basis-1/2 h-1/2"
                                        onClick={() => mainApi?.scrollTo(index)}
                                    >
                                        <div className={cn(
                                            "relative h-full w-full overflow-hidden rounded-lg border-2 transition-all duration-300 cursor-pointer",
                                            selectedIndex === index
                                                ? "border-tertiary shadow-lg opacity-100"
                                                : "border-transparent opacity-40 hover:opacity-100"
                                        )}>
                                            <Image
                                                src={image}
                                                alt={`Miniatura ${index + 1}`}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 1200px) 25vw, 20vw"
                                            />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-background/95 to-transparent"></div>
                        </Carousel>
                    </div>
                </div>
            </section>

            {isLightboxOpen && (
                <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
                    <DialogContent className="max-w-[100vw] h-screen p-0 bg-black/95 border-none z-[150] flex flex-col items-center justify-center outline-none [&>button.opacity-70]:hidden">
                        <DialogTitle className="sr-only">Galeria de fotos</DialogTitle>
                        <button
                            onClick={() => setIsLightboxOpen(false)}
                            className="absolute cursor-pointer right-4 top-4 z-[160] rounded-full bg-tertiary p-2 text-white/70 backdrop-blur-sm transition-colors hover:bg-tertiary hover:text-white sm:right-8 sm:top-8"
                            aria-label="Fechar galeria"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        <Carousel
                            setApi={setMainApi}
                            className="w-full h-full flex items-center justify-center"
                            opts={{ loop: true, startIndex: selectedIndex }}
                        >
                            <CarouselContent className="h-full m-0 p-0">
                                {images.map((image, index) => (
                                    <CarouselItem key={index} className="h-full flex items-center justify-center p-0 pl-0">
                                        <div className="relative w-full h-full flex items-center justify-center">
                                            <Image
                                                src={image}
                                                alt={`Foto ${index + 1} ampliada`}
                                                fill
                                                className="max-h-[85vh] max-w-[95vw] object-contain select-none"
                                                sizes="100vw"
                                            />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>

                            {images.length > 1 && (
                                <>
                                    <CarouselPrevious className="fixed left-2 sm:left-4 top-1/2 -translate-y-1/2 h-12 w-12 border-none bg-background text-tertiary hover:text-tertiary hover:bg-background/80 z-[160] active:scale-95 transition-all" />
                                    <CarouselNext className="fixed right-2 sm:right-4 top-1/2 -translate-y-1/2 h-12 w-12 border-none bg-background text-tertiary hover:text-tertiary hover:bg-background/80 z-[160] active:scale-95 transition-all" />
                                </>
                            )}
                        </Carousel>

                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[160] flex gap-2 overflow-x-auto max-w-[90vw] p-2 no-scrollbar">
                            {images.map((_, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "h-1.5 rounded-full transition-all duration-300 shadow-sm",
                                        selectedIndex === index ? "bg-tertiary w-6" : "w-1.5 bg-white/40"
                                    )}
                                />
                            ))}
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}
