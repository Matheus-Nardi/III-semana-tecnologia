#!/bin/bash

# Script de Deploy Completo para Produção
# Uso: ./deploy.sh [--ssl] [--email seu-email@exemplo.com]

set -e

# Configurações padrão
DOMAIN="unitinscti.com.br"
EMAIL="admin@unitinscti.com.br"
SETUP_SSL=false

# Parse dos argumentos
while [[ $# -gt 0 ]]; do
    case $1 in
        --ssl)
            SETUP_SSL=true
            shift
            ;;
        --email)
            EMAIL="$2"
            shift 2
            ;;
        *)
            echo "Uso: $0 [--ssl] [--email seu-email@exemplo.com]"
            exit 1
            ;;
    esac
done

echo "🚀 Iniciando deploy da aplicação..."
echo "📧 Email: $EMAIL"
echo "🌐 Domínio: $DOMAIN"
echo "🔐 SSL: $SETUP_SSL"

# Verifica se o Docker está instalado e rodando
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Instale o Docker primeiro."
    exit 1
fi

if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Inicie o Docker e tente novamente."
    exit 1
fi

# Para containers existentes
echo "🛑 Parando containers existentes..."
docker-compose down 2>/dev/null || true
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

# Remove imagens antigas para forçar rebuild
echo "🧹 Limpando imagens antigas..."
docker image prune -f

# Build da aplicação
echo "🔨 Fazendo build da aplicação..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Cria arquivo .env.production se não existir
if [ ! -f .env.production ]; then
    echo "📝 Criando arquivo .env.production..."
    cp .env.production.example .env.production
    echo "⚠️  Lembre-se de configurar as variáveis em .env.production"
fi

if [ "$SETUP_SSL" = true ]; then
    # Emissão inicial; a renovação é feita pelo serviço certbot do compose
    bash "$(dirname "$0")/setup-ssl.sh" "$EMAIL"
fi

echo "🚀 Iniciando aplicação..."
docker compose -f docker-compose.prod.yml up -d

# Aguarda a aplicação inicializar
echo "⏳ Aguardando aplicação inicializar..."
sleep 30

# Verifica se a aplicação está rodando
if docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    echo "✅ Deploy concluído com sucesso!"
    echo ""
    echo "🌐 Aplicação disponível em:"
    if [ "$SETUP_SSL" = true ]; then
        echo "   - https://$DOMAIN"
        echo "   - https://www.$DOMAIN"
    else
        echo "   - http://$DOMAIN"
        echo "   - http://www.$DOMAIN"
    fi
    echo ""
    echo "📊 Status dos containers:"
    docker-compose -f docker-compose.prod.yml ps
    echo ""
    echo "📝 Para ver os logs:"
    echo "   docker-compose -f docker-compose.prod.yml logs -f"
    echo ""
    echo "🔄 Para reiniciar:"
    echo "   docker-compose -f docker-compose.prod.yml restart"
else
    echo "❌ Erro no deploy. Verificando logs..."
    docker-compose -f docker-compose.prod.yml logs
    exit 1
fi