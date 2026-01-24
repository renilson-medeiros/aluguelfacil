"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowLeft, Info, Loader2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Property, HistoricalTenant } from "@/types/property";

// Components
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { PropertyInfo } from "@/components/property/PropertyInfo";
import { PropertyHistory } from "@/components/property/PropertyHistory";
import { PropertySidebar } from "@/components/property/PropertySidebar";

interface PropertyDetailClientProps {
    initialData: Property;
}

export default function PropertyDetailClient({ initialData }: PropertyDetailClientProps) {
    const router = useRouter();
    const params = useParams();
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
    const { user } = useAuth();
    
    // State
    const [property] = useState<Property>(initialData);
    const [tenants, setTenants] = useState<HistoricalTenant[]>([]);
    const [loadingTenants, setLoadingTenants] = useState(false);
    const [isTerminating, setIsTerminating] = useState(false);
    const [showTerminateDialog, setShowTerminateDialog] = useState(false);
    const [isChanging, setIsChanging] = useState(false);

    // Load tenants only if owner
    useEffect(() => {
        if (property && user && user.id === property.owner.id) {
            loadTenants(property.id);
        }
    }, [property, user]);

    const loadTenants = async (propertyId: string) => {
        try {
            setLoadingTenants(true);
            const { data, error } = await supabase
                .from('inquilinos')
                .select('id, nome_completo, data_inicio, data_fim, status, valor_aluguel')
                .eq('imovel_id', propertyId)
                .order('data_inicio', { ascending: false });

            if (error) throw error;
            setTenants(data || []);
        } catch (error) {
            console.error('Erro ao carregar inquilinos:', error);
        } finally {
            setLoadingTenants(false);
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

    const handleTerminateLease = async (isChangeFlow = false) => {
        try {
            if (!id) return;
            setIsTerminating(true);

            // 1. Encontrar o inquilino ativo para este imóvel
            const { data: inquilino } = await supabase
                .from('inquilinos')
                .select('id')
                .eq('imovel_id', id)
                .eq('status', 'ativo')
                .single();

            if (inquilino) {
                // 2. Buscar todos os comprovantes do inquilino para deletar PDFs
                const { data: comprovantes } = await supabase
                    .from('comprovantes')
                    .select('pdf_url')
                    .eq('inquilino_id', inquilino.id);

                // 3. Deletar PDFs do Storage
                if (comprovantes && comprovantes.length > 0) {
                    const pdfPaths = comprovantes
                        .filter(c => c.pdf_url)
                        .map(c => {
                            const url = new URL(c.pdf_url!);
                            const pathParts = url.pathname.split('/');
                            const bucketIndex = pathParts.findIndex(p => p === 'imoveis-fotos');
                            return pathParts.slice(bucketIndex + 1).join('/');
                        });

                    if (pdfPaths.length > 0) {
                        await supabase.storage
                            .from('imoveis-fotos')
                            .remove(pdfPaths);
                    }
                }

                // 4. Deletar comprovantes do banco
                await supabase
                    .from('comprovantes')
                    .delete()
                    .eq('inquilino_id', inquilino.id);

                // 5. Inativar o inquilino
                await supabase
                    .from('inquilinos')
                    .update({
                        status: 'inativo',
                        data_fim: new Date().toISOString().split('T')[0]
                    })
                    .eq('id', inquilino.id);
            }

            // 6. Voltar o imóvel para disponível
            const { error: propertyError } = await supabase
                .from('imoveis')
                .update({ status: 'disponivel' })
                .eq('id', id);

            if (propertyError) throw propertyError;

            toast.success('Locação finalizada!', {
                description: 'Comprovantes e PDFs foram removidos.'
            });

            if (!isChangeFlow) {
                // Refresh data via router since we are using SSR now
                router.refresh(); 
            }
        } catch (error) {
            console.error('Erro ao finalizar locação:', error);
            toast.error('Erro ao finalizar locação');
        } finally {
            setIsTerminating(false);
            setShowTerminateDialog(false);
        }
    };

    const handleChangeTenant = async () => {
        if (!id) return;
        setIsChanging(true);
        await handleTerminateLease(true);
        router.push(`/dashboard/imoveis/${id}/inquilino`);
    };

    const isOwner = user?.id === property.owner.id;

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
                            <Info className="w-4 h-4 text-tertiary" />
                            <span>Informações do Imóvel de {property.owner.name}</span>
                        </div>
                    )}
                </div>

                <PropertyGallery 
                    images={property.images} 
                    title={property.title} 
                />

                <section className="container px-4 pb-16">
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <PropertyInfo property={property} />
                            
                            {isOwner && (
                                <PropertyHistory 
                                    tenants={tenants} 
                                    loading={loadingTenants} 
                                />
                            )}
                        </div>

                        {/* Sidebar (Pricing & Actions) */}
                        <div className="space-y-6 lg:col-span-1">
                            <PropertySidebar 
                                property={property}
                                isOwner={isOwner}
                                onTerminate={() => setShowTerminateDialog(true)}
                                onChangeTenant={handleChangeTenant}
                                onEdit={() => router.push(`/dashboard/imoveis/${property.id}/editar`)}
                                onContact={handleWhatsAppContact}
                            />

                            {/* Owner Info (if not owner) */}
                            {!isOwner && (
                                <Card>
                                    <CardContent className="p-6 flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary font-bold text-lg">
                                            {property.owner.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">{property.owner.name}</p>
                                            <p className="text-sm text-muted-foreground">Proprietário verificado</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </section>

                {/* Terminate Lease Dialog */}
                <AlertDialog open={showTerminateDialog} onOpenChange={setShowTerminateDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Encerrar contrato de locação?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta ação irá alterar o status do imóvel para "Disponível" e mover o inquilino atual para o histórico.
                                <br /><br />
                                <span className="font-semibold text-red-600">Atenção:</span> Todos os comprovantes e arquivos associados a esta locação serão excluídos permanentemente para liberar espaço.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isTerminating}>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-destructive hover:bg-destructive/90"
                                onClick={() => handleTerminateLease()}
                                disabled={isTerminating}
                            >
                                {isTerminating ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        Encerrando...
                                    </>
                                ) : (
                                    "Sim, encerrar contrato"
                                )}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </main>

            <Footer />
        </div>
    );
}
