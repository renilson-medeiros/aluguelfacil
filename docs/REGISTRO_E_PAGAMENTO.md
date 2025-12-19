# 💳 Fluxo de Registro e Pagamento - Alugue Fácil

Este documento detalha a análise técnica, o fluxo proposto e as **regras de negócio** para a integração do sistema de registro de usuários com a cobrança recorrente (SaaS) da plataforma.

## 🔍 Análise do Estado Atual

Atualmente, o projeto possui a funcionalidade de registro técnica funcional, mas a parte de pagamento é apenas **visual**.

- **Registro**: O formulário em `src/modules/Register.tsx` coleta dados e cria o usuário no Supabase Auth.
- **Perfil**: Um trigger no banco de dados cria automaticamente uma entrada na tabela `profiles`.
- **Pagamento**: Existe um card visual informativo sobre o valor de **R$ 30,00/mês**.

---

## 🚀 Fluxo de Registro e Trial (7 Dias)

Para garantir uma boa experiência inicial e segurança comercial, o fluxo segue estas regras:

### 1. Cadastro e Início do Trial
Ao criar a conta, o usuário recebe automaticamente **7 dias de teste grátis**.
- **Status Inicial**: `trial`
- **Data de Expiração**: `data_cadastro + 7 dias`

### 2. Limitações do Período de Teste
Durante os 7 dias, o proprietário pode usar a plataforma com limitações pedagógicas:
- 🏠 **Máximo de 1 Imóvel**: Permite cadastrar apenas um imóvel para teste.
- 👤 **Máximo de 1 Inquilino**: Permite gerenciar apenas um contrato ativo.

### 3. O Paywall (Bloqueio de Acesso)
Assim que os **7 dias expirarem**:
- O sistema verifica o campo `expires_at` e `subscription_status`.
- Caso o status não seja `active`, o usuário será redirecionado para uma **Página de Pagamento Obrigatória**.
- O acesso ao Dashboard e ferramentas de gestão fica totalmente bloqueado até a confirmação do pagamento.

---

## 💸 Método de Pagamento: PIX

A preferência absoluta da plataforma é o **PIX**, devido à sua natureza instantânea e facilidade de conciliação.

- **Gateway Recomendado**: **Mercado Pago** (Líder em integração de PIX no Brasil).
- **Processo**:
    1. O usuário gera o QR Code/Copia e Cola no sistema.
    2. O gateway confirma o recebimento em segundos.
    3. O Webhook ativa o status do usuário para `active` instantaneamente.

---

## 🛠️ Alterações de Infraestrutura (Banco de Dados)

Devemos expandir a tabela `profiles` com os seguintes campos de controle:

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `subscription_status` | `text` | `trial`, `active`, `past_due`, `canceled` |
| `expires_at` | `timestamp` | Fim do trial ou do mês pago |
| `trial_limit_reached` | `boolean` | Flag para controle de limites de teste |
| `subscription_id` | `text` | ID da transação no Mercado Pago |

---

## � Regras de Segurança e Middleware

1. **Middleware de Assinatura**:
   - Se `current_date > expires_at` E `status != 'active'`, redireciona para `/checkout`.
2. **Validação de Limites**:
   - Ao tentar criar o 2º imóvel ou inquilino, o sistema verifica se o usuário é `active`. Se for `trial`, exibe um convite para assinar o plano completo.

---

> [!TIP]
> O uso do Mercado Pago permitirá que a ativação da conta após os 7 dias seja automática e sem intervenção manual, mantendo a experiência do usuário fluida.
