-- =====================================================
-- SCRIPT DE CRIAÇÃO DO BANCO DE DADOS
-- Sistema de Gestão Imobiliária
-- =====================================================
-- 1. TABELA DE PERFIS (estende auth.users)
-- =====================================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nome_completo TEXT NOT NULL,
  cpf TEXT UNIQUE NOT NULL,
  telefone TEXT,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'proprietario' CHECK (role IN ('proprietario', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. TABELA DE IMÓVEIS
-- =====================================================
CREATE TABLE imoveis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  proprietario_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  endereco_rua TEXT NOT NULL,
  endereco_numero TEXT NOT NULL,
  endereco_complemento TEXT,
  endereco_bairro TEXT NOT NULL,
  endereco_cidade TEXT NOT NULL,
  endereco_estado TEXT NOT NULL,
  endereco_cep TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('casa', 'apartamento', 'comercial', 'terreno')),
  quartos INTEGER,
  banheiros INTEGER,
  area_m2 DECIMAL(10, 2),
  valor_aluguel DECIMAL(10, 2) NOT NULL,
  valor_condominio DECIMAL(10, 2),
  valor_iptu DECIMAL(10, 2),
  descricao TEXT,
  fotos TEXT[], -- Array de URLs das fotos
  status TEXT NOT NULL DEFAULT 'disponivel' CHECK (status IN ('disponivel', 'alugado', 'manutencao')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. TABELA DE INQUILINOS
-- =====================================================
CREATE TABLE inquilinos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  imovel_id UUID REFERENCES imoveis(id) ON DELETE CASCADE NOT NULL,
  nome_completo TEXT NOT NULL,
  cpf TEXT NOT NULL,
  rg TEXT,
  telefone TEXT NOT NULL,
  email TEXT,
  data_nascimento DATE,
  profissao TEXT,
  data_inicio DATE NOT NULL,
  data_fim DATE,
  valor_aluguel DECIMAL(10, 2) NOT NULL,
  dia_vencimento INTEGER NOT NULL CHECK (dia_vencimento >= 1 AND dia_vencimento <= 31),
  observacoes TEXT,
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. TABELA DE COMPROVANTES
-- =====================================================
CREATE TABLE comprovantes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  inquilino_id UUID REFERENCES inquilinos(id) ON DELETE CASCADE NOT NULL,
  imovel_id UUID REFERENCES imoveis(id) ON DELETE CASCADE NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('pagamento', 'residencia')),
  mes_referencia DATE NOT NULL,
  valor DECIMAL(10, 2),
  descricao TEXT,
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================
CREATE INDEX idx_imoveis_proprietario ON imoveis(proprietario_id);
CREATE INDEX idx_imoveis_status ON imoveis(status);
CREATE INDEX idx_inquilinos_imovel ON inquilinos(imovel_id);
CREATE INDEX idx_inquilinos_status ON inquilinos(status);
CREATE INDEX idx_comprovantes_inquilino ON comprovantes(inquilino_id);
CREATE INDEX idx_comprovantes_imovel ON comprovantes(imovel_id);
CREATE INDEX idx_comprovantes_mes ON comprovantes(mes_referencia);

-- =====================================================
-- TRIGGERS PARA UPDATED_AT
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_imoveis_updated_at BEFORE UPDATE ON imoveis
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inquilinos_updated_at BEFORE UPDATE ON inquilinos
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNCTION: Criar perfil automaticamente após signup
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nome_completo, cpf, telefone, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nome_completo', 'Usuário'),
    COALESCE(NEW.raw_user_meta_data->>'cpf', '00000000000'),
    COALESCE(NEW.raw_user_meta_data->>'telefone', null),
    COALESCE(NEW.raw_user_meta_data->>'role', 'proprietario')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Ativar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE imoveis ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquilinos ENABLE ROW LEVEL SECURITY;
ALTER TABLE comprovantes ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLICIES: PROFILES
-- =====================================================
-- Usuários podem criar próprio profile
CREATE POLICY "Usuário pode criar próprio profile"
ON profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Usuários podem ver seu próprio perfil
CREATE POLICY "Usuários podem ver próprio perfil"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Usuários podem atualizar seu próprio perfil
CREATE POLICY "Usuários podem atualizar próprio perfil"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Admins podem ver todos os perfis
CREATE POLICY "Admins podem ver todos perfis"
ON profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- =====================================================
-- POLICIES: IMÓVEIS
-- =====================================================

-- Proprietários podem ver seus próprios imóveis
CREATE POLICY "Proprietários veem próprios imóveis"
ON imoveis FOR SELECT
USING (
  proprietario_id = auth.uid()
  OR
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Proprietários podem inserir imóveis
CREATE POLICY "Proprietários podem inserir imóveis"
ON imoveis FOR INSERT
WITH CHECK (proprietario_id = auth.uid());

-- Proprietários podem atualizar seus próprios imóveis
CREATE POLICY "Proprietários podem atualizar próprios imóveis"
ON imoveis FOR UPDATE
USING (
  proprietario_id = auth.uid()
  OR
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Proprietários podem deletar seus próprios imóveis
CREATE POLICY "Proprietários podem deletar próprios imóveis"
ON imoveis FOR DELETE
USING (
  proprietario_id = auth.uid()
  OR
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- =====================================================
-- POLICIES: INQUILINOS
-- =====================================================

-- Proprietários podem ver inquilinos de seus imóveis
CREATE POLICY "Proprietários veem inquilinos de seus imóveis"
ON inquilinos FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM imoveis
    WHERE imoveis.id = inquilinos.imovel_id
    AND imoveis.proprietario_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Proprietários podem inserir inquilinos em seus imóveis
CREATE POLICY "Proprietários podem inserir inquilinos"
ON inquilinos FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM imoveis
    WHERE imoveis.id = inquilinos.imovel_id
    AND imoveis.proprietario_id = auth.uid()
  )
);

-- Proprietários podem atualizar inquilinos de seus imóveis
CREATE POLICY "Proprietários podem atualizar inquilinos"
ON inquilinos FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM imoveis
    WHERE imoveis.id = inquilinos.imovel_id
    AND imoveis.proprietario_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Proprietários podem deletar inquilinos de seus imóveis
CREATE POLICY "Proprietários podem deletar inquilinos"
ON inquilinos FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM imoveis
    WHERE imoveis.id = inquilinos.imovel_id
    AND imoveis.proprietario_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- =====================================================
-- POLICIES: COMPROVANTES
-- =====================================================

-- Proprietários podem ver comprovantes de seus inquilinos
CREATE POLICY "Proprietários veem comprovantes de seus inquilinos"
ON comprovantes FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM imoveis
    WHERE imoveis.id = comprovantes.imovel_id
    AND imoveis.proprietario_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Proprietários podem inserir comprovantes
CREATE POLICY "Proprietários podem inserir comprovantes"
ON comprovantes FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM imoveis
    WHERE imoveis.id = comprovantes.imovel_id
    AND imoveis.proprietario_id = auth.uid()
  )
);

