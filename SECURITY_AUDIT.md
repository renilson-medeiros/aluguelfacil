# Auditoria de Segurança - Lugo (Alugue Fácil)

**Data**: 05 de Janeiro de 2026
**Responsável**: Antigravity Security Advisor
**Status**: Crítico (Ações requeridas)

## 1. Visão Geral

Esta auditoria foi realizada com foco em proteção de dados (LGPD), isolamento de multi-inquilino (Multi-Tenancy) e prevenção de ataques OWASP Top 10.

## 2. Pontos Críticos e Vulnerabilidades

### 2.1. Vazamento de Dados Pessoais (LGPD) - **CRÍTICO**

- **Vulnerabilidade**: A política de RLS da tabela `profiles` permite leitura por qualquer usuário (`USING (true)`).
- **Risco**: Um atacante pode listar todos os usuários cadastrados, coletando nomes, CPFs, e-mails e telefones.
- **Ação**: Implementar políticas granulares que retornem apenas dados públicos (nome) para visitantes anônimos e protejam dados sensíveis (CPF) apenas para o dono da conta.

### 2.2. Manipulação de Identidade na API de PDF - **ALTO**

- **Vulnerabilidade**: A rota `/api/pdf/generate` recebe `userId` e `propertyId` direto no corpo da requisição sem validação cruzada no servidor.
- **Risco**: Um usuário logado poderia, em teoria, gerar comprovantes em nome de outro proprietário ou associar comprovantes a imóveis que não lhe pertencem.
- **Ação**: Validar o `userId` enviado contra o `auth.uid()` extraído do token JWT no servidor.

### 2.3. Exposição de Chaves de API

- **Avaliação**: As chaves do Supabase e do Asaas estão corretamente configuradas em variáveis de ambiente e não são expostas no `frontend` (prefixo `NEXT_PUBLIC`).
- **Status**: **SEGURO**.

### 2.4. Injeção de Código (XSS)

- **Avaliação**: O uso de React protege contra a maioria das injeções via DOM, mas os campos de `observações` que são renderizados em PDFs e dashboards devem ser sanitizados para evitar que scripts sejam executados em contextos de visualização administrativa.
- **Status**: **ATENÇÃO**.

### 2.5. Armazenamento (Storage)

- **Vulnerabilidade**: O bucket `imoveis-fotos` é público. Embora nomes de arquivos usem UUIDs, a falta de proteção de caminho pode ser um problema futuro.
- **Risco**: Baixo (UUIDs são difíceis de adivinhar), mas pode ser melhorado.
- **Ação**: Garantir que o prefixo do caminho no storage sempre contenha o `userId` e validar isso no RLS do storage.

## 3. Plano de Ação (Próximos Passos)

1. **Patch de RLS**: Restringir a tabela `profiles` e criar políticas específicas por coluna.
2. **Blindagem de API**: Refatorar o middleware de autenticação e as rotas POST para validação de posse (Ownership Validation).
3. **Limpeza de Schema**: Remover privilégios desnecessários do usuário `anon`.

---

_Assinado: Antigravity Security Advisor_
