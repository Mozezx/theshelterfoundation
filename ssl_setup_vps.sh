#!/bin/bash

echo "🔐 Configuração de SSL para The Shelter Foundation"
echo "=================================================="

# Verificar se está rodando como root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Execute com sudo: sudo bash ssl_setup_vps.sh"
    exit 1
fi

echo ""
echo "📋 Passo 1: Verificar configuração atual"
echo "---------------------------------------"

# Verificar se o diretório para o Certbot existe
if [ ! -d "/var/www/certbot" ]; then
    echo "Criando diretório /var/www/certbot..."
    mkdir -p /var/www/certbot
    chown -R www-data:www-data /var/www/certbot
    echo "✅ Diretório criado"
else
    echo "✅ Diretório /var/www/certbot já existe"
fi

# Verificar configuração do Nginx
echo ""
echo "📋 Passo 2: Verificar configuração do Nginx"
echo "-----------------------------------------"

CONFIG_FILE="/etc/nginx/sites-available/theshelter.foundation"
if [ -f "$CONFIG_FILE" ]; then
    echo "✅ Arquivo de configuração encontrado: $CONFIG_FILE"
    
    # Verificar se tem bloco .well-known
    if grep -q "\.well-known/acme-challenge" "$CONFIG_FILE"; then
        echo "✅ Configuração .well-found já existe"
    else
        echo "⚠️  Adicionando bloco .well-known à configuração..."
        
        # Criar backup
        cp "$CONFIG_FILE" "$CONFIG_FILE.backup.$(date +%Y%m%d_%H%M%S)"
        
        # Adicionar bloco após server_name
        sed -i '/server_name theshelter.foundation www.theshelter.foundation;/a\
    # Bloco para validação do Certbot (ACME Challenge)\
    location /.well-known/acme-challenge/ {\
        root /var/www/certbot;\
        try_files $uri =404;\
    }' "$CONFIG_FILE"
        
        echo "✅ Configuração atualizada"
    fi
    
    # Testar configuração
    echo "Testando configuração do Nginx..."
    nginx -t
    if [ $? -eq 0 ]; then
        echo "✅ Configuração do Nginx é válida"
        echo "Reiniciando Nginx..."
        systemctl reload nginx
        echo "✅ Nginx reiniciado"
    else
        echo "❌ Erro na configuração do Nginx"
        exit 1
    fi
else
    echo "❌ Arquivo de configuração não encontrado: $CONFIG_FILE"
    exit 1
fi

echo ""
echo "📋 Passo 3: Instalar Certbot (se necessário)"
echo "------------------------------------------"

if ! command -v certbot &> /dev/null; then
    echo "Instalando Certbot..."
    apt update
    apt install -y certbot python3-certbot-nginx
    echo "✅ Certbot instalado"
else
    echo "✅ Certbot já está instalado"
fi

echo ""
echo "📋 Passo 4: OPÇÕES para obter certificado SSL"
echo "-------------------------------------------"
echo ""
echo "OPÇÃO A: Desativar Cloudflare Proxy temporariamente (RECOMENDADO)"
echo "-----------------------------------------------------------------"
echo "1. Acesse https://dash.cloudflare.com"
echo "2. Vá para a zona do domínio theshelter.foundation"
echo "3. Encontre o registro A para theshelter.foundation"
echo "4. Clique no ícone de nuvem laranja para desativar (ficará cinza)"
echo "5. Aguarde 5-10 minutos para propagação DNS"
echo "6. Execute: sudo certbot --nginx -d theshelter.foundation -d www.theshelter.foundation"
echo "7. Após sucesso, reative o proxy do Cloudflare"
echo ""
echo "OPÇÃO B: Validação DNS manual"
echo "----------------------------"
echo "Execute:"
echo "sudo certbot certonly --manual --preferred-challenges dns \\"
echo "  -d theshelter.foundation -d www.theshelter.foundation"
echo ""
echo "OPÇÃO C: Tentar validação HTTP direta (pode falhar com Cloudflare)"
echo "-----------------------------------------------------------------"
echo "sudo certbot --nginx -d theshelter.foundation -d www.theshelter.foundation"
echo ""

read -p "Escolha uma opção (A/B/C): " option

case $option in
    A|a)
        echo ""
        echo "📋 Instruções para Opção A:"
        echo "1. Desative o proxy do Cloudflare conforme instruído acima"
        echo "2. Aguarde propagação DNS (verifique com: dig +short theshelter.foundation)"
        echo "3. Quando mostrar apenas 85.31.239.235, execute:"
        echo "   sudo certbot --nginx -d theshelter.foundation -d www.theshelter.foundation"
        echo "4. Siga as instruções interativas do Certbot"
        echo "5. Após sucesso, reative o proxy do Cloudflare"
        ;;
    B|b)
        echo ""
        echo "📋 Instruções para Opção B:"
        echo "Execute o comando abaixo e siga as instruções:"
        echo "sudo certbot certonly --manual --preferred-challenges dns \\"
        echo "  -d theshelter.foundation -d www.theshelter.foundation"
        echo ""
        echo "Você precisará adicionar um registro TXT no DNS do Cloudflare."
        ;;
    C|c)
        echo ""
        echo "📋 Executando Certbot (pode falhar com Cloudflare ativo)..."
        certbot --nginx -d theshelter.foundation -d www.theshelter.foundation
        ;;
    *)
        echo "Opção inválida"
        ;;
esac

echo ""
echo "📋 Passo 5: Verificar certificado"
echo "--------------------------------"
echo "Após obter o certificado, verifique com:"
echo "sudo certbot certificates"
echo ""
echo "Teste o site em: https://theshelter.foundation"
echo ""
echo "✅ Configuração de SSL concluída!"