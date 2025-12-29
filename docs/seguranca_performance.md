# Análise de Segurança e Performance

Esta análise detalha os pontos críticos encontrados no projeto que necessitam de correção para garantir a segurança dos dados e o desempenho da aplicação.

## 🚨 Segurança (Prioridade Alta)

### 1. Upload de Arquivos Vulnerável (Crítico)
**Arquivo:** `src/app/api/uploadthing/core.ts`
- **Problema:** A função de autenticação está mockada (`fakeId`), permitindo que qualquer pessoa (mesmo não logada) faça upload de arquivos no bucket.
- **Correção:** Implementar a validação real do usuário usando o Supabase no callback `middleware`.

```typescript
// Como está:
const auth = (req: Request) => ({ id: "fakeId" });

// Correção sugerida:
const auth = async (req: Request) => {
  const supabase = createClient(req); // Usar createServerClient
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return { id: user.id };
};
```

### 2. Exposição de Dados de Perfil (Alto)
**Arquivo:** `SQL.sql` (e políticas ativas no Banco)
- **Problema:** A política RLS `"Qualquer pessoa pode ver informações básicas do proprietário"` utiliza `USING (true)`, liberando acesso de leitura a **todas** as colunas da tabela `profiles` (CPF, Telefone, Email) para qualquer usuário (anônimo ou autenticado).
- **Correção:** Restringir a política ou criar uma VIEW pública separada apenas com os dados necessários (ex: nome, foto) para exibição pública.

### 3. Middleware e Rotas API
**Arquivo:** `src/lib/supabase/middleware.ts`
- **Obs:** O middleware redireciona rotas protegidas corretamente. Certifique-se de que *todas* as rotas sensíveis em `src/app/api` também verifiquem a sessão do usuário internamente, pois o middleware pode não cobrir casos de borda em invocação direta da API.

---

## ⚡ Performance

### 1. Renderização e Queries no Dashboard
**Arquivo:** `src/app/dashboard/page.tsx`
- **Problema (Receita):** A função `loadRevenueData` busca **todos** os comprovantes de pagamento (`.select('valor, mes_referencia')`) sem filtro de data.
    - O cálculo dos "Últimos 6 meses" é feito no Javascript (Cliente).
    - Conforme o histórico cresce, o carregamento ficará lento e consumirá muita banda.
- **Correção:** Filtrar no banco de dados usando `.gte('mes_referencia', dataSeisMesesAtras)`.

```typescript
// Sugestão
const sixMonthsAgo = new Date();
sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
// ...
.gte('mes_referencia', sixMonthsAgo.toISOString())
```

- **Problema (Alertas):** A função `loadAlerts` busca **todos** os inquilinos ativos e itera no cliente para verificar vencimentos. Para muitos inquilinos, isso bloqueará a thread principal.
- **Correção:** Mover essa lógica para uma `Postgres Function` ou `View` que retorna apenas os inquilinos com pendências, ou filtrar mais agressivamente na query SQL.

### 2. Otimização de Imagens
- **Geral:** O uso de `next/image` deve ser priorizado para imagens de propriedades (fotos de upload). Verifique se o domínio do Supabase Storage está configurado em `next.config.mjs` para permitir otimização automática.

### 3. Imports
- O uso de bibliotecas como `lucide-react` está correto (imports individuais), o que ajuda no Tree Shaking.

---

## 📋 Recomendações Gerais

1.  **Sanitize Inputs:** Garantir que todas as entradas de formulário (especialmente em `SQL.sql` via procedures) sejam validadas via Zod no backend/actions.
2.  **Rate Limiting:** Implementar Rate Limiting nas rotas de autenticação (Login/Registro) e Upload para evitar abuso.
3.  **Logs:** Remover `console.log` de produção (visto em `loadDashboardStats` e outros handlers de erro). Integrar com uma ferramenta de monitoramento (Sentry, etc).
