---
name: code-intelligence-recall
description: "Referência de uso dos MCPs Ingenium (AST + Busca Semântica) e Serena (LSP + Refatoração Global): árvore de decisão de custo, cadeia sem-grep via next_actions, quando usar explore_code/get_symbol_context/apply_structural_edit, checagem de readiness/freshness do índice após mudanças e guardrails. Use como referência única para análise, busca, refatoração ou diagnóstico."
targets: [shared]
---

# Code Intelligence Recall — Ingenium & Serena MCP

Referência operacional dos MCPs **Ingenium** (busca semântica + AST) e **Serena** (LSP + refatoração global). O objetivo é **minimizar tokens e round-trips** mantendo a precisão: gastar a menor quantidade de chamadas possível e **nunca** substituir os macro-tools por varredura manual (`grep`/`read` de arquivos inteiros).

> **Fonte autoritativa:** as descrições das próprias tools do MCP (`QUANDO USAR` / `QUANDO NÃO USAR`) são a verdade canônica. Esta skill apenas organiza a decisão e o **encadeamento**.

---

## 1. Modelo mental: o encadeamento é o contrato (a cadeia sem-grep)

O Ingenium é desenhado como **Progressive Disclosure em 3 camadas**, conectadas por um campo **`next_actions`** que cada tool retorna. **Siga esse encadeamento — ele é o caminho sem `grep`.**

```
Camada 1 (busca)        explore_code / get_architecture_map
                          │  devolve resultado + next_actions
                          ▼
Camada 2 (inspeção)     get_symbol_context  ← corpo COMPLETO do símbolo
                          │  devolve code + callers/callees + next_actions
                          ▼
Camada 3 (mutação)      apply_structural_edit (dry_run=true → diff → dry_run=false)
```

Regras que decorrem daí:

- **`explore_code` devolve código ESQUELETO** (assinaturas e trechos), **não o corpo completo**. Se você precisa do corpo inteiro para editar, **NÃO** faça `grep`/`read` — chamou `get_symbol_context` (que retorna `code` completo) e pronto.
- **Siga sempre os `next_actions`** retornados: eles apontam a continuação correta (`get_symbol_context` para o corpo, `apply_structural_edit` para editar). Ignorar `next_actions` é o que faz o agente cair em `grep`.
- **Busca literal de string (ex.: "onde `revalidateTag` aparece?")** → use `explore_code(mode="exact_match")`, que **internamente já usa ripgrep**. Não acione o `grep` nativo para isso.

---

## 2. Árvore de decisão de custo (usar primeiro)

Decida **antes** de tocar em qualquer ferramenta. Objetivo: 2–3 round-trips por investigação, não 7–15.

1. **Preciso do corpo completo / editar um símbolo já conhecido?**
   → `get_symbol_context(symbol_name, file_path?, depth=...)`. Pulo direto — sem `explore_code`.

2. **Não sei onde está / é conceito, fluxo ou intenção?**
   → `explore_code(query="...", mode="hybrid")`. Se a resposta não inclui o corpo, **continue** com `get_symbol_context` apontado pelos `next_actions`.

3. **Quero saber se já existe algo (reuso)?**
   → `explore_code(query="...", mode="reuse_check")`.

4. **Estou diagnosticando causa de erro?**
   → `explore_code(query="...", mode="rca")`.

5. **É busca LITERAL (string exata, nome exato)?**
   → `explore_code(query="...", mode="exact_match")` (= ripgrep interno).

6. **É busca por símbolo exato, mas pode haver vários arquivos?**
   → `explore_code(mode="exact_match")` ou `get_symbol_context` com `file_path` quando houver ambiguidade (a tool devolve `SYMBOL_AMBIGUOUS` com as sugestões de `file_path`).

7. **É refatoração global / diagnóstico de tipo / mover arquivo?**
   → Serena (`rename_symbol`, `find_referencing_symbols`, `get_diagnostics`, `move_file`).

---

## 3. Contrato condicional e Regra Anti-Grep (condicional, não absoluta)

**A)** Quando as tools MCP estão injetadas na sessão (caso normal):

- **NUNCA** faça `grep`/`read` massivo de arquivos para explorar/entender. Use a cadeia acima.
- Busca de **conceito** → `explore_code` (hybrid/reuse_check/rca).
- Corpo de **símbolo conhecido** → `get_symbol_context`.
- **Literal/string** → `explore_code(mode="exact_match")`.
- **Editar** → `apply_structural_edit` com `dry_run=true` (que já devolve o diff; não precisa ler o arquivo para saber o efeito).

**B)** Só escape para a ferramenta nativa `grep`/`read` **estritamente** quando:

- A tool MCP retornar **sem resultado** (`results: []`) e você já tentou `exact_match`; **ou**
- O índice estiver obsoleto/incompleto (`get_workspace_status` com `semantic_ready=false` / `degraded=true`) e a busca degradar para `EXACT_MATCH`/lexical ainda assim não achar; **ou**
- As tools MCP não estiverem carregadas (modo fallback).

Nesses casos, avise o usuário no início da resposta e use `read`/`grep`/`glob` com **escopo mínimo** (arquivo específico, faixa de linhas curta, padrão estreito) — nunca varredura de árvore inteira.

> **Princípio:** mesmo quando o índice falha, prefira `explore_code(mode="exact_match")` antes do `grep` nativo, pois ele encapsula ripgrep com *path jailing* e *anti-flag injection*.

---

## 4. Tabela de Despacho (Dispatcher)

