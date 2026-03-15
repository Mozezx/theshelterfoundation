#!/bin/bash

# Script para configurar ambiente .env no VPS

echo "🔧 Configurando ambiente .env para produção..."

# Verificar se está no diretório do projeto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Não está no diretório do projeto."
    echo "   Execute: cd /opt/theshelterfoundation"
    exit 1
fi

# 1. Verificar se .env existe
if [ -f ".env" ]; then
    echo "📄 Arquivo .env já existe. Fazendo backup..."
    cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
else
    echo "📄 Criando arquivo .env a partir do exemplo..."
    cp .env.example .env
fi

# 2. Conteúdo recomendado para .env de produção
echo ""
echo "📋 Conteúdo recomendado para .env (produção):"
echo "=============================================="
echo "# Stripe API Keys (produção)"
echo "VITE_STRIPE_PUBLISHABLE_KEY=pk_live_********"
echo "STRIPE_SECRET_KEY=sk_live_********"
echo ""
echo "# Server Configuration"
echo "SERVER_PORT=3001"
echo "PORT=3001"
echo "NODE_ENV=production"
echo ""
echo "# Database Configuration"
echo "DB_PASSWORD=senha_segura_para_producao"
echo "DATABASE_URL=postgresql://shelter_user:senha_segura_para_producao@db:5432/shelter_db"
echo ""
echo "# Application Settings"
echo "APP_NAME=The Shelter Foundation"
echo "APP_URL=https://theshelter.foundation"
echo "=============================================="

# 3. Instruções para editar
echo ""
echo "📝 Instruções para editar:"
echo "1. Edite o arquivo .env: nano .env"
echo "2. Substitua as chaves do Stripe pelas de produção"
echo "3. Defina uma senha segura para o banco de dados"
echo "4. Salve e saia (Ctrl+X, Y, Enter)"

# 4. Verificar Docker Compose
echo ""
echo "🐳 Verificando Docker Compose..."
if command -v docker-compose &> /dev/null; then
    echo "✅ Docker Compose está instalado"
    docker-compose --version
else
    echo "⚠️  Docker Compose não encontrado"
    echo "   Instale com: apt-get update && apt-get install -y docker-compose-plugin"
fi

echo ""
echo "✅ Próximo passo: Executar bash infra/scripts/deploy.sh"