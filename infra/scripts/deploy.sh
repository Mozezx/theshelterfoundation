#!/bin/bash

# Script de deploy para The Shelter Foundation no VPS
# Este script assume que o projeto já está clonado no VPS
# Usa 'docker compose' (com espaço) que é a versão moderna

set -e  # Sai em caso de erro

echo "🚀 Iniciando deploy do The Shelter Foundation..."

# 1. Atualizar código do repositório
echo "📥 Atualizando código do Git..."
git pull origin main

# 2. Verificar se o arquivo .env existe
if [ ! -f .env ]; then
    echo "⚠️  Arquivo .env não encontrado. Criando a partir do exemplo..."
    cp .env.example .env
    echo "⚠️  ATENÇÃO: Edite o arquivo .env com as configurações de produção!"
    exit 1
fi

# 3. Parar containers existentes (se houver)
echo "🛑 Parando containers existentes..."
docker compose -f infra/docker/docker-compose.yml down || true

# 4. Construir e iniciar containers
echo "🔨 Construindo e iniciando containers..."
docker compose -f infra/docker/docker-compose.yml up -d --build

# 5. Verificar status dos containers
echo "📊 Verificando status dos containers..."
docker compose -f infra/docker/docker-compose.yml ps

# 6. Verificar logs do aplicativo
echo "📝 Exibindo logs do aplicativo (últimas 10 linhas)..."
docker compose -f infra/docker/docker-compose.yml logs --tail=10 web

# 7. Verificar se a aplicação está respondendo
echo "🔍 Testando se a aplicação está respondendo..."
sleep 5  # Aguardar aplicação iniciar
if curl -s -f http://localhost:4100 > /dev/null; then
    echo "✅ Aplicação está respondendo na porta 4100!"
else
    echo "❌ Aplicação não está respondendo. Verifique os logs."
    docker compose -f infra/docker/docker-compose.yml logs web
    exit 1
fi

# 8. Verificar banco de dados
echo "🗄️  Verificando status do banco de dados..."
if docker compose -f infra/docker/docker-compose.yml exec db pg_isready -U shelter_user -d shelter_db; then
    echo "✅ Banco de dados PostgreSQL está funcionando!"
else
    echo "⚠️  Banco de dados pode não estar funcionando corretamente."
fi

echo ""
echo "🎉 Deploy concluído com sucesso!"
echo ""
echo "📋 Informações importantes:"
echo "   - Aplicação disponível em: http://localhost:4100"
echo "   - Banco de dados: PostgreSQL na rede Docker interna"
echo "   - Porta exposta apenas no localhost: 4100"
echo ""
echo "🔧 Comandos úteis:"
echo "   - Ver logs: docker compose -f infra/docker/docker-compose.yml logs -f web"
echo "   - Parar aplicação: docker compose -f infra/docker/docker-compose.yml down"
echo "   - Reiniciar: docker compose -f infra/docker/docker-compose.yml restart"
echo "   - Acessar banco: docker compose -f infra/docker/docker-compose.yml exec db psql -U shelter_user -d shelter_db"
echo ""
echo "⚠️  Lembre-se de configurar o Nginx como reverse proxy para a porta 4100"
echo "   conforme descrito em docs/deploy/README.md"