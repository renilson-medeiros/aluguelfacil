# 🗺️ Roadmap de Implementação - Funcionalidades Jurídicas

> **Plano de Desenvolvimento**: Implementação faseada das funcionalidades jurídicas no Lugo

---

## 📋 Visão Geral

Roadmap para implementação das funcionalidades jurídicas e burocráticas, dividido em **3 fases** com **branches específicas** para cada feature.

### Princípios

- ✅ **Aluguel Direto**: Proprietário → Inquilino (sem intermediários)
- ✅ **Garantias Simplificadas**: Comprovante de renda (fiador é opcional)
- ✅ **Segurança**: Nenhuma informação sensível no Git
- ✅ **Entregas Incrementais**: Features independentes

---

## 🌳 Estratégia de Branches

### Nomenclatura

```
feature/legal-<nome-da-feature>
```

### Fluxo

1. Criar branch a partir de `main`
2. Desenvolver e testar
3. Commit com convenção
4. Pull Request para `main`
5. Code review
6. Merge

### Convenção de Commits

```
feat(legal): add contract generator form
fix(legal): correct PDF generation
docs(legal): update templates docs
```

---

## 📊 Fase 1 - MVP (3-4 semanas)

### 1.1. Gerador de Contratos

**Branch**: `feature/legal-contract-generator`

**Entregas:**

- ✅ Formulário de criação de contrato
- ✅ PDF com cláusulas obrigatórias
- ✅ Armazenamento no Supabase
- ✅ Listagem de contratos

**Campos Principais:**

- Dados do imóvel (pré-preenchidos)
- Dados do locador (pré-preenchidos)
- Dados do locatário + comprovante de renda (opcional)
- Datas, valores, índice de reajuste
- Garantia (opcional): sem garantia, caução, seguro, fiador

---

### 1.2. Vistoria Digital

**Branch**: `feature/legal-inspection-system`

**Entregas:**

- ✅ Checklist de vistoria (entrada/saída)
- ✅ Upload de fotos por item
- ✅ PDF de laudo
- ✅ Comparação entrada vs. saída

**Checklist:**

- Estrutura (paredes, tetos, pisos, portas, janelas)
- Elétrica (tomadas, interruptores, iluminação)
- Hidráulica (torneiras, descargas, ralos)
- Observações gerais

---

### 1.3. Sistema de Alertas

**Branch**: `feature/legal-alerts-system`

**Entregas:**

- ✅ Painel de alertas no dashboard
- ✅ Notificações em tempo real
- ✅ Priorização (crítico/aviso/info)
- ✅ Ações sugeridas

**Tipos:**

- Vencimento de contrato (90/60/30 dias)
- Inadimplência (5/15/30 dias)
- Documentação incompleta

---

## 📊 Fase 2 - Expansão (4-6 semanas)

### 2.1. Templates Avançados

**Branch**: `feature/legal-contract-templates`

- Templates para cada tipo de garantia
- Editor de cláusulas
- Versionamento

### 2.2. Vistoria Completa

**Branch**: `feature/legal-inspection-advanced`

- Checklist detalhado por cômodo
- Gravação de vídeo
- Cálculo de danos

### 2.3. Central de Conhecimento

**Branch**: `feature/legal-knowledge-base`

- Artigos jurídicos (10+)
- FAQ (20+ perguntas)
- Glossário (30+ termos)

---

## 📊 Fase 3 - Otimização (6-8 semanas)

### 3.1. Gestão de Riscos

**Branch**: `feature/legal-risk-management`

- Score de risco por locação
- Dashboard de conformidade

### 3.2. Tooltips Jurídicos

**Branch**: `feature/legal-tooltips`

- Tooltips em formulários
- Citações da Lei 8.245/91

### 3.3. Assinatura Eletrônica

**Branch**: `feature/legal-digital-signature`

- Integração com plataforma
- Fluxo de assinatura

---

## 🗄️ Banco de Dados

```sql
-- Contratos
CREATE TABLE contracts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  property_id UUID REFERENCES properties(id),
  tenant_id UUID REFERENCES tenants(id),
  guarantee_type VARCHAR(50), -- 'none', 'caucao', 'seguro', 'fiador'
  start_date DATE,
  end_date DATE,
  rent_value DECIMAL(10,2),
  income_proof_url TEXT,
  pdf_url TEXT,
  status VARCHAR(20) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Vistorias
CREATE TABLE inspections (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  property_id UUID REFERENCES properties(id),
  inspection_type VARCHAR(20), -- 'entry', 'exit'
  checklist_data JSONB,
  photos JSONB,
  pdf_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Alertas
CREATE TABLE legal_alerts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  alert_type VARCHAR(50),
  severity VARCHAR(20), -- 'info', 'warning', 'critical'
  title VARCHAR(255),
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔒 Segurança (.gitignore)

**NUNCA commitar:**

- ❌ `.env` com credenciais
- ❌ PDFs de contratos reais
- ❌ Fotos de vistorias
- ❌ Comprovantes de renda
- ❌ Documentos pessoais

**Sempre usar:**

- ✅ Variáveis de ambiente
- ✅ Supabase Storage
- ✅ RLS para isolamento

---

## 📦 Estrutura de Pastas

```
src/
├── modules/legal/
│   ├── contracts/
│   ├── inspections/
│   ├── alerts/
│   └── knowledge/
├── lib/legal/
│   ├── contracts/
│   └── inspections/
└── app/dashboard/
    ├── contratos/
    ├── vistorias/
    └── central-conhecimento/
```

---

## 🎯 Cronograma

| Fase      | Duração           | Entregas                                |
| --------- | ----------------- | --------------------------------------- |
| Fase 1    | 3-4 semanas       | Contratos + Vistorias + Alertas         |
| Fase 2    | 4-6 semanas       | Templates + Vistoria Avançada + Central |
| Fase 3    | 6-8 semanas       | Riscos + Tooltips + Assinatura          |
| **TOTAL** | **13-18 semanas** | **12 features**                         |

---

## 🚀 Próximos Passos

1. Revisar roadmap
2. Criar branch `feature/legal-contract-generator`
3. Configurar tabela `contracts` no Supabase
4. Desenvolver formulário de contrato
5. Implementar geração de PDF

---

**Versão**: 1.0 | **Data**: 11/01/2026
