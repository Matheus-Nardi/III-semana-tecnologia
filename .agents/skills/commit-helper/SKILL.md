---
name: commit-helper
description: Assists with formatting and validating git commits following the project's custom commit convention. Ensures proper types, present-tense verbs in Portuguese, lowercase, and less than 60 characters.
metadata:
  model: inherit
---

## Use this skill when

- Formatting or suggesting git commit messages for the repository.
- Validating if a planned commit message aligns with the project's commit convention.
- Preparing git commands to commit changes.

## Do not use this skill when

- The task is unrelated to version control or committing changes.
- Writing code or general project documentation that doesn't involve commit messages.

## Instructions

When suggesting or creating commit messages, you MUST strictly adhere to the project's commit convention described below.

### 1. Structure
All commit messages must follow the structure:
```
<tipo>(<escopo>): <resumo em letras minúsculas>
```

### 2. Main Types (`<tipo>`)
You must use one of the following types:
- **`feat`**: Nova funcionalidade.
- **`fix`**: Correção de bug.
- **`refactor`**: Mudança de regra de negócio ou melhoria de código (sem corrigir bug ou adicionar funcionalidade).
- **`remove`**: Remoção de funcionalidade ou código morto.
- **`test`**: Criação ou alteração de testes.
- **`docs`**: Mudanças na documentação (README, manuais, guias).

### 3. Critical Changes (Breaking Changes)
If the change breaks compatibility with the system, append `!` immediately after the type:
```
<tipo>!(<escopo>): <resumo em letras minúsculas>
```
*Example*: `remove(api)!: remove suporte ao formato XML`

### 4. Rigid Rules
- **Language**: The summary MUST be in Portuguese (Brazil).
- **Verbs**: Use verbs in the present tense (e.g., *adiciona*, *corrige*, *altera*, *remove*, *cria*, *atualiza*).
- **Length**: The entire commit message line must be short — **maximum 60 characters**.
- **Case**: The entire message (specifically the summary and scope) must be in **lowercase** only.

### 5. Common Examples
- `feat(checkout): adiciona opção de pagamento com pix` (51 chars)
- `fix(cart): corrige soma do valor total com desconto` (51 chars)
- `refactor(billing): altera vencimento do boleto para 3 dias` (57 chars)
- `remove(login): remove botão antigo do facebook` (45 chars)
- `test(user): adiciona teste unitário para validação de senha` (58 chars)
- `docs(readme): atualiza instruções de instalação do projeto` (58 chars)

## Response Approach
1. **Analyze changes**: Look at the files modified. Identify the main scope and type of the changes.
2. **Formulate message**: Create a message in lowercase, using present tense in Portuguese, and within the 60-character limit.
3. **Verify rules**:
   - Check length (<= 60 characters).
   - Check verb tense (present tense).
   - Check casing (all lowercase).
   - Check structure (no uppercase in type or scope).
