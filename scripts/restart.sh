#!/bin/bash

set -e

# Script de restart/deploy: sobe a stack de produção de forma segura.
# Por padrão faz pull da imagem (APP_IMAGE) e recria apenas o que mudou.
# Uso: ./scripts/restart.sh [--build] [--no-cache] [--prune] [--file docker-compose.prod.yml]
#
# ATENÇÃO: este script NUNCA remove volumes (não usa "down -v"), para não
# apagar o banco PostgreSQL (db-data-prod) nem os certificados.

COMPOSE_FILE="docker-compose.prod.yml"
BUILD=false
NO_CACHE=false
PRUNE_IMAGES=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --build)
      BUILD=true
      shift
      ;;
    --no-cache)
      BUILD=true
      NO_CACHE=true
      shift
      ;;
    --prune)
      PRUNE_IMAGES=true
      shift
      ;;
    --file)
      COMPOSE_FILE="$2"
      shift 2
      ;;
    *)
      echo "Uso: $0 [--build] [--no-cache] [--prune] [--file docker-compose.prod.yml]"
      exit 1
      ;;
  esac
done

# Detecta Docker Compose v2 (plugin) com fallback para o binário legado
if docker compose version > /dev/null 2>&1; then
  DC="docker compose"
elif command -v docker-compose > /dev/null 2>&1; then
  DC="docker-compose"
else
  echo "❌ Docker Compose não encontrado (instale o plugin v2)."
  exit 1
fi

if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker não está rodando."
  exit 1
fi

if [ "$PRUNE_IMAGES" = true ]; then
  echo "🧹 Limpando imagens não utilizadas..."
  docker image prune -f || true
fi

if [ "$BUILD" = true ]; then
  if [ "$NO_CACHE" = true ]; then
    echo "🏗️  Construindo imagens sem cache..."
    $DC -f "$COMPOSE_FILE" build --no-cache
  else
    echo "🏗️  Construindo imagens..."
    $DC -f "$COMPOSE_FILE" build
  fi
else
  echo "⬇️  Baixando imagem da aplicação (${APP_IMAGE:-semana-tecnologia-prod:latest})..."
  $DC -f "$COMPOSE_FILE" pull nextjs
  $DC -f "$COMPOSE_FILE" pull db nginx certbot backup || true
fi

echo "🚀 Subindo containers..."
# --force-recreate: garante que binds criados a partir de stubs antigos
# (diretório vazio no lugar de arquivo) não persistam entre deploys
$DC -f "$COMPOSE_FILE" up -d --remove-orphans --force-recreate

echo "⏳ Aguardando inicialização..."
sleep 20

echo "📊 Status dos containers:"
$DC -f "$COMPOSE_FILE" ps

echo "✅ Restart concluído."