-- Proprietários podem atualizar comprovantes
CREATE POLICY "Proprietários podem atualizar comprovantes"
ON comprovantes FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM imoveis
    WHERE imoveis.id = comprovantes.imovel_id
    AND imoveis.proprietario_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Proprietários podem deletar comprovantes
CREATE POLICY "Proprietários podem deletar comprovantes"
ON comprovantes FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM imoveis
    WHERE imoveis.id = comprovantes.imovel_id
    AND imoveis.proprietario_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- =====================================================
-- STORAGE: Políticas para o bucket imoveis-fotos
-- =====================================================

-- 1. Permitir upload de fotos (apenas proprietários autenticados)
CREATE POLICY "Proprietários podem fazer upload de fotos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'imoveis-fotos'
  AND auth.role() = 'authenticated'
);

-- 2. Permitir visualização pública das fotos
CREATE POLICY "Fotos são publicamente acessíveis"
ON storage.objects FOR SELECT
USING (bucket_id = 'imoveis-fotos');

-- 3. Proprietários podem deletar suas fotos
CREATE POLICY "Proprietários podem deletar suas fotos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'imoveis-fotos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- =====================================================
-- DADOS INICIAIS (OPCIONAL)
-- =====================================================

-- Você pode criar seu usuário admin manualmente após o signup
-- ou executar este comando após criar sua conta:

-- UPDATE profiles SET role = 'admin' WHERE email = 'renilson.medeiros96@outlook.com';

-- =====================================================
-- NOVAS POLÍTICAS: ACESSO PÚBLICO
-- =====================================================

-- Permitir que qualquer pessoa veja imóveis com status 'disponivel'
CREATE POLICY "Qualquer pessoa pode ver imóveis disponíveis"
ON imoveis FOR SELECT
USING (status = 'disponivel');

-- Permitir que qualquer pessoa veja informações básicas do proprietário
-- (Necessário para exibir o nome e telefone do proprietário na página pública do imóvel)
CREATE POLICY "Qualquer pessoa pode ver informações básicas do proprietário"
ON profiles FOR SELECT
USING (true);

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================