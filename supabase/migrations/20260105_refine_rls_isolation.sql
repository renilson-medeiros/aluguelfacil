-- =====================================================
-- REFINAMENTO DE SEGURANÇA E ISOLAMENTO DE DADOS
-- =====================================================

-- 1. Ajustar a política de visualização pública de imóveis
-- A política atual permite que usuários autenticados vejam imóveis disponíveis de outros.
-- Vamos restringir isso para que usuários autenticados vejam APENAS seus próprios imóveis,
-- e usuários anônimos continuem vendo imóveis disponíveis.

DROP POLICY IF EXISTS "Qualquer pessoa pode ver imóveis disponíveis" ON imoveis;

-- Política para usuários ANÔNIMOS (links públicos)
CREATE POLICY "Public: Ver imóveis disponíveis"
ON imoveis FOR SELECT
TO anon
USING (status = 'disponivel');

-- Reforçar a política de proprietários (já existe, mas vamos garantir que seja a única para autenticados)
-- A política "Proprietários veem próprios imóveis" já cobre o caso 'authenticated'.

-- 2. Garantir que inquilinos e comprovantes sigam estritamente o vínculo com o proprietário do imóvel
-- As políticas atuais já usam EXISTS com imoveis.proprietario_id = auth.uid(), o que está correto.

-- 3. Melhorar a segurança de perfis para evitar vazamento de dados sensíveis
DROP POLICY IF EXISTS "Qualquer pessoa pode ver informações básicas do proprietário" ON profiles;

CREATE POLICY "Public: Ver informações básicas do proprietário"
ON profiles FOR SELECT
TO anon, authenticated
USING (true); -- Controle de colunas é feito via GRANT no script fix_security_rls.sql

-- 4. Criar política explícita para o Dashboard (Opcional, mas ajuda no isolamento)
-- As consultas no frontend já foram filtradas. As políticas de RLS servem como a camada final de defesa.

-- =====================================================
-- FIM DA MIGRAÇÃO
-- =====================================================
