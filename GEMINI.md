# Dispatcher de MCP Tools — III Semana de Tecnologia (UNITINS 2025)

> Stack: Next.js 15 (App Router, Turbopack) | React 19 | TypeScript | Tailwind CSS v4 | Radix UI | Docker/Nginx
> Contexto: Site estático oficial da III Semana de Ciência, Tecnologia e Inovação da UNITINS (Evento 2025)
> MCPs ativos: ingenium (busca semantica + edicao AST) | serena (LSP + refatoracao global)

Este documento e o ponto de entrada para agentes. Leia-o antes de qualquer acao no repositorio.
Ele ensina QUANDO e COMO usar cada ferramenta disponivel, tal como o sistema de skills do CEREBRO.

---

## 1. Ritual de Inicio de Sessao e Uso Eficiente

Quando as ferramentas MCP estiverem disponíveis diretamente no agente:
- Execute `ingenium: get_workspace_status()` para checar a prontidão do índice se for a primeira exploração do repositório.
- Se os MCPs não estiverem injetados no turno atual (modo fallback), utilize as ferramentas nativas (`view_file`, `grep_search`) de forma cirúrgica e com faixas de linhas específicas, evitando criar subagentes desnecessários ou rodar scripts avulsos.

---

## 2. Tabela de Dispatch: Qual MCP usar para cada intencao

| Intencao / Pergunta | MCP | Ferramenta | Modo |
|:--------------------|:---:|:-----------|:-----|
| "Como funciona X neste projeto?" | ingenium | explore_code | hybrid |
| "Onde e implementado Y?" | ingenium | explore_code | hybrid ou auto |
| "Ja existe algo que faca Z antes de eu criar?" | ingenium | explore_code | reuse_check |
| "Quero ver o corpo completo da funcao/componente W" | ingenium | get_symbol_context | -- |
| "Quem chama esta funcao/componente? Impacto de mudar?" | ingenium | get_symbol_context | depth=1 ou 2 |
| "Qual a arquitetura do projeto?" | ingenium | get_architecture_map | summary |
| "Erro X esta acontecendo. Qual a causa?" | ingenium | explore_code | rca |
| "Quero editar o corpo de um componente/funcao" | ingenium | apply_structural_edit | dry_run=true primeiro |
| "Quero adicionar/remover um import" | ingenium | apply_structural_edit | add_import / delete |
| "Esta funcao/componente tem uma regra especial — anote" | ingenium | annotate_symbol | -- |
| "Renomear simbolo em 20+ arquivos" | serena | rename_symbol | -- |
| "Mover arquivo ou diretorio" | serena | move_file | -- |
| "Listar todas as referencias de um tipo" | serena | find_referencing_symbols | -- |
| "Onde este tipo e declarado?" | serena | find_symbol | -- |
| "Ha erros de tipo neste arquivo?" | serena | get_diagnostics | -- |
| "Executar build, lint ou testes" | serena | execute_shell_command | -- |

Regra de ouro: se voce JA SABE o nome exato do simbolo -> get_symbol_context.
Se voce PROCURA por conceito ou intencao -> explore_code.
Se e uma operacao GLOBAL em N arquivos -> serena.

---

## 3. Receitas por Fluxo de Trabalho (Inspiradas no CEREBRO)

### 3.1 Explorar Area Desconhecida

```
1. ingenium: get_architecture_map(detail_level="summary")
   -> Identifica os modulos do projeto (src/components/project, src/data, src/app, etc.)

2. ingenium: explore_code(query="como funciona a renderizacao da programacao?", mode="hybrid")
   -> Retorna chunks relevantes com Sibling Folding (metodos irmaos dobrados para economizar tokens)
   -> ATENCAO: scores sao ranks RRF ordinais, nao porcentagem de similaridade.
      Score 0.5 nao significa "50% relevante" -- use so para ordenar os resultados.

3. [Siga o next_actions retornado] -> geralmente get_symbol_context no simbolo mais relevante
```

### 3.2 Verificar Reuso Antes de Criar

Antes de criar qualquer componente, hook ou utilitario, pergunte:

```
ingenium: explore_code(query="Schedule", mode="reuse_check")
ingenium: explore_code(query="cn helper", mode="reuse_check")
```

O modo reuse_check aplica boost 3x em matches exatos de identificadores de simbolos.
Se o resultado mostrar uma implementacao existente, reaproveite-a.

### 3.3 Inspecionar Impacto Antes de Mudar

