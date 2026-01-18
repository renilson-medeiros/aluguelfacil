"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Home,
  Building2,
  Users,
  Receipt,
  Settings,
  LogOut,
  Menu,
  Plus,
  Lock,
  User,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/ui/Logo";
import { Paywall } from "@/components/dashboard/Paywall";
import { CompleteProfileForm } from "@/components/dashboard/CompleteProfileForm";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { icon: Home, label: "Painel", href: "/dashboard" },
  { icon: Building2, label: "Imóveis", href: "/dashboard/imoveis" },
  { icon: Users, label: "Inquilinos", href: "/dashboard/inquilinos" },
  { icon: Receipt, label: "Comprovantes", href: "/dashboard/comprovantes" },
  { icon: Settings, label: "Configurações", href: "/dashboard/configuracoes" },
];

function NavItem({
  item,
  isActive,
  disabled,
  isCollapsed,
  onClick
}: {
  item: typeof menuItems[0];
  isActive: boolean;
  disabled?: boolean;
  isCollapsed?: boolean;
  onClick?: () => void
}) {
  if (disabled) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium opacity-50 cursor-not-allowed text-muted-foreground",
          isCollapsed && "justify-center px-2"
        )}
      >
        <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
        {!isCollapsed && (
          <>
            {item.label}
            <Lock className="h-3 w-3 ml-auto text-muted-foreground/50" />
          </>
        )}
      </div>
    );
  }

  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <Link
          href={item.href}
          onClick={onClick}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200",
            isActive
              ? "bg-primary/10 text-tertiary"
              : "text-tertiary/90 hover:bg-tertiary hover:text-white",
            isCollapsed && "justify-start pl-[14px]"
          )}
          aria-current={isActive ? "page" : undefined}
        >
          <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
          {!isCollapsed && item.label}
        </Link>
      </TooltipTrigger>
      {isCollapsed && (
        <TooltipContent side="right" className="font-medium">
          {item.label}
        </TooltipContent>
      )}
    </Tooltip>
  );
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { signOut, user, profile, resendConfirmationEmail } = useAuth();
  const [isResending, setIsResending] = useState(false);

  const handleLogout = async () => {
    await signOut();
    router.refresh();
    router.replace("/login");
  };

  const handleResendEmail = async () => {
    if (!profile?.email) return;
    setIsResending(true);
    try {
      await resendConfirmationEmail(profile.email);
      toast.success("E-mail de confirmação reenviado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao reenviar e-mail:", error);
      toast.error(error.message || "Erro ao reenviar e-mail de confirmação.");
    } finally {
      setIsResending(false);
    }
  };

  // Verificação de Trial Expirado (Paywall)
  const isExpired = !!(
    profile?.subscription_status === 'trial' &&
    profile?.expires_at &&
    new Date(profile.expires_at) < new Date()
  );

  const isSettingsPage = pathname === "/dashboard/configuracoes";

  // Verificação de Perfil Incompleto (Mandatório para WhatsApp e CPF)
  const isProfileIncomplete = !!(profile && (!profile.telefone || !profile.cpf));

  return (
    <div className="min-h-screen bg-primary/5">
      {/* Banner de Confirmação de E-mail */}
      {user && !user.email_confirmed_at && (
        <div className="bg-amber-500 text-white py-2 px-4 sticky top-0 z-100 shadow-md">
          <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>Sua conta ainda não foi confirmada. Verifique seu e-mail para ter acesso completo.</span>
            </div>
            <Button 
              variant="secondary" 
              size="sm" 
              className="h-8 text-xs bg-white text-amber-600 hover:bg-white/90 shrink-0"
              onClick={handleResendEmail}
              disabled={isResending}
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Reenviar link de confirmação"
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <TooltipProvider>
        <aside 
          className={cn(
            "fixed inset-y-0 left-0 z-50 hidden border-r border-border/40 bg-card lg:block transition-all duration-300",
            isCollapsed ? "w-20 transition-all duration-300" : "w-64"
          )}
        >
          <div className="flex h-full flex-col">
            <div className={cn(
              "flex h-16 items-center border-b border-border/40 px-6",
              isCollapsed && "justify-start pl-[17px]"
            )}>
              <Logo iconOnly={isCollapsed} />
              {!isCollapsed && (
                <div className="absolute -right-3 top-5">
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-auto h-6 w-6 text-muted-foreground rounded-full bg-white border border-border hover:bg-tertiary hover:border-tertiary hover:text-white"
                        onClick={() => setIsCollapsed(true)}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">Colapsar menu</TooltipContent>
                  </Tooltip>
                </div>
              )}

              {isCollapsed && (
              <div className="absolute -right-3 top-5">
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground rounded-full bg-white border border-border hover:bg-tertiary hover:border-tertiary hover:text-white"
                      onClick={() => setIsCollapsed(false)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Expandir menu</TooltipContent>
                </Tooltip>
              </div>
            )}
            </div>

            <nav className="flex-1 space-y-2 overflow-hidden p-4" aria-label="Menu do painel">
              {menuItems.map((item) => {
                const isDisabled = isExpired && item.href !== "/dashboard/configuracoes" && item.href !== "/dashboard";
                return (
                  <NavItem
                    key={item.href}
                    item={item}
                    isActive={pathname === item.href}
                    disabled={isDisabled}
                    isCollapsed={isCollapsed}
                  />
                );
              })}
            </nav>

            <div className="border-t border-border/40 p-4">

              <div className={cn(
                "flex items-center gap-2 py-4",
                isCollapsed && "justify-start ml-1"
              )}>

                <span className="text-xl rounded-lg bg-primary/10 text-tertiary w-10 h-10 flex items-center justify-center font-bold shrink-0">
                  {profile?.nome_completo[0]}
                </span>

                {!isCollapsed && (
                  <div className="flex flex-col items-start gap-1 overflow-hidden">
                    <p className="text-sm text-secondary font-medium truncate w-full">{profile?.nome_completo}</p>
                    <p className="text-xs text-secondary/70 font-medium truncate w-full">{profile?.email}</p>
                  </div>
                )}
              </div>

              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-red-600 hover:text-white hover:bg-red-500",
                      isCollapsed && "justify-start w-fit pl-[17px]"
                    )}
                    onClick={handleLogout}
                  >
                    <LogOut className={cn("h-5 w-5 ", !isCollapsed && "mr-3")} aria-hidden="true" />
                    {!isCollapsed && "Sair"}
                  </Button>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right">Sair</TooltipContent>
                )}
              </Tooltip>
            </div>
          </div>
        </aside>
      </TooltipProvider>

      {/* Mobile Header */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/95 backdrop-blur lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <Logo size="sm" />
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Abrir menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-96 p-0">
              <div className="flex h-full flex-col">
                <div className="flex h-16 items-center gap-2 border-b border-border/40 px-6">
                  <span className="font-display text-lg font-semibold">Menu</span>
                </div>

                <nav className="flex-1 space-y-1 p-4" aria-label="Menu mobile">
                  {menuItems.map((item) => {
                    const isDisabled = isExpired && item.href !== "/dashboard/configuracoes" && item.href !== "/dashboard";
                    return (
                      <NavItem
                        key={item.href}
                        item={item}
                        isActive={pathname === item.href}
                        disabled={isDisabled}
                        onClick={() => setIsOpen(false)}
                      />
                    );
                  })}
                </nav>

                <div className="border-t border-border/40 p-4">
                  <div className="flex items-center gap-2 py-4">

                    <span className="text-xl rounded-lg bg-primary/10 text-tertiary w-10 h-10 flex items-center justify-center font-bold">
                      {profile?.nome_completo[0]}
                    </span>

                    <div className="flex flex-col items-start gap-1">
                      <p className="text-sm text-secondary font-medium truncate">{profile?.nome_completo}</p>
                      <p className="text-xs text-secondary/70 font-medium truncate">{profile?.email}</p>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-3 h-5 w-5" aria-hidden="true" />
                    Sair
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className={cn(
        "transition-all duration-300",
        isCollapsed ? "lg:pl-20" : "lg:pl-64"
      )}>
        <div className="container px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {isProfileIncomplete ? (
            <CompleteProfileForm />
          ) : isExpired && !isSettingsPage ? (
            <Paywall />
          ) : (
            children
          )}
        </div>
      </main>
    </div>
  );
}

