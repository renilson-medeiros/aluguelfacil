"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    AlertTriangle,
    UserPlus,
    Settings,
    MessageCircle
} from "lucide-react";
import { Property } from "@/types/property";

interface PropertySidebarProps {
    property: Property;
    isOwner: boolean;
    onTerminate: () => void;
    onChangeTenant: () => void;
    onEdit: () => void;
    onContact: () => void;
}

export function PropertySidebar({
    property,
    isOwner,
    onTerminate,
    onChangeTenant,
    onEdit,
    onContact
}: PropertySidebarProps) {
    const totalMonthly = property.pricing.rent + property.pricing.condominium + property.pricing.iptu + property.pricing.serviceFee;

    return (
        <Card className="border-primary/10 shadow-sm overflow-hidden sticky top-24">
            <CardContent className="p-6">
                <div className="mb-6">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Valor total mensal</p>
                    <div className="mt-2 flex items-baseline gap-1">
                        <span className="text-sm font-medium text-muted-foreground">R$</span>
                        <span className="font-display text-4xl font-bold">{totalMonthly.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                </div>

                <div className="space-y-4 text-sm">
                    <div className="flex justify-between border-b pb-4">
                        <span className="text-muted-foreground">Aluguel:</span>
                        <span className="font-medium">{property.pricing.rent.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    </div>
                    {property.pricing.condominium > 0 && (
                        <div className="flex justify-between border-b pb-4">
                            <span className="text-muted-foreground">Condomínio:</span>
                            <span className="font-medium">{property.pricing.condominium.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </div>
                    )}
                    {property.pricing.iptu > 0 && (
                        <div className="flex justify-between border-b pb-4">
                            <span className="text-muted-foreground">IPTU:</span>
                            <span className="font-medium">{property.pricing.iptu.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </div>
                    )}
                    {property.pricing.serviceFee > 0 && (
                        <div className="flex justify-between border-b pb-4">
                            <span className="text-muted-foreground">Taxa de Serviço:</span>
                            <span className="font-medium">{property.pricing.serviceFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </div>
                    )}
                </div>

                <div className="mt-8 space-y-3">
                    {isOwner ? (
                        <>
                            <Button
                                className={`w-full h-12 text-base ${property.status === 'alugado' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-tertiary hover:bg-tertiary/90'}`}
                                onClick={() => {
                                    if (property.status === 'alugado') {
                                        onTerminate();
                                    } else {
                                        onChangeTenant(); // Reuse for register as mostly same flow starter or special handler in parent
                                    }
                                }}
                            >
                                {property.status === 'alugado' ? (
                                    <>
                                        <AlertTriangle className="h-4 w-4 mr-2" />
                                        Encerrar Contrato
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="h-4 w-4 mr-2" />
                                        Registrar Inquilino
                                    </>
                                )}
                            </Button>

                            {property.status === 'alugado' && (
                                <Button
                                    variant="outline"
                                    className="w-full h-12 border-dashed border-2"
                                    onClick={onChangeTenant}
                                >
                                    <UserPlus className="h-4 w-4 mr-2" />
                                    Trocar Inquilino
                                </Button>
                            )}

                            <Button
                                variant="outline"
                                className="w-full h-12"
                                onClick={onEdit}
                            >
                                <Settings className="h-4 w-4 mr-2" />
                                Editar Imóvel
                            </Button>
                        </>
                    ) : (
                        <Button
                            className="w-full bg-green-600 hover:bg-green-700 h-14 text-base shadow-lg shadow-green-200"
                            onClick={onContact}
                        >
                            <MessageCircle className="h-5 w-5 mr-2" />
                            Conversar com Proprietário
                        </Button>
                    )}
                </div>

                <p className="mt-4 text-center text-xs text-muted-foreground">
                    Código do imóvel: <span className="font-mono bg-green-600/10 text-green-600 px-1 rounded">{property.id.slice(0, 8)}</span>
                </p>
            </CardContent>
        </Card>
    );
}
