"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { HistoricalTenant } from "@/types/property";

interface PropertyHistoryProps {
    tenants: HistoricalTenant[];
    loading: boolean;
}

export function PropertyHistory({ tenants, loading }: PropertyHistoryProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    const totalPages = Math.ceil(tenants.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentTenants = tenants.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <>
            <Separator className="my-8" />
            <div>
                <div className="flex items-center justify-between">
                    <h2 className="font-display text-xl font-semibold">Histórico de Locações</h2>
                    <Badge variant="outline" className="font-normal text-muted-foreground">
                        {tenants.length} registro{tenants.length !== 1 ? 's' : ''}
                    </Badge>
                </div>

                <div className="mt-6 space-y-4">
                    {loading ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Carregando histórico...
                        </div>
                    ) : tenants.length > 0 ? (
                        <div className="rounded-lg w-full border border-border overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="text-sm text-left w-full">
                                    <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                                        <tr>
                                            <th className="px-4 py-3 font-medium">Inquilino</th>
                                            <th className="px-4 py-3 font-medium">Período</th>
                                            <th className="px-4 py-3 font-medium">Valor</th>
                                            <th className="px-4 py-3 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {currentTenants.map((tenant) => (
                                            <tr key={tenant.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="px-4 py-4 font-medium">{tenant.nome_completo}</td>
                                                <td className="px-4 py-4 text-muted-foreground">
                                                    {new Date(tenant.data_inicio).toLocaleDateString('pt-BR', { month: '2-digit', year: '2-digit' })} - {tenant.data_fim ? new Date(tenant.data_fim).toLocaleDateString('pt-BR', { month: '2-digit', year: '2-digit' }) : 'Atual'}
                                                </td>
                                                <td className="px-4 py-4">
                                                    {tenant.valor_aluguel.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <Badge variant={tenant.status === 'ativo' ? 'default' : 'secondary'}>
                                                        {tenant.status}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {totalPages > 1 && (
                                <div className="flex items-center justify-between border-t border-border px-4 py-3 bg-muted/20">
                                    <div className="text-xs text-muted-foreground">
                                        Página {currentPage} de {totalPages}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={goToPreviousPage}
                                            disabled={currentPage === 1}
                                            className="h-8 w-8 p-0"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={goToNextPage}
                                            disabled={currentPage === totalPages}
                                            className="h-8 w-8 p-0"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
                            <Users className="h-8 w-8 mb-2 opacity-50" />
                            <p>Nenhum histórico encontrado para este imóvel.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
