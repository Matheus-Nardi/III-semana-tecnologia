# MCP Tools (Ingenium & Serena) - Diretrizes de Uso para Agentes

> **Stack:** Next.js 15 (App Router, Turbopack) + React 19 + TypeScript + Tailwind CSS v4 + Radix UI + Docker/Nginx
> **Contexto:** Site estático oficial da III Semana de Ciência, Tecnologia e Inovação da UNITINS (Evento 2025)
> **MCPs:** Ingenium (Semântica + AST) | Serena (LSP + Refatoração Global)

Este projeto utiliza **Ingenium MCP** e **Serena MCP** como servidores de inteligência de código. Siga estas diretrizes em toda sessão.

> **Mapeamento de nomes neste harness:** as tools MCP aparecem prefixadas (`mcp__ingenium__*`, `mcp__serena__*`); as nativas são `read`/`grep`/`glob`/`write`/`edit`. Use os nomes que existem no harness em uso.

---

## Divisão de Responsabilidade: Ingenium vs Serena

| Tarefa / Intenção | Ferramenta Recomendada | MCP |
|:------------------|:-----------------------|:---:|
| Entender arquitetura e módulos | `get_architecture_map(detail_level="summary")` | Ingenium |
| Busca semântica por conceito/fluxo | `explore_code(query="...", mode="hybrid")` | Ingenium |
| Checar reuso antes de criar algo novo | `explore_code(query="...", mode="reuse_check")` | Ingenium |
| Investigar causas de erro (RCA) | `explore_code(query="...", mode="rca")` | Ingenium |
| Ver corpo AST + callers/callees de símbolo | `get_symbol_context(symbol_name="...", file_path="...")` | Ingenium |
| Edição estrutural em 1 arquivo (com AST) | `apply_structural_edit(dry_run=true)` -> `dry_run=false` | Ingenium |
| Anotar invariantes de negócio no grafo | `annotate_symbol(...)` | Ingenium |
| Diagnósticos e erros de tipo em arquivo | `get_diagnostics_for_file(relative_path="...")` | Serena |
| Renomear símbolo em múltiplos arquivos | `rename_symbol(name_path="...", new_name="...", relative_path="...")` | Serena |
| Mover/renomear arquivo com imports | (não exposto neste harness — mova o arquivo com `read`/`write` e renomeie símbolos com `rename_symbol`) | Serena |
| Encontrar todas as referências de um símbolo | `find_referencing_symbols(name_path="...", relative_path="...")` | Serena |
| Executar comandos de build / teste | (não é MCP — use a tool de shell do harness, ex.: `pwsh`) | — |

---

## Regras de Uso do Ingenium MCP

### 1. Início de Sessão
- **Verifique os subsistemas:**
  ```
  get_workspace_status()
  ```
- **Mapeie a arquitetura:**
  ```
  get_architecture_map(detail_level="summary")
  ```

### 2. Busca e Exploração de Código
- **NUNCA leia arquivos inteiros** para explorar -- use:
  ```
  explore_code(query="como funciona o componente de cronograma e a carga de dados?", mode="hybrid")
  ```
- **Verificar reuso** antes de criar novos utilitários ou componentes:
  ```
  explore_code(query="Schedule", mode="reuse_check")
  ```

### 3. Edições de Código -- OBRIGATÓRIO Dry Run
- **Sempre** simule com `dry_run=true` primeiro:
  ```
  apply_structural_edit(file_path="src/components/project/Schedule.tsx", target="Schedule", operation="replace_body", dry_run=true)
  ```
- Só aplique com `dry_run=false` após validar o diff e callers impactados.

---

## Arquitetura do Projeto

```
src/
+-- app/
|   +-- api/news/route.ts       # Endpoint para busca e scraping de notícias (Cheerio)
|   +-- layout.tsx              # Root Layout com fontes, metadados e handlers de erro
|   +-- page.tsx                # Página inicial Single-Page agregando todas as seções
|   +-- globals.css             # Configurações de Tailwind CSS v4 e temas
|   +-- robots.ts / sitemap.ts  # SEO e indexação
+-- components/
|   +-- project/                # Componentes das seções do evento
|   |   +-- About.tsx           # Sobre o evento
|   |   +-- Countdown.tsx       # Contagem regressiva
|   |   +-- Faq.tsx             # Perguntas frequentes
|   |   +-- Footer.tsx          # Rodapé oficial
|   |   +-- Header.tsx          # Cabeçalho e navegação
|   |   +-- Hero.tsx            # Seção principal de apresentação
|   |   +-- Location.tsx        # Localização do evento
|   |   +-- News.tsx            # Seção de notícias
|   |   +-- Partners.tsx        # Parceiros e apoiadores
|   |   +-- Schedule.tsx        # Programação interativa (trilhas, dias, horários)
|   |   +-- Subscription.tsx    # Inscrições
|   +-- ui/                     # Componentes base Radix UI / Shadcn
|       +-- accordion.tsx, badge.tsx, button.tsx, card.tsx, carousel.tsx...
+-- data/
|   +-- schedule.json           # Fonte de dados estática da programação do evento (2025)
+-- lib/
|   +-- utils.ts                # Utilitários gerais (ex.: clsx + tailwind-merge)
public/                         # Assets estáticos (logos, favicons, ilustrações)
nginx/                          # Configurações do Nginx Reverse Proxy
```

---

## Invariantes Chave e Diretrizes do Projeto

1. **Site Estático do Evento 2025:** O projeto é uma aplicação estática e interativa para a III SCTI (2025). Não há CMS acoplado (sem Payload CMS) e não há banco de dados relacional/SQLite.
2. **Dados da Programação:** A programação oficial é mantida em `src/data/schedule.json` e consumida pelo componente `Schedule.tsx`.
3. **Scraping de Notícias:** O componente `News.tsx` consome o endpoint `src/app/api/news/route.ts`, que obtém dinamicamente notícias da UNITINS via web scraping com Cheerio.
4. **Tailwind CSS v4 & UI:** Estilização com Tailwind v4 (`@tailwindcss/postcss`), componentes Radix UI e animações via `motion` e `aos`.
5. **Deploy & Docker:** Containerização em multi-stage build (`Dockerfile`), com saída Next.js standalone servida por proxy reverso Nginx e SSL gerenciado via Certbot.