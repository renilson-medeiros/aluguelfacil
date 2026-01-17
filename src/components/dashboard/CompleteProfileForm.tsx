"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { formatarCPF, formatarTelefone } from "@/lib/validators";
import { validarCPF, validarTelefone } from "@/lib/validators";

const completeProfileSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  cpf: z.string()
    .min(1, "CPF é obrigatório")
    .refine((val) => validarCPF(val), "CPF inválido"),
  phone: z.string()
    .min(1, "WhatsApp é obrigatório")
    .refine((val) => validarTelefone(val), "WhatsApp inválido"),
});

type CompleteProfileData = z.infer<typeof completeProfileSchema>;

export function CompleteProfileForm() {
  const { profile, updateProfile } = useAuth();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CompleteProfileData>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      name: profile?.nome_completo || "",
      cpf: "",
      phone: "",
    },
  });

  const onSubmit = async (data: CompleteProfileData) => {
    setIsSubmitting(true);
    setError("");

    try {
      await updateProfile({
        nome_completo: data.name,
        cpf: data.cpf.replace(/\D/g, ""),
        telefone: data.phone.replace(/\D/g, ""),
      });
    } catch (err: any) {
      console.error("Erro ao completar perfil:", err);
      
      if (err.message?.includes("profiles_cpf_key") || err.message?.includes("duplicate key value violates unique constraint")) {
        setError("O CPF informado já possui cadastro.");
      } else {
        setError(err.message || "Erro ao salvar dados. Tente novamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("cpf", formatarCPF(e.target.value), { shouldValidate: true });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("phone", formatarTelefone(e.target.value), { shouldValidate: true });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-card border rounded-lg shadow-sm p-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Complete seu perfil</h2>
          <p className="text-muted-foreground">
            Precisamos de alguns dados obrigatórios para que você possa divulgar e gerenciar seus imóveis.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Seu nome"
              className="h-11"
              disabled={isSubmitting}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              placeholder="000.000.000-00"
              maxLength={14}
              {...register("cpf")}
              value={watch("cpf")}
              onChange={handleCPFChange}
              className="h-11"
              disabled={isSubmitting}
            />
            {errors.cpf && <p className="text-xs text-destructive">{errors.cpf.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">WhatsApp</Label>
            <Input
              id="phone"
              placeholder="(00) 00000-0000"
              maxLength={15}
              {...register("phone")}
              value={watch("phone")}
              onChange={handlePhoneChange}
              className="h-11"
              disabled={isSubmitting}
            />
            {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-tertiary text-white hover:bg-tertiary/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar e Continuar"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
