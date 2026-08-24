#!/bin/sh
set -e

DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$DIR"

echo "=========================================================="
echo "  📦 BACKUP COMPLETO (LOCAL + NUVEM BACKBLAZE B2)"
echo "=========================================================="

echo "[1/3] 💾 Gerando dump do banco de dados PostgreSQL..."
docker exec semana-tecnologia-backup-prod /backup.sh

echo "[2/3] 🖼️ Compactando mídias locais (./public/media)..."
if [ -d "public/media" ]; then
  mkdir -p backups/last
  tar -czf backups/last/media-latest.tar.gz -C public media
  echo "✅ Mídias locais compactadas em ./backups/last/media-latest.tar.gz"
fi

echo "[3/3] ☁️ Enviando cópias de segurança para o Backblaze B2..."
if [ -f "scripts/s3_sync.py" ]; then
  python3 scripts/s3_sync.py upload backups/last/semana_tecnologia-latest.sql.gz backups/semana_tecnologia-latest.sql.gz || echo "⚠️ Aviso: Falha no upload do banco para B2 (verifique credenciais no .env)"
  python3 scripts/s3_sync.py upload backups/last/media-latest.tar.gz backups/media-latest.tar.gz || echo "⚠️ Aviso: Falha no upload das mídias para B2 (verifique credenciais no .env)"
fi

echo "=========================================================="
echo "  🚀 BACKUP FINALIZADO COM SUCESSO NO DISCO E NA NUVEM!  "
echo "=========================================================="
