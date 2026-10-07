# Notificação HTTP integrada ao Telegram (plugin oficial do CrowdSec)
# Os placeholders __BOT_TOKEN__ e __CHAT_ID__ são substituídos no boot
# pelo entrypoint (variáveis TELEGRAM_BOT_TOKEN e TELEGRAM_CHAT_ID do .env)
name: http_default
enabled: true
type: http
format: |
  {
    "chat_id": "__CHAT_ID__",
    "text": "🛡️ CrowdSec — unitinscti.com.br\n\n{{range . -}}\n{{$alert := . -}}\n{{range .Decisions -}}\n⛔ {{.Value}} → {{.Type}} por {{.Duration}} ({{.Scenario}})\n{{end -}}\n{{end -}}",
    "disable_web_page_preview": true
  }
url: https://api.telegram.org/bot__BOT_TOKEN__/sendMessage
method: POST
headers:
  Content-Type: "application/json"
