// src/lib/supabase/index.ts
// Exporta todos os clientes e utilitários do Supabase

export { createClient as createBrowserClient } from './client'
export { createClient as createServerClient } from './server'
export { updateSession } from './middleware'
