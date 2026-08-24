#!/bin/sh
set -e

DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$DIR"

echo "=========================================================="
echo "  🔄 RESTAURAÇÃO COMPLETA (BANCO + MÍDIAS DO B2/LOCAL)"
echo "=========================================================="

BACKUP_DB="backups/last/semana_tecnologia-latest.sql.gz"
BACKUP_MEDIA="backups/last/media-latest.tar.gz"

# Se os arquivos locais não existirem ou se solicitado via flag --cloud, baixa do Backblaze B2
if [ "$1" = "--cloud" ] || [ ! -f "$BACKUP_DB" ] || [ ! -f "$BACKUP_MEDIA" ]; then
  echo "[1/3] ☁️ Baixando backups mais recentes da nuvem (Backblaze B2)..."
  mkdir -p backups/last
  python3 scripts/s3_sync.py download backups/semana_tecnologia-latest.sql.gz "$BACKUP_DB" || echo "⚠️ Aviso: Não foi possível baixar dump do B2"
  python3 scripts/s3_sync.py download backups/media-latest.tar.gz "$BACKUP_MEDIA" || echo "⚠️ Aviso: Não foi possível baixar mídias do B2"
else
  echo "[1/3] 📂 Utilizando arquivos de backup locais já presentes..."
fi

PGPASSWORD="${POSTGRES_PASSWORD:-sua-senha-do-banco}"
PGUSER="${POSTGRES_USER:-app}"
PGDB="${POSTGRES_DB:-semana_tecnologia}"

echo "[2/3] 💾 Restaurando banco de dados PostgreSQL..."
docker exec -e PGPASSWORD="$PGPASSWORD" semana-tecnologia-backup-prod sh -c "psql -h db -U $PGUSER -d $PGDB -c 'DROP SCHEMA public CASCADE; CREATE SCHEMA public;' && gunzip -c /backups/last/semana_tecnologia-latest.sql.gz | psql -h db -U $PGUSER -d $PGDB"

echo "[3/3] 🖼️ Extraindo mídias para a pasta local (./public/media)..."
if [ -f "$BACKUP_MEDIA" ]; then
  mkdir -p public
  tar -xzf "$BACKUP_MEDIA" -C public
  echo "✅ Mídias locais extraídas com sucesso em ./public/media"
fi

echo "=========================================================="
echo "  🎉 RESTAURAÇÃO CONCLUÍDA COM SUCESSO! SITE 100% PRONTO  "
echo "=========================================================="
