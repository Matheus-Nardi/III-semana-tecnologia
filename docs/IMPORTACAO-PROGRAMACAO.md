# Atualização da Programação (planilha → site)

A **planilha oficial é a fonte da verdade**. O site é atualizado a partir dela pelo script
`src/scripts/import-schedule.ts`; edições feitas direto no admin são sobrescritas na próxima importação.

## Regras da importação

- Título, horário, local e palestrante vêm **sempre** da planilha.
- Palestrante **vazio** na planilha não apaga um palestrante já cadastrado no site (aparece no relatório como "preservado").
- São preservados do banco: ids das linhas, cor dos eixos, vagas, link do Meet e vínculo com palestrante.
- Atividades que existem só no site são **removidas** (listadas no relatório antes de gravar).
- A linha "13 a 16/10" (Exposição do Museu) é ignorada: o banner é fixo no componente `Schedule.tsx`.
- Sem `--apply` nada é gravado. Com `--apply`, a grade atual é salva em `backups/schedule/` (na VM) antes da gravação.

## Passo a passo

1. Exporte a planilha do Google Sheets como CSV e salve **sempre** em `src/data/raw/2026/programacao-2026.csv`.
2. Commit + push em `unstable`/`main`. O workflow **Deploy to Oracle VM** publica a aplicação e a imagem
   `-tools` (código + planilha deste commit) e a deixa pronta na VM. **Nada é importado automaticamente.**
3. Com o deploy concluído, na VM:
   ```bash
   cd <DEPLOY_PATH>
   docker compose -f docker-compose.prod.yml run --rm tools npm run import:schedule:2026              # simula
   ```
   Revise o relatório (alteradas, novas, removidas, preservados).
4. Se estiver correto, grave:
   ```bash
   docker compose -f docker-compose.prod.yml run --rm tools npm run import:schedule:2026 -- --apply   # grava
   ```
5. Confira em https://unitinscti.com.br/2026#programacao (a página não tem cache; reflete o banco na hora).

A imagem `tools` sempre corresponde ao último deploy: para importar uma planilha nova, ela precisa ter sido
commitada e deployada antes.

## Simulação local contra um snapshot

```bash
npx tsx src/scripts/import-schedule.ts --year 2026 --current caminho/para/snapshot.json
```

O snapshot pode ser o backup gerado em `backups/schedule/edicao-*.json`.

## Rollback

O arquivo `backups/schedule/edicao-<ano>-<data>.json` (na VM) contém a grade anterior a cada `--apply`.
Para um restauro completo do banco, use os dumps diários do serviço `backup` (`./backups`).
