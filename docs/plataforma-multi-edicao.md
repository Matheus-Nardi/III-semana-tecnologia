# Plataforma Multi-Edição — III Semana de Ciência, Tecnologia e Inovação (UNITINS)

Documento consolidado de arquitetura e implementação pós-avaliação estrutural (*grill-me*). Define o plano técnico para transformar o site estático atual (fixo na edição 2025) em uma plataforma multi-edição escalável, performática e de fácil manutenção, com Painel Administrativo (Payload CMS 3.x), On-Demand Tag Revalidation, armazenamento em nuvem no Backblaze B2 (S3) e identidade visual customizável por ano.

> **Stack:** Next.js 15 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · Radix UI · Payload CMS 3.x · Postgres 16 · Docker/Nginx · Backblaze B2 (S3)

---

## 1. Objetivos e Requisitos Centrais

- **Multi-edições anuais:** criação e gestão de novas edições com histórico navegável em `/edicoes`.
- **Roteamento canônico e limpo:** a raiz `/` redireciona automaticamente (307/308) para a edição padrão ativa (ex: `/2025`), garantindo SEO consistente e links únicos.
- **Painel Administrativo Intuitivo (Payload CMS 3.x):** rota `/admin` para gerenciamento em tela única da grade do evento, textos, palestrantes, parceiros e banners.
- **Atualização Instantânea (On-Demand Revalidation):** salvar no painel revalida o cache no milissegundo seguinte via `revalidateTag`, sem gerar consultas periódicas ao banco em requisições públicas.
- **Mídia em Nuvem (B2 / S3):** uploads enviados diretamente para o Backblaze B2 via `@payloadcms/storage-s3`, sem dependência de volumes locais pesados em produção.
- **Identidade Visual e Theming Dinâmico:** paleta de 2 cores (`primaryColor` + `accentColor`), logos e banners por edição consumidos via variáveis CSS do Tailwind v4.
- **Zero Downtime & Seed Automático:** inicialização automática com o evento 2025 totalmente populado a partir de `src/data/schedule.json` no primeiro boot.
- **Preservação do Design System:** reaproveitamento total da UI, animações, componentes Shadcn/Radix e estilo já construídos.

---

## 2. Diagnóstico do Estado Atual

O site atual é uma single-page estática onde dados da edição 2025 estão embutidos nos componentes:

| Arquivo | Estado Atual (2025 Hardcoded) | Destino na Plataforma Multi-Edição |
|---|---|---|
| `src/app/page.tsx` | Compõe as seções na raiz | Redireciona para `/{ano-ativo}` via `getDefaultEdition()` |
| `src/app/layout.tsx` | Layout fixo com `metadata` estática | Layout base limpo; metadados dinâmicos por edição |
| `src/components/project/Hero.tsx` | Textos e cores `#e2187f` fixas | Recebe `edition.heroSlides`, `edition.title`, CSS vars de tema |
| `src/components/project/Header.tsx` | Logo fixa e links locais | Consome `edition.theme.logo` e link `/edicoes` |
| `src/components/project/About.tsx` | Texto e tema "Planeta Água" fixos | Recebe `edition.about` |
| `src/components/project/Schedule.tsx` | Importa `src/data/schedule.json` | Recebe `edition.schedule` como prop |
| `src/components/project/Partners.tsx` | Array de parceiros hardcoded | Recebe `edition.partners` |
| `src/components/project/Footer.tsx` | Textos e copyright fixos | Recebe `edition.shortTitle` e links dinâmicos |
| `src/app/globals.css` | Cores fixas em `:root` | Tokens de tema associados a variáveis injetadas por edição |
| `src/app/api/news/route.ts` | Scraping de notícias da UNITINS | Mantido inalterado (independente de edição) |

---

## 3. Decisões Estruturais Aprovadas (*Grill-Me Summary*)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              Arquitetura Geral                                  │
│                                                                                 │
│  [Visitante] ──> Nginx (SSL) ──> Next.js 15 (SSG / Tag Cache) <── [Postgres 16] │
│      │                                  │ (Revalidação On-Demand)        │      │
│      │                                  ▼                                │      │
│      │                        Payload CMS 3.x (/admin)                   │      │
│      │                                  │                                │      │
│      │                                  ▼ (Upload Direto S3)             │      │
│      ▼                                                                   ▼      │
│  [Imagens / Banners] ────────────> Backblaze B2 <──────────── [Backup pg_dump]  │
│                                                               (Sidecar Diário)  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

