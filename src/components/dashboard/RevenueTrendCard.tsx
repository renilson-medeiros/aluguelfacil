"use client";

import { memo, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingUp, TrendingDown, Calendar, ArrowRight, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface RevenueData {
    month: string;
    total: number;
}

interface RevenueTrendCardProps {
    data: RevenueData[];
}

function RevenueTrendCard({ data }: RevenueTrendCardProps) {
    const hasData = data && data.length >= 2;
    
    const metrics = useMemo(() => {
        if (!hasData) return null;
        const current = data[data.length - 1];
        const last = data[data.length - 2];
        const diff = current.total - last.total;
        const percentChange = last.total > 0 ? (diff / last.total) * 100 : 0;
        
        const maxVal = Math.max(...data.map(d => d.total), 1);
        const points = data.map((d, i) => {
            const x = (i / (data.length - 1)) * 100;
            const y = 100 - (d.total / maxVal) * 90; // Um pouco mais de altura
            return `${x},${y}`;
        }).join(" ");

        return { current, last, diff, percentChange, points, isPositive: diff >= 0 };
    }, [data, hasData]);

    if (!hasData || !metrics) {
        return (
            <Card className="lg:col-span-2 border-dashed">
                <CardContent className="flex h-40 flex-col items-center justify-center text-center">
                    <div className="p-3 bg-gray-100 rounded-full mb-3">
                        <Wallet className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">Dados de receita insuficientes para projeção.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="lg:col-span-2 shadow-sm border-gray-200/60 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 px-6 pt-6">
                <div className="space-y-1">
                    <CardTitle className="text-lg font-semibold tracking-tight">Receita e Evolução</CardTitle>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Últimos 6 meses</span>
                    </div>
                </div>
                <div className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    metrics.isPositive 
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" 
                        : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                )}>
                    {metrics.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {metrics.percentChange > 0 ? `+${metrics.percentChange.toFixed(1)}%` : `${metrics.percentChange.toFixed(1)}%`}
                </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Main Metric */}
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Mês Atual</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold tracking-tighter">
                                {metrics.current.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-medium italic">Ref: {metrics.current.month}</p>
                    </div>

                    {/* Comparison 1 */}
                    <div className="space-y-1 border-l border-gray-100 dark:border-gray-800 pl-6">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Mês Anterior</p>
                        <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                                {metrics.last.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                        </div>
                    </div>

                    {/* Comparison 2 */}
                    <div className="space-y-1 border-l border-gray-100 dark:border-gray-800 pl-6">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Variação Nominal</p>
                        <div className={cn(
                            "flex items-baseline gap-1 mt-1 font-bold text-xl",
                            metrics.isPositive ? "text-emerald-600" : "text-red-600"
                        )}>
                            {metrics.isPositive ? "+" : ""}{metrics.diff.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </div>
                    </div>
                </div>

                {/* Sparkling / Interactive Line Area */}
                <div className="relative pt-4 overflow-hidden border-t border-gray-50 dark:border-gray-900">
                    <div className="absolute top-2 left-0 flex items-center gap-2">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Tendência</span>
                    </div>
                    <div className="h-20 w-full mt-6 opacity-60">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="revenue-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="rgb(37, 99, 235)" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="rgb(37, 99, 235)" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path
                                d={`M 0,100 L ${metrics.points} L 100,100 Z`}
                                fill="url(#revenue-gradient)"
                            />
                            <polyline
                                fill="none"
                                stroke="rgb(37, 99, 235)"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                points={metrics.points}
                            />
                            {/* Pontos nas extremidades */}
                            <circle cx="0" cy="100" r="1.5" fill="rgb(37, 99, 235)" />
                            <circle cx="100" cy={metrics.points.split(' ').pop()?.split(',')[1]} r="1.5" fill="rgb(37, 99, 235)" />
                        </svg>
                    </div>
                </div>

                {/* Professional Footer Insight */}
                <div className="mt-6 flex items-center gap-3 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-800/20">
                    <div className="p-1.5 bg-blue-100 dark:bg-blue-800/40 rounded-md">
                        <Info className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-[11px] text-blue-900/80 dark:text-blue-200/70 font-medium leading-normal">
                        {metrics.isPositive 
                            ? `Seu negócio está em crescimento. O faturamento deste mês superou o anterior em ${metrics.percentChange.toFixed(1)}%.` 
                            : `Houve uma retração de ${Math.abs(metrics.percentChange).toFixed(1)}%. Avalie possíveis causas de vacância.`}
                    </p>
                    <ArrowRight className="h-3 w-3 text-blue-400 ml-auto shrink-0" />
                </div>
            </CardContent>
        </Card>
    );
}

export default memo(RevenueTrendCard);
