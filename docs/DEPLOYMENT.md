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

### 4.2. Deploy de Atualização (Deploy Contínuo)

Para implantar novas versões ou correções de segurança em um servidor já em operação:

```bash
# 1. Puxar alterações do repositório
git pull origin main

# 2. Reconstruir a imagem e atualizar os containers sem downtime do banco
docker compose -f docker-compose.prod.yml up -d --build nextjs nginx

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