1. **Roteamento:** Rota `/` redireciona (307/308) para `/{ano-ativo}`. Rotas `/[edition]` servem páginas estáticas de cada ano. Rota `/edicoes` exibe o histórico.
2. **Cache:** Server Components consomem a Local API do Payload encapsulada em `src/lib/content.ts`. O cache é invalidado imediatamente no salvamento do CMS via `revalidateTag(['edition-${slug}', 'editions'])`.
3. **Mídia:** Plugin `@payloadcms/storage-s3` envia uploads diretamente para o Backblaze B2 em produção. Em desenvolvimento local sem chaves configuradas, faz fallback para armazenamento em pasta local `media/`.
4. **Modelagem Híbrida:**
   - Coleções Globais: `speakers` (reuso de bio/fotos), `partners` (categorização/tiers), `users` (admin) e `media` (S3).
   - Grupos Aninhados na Edição: `schedule` (dias e palestras), `faqs`, `about`, `heroSlides` e `theme` para edição centralizada em formulário único.
5. **Theming:** Injeção de variáveis CSS no wrapper (`--color-primary`, `--color-accent`) com fallback inteligente.

---

## 4. Modelagem de Dados e Tipos TypeScript

### 4.1 Tipagem Central (`src/lib/content.ts`)

```ts
export interface ThemeConfig {
  primaryColor: string;       // ex: "#083D77" (cor principal)
  accentColor: string;        // ex: "#e2187f" (cor de destaque)
  logo?: MediaRef | null;
  heroBanner?: MediaRef | null;
  heroBackground?: MediaRef | null;
}

export interface Talk {
  titulo: string;
  horario: string;
  local: string;
  palestrante: string;
  speakerRef?: Speaker | null;
  vagas?: string;
  meetLink?: string;
}

export interface ScheduleDay {
  date: string;               // "20/10"
  dayOfWeek: string;          // "Segunda-feira"
  eventName: string;          // "Abertura Oficial"
  talks: Talk[];
}

export interface Edition {
  id: string;
  slug: string;               // "2025" — rota na URL
  year: number;               // 2025
  title: string;              // "III Semana de Ciência, Tecnologia e Inovação"
  shortTitle: string;         // "III Semana de Tecnologia"
  isDefault: boolean;         // Define a edição ativa
  dates: string;              // "20 a 24 de outubro de 2025"
  registrationUrl: string;
  theme: ThemeConfig;
  heroSlides: { type: "image" | "video"; src: string; alt: string }[];
  about: { title: string; body: string; illustration?: MediaRef | null };
  schedule: ScheduleDay[];
  partners: Partner[];
  faqs: { question: string; answer: string }[];
  subscription: { title: string; ctaLabel: string };
}
```

### 4.2 Configuração da Coleção `editions` (`src/collections/Editions.ts`)

```ts
import { CollectionConfig } from "payload";
import { revalidateTag } from "next/cache";

export const Editions: CollectionConfig = {
  slug: "editions",
  admin: { useAsTitle: "title", defaultColumns: ["year", "title", "isDefault"] },
  access: { read: () => true },
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // Garante que apenas uma edição seja isDefault
        if (data.isDefault) {
          await req.payload.update({
            collection: "editions",
            where: { isDefault: { equals: true } },
            data: { isDefault: false },
          });
        }
        return data;
      },
    ],
    afterChange: [
      async ({ doc }) => {
        revalidateTag(`edition-${doc.slug}`);
        revalidateTag("editions");
        revalidateTag("default-edition");
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        revalidateTag(`edition-${doc.slug}`);
        revalidateTag("editions");
        revalidateTag("default-edition");
      },
    ],
  },
  fields: [
    { name: "slug", type: "text", required: true, unique: true },
    { name: "year", type: "number", required: true, unique: true },
    { name: "title", type: "text", required: true },
    { name: "shortTitle", type: "text", defaultValue: "Semana de Tecnologia" },
    { name: "isDefault", type: "checkbox", defaultValue: false },
    { name: "dates", type: "text" },
    { name: "registrationUrl", type: "text" },
    {
      name: "theme",
      type: "group",
      fields: [
        { name: "primaryColor", type: "text", defaultValue: "#083D77" },
        { name: "accentColor", type: "text", defaultValue: "#e2187f" },
        { name: "logo", type: "upload", relationTo: "media" },
        { name: "heroBanner", type: "upload", relationTo: "media" },
        { name: "heroBackground", type: "upload", relationTo: "media" },
      ],
    },
    {
      name: "about",
      type: "group",
      fields: [
        { name: "title", type: "text" },
        { name: "body", type: "textarea" },
        { name: "illustration", type: "upload", relationTo: "media" },
      ],
    },
    {
      name: "schedule",
      type: "array",
      fields: [
        { name: "date", type: "text", required: true },
        { name: "dayOfWeek", type: "text", required: true },
        { name: "eventName", type: "text", required: true },
        {
          name: "talks",
          type: "array",
          fields: [
            { name: "titulo", type: "text", required: true },
            { name: "horario", type: "text", required: true },
            { name: "local", type: "text", required: true },
            { name: "palestrante", type: "text", required: true },
            { name: "speakerRef", type: "relationship", relationTo: "speakers" },
            { name: "vagas", type: "text" },
            { name: "meetLink", type: "text" },
          ],
        },
      ],
    },
    { name: "partners", type: "relationship", relationTo: "partners", hasMany: true },
    {
      name: "faqs",
      type: "array",
      fields: [
        { name: "question", type: "text", required: true },
        { name: "answer", type: "textarea", required: true },
      ],
    },
    {
      name: "subscription",
      type: "group",
      fields: [
        { name: "title", type: "text" },
        { name: "ctaLabel", type: "text" },
      ],
    },
  ],
};
```