Antes de alterar a assinatura de um componente ou funcao publica:

```
ingenium: get_symbol_context(
  symbol_name="Schedule",
  file_path="src/components/project/Schedule.tsx",
  depth=2
)
```

A resposta inclui callers e callees ate profundidade 2.
Verifique o array `callers` antes de qualquer modificacao de assinatura publica.
Se houver callers em muitos arquivos -> considere serena: rename_symbol para refatoracao atomica.

### 3.4 Investigar Causa de Erro (RCA)

```
ingenium: explore_code(
  query="erro ao parsear schedule.json ou buscar noticias na API",
  mode="rca"
)
```

O modo rca cruza a busca semantica com co-changes recentes do git.
Retorna os simbolos que mudaram junto com os arquivos mais proximos do sintoma.
Use o `module_context` retornado para entender as convencoes do modulo afetado.

### 3.5 Regras do Modulo

Toda resposta de explore_code e get_symbol_context inclui um campo `module_context` com:
- Docstring do modulo pai
- Snippet do README local (se existir)
- Convencoes detectadas automaticamente

Leia o `module_context` antes de editar qualquer arquivo.

### 3.6 Anotar Invariantes

Registre decisoes arquiteturais e restricoes diretamente no grafo do projeto:

```
ingenium: annotate_symbol(
  symbol_name="Schedule",
  file_path="src/components/project/Schedule.tsx",
  annotation="INVARIANTE: A programacao oficial e carregada a partir de src/data/schedule.json para a edicao 2025."
)
```

As anotacoes aparecem automaticamente no proximo get_symbol_context para esse simbolo.
Sao persistentes entre sessoes -- qualquer agente futuro vera a nota.

### 3.7 Editar Codigo com Seguranca (3 Etapas Obrigatorias)

NUNCA edite diretamente. Siga este fluxo:

Etapa 1 -- Inspecionar callers:
```
ingenium: get_symbol_context(symbol_name="Schedule", depth=1)
```

Etapa 2 -- Simular a edicao (dry_run=true, default):
```
ingenium: apply_structural_edit(
  file_path="src/components/project/Schedule.tsx",
  target="Schedule",
  operation="replace_body",
  content="... novo codigo em indentacao base-0 ...",
  dry_run=true
)
```
-> Revise o diff e o array `impacted_callers` retornado.

Etapa 3 -- Aplicar somente apos validar:
```
ingenium: apply_structural_edit(
  file_path="src/components/project/Schedule.tsx",
  target="Schedule",
  operation="replace_body",
  content="... mesmo codigo ...",
  dry_run=false,
  format_after=true
)
```
-> Backup automatico criado. Formatacao aplicada apos a edicao.

---

## 4. Contrato Condicional: O Que Fazer Quando o MCP Nao Esta Disponivel

Inspirado no principio central: "nunca bloquear o agente".

| Situacao | Acao de Fallback |
|:---------|:-----------------|
| ingenium semantic_ready=false (indexando) | Use explore_code(mode="exact_match") ou get_symbol_context diretamente |
| ingenium degraded=true | Resultados via Ripgrep (lexical). Menos precisao, mas funcional. |
| serena indisponivel / LSP nao iniciado | Use ingenium get_symbol_context para callers. Para rename em massa, faca manualmente ou adie. |
| Ambos indisponiveis | Use as ferramentas nativas do agente (read_file, search) com cautela. Nao edite sem dry_run equivalente. |

Sempre verifique `available_tools` e `blocked_tools` no retorno de get_workspace_status.
Se uma ferramenta aparecer em `blocked_tools`, nao tente usa-la -- use o fallback acima.

---

## 5. Arquitetura do Projeto e Invariantes Chave

### Mapa de Arquivos Criticos

| Arquivo | Responsabilidade | Tipo |
|:--------|:-----------------|:----:|
| src/app/page.tsx | Página inicial Single-Page agregando todas as seções do evento | Entrada Frontend |
| src/components/project/Schedule.tsx | Componente interativo da programação do evento | Componente Principal |
| src/data/schedule.json | Fonte estática de dados com cronograma, trilhas e atividades de 2025 | Fonte de Dados |
| src/components/project/ | Seções da página (Hero, About, Countdown, News, Partners, Faq, Location, etc.) | Componentes |
| src/components/ui/ | Componentes base Radix UI / Shadcn | UI Primitives |
| src/app/api/news/route.ts | Endpoint de scraping de notícias da UNITINS via Cheerio | API Route |
| src/app/globals.css | Configurações de estilização e variáveis CSS do Tailwind v4 | Estilos Globais |
| Dockerfile & docker-compose.yml | Build standalone do Next.js e proxy Nginx com SSL Certbot | Infraestrutura |

