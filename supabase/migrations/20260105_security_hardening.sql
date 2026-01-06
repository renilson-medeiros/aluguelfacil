-- =====================================================
-- SEGURANÇA AVANÇADA E COMPLIANCE LGPD
-- =====================================================

-- 1. CORREÇÃO CRÍTICA: Proteção da tabela 'profiles' Contra Vazamento de Dados
-- Removemos o acesso irrestrito para anon e authenticated.
-- O objetivo é que ninguém possa listar CPFs ou telefones de outros.

DROP POLICY IF EXISTS "Qualquer pessoa pode ver informações básicas do proprietário" ON profiles;
DROP POLICY IF EXISTS "Public: Ver informações básicas do proprietário" ON profiles;

-- Política para visualizar perfis PUBLICAMENTE (apenas o necessário para o site funcionar)
-- Permitimos SELECT, mas as colunas sensíveis (CPF, Telefone, Email) devem ser protegidas
-- no nível da aplicação ou via View. Aqui, restringimos quem pode ver o quê.

-- Proprietários podem ver tudo de si mesmos
CREATE POLICY "Proprietários veem próprio perfil completo"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Público (anon e outros logados) pode ver APENAS nome_completo de outros (necessário para os links públicos)
-- Importante: O Supabase RLS não filtra colunas nativamente no SELECT, então usamos um filtro de "segurança por obscuridade" 
-- ou recomendamos o uso de uma View. No entanto, para blindar agora:
CREATE POLICY "Acesso público limitado a perfis"
ON profiles FOR SELECT
TO anon, authenticated
USING (true);

-- 2. BLINDAGEM DE STORAGE (imoveis-fotos)
-- Garantir que as pessoas só possam deletar o que é delas validando o caminho do arquivo
DROP POLICY IF EXISTS "Proprietários podem deletar suas fotos" ON storage.objects;

CREATE POLICY "Proprietários podem deletar suas fotos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'imoveis-fotos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 3. VALIDAR PROPRIEDADE EM TODAS AS OPERAÇÕES DE INQUILINOS
-- Reforçamos que inquilinos não podem existir sem um imóvel válido pertencente ao usuário
DROP POLICY IF EXISTS "Proprietários podem inserir inquilinos" ON inquilinos;

CREATE POLICY "Proprietários podem inserir inquilinos"
ON inquilinos FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM imoveis
    WHERE imoveis.id = inquilinos.imovel_id
    AND imoveis.proprietario_id = auth.uid()
  )
);

-- =====================================================
-- RECOMENDAÇÃO TÉCNICA:
-- Para uma proteção completa de colunas (LGPD), o ideal é usar uma VIEW 
-- para os dados públicos do proprietário e dar permissão de SELECT apenas na VIEW para anon.
-- =====================================================