---

## 5. Camada de Conteúdo (`src/lib/content.ts`)

A camada de acesso encapsula as queries do Payload e aplica cache com tags do Next.js:

```ts
import { getPayload } from "payload";
import config from "@payload-config";
import { unstable_cache } from "next/cache";

export const getEdition = unstable_cache(
  async (slug: string) => {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: "editions",
      where: { slug: { equals: slug } },
      depth: 2,
    });
    return result.docs[0] ?? null;
  },
  ["getEdition"],
  { tags: (slug) => [`edition-${slug}`] }
);

export const getDefaultEdition = unstable_cache(
  async () => {
    const payload = await getPayload({ config });
    // Busca a edição default ou faz fallback para a mais recente
    const result = await payload.find({
      collection: "editions",
      where: { isDefault: { equals: true } },
      depth: 2,
    });
    if (result.docs.length > 0) return result.docs[0];

    const fallback = await payload.find({
      collection: "editions",
      sort: "-year",
      limit: 1,
      depth: 2,
    });
    return fallback.docs[0] ?? null;
  },
  ["getDefaultEdition"],
  { tags: ["default-edition", "editions"] }
);

export const getAllEditions = unstable_cache(
  async () => {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: "editions",
      sort: "-year",
      depth: 1,
    });
    return result.docs;
  },
  ["getAllEditions"],
  { tags: ["editions"] }
);
```

---

## 6. Estrutura de Rotas Multi-Edição

```
src/app/
├── (payload)/
│   └── admin/[[...segments]]/page.tsx   # Painel Administrativo do Payload
├── (site)/
│   ├── page.tsx                         # Redirect 307/308 para /{ano-ativo}
│   ├── edicoes/
│   │   └── page.tsx                     # Histórico navegável de edições
│   └── [edition]/
│       ├── page.tsx                     # Renderização da edição específica
│       ├── layout.tsx                   # Metadata dinâmico por edição
│       └── not-found.tsx                # 404 personalizado da edição
├── api/
│   └── news/route.ts                    # Scraping de notícias (mantido)
├── globals.css
└── layout.tsx                           # Layout raiz compartilhado
```

### 6.1 Redirecionamento da Raiz (`src/app/(site)/page.tsx`)

```tsx
import { redirect } from "next/navigation";
import { getDefaultEdition } from "@/lib/content";

export default async function RootPage() {
  const defaultEdition = await getDefaultEdition();
  const targetSlug = defaultEdition?.slug || "2025";
  redirect(`/${targetSlug}`);
}
```

### 6.2 Página da Edição (`src/app/(site)/[edition]/page.tsx`)

```tsx
import { notFound } from "next/navigation";
import { getEdition, getAllEditions } from "@/lib/content";
import Header from "@/components/project/Header";
import Hero from "@/components/project/Hero";
import About from "@/components/project/About";
import Schedule from "@/components/project/Schedule";
import Partners from "@/components/project/Partners";
import News from "@/components/project/News";
import Faq from "@/components/project/Faq";
import Footer from "@/components/project/Footer";

export async function generateStaticParams() {
  const editions = await getAllEditions();
  return editions.map((e) => ({ edition: e.slug }));
}

export default async function EditionPage({ params }: { params: Promise<{ edition: string }> }) {
  const { edition: slug } = await params;
  const edition = await getEdition(slug);

  if (!edition) notFound();

  return (
    <div
      data-edition={edition.slug}
      style={{
        "--color-primary": edition.theme?.primaryColor || "#083D77",
        "--color-accent": edition.theme?.accentColor || "#e2187f",
      } as React.CSSProperties}
      className="min-h-screen bg-background text-foreground"
    >
      <Header edition={edition} />
      <main>
        <Hero edition={edition} />
        <About edition={edition} />
        <Schedule edition={edition} />
        <Partners edition={edition} />
        <News />
        <Faq edition={edition} />
      </main>
      <Footer edition={edition} />
    </div>
  );
}
```