### Invariantes Criticas (Nunca Violar)

1. **Site Estático do Evento 2025:**
   O site é estático e voltado exclusivamente para a III Semana de Ciência, Tecnologia e Inovação (2025). Não há CMS headless, Payload CMS, SQLite ou banco de dados externo acoplado.

2. **Fonte de Dados da Programação (`src/data/schedule.json`):**
   A programação e cronograma do evento são mantidos no JSON estático `src/data/schedule.json` e renderizados de forma reativa pelo componente `src/components/project/Schedule.tsx`.

3. **Scraping de Notícias (`src/app/api/news/route.ts`):**
   A seção de notícias obtém atualizações dinâmicas da UNITINS via scraping com Cheerio pelo route handler `/api/news`.

4. **Estilização com Tailwind CSS v4:**
   O projeto utiliza a versão 4 do Tailwind CSS (`@tailwindcss/postcss`). Evite recriar configurações obsoletas de Tailwind v3.

5. **Deploy Standalone com Docker e Nginx:**
   A compilação do Next.js gera o pacote standalone (`output: 'standalone'`). Em produção, a aplicação roda em container Docker com proxy reverso Nginx e SSL gerenciado pelo Certbot no domínio `unitinscti.com.br`.

---

## 6. Divisao de Responsabilidade: Ingenium vs Serena

| Dimensao | Ingenium MCP | Serena MCP |
|:---------|:------------|:-----------|
| Busca por conceito/intencao | explore_code(hybrid/semantic/rca) | -- |
| Verificar reuso | explore_code(reuse_check) | -- |
| Ver corpo completo de funcao | get_symbol_context | -- |
| Grafo de callers/callees | get_symbol_context(depth=N) | -- |
| Editar corpo de funcao/classe | apply_structural_edit | replace_symbol_body |
| Adicionar/remover import | apply_structural_edit(add_import/delete) | -- |
| Renomear simbolo em 1 arquivo | apply_structural_edit(replace) | -- |
| Renomear simbolo em N arquivos | NAO USE (apenas 1 arquivo) | rename_symbol |
| Mover arquivo ou diretorio | NAO USE | move_file |
| Listar referencias cruzadas | get_symbol_context(callers) | find_referencing_symbols |
| Erros de tipo / diagnosticos | NAO USE | get_diagnostics |
| Mapa arquitetural / comunidades | get_architecture_map | -- |
| Anotar invariantes de negocio | annotate_symbol | -- |
| Executar scripts / testes / build | NAO USE | execute_shell_command |

---

## 7. Checklist Antes de Fechar uma Tarefa

- [ ] Anotei novos comportamentos ou invariantes via `annotate_symbol`?
- [ ] Verifiquei `callers` antes de alterar a assinatura de componentes públicos?
- [ ] Confirmei que as alterações não quebram o layout responsivo ou Tailwind v4?
- [ ] O diff do dry_run foi revisado antes de aplicar com dry_run=false?
- [ ] Se renomeei símbolos em massa, usei serena: rename_symbol?

---

## 8. Configuracao e Instalacao dos MCPs

Ambos os MCPs sao executados via `uv run` diretamente de seus repositorios locais:

- **Ingenium MCP:** `C:\Users\Italo\Documents\Projetos\mcps\ingenium-mcp`
- **Serena MCP:** `C:\Users\Italo\Documents\Projetos\mcps\serena-mcp`

### Arquivos de Configuracao Ativos

1. **Antigravity Workspace Plugin:** `.agents/plugins/code-intelligence/mcp_config.json` (fonte principal no Antigravity, com `--path` e `--project` vinculados ao projeto)
2. **Claude Code / Cursor / VS Code:** `.mcp.json`
3. **Antigravity Global:** `~/.gemini/config/mcp_config.json` (servidores globais; desativar servidores duplicados do workspace para evitar inicialização dupla)

### Subagentes e MCPs
Ao definir ou invocar subagentes especializados (via `define_subagent` ou `invoke_subagent`), garanta que `enable_mcp_tools: true` esteja configurado para que o subagente herde o acesso as ferramentas do Ingenium e Serena.