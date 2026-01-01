-- =====================================================
-- SCRIPT DE CORREÇÃO DE SEGURANÇA (RLS & PERMISSÕES)
-- Execute este script no SQL Editor do Supabase
-- =====================================================

-- 1. Restringir acesso de usuários ANÔNIMOS (não logados)
-- Remove o acesso total à tabela profiles
REVOKE SELECT ON profiles FROM anon;

-- Concede acesso APENAS às colunas públicas necessárias
GRANT SELECT (id, nome_completo, telefone, role) ON profiles TO anon;

-- Explicação:
-- Isso impede que scripts ou usuários deslogados acessem dados sensíveis
-- como 'cpf' ou 'email' através da API pública, mas mantém o funcionamento
-- da página de detalhes do imóvel (que precisa do nome e telefone).

-- Observação: Usuários autenticados continuam com acesso normal
-- para poderem gerenciar seus próprios perfis.
