# AluguelFácil 🏠

Sistema de gerenciamento de imóveis para aluguel, desenvolvido com Next.js, TypeScript e Supabase.

## 🚀 Tecnologias

- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Banco de Dados**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth
- **Estilização**: Tailwind CSS + shadcn/ui
- **Validações**: Zod + validadores customizados
- **Upload de Arquivos**: Supabase Storage

## ✨ Funcionalidades

### Autenticação
- ✅ Registro de usuários com validação de CPF
- ✅ Login/Logout
- ✅ Validação de força de senha
- ✅ Proteção de rotas com middleware

### Gestão de Imóveis
- ✅ Cadastro de imóveis com fotos
- ✅ Edição e exclusão
- ✅ Upload de múltiplas fotos (Supabase Storage)
- ✅ Visualização pública de imóveis
- ✅ Máscaras de input (CEP, valores monetários)

### Gestão de Inquilinos
- ✅ Cadastro de inquilinos
- ✅ Vinculação a imóveis
- ✅ Controle de contratos
- ✅ Máscaras de input (CPF, telefone)

### Comprovantes
- ✅ Geração de comprovantes de pagamento
- ✅ Comprovantes de residência
- ✅ Histórico de comprovantes
- ✅ Preview em tempo real

### UX/UI
- ✅ DatePicker customizado (fecha automaticamente)
- ✅ Selects estilizados (shadcn/ui)
- ✅ Navegação com router.back() (botões voltar inteligentes)
- ✅ Loading states e empty states
- ✅ Feedback visual de validações
- ✅ Design responsivo

## 📁 Estrutura do Projeto

```
aluguelfacil/
├── src/
│   ├── app/                    # App Router (Next.js 14)
│   │   ├── dashboard/          # Páginas do dashboard
│   │   ├── login/              # Página de login
│   │   └── registro/           # Página de registro
│   ├── components/
│   │   ├── layout/             # Header, Footer
│   │   └── ui/                 # Componentes shadcn/ui
│   ├── contexts/
│   │   └── AuthContext.tsx    # Contexto de autenticação
│   ├── lib/
│   │   ├── supabase/           # Clientes Supabase
│   │   │   ├── client.ts       # Browser client
│   │   │   ├── server.ts       # Server client
│   │   │   └── middleware.ts   # Middleware client
│   │   └── validators.ts       # Validadores centralizados
│   └── modules/                # Módulos/páginas
│       └── dashboard/          # Componentes do dashboard
├── docs/                       # Documentação do projeto
│   ├── task.md                 # Checklist de tarefas
│   └── walkthrough.md          # Histórico de mudanças
└── public/                     # Arquivos estáticos
```

## 🔧 Instalação

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no Supabase

### Passo a Passo

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/aluguelfacil.git
cd aluguelfacil
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
```

4. **Configure o banco de dados**

Execute o SQL do arquivo `SQL.sql` no seu projeto Supabase para criar as tabelas e políticas RLS.

5. **Crie o bucket de storage**

No Supabase Storage, crie um bucket chamado `imoveis-fotos` com as seguintes políticas:
- Upload: Apenas usuários autenticados
- Select: Público
- Delete: Apenas o proprietário

6. **Rode o projeto**
```bash
npm run dev
```

Acesse: `http://localhost:3000`

## 🗄️ Banco de Dados

### Tabelas Principais

- **profiles**: Dados dos usuários (estende auth.users)
- **imoveis**: Cadastro de imóveis
- **inquilinos**: Cadastro de inquilinos
- **comprovantes**: Comprovantes gerados

### Row Level Security (RLS)

Todas as tabelas têm RLS habilitado:
- Usuários só veem seus próprios dados
- Imóveis públicos são visíveis para todos
- Inquilinos e comprovantes são privados

## 🔒 Segurança

- ✅ Row Level Security (RLS) no Supabase
- ✅ Validação de força de senha (8+ caracteres, maiúscula, minúscula, número)
- ✅ Validação de CPF
- ✅ Sanitização de inputs
- ✅ Proteção de rotas com middleware
- ✅ Upload de arquivos validado (tamanho e tipo)

## 📝 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Linter
```

## 🎨 Componentes Customizados

### DatePicker
Componente de seleção de data que fecha automaticamente ao selecionar.

```tsx
<DatePicker
  date={formData.startDate}
  onSelect={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
  placeholder="Selecione a data"
/>
```

### Validadores

```tsx
import { validarCPF, validarSenha, formatarTelefone } from "@/lib/validators";

const cpfValido = validarCPF("123.456.789-00");
const senhaValidacao = validarSenha("MinhaSenh@123");
const telefoneFormatado = formatarTelefone("11999999999");
```

## 📚 Documentação

Consulte a pasta `docs/` para:
- **task.md**: Checklist de tarefas implementadas
- **walkthrough.md**: Histórico detalhado de mudanças

## 🚧 Próximos Passos

- [ ] Implementar rate limiting
- [ ] Adicionar testes automatizados
- [ ] Implementar CAPTCHA no registro
- [ ] Sistema de notificações por email
- [ ] Geração de PDF de comprovantes
- [ ] Dashboard com gráficos

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👤 Autor

Desenvolvido com ❤️ por [Seu Nome]

---

**Nota sobre Performance**: O projeto está otimizado para desenvolvimento. Para produção, considere:
- Implementar cache de queries do Supabase
- Otimizar imagens com Next.js Image
- Implementar lazy loading de componentes
- Usar React.memo em componentes pesados