| Pergunta / Intenção | Servidor | Ferramenta | Parâmetros |
|:--------------------|:--------:|:-----------|:-----------|
| "Como funciona X neste projeto?" | Ingenium | `explore_code` | `mode="hybrid"` |
| "Onde é implementado Y?" | Ingenium | `explore_code` | `mode="hybrid"` ou `mode="exact_match"` |
| "Já existe algo que faça Z?" (reuso) | Ingenium | `explore_code` | `mode="reuse_check"` |
| "Causa do erro X?" (RCA) | Ingenium | `explore_code` | `mode="rca"` |
| "Busca literal: onde aparece a string S?" | Ingenium | `explore_code` | `mode="exact_match"` |
| "Corpo completo de função/classe" | Ingenium | `get_symbol_context` | `depth=0` |
| "Quem chama? Impacto de mudar?" | Ingenium | `get_symbol_context` | `depth=1` ou `depth=2` |
| "Arquitetura / módulos do projeto?" | Ingenium | `get_architecture_map` | `detail_level="summary"` |
| "Editar corpo com AST" | Ingenium | `apply_structural_edit` | `dry_run=true` primeiro |
| "Adicionar/remover import" | Ingenium | `apply_structural_edit` | `operation="add_import"` |
| "Anotar invariante de negócio" | Ingenium | `annotate_symbol` | — |
| "Renomear símbolo em vários arquivos" | Serena | `rename_symbol` | — |
| "Mover arquivo com imports" | Serena | `move_file` | — |
| "Referências cruzadas de um símbolo" | Serena | `find_referencing_symbols` | — |
| "Erros de tipo / lint" | Serena | `get_diagnostics` | — |

---

## 5. Inicialização e Freshness do Índice (não é "uma vez por sessão")

O índice **não é estático durante a sessão**: ele é re-indexado automaticamente quando o workspace muda. Portanto `get_workspace_status()` é chamado **uma vez no início** e **re-verificado quando o índice pode ter desatualizado** — não "uma vez por sessão, nunca mais".

Quando o índice atualiza sozinho:
- **`apply_structural_edit` (dry_run=false):** o arquivo é re-indexado **imediatamente** na mesma chamada. Índice fresco, sem ação extra.
- **Edições NATIVAS** (agente via `write`/`edit`, ou usuário no IDE): o **FileWatcher** re-indexa de forma **assíncrona** (`debounce≈300ms`). Existe uma **janela de staleness** — logo após uma edição nativa, uma busca semântica/híbrida pode devolver resultado antigo até o watcher concluir.

Quando re-verificar com `get_workspace_status()`:
- Após edições nativas em massa, arquivos novos/renomeados/movidos, `git checkout`/troca de branch, instalação de dependências ou geração de arquivos.
- Quando uma busca retornar `results: []` ou resultado surpreendente para algo que você acabou de criar/editar.
- Antes de uma edição cirúrgica que dependa de dados de símbolos frescos (garantir alvo/linhas corretos).

O que validar na resposta:
- `semantic_ready=true` → busca vetorial pronta; use `hybrid`/`semantic`. Se `false`/`degraded=true`, use `mode="exact_match"` ou `get_symbol_context`.
- `graph_ready=true` → grafo completo. Se `false`, o mapa de dependências pode ser parcial.
- `is_indexing=true` ou `indexing_progress < 100` → re-index em andamento; espere, ou use as alternativas abaixo.

Como reduzir a corrida contra o watcher:
- **Símbolos recém-criados/editados → `explore_code(mode="exact_match")`** (ripgrep no disco, lê o conteúdo ao vivo — imune à staleness do índice vetorial) **ou `get_symbol_context`** (que re-extrai do disco quando o símbolo não está no cache). Prefira isso a `hybrid`/`semantic`, que dependem do índice vetorial ainda em atualização.
- Não confie em `explore_code` semântico/híbrido para símbolos acabados de adicionar até o watcher re-indexar.
- Se estiver mapeando um repositório desconhecido no início, chame `get_architecture_map(detail_level="summary")` na sequência.

---

## 6. Guardrails

- **Scores RRF são ordinais:** o `score` do `explore_code` é um ranking RRF normalizado, **não** porcentagem de similaridade. Não interprete `0.5` como 50%.
- **Edição em 3 etapas (obrigatório):**
  1. Inspecionar callers: `get_symbol_context(symbol_name, depth=1)`.
  2. Simular: `apply_structural_edit(..., dry_run=true)` → validar o diff.
  3. Aplicar: `apply_structural_edit(..., dry_run=false, format_after=true)`.
- **Conteúdo base-0:** em `apply_structural_edit`, o `content` deve ter indentação base-0; o *Reindenter* ajusta automaticamente ao escopo do alvo.
- **Ambiguidade:** se `get_symbol_context` retornar `SYMBOL_AMBIGUOUS`, informe `file_path` (as sugestões vêm no payload) — não `grep` para adivinhar.
- **Invariantes do Projeto:** Site estático para a III Semana de Tecnologia 2025; cronograma oficial mantido em `src/data/schedule.json`; interface estilizada com Tailwind CSS v4 e Radix UI.

---

## 7. Mapeamento de nomes (neste harness)

- Tools MCP aparecem prefixadas: `mcp__ingenium__explore_code`, `mcp__ingenium__get_symbol_context`, `mcp__ingenium__apply_structural_edit`, `mcp__ingenium__get_architecture_map`, `mcp__ingenium__get_workspace_status`, `mcp__ingenium__annotate_symbol`; e `mcp__serena__*` para o Serena.
- Ferramentas nativas aqui são `read`, `grep`, `glob`, `write`, `edit` (em outros harnesses podem se chamar `view_file`, `grep_search`). Use os nomes que existem **no seu harness** ao invocar.
