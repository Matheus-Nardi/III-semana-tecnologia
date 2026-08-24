---
name: grill-me
description: "Pressure-test an existing plan, design, or decision, interrogating every decision point one question at a time until hidden assumptions and weak points surface."
model: opus
effort: high
---

# Grill Me

Pressione um plano, design ou decisão antes de commitá-lo. Mostre hipóteses ocultas, pontos frágeis e dependências não resolvidas. Para gerar opções, use **brainstorming**.

Reserve para decisões caras de reverter: mudanças em `models.py` / data model, contratos públicos de API (`schemas.py`), postura de segurança (JWT/passlib), escolhas de infra (S3/MinIO, asyncpg). Features pequenas e de baixo risco pulam direto para `implementar-issue`.

## Como interrogar

- Uma pergunta por vez, com resposta recomendada quando houver uma clara.
- Ative o `dev-mcp` antes de começar:
  1. `call_mcp_tool(ServerName="dev-mcp", ToolName="set_project", Arguments={"path": "/home/italo/Documentos/sfi/vistoria-backend"})`
  2. Verifique `vendors_ready` na resposta. Se `false`, chame `call_mcp_tool(ServerName="dev-mcp", ToolName="ping", Arguments={})` e confirme antes de usar ferramentas de grafo. **Fallback** (vendors ainda `false`): use `grep_search`/`view_file`; não invoque `check_type_consistency` nem `diff_impact_analysis`.
  3. `call_mcp_tool(ServerName="dev-mcp", ToolName="set_mode", Arguments={"mode": "review"})`
  4. Use `call_mcp_tool(ToolName="check_type_consistency")` e `call_mcp_tool(ToolName="diff_impact_analysis")` para embasar perguntas com dados reais — **somente se `vendors_ready: true`**.
- Leia o repositório antes; pergunte apenas o que o código não responde.
- Navegue a árvore de decisão completa: siga cada resposta até o fim antes de passar para a próxima.
- Quando uma resposta revelar lacuna ou contradição, nomeie-a e faça o follow-up imediatamente.

## Processo

1. Se houver `docs/` relevante, leia-o; use `dev-mcp` via `call_mcp_tool` (`semantic_search`, `check_type_consistency`) — **somente se `vendors_ready: true`** — para validar a decisão contra o código real. Princípios do `GEMINI.md` são absolutos: violação é bloqueante, não tradeoff.
2. Derive as áreas de decisão a partir do artefato e das regras do `GEMINI.md`, não de um checklist fixo.
3. Comece pela decisão mais estrutural — a que invalida mais escolhas downstream se estiver errada. Formato de cada pergunta:
   > **[Tópico]:** [Pergunta]
   >
   > Recomendado: [recomendação, ou "sem preferência forte"]
4. Quando uma resposta revelar nova contradição, dependência ou violação de regra do `GEMINI.md`, retorne ao passo 3 automaticamente até nada novo emergir.
5. Sumarize: decisões sólidas, hipóteses validadas, riscos/lacunas ainda abertos, o que precisa ser decidido antes de prosseguir.
6. Pergunte se prosseguir, revisar ou aprofundar. Em revisão, retorne ao ponto afetado sem reiniciar.
7. **Comunicação**: Respostas diretas, sem prolixidade. Repita termos técnicos do projeto (`schemas.py`, `models.py`, nomes de domínios, rotas) livremente para garantir clareza.

## Concluído Quando

Todos os pontos de decisão materiais foram cobertos e o usuário aprova. Sugira `planejar-issues` para sequenciar o trabalho.