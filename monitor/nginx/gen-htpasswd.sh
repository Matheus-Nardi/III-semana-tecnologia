#!/bin/sh
# Gera /auth/htpasswd para o Basic Auth do Nginx (/stats e /logs).
# - Se STATS_PASSWORD estiver definido: gera o hash apr1 a partir da senha.
# - Senão, aceita STATS_HASH já pronto (apr1/bcrypt/md5).
# - Se nenhum dos dois: usa senha aleatória (mantém o site no ar; painéis dão 401).
set -e

USER="${STATS_USER:-stats}"
PASS="${STATS_PASSWORD:-}"
HASH="${STATS_HASH:-}"

mkdir -p /auth

if [ -z "$PASS" ]; then
  case "$HASH" in
    \$apr1\$*|\$1\$*|\$2a\$*|\$2b\$*|\$2y\$*)
      printf '%s:%s\n' "$USER" "$HASH" > /auth/htpasswd
      echo "htpasswd: usando STATS_HASH informado"
      exit 0
      ;;
    "")
      echo "AVISO: STATS_PASSWORD/STATS_HASH nao definidos; gerando senha aleatoria"
      PASS="$(head -c 18 /dev/urandom | base64 | tr -d '\n')"
      ;;
    *)
      # conveniencia: texto puro passado por engano em STATS_HASH
      PASS="$HASH"
      ;;
  esac
fi

htpasswd -nb -m "$USER" "$PASS" > /auth/htpasswd
echo "htpasswd: gerado para usuario '${USER}' (apr1)"
