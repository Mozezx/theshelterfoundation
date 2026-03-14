#!/bin/bash

# Script para instalar Docker Compose no Ubuntu

echo "🐳 Instalando Docker Compose..."

# Verificar se já está instalado
if command -v docker-compose &> /dev/null; then
    echo "✅ Docker Compose já está instalado"
    docker-compose --version
    exit 0
fi

# Instalar Docker Compose plugin (recomendado)
echo "📦 Instalando Docker Compose plugin..."
apt-get update
apt-get install -y docker-compose-plugin

# Verificar instalação
if command -v docker-compose &> /dev/null; then
    echo "✅ Docker Compose instalado com sucesso!"
    docker-compose --version
else
    echo "⚠️  Tentando método alternativo..."
    
    # Método alternativo: baixar binário
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    
    # Verificar novamente
    if command -v docker-compose &> /dev/null; then
        echo "✅ Docker Compose instalado via binário"
        docker-compose --version
    else
        echo "❌ Falha na instalação do Docker Compose"
        echo "   Tente manualmente: apt install docker-compose"
        exit 1
    fi
fi

echo ""
echo "🚀 Continuando deploy..."
echo "Executando: ./deploy.sh"