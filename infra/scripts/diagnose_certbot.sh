#!/bin/bash

echo "🔍 Diagnóstico do problema do Certbot"

# 1. Verificar resolução DNS
echo "1. Verificando DNS..."
echo "   Domínio: theshelter.foundation"
nslookup theshelter.foundation 2>/dev/null || echo "   nslookup não disponível"
dig +short theshelter.foundation 2>/dev/null || echo "   dig não disponível"

# 2. Verificar se o IP está correto
echo "2. IP do servidor: 85.31.239.235"

# 3. Verificar se Nginx está ouvindo na porta 80
echo "3. Verificando Nginx..."
if systemctl is-active --quiet nginx; then
    echo "   ✅ Nginx está ativo"
else
    echo "   ❌ Nginx não está ativo"
fi

# 4. Verificar configuração do site
echo "4. Verificando configuração do site..."
if [ -f /etc/nginx/sites-available/theshelter.foundation ]; then
    echo "   ✅ Arquivo de configuração existe"
    # Verificar se tem bloco para .well-known
    if grep -q "\.well-known" /etc/nginx/sites-available/theshelter.foundation; then
        echo "   ✅ Configuração .well-known encontrada"
    else
        echo "   ⚠️  Configuração .well-known não encontrada"
    fi
else
    echo "   ❌ Arquivo de configuração não existe"
fi

# 5. Testar acesso local
echo "5. Testando acesso local..."
curl -s -o /dev/null -w "%{http_code}" -H "Host: theshelter.foundation" http://localhost
echo " (código HTTP)"

# 6. Verificar logs do Nginx
echo "6. Últimas linhas do log de erro do Nginx:"
tail -5 /var/log/nginx/theshelter.error.log 2>/dev/null || echo "   Log não encontrado"

echo ""
echo "📋 Possíveis soluções:"
echo "   A. Aguardar propagação DNS (pode levar horas)"
echo "   B. Verificar configurações DNS na GoDaddy"
echo "   C. Configurar manualmente o bloco .well-known no Nginx"
echo "   D. Usar Certbot em modo manual:"
echo "      sudo certbot certonly --manual -d theshelter.foundation -d www.theshelter.foundation"
echo ""
echo "🔗 Verificar propagação DNS: https://www.whatsmydns.net/#A/theshelter.foundation"