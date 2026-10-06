# Guia de Deploy em Produção — Plataforma Semana de Tecnologia (UNITINS)

Este documento descreve o procedimento operacional padrão (POP) para implantação, atualização e manutenção da plataforma oficial da **Semana de Ciência, Tecnologia e Inovação da UNITINS** em ambiente de produção.

---

## 1. Visão Geral da Arquitetura de Produção

A infraestrutura é executada em containers Docker orquestrados via Docker Compose, com proxy reverso Nginx e terminação SSL automática via Let's Encrypt (Certbot).

```
                      Internet (Portas 80 / 443)
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │      Nginx Proxy      │
                     │  (Rate Limit / SSL)   │
                     └───────────┬───────────┘
                                 │
         ┌───────────────────────┴───────────────────────┐
         │ (unitinscti.com.br)                           │ (admin.unitinscti.com.br)
         ▼                                               ▼
┌─────────────────────────┐                     ┌─────────────────────────┐
│     Next.js Portal      │                     │     Payload CMS Admin   │
│  (Landing, Agenda, etc) │                     │   (/admin, /api/users)  │
└────────────┬────────────┘                     └────────────┬────────────┘
             │                                               │
             └───────────────────────┬───────────────────────┘
                                     │
                                     ▼
                        ┌─────────────────────────┐
                        │   PostgreSQL 16 Alpine  │
                        │    (Banco de Dados)     │
                        └─────────────────────────┘
```

### Novos Requisitos e Controles de Segurança Implementados
1. **Next.js 15.5+**: Otimizador de imagens (`/_next/image`) protegido contra vulnerabilidades críticas de RCE (GHSA-2xp9-vwfh-vxw4 e GHSA-p293-qw3h-jr36).
2. **PAYLOAD_SECRET Obrigatório**: O sistema valida no startup em produção (`NODE_ENV=production`) que `PAYLOAD_SECRET` possui no mínimo 32 caracteres aleatórios e recusa strings fallback estáticas.
3. **ADMIN_INITIAL_PASSWORD Obrigatório**: O auto-seed não permite mais senhas padrão fracas em produção; exige senha com no mínimo 12 caracteres.
4. **Proteção Anti-Clickjacking**: Cabeçalhos `X-Frame-Options: SAMEORIGIN` e `frame-ancestors 'self'` ativos no Nginx e Next.js.
5. **Cookies de Sessão Seguros**: `COOKIE_SECURE=true` ativado por padrão em `docker-compose.prod.yml` e `src/collections/Users.ts`.
6. **Isolamento de APIs no Nginx**: No domínio principal (`unitinscti.com.br`), apenas a rota pública de scraping `/api/news` é exposta; todas as demais APIs do CMS (`/api/users`, `/api/graphql`, etc.) são restritas com 404 no portal público e acessíveis exclusivamente via `admin.unitinscti.com.br`.

---

## 2. Pré-requisitos do Servidor

- **Sistema Operacional**: Linux (Ubuntu 22.04 LTS ou superior recomendado)
- **Docker Engine**: Versão 24.0+ e **Docker Compose** v2.20+
- **Portas Liberadas no Firewall**:
  - `80/TCP` (HTTP para renovação ACME Certbot e redirect)
  - `443/TCP` (HTTPS para acesso dos usuários e painel)
  - `22/TCP` (SSH restrito aos operadores)
  - *Atenção:* A porta `5432` do PostgreSQL **NÃO** deve ser exposta publicamente na internet.
- **Registros DNS (Tipo A)** apontando para o IP do servidor (ex: `168.138.247.203`):
  - `unitinscti.com.br`
  - `www.unitinscti.com.br`
  - `admin.unitinscti.com.br`

---

## 3. Configuração de Variáveis de Ambiente (`.env`)

No diretório raiz do projeto no servidor, crie o arquivo `.env` baseado no `.env.example`:

```bash
cp .env.example .env
chmod 600 .env
```

### Exemplo de Configuração de Produção:

