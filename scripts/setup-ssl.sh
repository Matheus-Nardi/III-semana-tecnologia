#!/bin/bash

# Emissão inicial do certificado SSL (Let's Encrypt), só necessária em um servidor novo.
# A renovação é automática: serviço "certbot" do docker-compose.prod.yml.
# Pré-requisitos: DNS apontando para este servidor e porta 80 liberada.
# Uso: bash scripts/setup-ssl.sh [email]

set -e

EMAIL=${1:-"suporte@unitins.br"}
DOMAIN="unitinscti.com.br"
COMPOSE="docker compose -f docker-compose.prod.yml"

if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Inicie o Docker e tente novamente."
    exit 1
fi

mkdir -p ./certbot/conf ./certbot/www

# O modo standalone precisa da porta 80 livre
$COMPOSE stop nginx 2>/dev/null || true

echo "🔐 Obtendo certificados SSL para $DOMAIN..."
if ! $COMPOSE run --rm -p 80:80 --entrypoint certbot certbot certonly \
    --standalone \
    --non-interactive \
    --agree-tos \
    --no-eff-email \
    --keep-until-expiring \
    --email "$EMAIL" \
    --cert-name "$DOMAIN" \
    -d "$DOMAIN" \
    -d "www.$DOMAIN" \
    -d "admin.$DOMAIN"; then
    echo "❌ Erro ao obter certificados SSL"
    echo "🔍 Verifique se:"
    echo "   - Os domínios apontam para este servidor"
    echo "   - A porta 80 está aberta e livre"
    echo "   - O DNS está propagado corretamente"
    exit 1
fi

echo "✅ Certificados prontos. Suba a stack com: $COMPOSE up -d"
