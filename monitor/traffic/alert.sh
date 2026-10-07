#!/bin/sh
# Alerta de pico de trafego -> Telegram (alternativa leve ao Grafana)
# Le o access log do Nginx e avisa quando os limiares da janela sao excedidos.
LOG=/var/log/nginx/access_nginx.log
[ -f "$LOG" ] || exit 0

WINDOW_MIN=${WINDOW_MIN:-5}
THRESH_RPM=${THRESH_RPM:-200}
THRESH_5XX=${THRESH_5XX:-30}
THRESH_IPS=${THRESH_IPS:-300}
COOLDOWN_MIN=${COOLDOWN_MIN:-30}
STATE=/state/last_alert

NOW=$(date -u +%s)
CUTOFF=$(( NOW - WINDOW_MIN * 60 ))

STATS=$(gawk -v cutoff="$CUTOFF" '
BEGIN {
  split("Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec", mon, " ");
  for (i = 1; i <= 12; i++) M[mon[i]] = i;
}
{
  n = split($0, a, "\"");
  if (n < 3) next;
  t = a[1];
  p = index(t, "[");
  if (p == 0) next;
  ts = substr(t, p + 1);
  q = index(ts, "]");
  ts = substr(ts, 1, q - 1);
  split(ts, d, "[/: ]");
  epoch = mktime(d[3] " " M[d[2]] " " d[1] " " d[4] " " d[5] " " d[6]);
  if (epoch < cutoff) next;
  total++;
  split(a[3], s, " ");
  if (s[2] + 0 >= 500) s5xx++;
  split(a[1], ipa, " ");
  ip = ipa[1];
  cnt[ip]++;
  seen[ip] = 1;
}
END {
  u = 0; for (i in seen) u++;
  top = "-"; topn = 0;
  for (i in cnt) if (cnt[i] > topn) { topn = cnt[i]; top = i; }
  printf "%d %d %d %s(%d)", total + 0, s5xx + 0, u + 0, top, topn + 0;
}
' "$LOG")

TOTAL=$(echo "$STATS" | cut -d' ' -f1)
S5XX=$(echo "$STATS" | cut -d' ' -f2)
UNIQ=$(echo "$STATS" | cut -d' ' -f3)
TOP=$(echo "$STATS" | cut -d' ' -f4)
RPM=$(( TOTAL / WINDOW_MIN ))

BREACH=""
[ "${RPM:-0}" -gt "$THRESH_RPM" ] && BREACH="req/min (${RPM}>${THRESH_RPM})"
[ "${S5XX:-0}" -gt "$THRESH_5XX" ] && BREACH="${BREACH:+$BREACH, }erros 5xx (${S5XX}>${THRESH_5XX})"
[ "${UNIQ:-0}" -gt "$THRESH_IPS" ] && BREACH="${BREACH:+$BREACH, }IPs distintos (${UNIQ}>${THRESH_IPS})"

[ -z "$BREACH" ] && exit 0

if [ -f "$STATE" ]; then
  LAST=$(cat "$STATE" 2>/dev/null || echo 0)
  [ $(( NOW - LAST )) -lt $(( COOLDOWN_MIN * 60 )) ] && exit 0
fi
echo "$NOW" > "$STATE"

TEXT="Pico de trafego - unitinscti.com.br\nJanela: ultimos ${WINDOW_MIN} min\nTotal: ${TOTAL} req (${RPM}/min)\nErros 5xx: ${S5XX}\nIPs distintos: ${UNIQ}\nTop IP: ${TOP}\nGatilhos: ${BREACH}"

curl -s -o /dev/null -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  -H "Content-Type: application/json" \
  --data-binary "$(printf '{"chat_id":"%s","text":"%s"}' "$TELEGRAM_CHAT_ID" "$TEXT")"