```env
# ==============================================================================
# AMBIENTE & DOMÍNIOS
# ==============================================================================
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_SERVER_URL=https://unitinscti.com.br

# Chave Secreta do Payload CMS (OBRIGATÓRIO: mínimo 32 caracteres aleatórios)
# Gere no terminal com: openssl rand -hex 32
PAYLOAD_SECRET=coloque_aqui_uma_chave_aleatoria_longa_gerada_com_openssl

# ==============================================================================
# BANCO DE DADOS POSTGRESQL
# ==============================================================================
POSTGRES_USER=app
POSTGRES_PASSWORD=gere_uma_senha_forte_e_exclusiva_para_o_postgres
POSTGRES_DB=semana_tecnologia

# ==============================================================================
# ADMINISTRADOR INICIAL (Auto-Seed)
# ==============================================================================
ADMIN_INITIAL_EMAIL=admin@unitins.br
# OBRIGATÓRIO: mínimo 12 caracteres em produção
ADMIN_INITIAL_PASSWORD=gere_uma_senha_forte_para_o_administrador_aqui

# ==============================================================================
# COOKIES & SEGURANÇA
# ==============================================================================
COOKIE_SECURE=true

# ==============================================================================
# ARMAZENAMENTO BACKBLAZE B2 / S3 (Opcional - se false, salva local em media/)
# ==============================================================================
S3_ENABLED=false
S3_BUCKET=semana-tec-midias
S3_ENDPOINT=https://s3.us-east-005.backblazeb2.com
S3_ACCESS_KEY_ID=seu-key-id
S3_SECRET_ACCESS_KEY=seu-application-key
S3_REGION=us-east-005

# ==============================================================================
# CERTIFICADO SSL / CERTBOT
# ==============================================================================
CERTBOT_EMAIL=suporte@unitins.br
```

> [!IMPORTANT]
> **Como gerar chaves fortes no terminal:**
> ```bash
> # Para PAYLOAD_SECRET (64 caracteres hexadecimais):
> openssl rand -hex 32
>
> # Para POSTGRES_PASSWORD ou ADMIN_INITIAL_PASSWORD:
> openssl rand -base64 24
> ```

---

## 4. Passo a Passo do Deploy

### 4.1. Primeiro Deploy (Instalação Inicial)

#### Passo 1: Atualizar código e checar permissões
```bash
git pull origin main
mkdir -p certbot/conf certbot/www backups nginx/ssl public/media
```

#### Passo 2: Gerar Certificado SSL Inicial com Certbot
Antes de ativar a configuração completa do Nginx com SSL, garanta que os certificados Let's Encrypt existam:

```bash
# Sobe apenas o Nginx básico para o desafio HTTP-01 ou execute o Certbot:
docker compose -f docker-compose.prod.yml run --rm certbot certonly \
  --webroot --webroot-path=/var/www/certbot \
  --email suporte@unitins.br \
  --agree-tos --no-eff-email \
  -d unitinscti.com.br -d www.unitinscti.com.br -d admin.unitinscti.com.br
```

#### Passo 3: Construir e Iniciar os Serviços de Produção
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

#### Passo 4: Acompanhar os Logs da Inicialização
```bash
docker compose -f docker-compose.prod.yml logs -f
```
Verifique nos logs se o Next.js inicializou com sucesso e se o auto-seed da edição 2025 foi executado pelo `onInit` sem erros.

---

## 4.2. Deploy Automático (GitHub Actions + GHCR) — padrão

O deploy contínuo é feito pelo workflow [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml):
o GitHub Actions builda a imagem Docker para **linux/arm64**, publica no **GitHub Container Registry (GHCR)**
e a VM apenas baixa a imagem e recria o container — ou seja, **a VM não compila mais o projeto**.

```
 push na main ──▶ GitHub Actions (build linux/arm64) ──▶ ghcr.io/<owner>/<repo>:main
                                                                   │
                                                                   ▼
                         SSH na VM ──▶ ./scripts/restart.sh (pull + up -d)
```

### 4.2.1. Pré-requisitos na VM

- Docker Engine 24+ **com o plugin `docker compose` v2** (`docker compose version` deve funcionar).
- Arquivo `.env` já criado na raiz do projeto (ver seção 3) — ele **não** é enviado pelo CI.
- Certificados SSL já emitidos uma vez (ver seção 4.1, Passo 2) — o CI não faz o bootstrap do Certbot.
- Acesso de leitura ao GHCR (token ou pacote público), conforme 4.3.3.

### 4.2.2. Secrets necessários no repositório

Configure em **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Descrição |
|:-------|:----------|
| `SSH_HOST` | IP ou host da VM (ex.: `168.138.247.203`) |
| `SSH_USER` | Usuário SSH (ex.: `ubuntu` ou `opc`) |
| `SSH_PRIVATE_KEY` | Chave privada SSH (conteúdo do `.pem`/`.key`) usada para autenticar |
| `DEPLOY_PATH` | Diretório na VM onde ficam o `.env`, `docker-compose.prod.yml`, `nginx/` e `scripts/` |
| `GHCR_USERNAME` | Usuário do GitHub com permissão de leitura no pacote GHCR |
| `GHCR_TOKEN` | Personal Access Token (classic) com escopo `read:packages` |

> O `GITHUB_TOKEN` do Actions é usado apenas para **publicar** a imagem (permissão `packages: write`).
> Para **baixar** na VM é necessário `GHCR_USERNAME`/`GHCR_TOKEN`.
>
> **Alternativa mais simples:** torne o pacote público em
> `github.com/<owner>?tab=packages` → pacote da imagem → *Package settings* → *Change visibility* → **Public**.
> Nesse caso basta remover o passo de `docker login` do workflow e os secrets `GHCR_*`.

