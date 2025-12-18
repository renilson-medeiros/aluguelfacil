import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Users, Receipt, Plus, ArrowRight, TrendingUp, Home } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface DashboardStats {
  totalImoveis: number;
  inquilinosAtivos: number;
  comprovantesGerados: number;
}

interface RecentProperty {
  id: string;
  endereco_rua: string;
  endereco_numero: string;
  status: string;
  inquilino_nome?: string;
}

export default function Dashboard() {
  // 🔥 CHAMAR useAuth NO TOPO (antes de qualquer outro código)
  const { profile, loading: authLoading } = useAuth();

  const [stats, setStats] = useState<DashboardStats>({
    totalImoveis: 0,
    inquilinosAtivos: 0,
    comprovantesGerados: 0,
  });
  const [recentProperties, setRecentProperties] = useState<RecentProperty[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar dados do dashboard
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Buscar total de imóveis
      const { count: totalImoveis } = await supabase
        .from('imoveis')
        .select('*', { count: 'exact', head: true });

      // Buscar inquilinos ativos
      const { count: inquilinosAtivos } = await supabase
        .from('inquilinos')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'ativo');

      // Buscar total de comprovantes
      const { count: comprovantesGerados } = await supabase
        .from('comprovantes')
        .select('*', { count: 'exact', head: true });

      // Buscar imóveis recentes (últimos 3)
      const { data: imoveisRecentes } = await supabase
        .from('imoveis')
        .select(`
          id,
          endereco_rua,
          endereco_numero,
          status,
          inquilinos(nome_completo)
        `)
        .order('created_at', { ascending: false })
        .limit(3);

      // Formatar imóveis recentes
      const formattedProperties = imoveisRecentes?.map(imovel => ({
        id: imovel.id,
        endereco_rua: imovel.endereco_rua,
        endereco_numero: imovel.endereco_numero,
        status: imovel.status,
        inquilino_nome: Array.isArray(imovel.inquilinos) && imovel.inquilinos.length > 0
          ? imovel.inquilinos[0].nome_completo
          : null,
      })) || [];

      setStats({
        totalImoveis: totalImoveis || 0,
        inquilinosAtivos: inquilinosAtivos || 0,
        comprovantesGerados: comprovantesGerados || 0,
      });
      setRecentProperties(formattedProperties);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    {
      label: "Imóveis cadastrados",
      value: stats.totalImoveis.toString(),
      icon: Building2,
      href: "/dashboard/imoveis"
    },
    {
      label: "Inquilinos ativos",
      value: stats.inquilinosAtivos.toString(),
      icon: Users,
      href: "/dashboard/inquilinos"
    },
    {
      label: "Comprovantes gerados",
      value: stats.comprovantesGerados.toString(),
      icon: Receipt,
      href: "/dashboard/comprovantes"
    },
  ];

  // 🔥 PEGAR O PRIMEIRO NOME
  const firstName = profile?.nome_completo?.split(' ')[0] || 'Usuário';

  // 🔥 MOSTRAR LOADING ENQUANTO AUTH CARREGA
  if (authLoading) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">Painel</h1>
            <p className="text-muted-foreground">
              Olá {firstName}! Aqui está o resumo dos seus imóveis.
            </p>
          </div>
          <Link href="/dashboard/imoveis/novo">
            <Button className="gap-2 bg-blue-500 hover:bg-blue-400">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Novo imóvel
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="h-12 w-12 rounded-xl bg-accent" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-20 rounded bg-accent" />
                    <div className="h-6 w-12 rounded bg-accent" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            statsData.map((stat, index) => (
              <Link key={stat.label} href={stat.href}>
                <Card
                  className="group transition-all duration-300 hover:border-blue-500/30 hover:shadow-lg"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent transition-colors group-hover:bg-primary/10">
                      <stat.icon className="h-6 w-6 text-blue-500" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="font-display text-2xl font-bold">{stat.value}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>

        {/* Recent Properties */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-lg">Imóveis recentes</CardTitle>
            {recentProperties.length > 0 && (
              <Link href="/dashboard/imoveis">
                <Button variant="ghost" size="sm" className="gap-1">
                  Ver todos
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              // Loading skeleton
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-border/50 p-4 animate-pulse"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-accent" />
                      <div className="space-y-2">
                        <div className="h-4 w-32 rounded bg-accent" />
                        <div className="h-3 w-24 rounded bg-accent" />
                      </div>
                    </div>
                    <div className="h-6 w-20 rounded-full bg-accent" />
                  </div>
                ))}
              </div>
            ) : recentProperties.length > 0 ? (
              <div className="space-y-4">
                {recentProperties.map((property) => (
                  <div
                    key={property.id}
                    className="flex items-center justify-between rounded-lg border border-border/50 p-4 transition-colors hover:bg-accent/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                        <Building2 className="h-5 w-5 text-blue-500" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {property.endereco_rua}, {property.endereco_numero}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {property.inquilino_nome || "Sem inquilino"}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${property.status === "alugado"
                        ? "bg-success/10 text-success"
                        : "bg-warning/10 text-warning"
                        }`}
                    >
                      {property.status === "alugado" ? "Ocupado" : "Disponível"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              // Estado vazio - Nenhum imóvel cadastrado
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                  <Home className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                </div>
                <h3 className="mb-2 font-medium text-lg">Nenhum imóvel cadastrado</h3>
                <p className="mb-6 text-sm text-muted-foreground max-w-sm">
                  Comece cadastrando seu primeiro imóvel para gerenciar aluguéis e inquilinos.
                </p>
                <Link href="/dashboard/imoveis/novo">
                  <Button className="gap-2 bg-blue-500 hover:bg-blue-400">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Cadastrar primeiro imóvel
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Tip */}
        <Card className="border-blue-500 bg-blue-500">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-400">
              <TrendingUp className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-white">Dica: Compartilhe seus imóveis</p>
              <p className="text-sm text-white/80">
                Gere links únicos para cada imóvel e compartilhe nas redes sociais para atrair mais inquilinos.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}