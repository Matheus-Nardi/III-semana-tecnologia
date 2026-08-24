---
name: brainstorming
description: "Explore how something should work before building it (product philosophy, component design, or feature behavior) and converge on an approved design."
allowed-tools: Read, Grep, Glob, Write, Edit
model: opus
effort: high
---

# Brainstorming

Converge on an approved design, not a large document. Explore how something should work before it is built.

## Scopes

| Scope | Lê | Saída | Próximo |
|---|---|---|---|
| **Produto** | `docs/api-reference.md`, `docs/guia-integracao-edicao-formulario.md` | conversacional, sem arquivo | `grill-me` ou `planejar-issues` |
| **Componente** | arquivos do domínio afetado (`src/<dominio>/`), `GEMINI.md` | conversacional, sem arquivo | `grill-me` (se data model, contrato público ou infra irreversível), senão `planejar-issues` |
| **Feature** | domínio relevante em `src/`, schemas e service do domínio | conversacional, sem arquivo | `grill-me` (se auth, data model ou contrato externo), senão `implementar-issue` |

- **Product:** philosophy, north star, principles, for a new product or a change of direction.
- **Component:** a module, plugin, integration, or service, with its boundaries, interfaces, responsibilities, tech choices.
- **Feature:** a specific behavior inside an existing component.

When an idea crosses a scope, like a feature that introduces a new boundary or a component that redefines a principle, switch scope before continuing.

## Como explorar

- Mantenha-se dentro do escopo declarado; sinalize dependências adjacentes apenas quando relevante.
- Ative o `dev-mcp` antes de explorar: `set_project("/home/italo/Documentos/sfi/vistoria-backend")` + `set_mode("planning")`. Use `map_change_impact`, `semantic_search` e `get_god_nodes` para embasar o brainstorm com dados reais do código.
- Leia o repositório antes de perguntar o que o código já responde. Faça uma pergunta por vez; use múltipla escolha quando ajudar.
- Explore a direção apontada pelo usuário. Ofereça 2–3 opções só quando a decisão for genuinamente aberta, cada uma com tradeoffs e recomendação.
- Posição no roadmap e ordem de entrega pertencem ao backlog do `tracker`.
- Código-fonte intocado nesta etapa; nada de edições, scaffolding ou commits.
- **Comunicação**: Respostas diretas, sem prolixidade. Repita livremente termos técnicos (nomes de domínios, funções, schemas, modelos) sem se preocupar com sinônimos.

## Processo

1. Leia o contexto do escopo. Se doc ausente, prossiga pela descrição do usuário e sinalize o que está sendo assumido.
2. Use `dev-mcp` para mapear impacto (`map_change_impact`) e nós críticos (`get_god_nodes`) do domínio afetado.
3. Clarifique apenas o que mudaria materialmente a direção. Uma pergunta por vez.
4. Apresente o design:
   - **Componente**: Problema, Fronteiras, Interfaces, Responsabilidades, Escolhas técnicas, Riscos.
   - **Feature**: Problema, Caso de uso central, Escopo MVP, Não-objetivos, Fluxo, Riscos.
5. Obtenha aprovação e revise no ponto afetado, sem reiniciar.

## Concluído Quando

Design aprovado. Sugira a próxima skill conforme a tabela de Escopos.