---

## 7. Theming com Tailwind CSS v4

As variáveis CSS injetadas no container raiz da edição são consumidas diretamente pelos componentes:

```tsx
// Exemplo em Hero.tsx
<h1 className="text-4xl md:text-6xl font-extrabold text-[var(--color-accent)]">
  {edition.title}
</h1>
```

---

## 8. Deploy, Docker e Backup

### 8.1 `docker-compose.prod.yml`

```yaml
services:
  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: semana_tecnologia
    volumes:
      - db-data:/var/lib/postgresql/data
    networks: [app-network]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d semana_tecnologia"]
      interval: 10s
      timeout: 5s
      retries: 5

  nextjs:
    image: ghcr.io/unitins/semana-tecnologia:latest
    restart: unless-stopped
    depends_on:
      db:
        condition: service_healthy
    environment:
      - DATABASE_URI=postgres://app:${POSTGRES_PASSWORD}@db:5432/semana_tecnologia
      - PAYLOAD_SECRET=${PAYLOAD_SECRET}
      - S3_BUCKET=${S3_BUCKET}
      - S3_ENDPOINT=${S3_ENDPOINT}
      - S3_ACCESS_KEY_ID=${S3_ACCESS_KEY_ID}
      - S3_SECRET_ACCESS_KEY=${S3_SECRET_ACCESS_KEY}
      - S3_REGION=${S3_REGION:-us-east-005}
    networks: [app-network]

  backup:
    image: prodrigestivill/postgres-backup-local:16-alpine
    restart: unless-stopped
    depends_on: [db]
    environment:
      - POSTGRES_HOST=db
      - POSTGRES_DB=semana_tecnologia
      - POSTGRES_USER=app
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - SCHEDULE=@daily
      - BACKUP_KEEP_DAYS=30
    volumes:
      - ./backups:/backups
    networks: [app-network]

volumes:
  db-data: {}
networks:
  app-network: { driver: bridge }
```

---

## 9. Seed Automático (Zero Downtime / Primeiro Boot)

Script `src/scripts/seed.ts` (executado automaticamente no primeiro startup ou via `npm run seed`):

1. Verifica se a coleção `editions` possui ao menos 1 documento.
2. Se estiver vazia:
   - Cria o usuário administrador padrão com credenciais seguras do `.env` (`ADMIN_INITIAL_EMAIL` / `ADMIN_INITIAL_PASSWORD`).
   - Carrega `src/data/schedule.json` e monta a edição `2025` como `isDefault: true`.
   - Popula os parceiros existentes e textos padrão.
3. Garante que o ambiente já sobe 100% pronto para uso sem requerer intervenção manual da comissão.

---

## 10. Fases de Execução do Plano

| Fase | Escopo | Entregáveis |
|:---:|---|---|
| **0** | **Setup e Infraestrutura** | Instalação do Payload CMS 3.x, `@payloadcms/db-postgres`, `@payloadcms/storage-s3`, Postgres local e rota `/admin`. |
| **1** | **Coleções e Modelagem** | Criação das coleções `editions`, `speakers`, `partners`, `media`, `users` com hooks de `isDefault` e `revalidateTag`. |
| **2** | **Script de Seed** | Criação do `seed.ts` populando automaticamente os dados de 2025 a partir de `schedule.json`. |
| **3** | **Camada de Conteúdo** | Implementação de `src/lib/content.ts` com cache e Local API. |
| **4** | **Refatoração dos Componentes** | Adaptação de `Hero`, `Header`, `About`, `Schedule`, `Partners`, `Faq`, `Footer` para receber `edition` por prop. |
| **5** | **Roteamento e Theming** | Implementação de `/(site)/page.tsx` (redirect), `/[edition]/page.tsx`, `/edicoes/page.tsx` e injeção de CSS vars. |
| **6** | **Docker, Backup & Testes** | Atualização do `docker-compose.prod.yml`, `Dockerfile` standalone, variáveis de ambiente e testes E2E. |
