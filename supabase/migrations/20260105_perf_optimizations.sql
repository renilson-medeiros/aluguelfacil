-- Otimizações de Performance: Lugo
-- Foco em RLS e Índices para reduzir latência real

-- 1. Índices adicionais para acelerar as políticas de RLS
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_imoveis_proprietario_id ON imoveis(proprietario_id);
-- Já existe idx_inquilinos_imovel
-- Já existe idx_comprovantes_imovel

-- 2. Otimização das políticas de RLS para inquilinos
-- A política atual usa um sub-select EXISTS para cada linha.
-- Podemos tentar usar uma política baseada em JOIN se o Supabase suportar melhor
-- ou simplesmente garantir que o Postgres use os índices corretamente.

-- 3. Simplificação da verificação de Admin
-- Criar uma função para verificar se o usuário é admin, com SECURITY DEFINER
-- para evitar recursão e sub-selects repetitivos em cada policy.
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 4. Aplicar a função nas políticas existentes (Exemplo para imoveis)
DROP POLICY IF EXISTS "Proprietários veem próprios imóveis" ON imoveis;
CREATE POLICY "Proprietários veem próprios imóveis"
ON imoveis FOR SELECT
USING (
  proprietario_id = auth.uid()
  OR
  is_admin()
);

-- Repetir para inquilinos e comprovantes para padronizar e otimizar
DROP POLICY IF EXISTS "Proprietários veem inquilinos de seus imóveis" ON inquilinos;
CREATE POLICY "Proprietários veem inquilinos de seus imóveis"
ON inquilinos FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM imoveis
    WHERE imoveis.id = inquilinos.imovel_id
    AND imoveis.proprietario_id = auth.uid()
  )
  OR
  is_admin()
);

DROP POLICY IF EXISTS "Proprietários veem comprovantes de seus inquilinos" ON comprovantes;
CREATE POLICY "Proprietários veem comprovantes de seus inquilinos"
ON comprovantes FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM imoveis
    WHERE imoveis.id = comprovantes.imovel_id
    AND imoveis.proprietario_id = auth.uid()
  )
  OR
  is_admin()
);
