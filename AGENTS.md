# Dispatcher de MCP Tools e Regras para Agentes

> **Stack:** Next.js 15 (App Router, Turbopack) | React 19 | TypeScript | Tailwind CSS v4 | Radix UI | Docker/Nginx
> **Contexto:** Site estático oficial da III Semana de Ciência, Tecnologia e Inovação da UNITINS (Evento 2025)
> **MCPs Ativos:** Ingenium (Busca Semântica + AST) | Serena (LSP + Refatoração Global)

Este documento orienta os agentes sobre o uso dos servidores MCP e a arquitetura do projeto.

---

## 1. Inicialização e Uso de Ferramentas

Quando as ferramentas MCP (`explore_code`, `get_symbol_context`, etc.) estiverem disponíveis no conjunto de ferramentas do agente, use-as **diretamente** sem criar subagentes desnecessários.

Se as ferramentas MCP não estiverem injetadas na sessão atual (modo fallback), execute o trabalho diretamente utilizando as ferramentas nativas (`read`, `grep`, `glob`) com escopo e faixas de linhas reduzidas para otimizar tokens e tempo de resposta. Evite instanciar subagentes ou scripts intermediários para consultas simples.

> **Mapeamento de nomes neste harness:** as tools MCP aparecem prefixadas (`mcp__ingenium__*`, `mcp__serena__*`); as nativas são `read`/`grep`/`glob`/`write`/`edit`. Use os nomes que existem no harness em uso.

---

## 2. Divisão de Responsabilidade (Ingenium vs Serena)

| Intenção / Tarefa | MCP | Ferramenta |
|:------------------|:---:|:-----------|
| "Como funciona X / Onde é implementado Y?" | ingenium | `explore_code(query="...", mode="hybrid")` |
| "Já existe algo que faça Z?" (Reuso) | ingenium | `explore_code(query="...", mode="reuse_check")` |
| "Diagnosticar causa de erro" (RCA) | ingenium | `explore_code(query="...", mode="rca")` |
| "Ver corpo AST e callers de uma função/tipo" | ingenium | `get_symbol_context(symbol_name="...", file_path="...")` |
| "Editar função/classe/componente com AST" | ingenium | `apply_structural_edit(dry_run=true/false)` |
| "Registrar invariante de negócio" | ingenium | `annotate_symbol(...)` |
| "Verificar erros de tipo e lint" | serena | `get_diagnostics_for_file(relative_path="...")` |
| "Renomear símbolo em múltiplos arquivos" | serena | `rename_symbol(name_path="...", new_name="...", relative_path="...")` |
| "Mover arquivo com ajuste automático de imports" | serena | (não exposto neste harness — mova o arquivo com `read`/`write` e renomeie símbolos com `rename_symbol`) |
| "Listar referências cruzadas" | serena | `find_referencing_symbols(name_path="...", relative_path="...")` |
| "Executar comandos / scripts" | — | (não é MCP — use a tool de shell do harness, ex.: `pwsh`) |

---

## 3. Arquitetura e Invariantes do Projeto

1. **Site Estático do Evento (2025):** O projeto é uma aplicação web estática / frontend desenvolvida em Next.js 15 (App Router com Turbopack) e React 19 para a III Semana de Ciência, Tecnologia e Inovação da UNITINS (2025). Não possui CMS headless (sem Payload CMS) e não utiliza banco de dados relacional/SQLite.
2. **Programação do Evento (`src/data/schedule.json`):** A programação oficial com dias, horários, locais, palestrantes e trilhas é mantida de forma estática no arquivo `src/data/schedule.json` e consumida pelo componente `src/components/project/Schedule.tsx`.
3. **Notícias do Evento (`src/app/api/news/route.ts`):** As notícias são obtidas através de um endpoint de API que realiza web scraping de notícias oficiais da UNITINS via Cheerio.
4. **UI, Componentes e Estilização:** Interface construída com Tailwind CSS v4, componentes Radix UI / Shadcn (`src/components/ui/`), animações com `motion` e `aos`, e carrosséis com `embla-carousel`.
5. **Deploy e Containerização:** Build em modo standalone via `Dockerfile` com Node.js 20 Alpine, servido com proxy reverso Nginx e certificado SSL Let's Encrypt gerenciado via Certbot (`docker-compose.yml` / `docker-compose.prod.yml`).

---

## 4. Configuração dos Servidores MCP

- **Ingenium MCP:** Executado via `uv run --project C:\Users\Italo\Documents\Projetos\mcps\ingenium-mcp ingenium-mcp`
- **Serena MCP:** Executado via `uv run --project C:\Users\Italo\Documents\Projetos\mcps\serena-mcp serena start-mcp-server --context claude-code --open-web-dashboard false`
