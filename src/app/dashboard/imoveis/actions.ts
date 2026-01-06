"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createPropertyAction(propertyData: any) {
    try {
        const supabase = await createClient();
        
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            throw new Error('Não autorizado');
        }

        const { data, error } = await supabase
            .from('imoveis')
            .insert([propertyData])
            .select()
            .single();

        if (error) {
            throw error;
        }

        revalidatePath('/dashboard/imoveis');
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message || 'Erro interno no servidor' };
    }
}

export async function updatePropertyAction(id: string, propertyData: any) {
    try {
        const supabase = await createClient();
        
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) throw new Error('Não autorizado');

        const { data, error } = await supabase
            .from('imoveis')
            .update(propertyData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        revalidatePath('/dashboard/imoveis');
        revalidatePath(`/dashboard/imoveis/${id}`);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message || 'Erro interno no servidor' };
    }
}

export async function generateSignedUploadUrlAction(path: string) {
    try {
        const supabase = await createClient();
        
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) throw new Error('Não autorizado');

        const { data, error } = await supabase.storage
            .from('imoveis-fotos')
            .createSignedUploadUrl(path);

        if (error) {
            throw error;
        }

        return { success: true, signedUrl: data.signedUrl };
    } catch (error: any) {
        return { success: false, error: error.message || 'Erro ao gerar URL de upload' };
    }
}
