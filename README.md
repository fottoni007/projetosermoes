# Biblioteca de Sermões

Aplicação web interna para a equipa do Pastor Fabrício Ottoni guardar, pesquisar e consultar sermões com notas e ficheiros PDF.

## Tecnologias

- Next.js com App Router
- TypeScript
- Tailwind CSS
- Supabase Auth, Postgres e Storage
- Zod e React Hook Form
- Lucide React

## Arranque local

1. Instalar dependências:

```bash
pnpm install
```

2. Criar `.env.local` com base em `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://o-seu-projecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=a-sua-chave-anon
ADMIN_EMAILS=o-seu-email@exemplo.com
```

`ADMIN_EMAILS` deve ter o email exacto do administrador. Para mais do que um administrador, separar os emails por vírgula.

3. No Supabase, correr o SQL em `supabase/schema.sql`.

4. Criar utilizadores em Supabase Auth.

5. Iniciar a aplicação:

```bash
pnpm dev
```

## Funcionalidades

- Login para equipa interna.
- Criação de conta com aceitação obrigatória dos termos de privacidade e RGPD.
- Lista de sermões ordenada por data.
- Pesquisa por título, pregador, texto bíblico, tema da série e notas.
- Criação e edição de sermões.
- Apenas emails definidos em `ADMIN_EMAILS` podem criar ou editar sermões.
- Upload de PDF para o bucket privado `sermon-pdfs`.
- Ligação temporária para abrir o PDF associado.