### 4.2.3. Disparo e comportamento

- Dispara automaticamente em **push para `main` e `unstable`** e manualmente via **workflow_dispatch**.
- Tag publicada: `ghcr.io/<owner>/<repo>:<branch>` (ex.: `:main`, `:unstable`) e `:sha-<hash>` para rollback.
- O script `scripts/restart.sh` faz `docker compose pull nextjs` + `up -d` — **sem `down -v`**,
  preservando o banco (`db-data-prod`), os uploads (`media-data-prod`) e os certificados.
- As **migrações do Payload** (`prodMigrations` em `src/payload.config.ts`) rodam automaticamente
  no start do container em produção — não há passo manual de migração no CI.
- Ao final, o workflow valida a saúde do container (`curl` interno) e imprime os logs em caso de falha.

### 4.2.4. Rollback pelo CI

```bash
# Na VM, fixe a tag do build anterior (sha curto)
cd <DEPLOY_PATH>
APP_IMAGE=ghcr.io/<owner>/<repo>:sha-<hash-anterior> docker compose -f docker-compose.prod.yml up -d nextjs
```

---

## 4.3. Migrations do Payload (evitar schema drift)

Em produção o schema **só** é alterado por migrations (`prodMigrations`). Em desenvolvimento o Payload faz `push` automático, então é fácil adicionar um campo numa collection e esquecer de gerar a migration — foi o que causou os erros `column ... does not exist`.

**Regra:** sempre que alterar collections/fields/plugins, gere a migration:

1. Actions → **Generate Migration** → *Run workflow* (na branch desejada). Ele sobe um Postgres limpo, aplica as migrations existentes, roda `payload migrate:create` e **commita** a migration gerada (+ `src/migrations/index.ts`).
2. O commit dispara o deploy; o container aplica a migration no startup.

O workflow **Schema Drift Check** roda em push/PR e **falha** se houver divergência entre as collections e as migrations — servindo de trava para o problema não voltar.

Alternativa local (com um Postgres de dev):
```bash
npm run migrate        # aplica as migrations existentes
npm run migrate:create # gera a migration a partir do drift
```

---

## 4.4. Deploy Manual (alternativa)

Para implantar manualmente em um servidor (útil para testes ou sem acesso ao GHCR):

```bash
# 1. Puxar alterações do repositório
git pull origin main

# 2. Build local + subir (sem apagar o banco, sem SSL bootstrap)
./scripts/restart.sh --build

# 3. Verificar o status dos containers
docker compose -f docker-compose.prod.yml ps
```

---

## 5. Rotinas Operacionais e Verificação Pós-Deploy

### 5.1. Checklist de Validação Pós-Deploy

Execute os testes rápidos abaixo para validar o funcionamento correto dos novos controles:

- [ ] **Portal Público**: Acesse `https://unitinscti.com.br` — a página inicial e a programação devem carregar normalmente.
- [ ] **Painel Administrativo**: Acesse `https://admin.unitinscti.com.br` — o redirecionamento para `/admin` deve ocorrer e a tela de login do Payload CMS deve ser exibida.
- [ ] **Bloqueio de `/admin` no Domínio Público**: Tente acessar `https://unitinscti.com.br/admin` — deve retornar erro 404.
- [ ] **Bloqueio de APIs Administrativas no Domínio Público**: Tente acessar `https://unitinscti.com.br/api/users` — deve retornar 404.
- [ ] **API Pública de Notícias**: Acesse `https://unitinscti.com.br/api/news` — deve responder com o JSON das últimas notícias da UNITINS.
- [ ] **Cabeçalhos de Segurança**:
  ```bash
  curl -I https://unitinscti.com.br
  ```
  Confirme a presença de:
  - `X-Frame-Options: SAMEORIGIN`
  - `X-Content-Type-Options: nosniff`
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains`

### 5.2. Rotina de Backup do Banco de Dados

O serviço de backup automático roda diariamente à meia-noite via container `backup` (`prodrigestivill/postgres-backup-local`).

Para forçar um backup manual a qualquer momento:
```bash
./scripts/backup.sh
```
Os arquivos gerados são salvos em `./backups/`.

### 5.3. Restauração de Backup

Caso seja necessário restaurar o banco de dados a partir do último backup local:
```bash
./scripts/restore.sh
```

---

## 6. Procedimento de Rollback

Em caso de inconsistência crítica durante a atualização:

```bash
# 1. Retornar ao commit estável anterior
git checkout <hash-do-commit-anterior>

# 2. Reconstruir a imagem da aplicação
docker compose -f docker-compose.prod.yml up -d --build nextjs

# 3. Validar restauração
docker compose -f docker-compose.prod.yml logs --tail=50 nextjs
```
