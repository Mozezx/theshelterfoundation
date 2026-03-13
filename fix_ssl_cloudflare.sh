#!/bin/bash

echo "🔧 Solução para problema de SSL com Cloudflare"
echo "=============================================="
echo ""
echo "Este script guiará você através da solução do problema de SSL onde o"
echo "Cloudflare está bloqueando a validação do Let's Encrypt."
echo ""

# Verificar se está rodando como root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Este script precisa ser executado como root (sudo)"
    echo "   Execute: sudo ./fix_ssl_cloudflare.sh"
    exit 1
fi

echo "📋 Passo 1: Verificar configuração atual do DNS"
echo "----------------------------------------------"
echo "O domínio theshelter.foundation está resolvendo para:"
dig +short theshelter.foundation

echo ""
echo "📋 Passo 2: Atualizar configuração do Nginx"
echo "------------------------------------------"

# Verificar se o diretório para o Certbot existe
if [ ! -d "/var/www/certbot" ]; then
    echo "Criando diretório /var/www/certbot..."
    mkdir -p /var/www/certbot
    chown -R www-data:www-data /var/www/certbot
fi

# Verificar se a configuração do Nginx já tem o bloco .well-known
CONFIG_FILE="/etc/nginx/sites-available/theshelter.foundation"
if [ -f "$CONFIG_FILE" ]; then
    if grep -q "\.well-known/acme-challenge" "$CONFIG_FILE"; then
        echo "✅ Configuração .well-known já existe no Nginx"
    else
        echo "⚠️  Configuração .well-known não encontrada. Atualizando..."
        
        # Criar backup da configuração atual
        cp "$CONFIG_FILE" "$CONFIG_FILE.backup.$(date +%Y%m%d_%H%M%S)"
        
        # Adicionar bloco .well-known após a linha do server_name
        sed -i '/server_name theshelter.foundation www.theshelter.foundation;/a\
    # Bloco para validação do Certbot (ACME Challenge)\
    location /.well-known/acme-challenge/ {\
        root /var/www/certbot;\
        try_files $uri =404;\
    }' "$CONFIG_FILE"
        
        echo "✅ Configuração atualizada"
    fi
    
    # Testar configuração do Nginx
    echo "Testando configuração do Nginx..."
    nginx -t
    if [ $? -eq 0 ]; then
        echo "✅ Configuração do Nginx é válida"
        echo "Reiniciando Nginx..."
        systemctl reload nginx
    else
        echo "❌ Erro na configuração do Nginx. Verifique o arquivo: $CONFIG_FILE"
        exit 1
    fi
else
    echo "❌ Arquivo de configuração do Nginx não encontrado: $CONFIG_FILE"
    echo "   Certifique-se de que o Nginx está configurado corretamente."
    exit 1
fi

echo ""
echo "📋 Passo 3: OPÇÕES para resolver o problema do Cloudflare"
echo "--------------------------------------------------------"
echo ""
echo "OPÇÃO A: Desativar temporariamente o proxy do Cloudflare (RECOMENDADO)"
echo "----------------------------------------------------------------------"
echo "1. Acesse https://dash.cloudflare.com"
echo "2. Vá para a zona do domínio theshelter.foundation"
echo "3. Encontre o registro A para theshelter.foundation"
echo "4. Clique no ícone de nuvem laranja para desativar o proxy (ficará cinza)"
echo "5. Aguarde alguns minutos para propagação"
echo ""
echo "OPÇÃO B: Usar validação DNS manual (mais complexo)"
echo "--------------------------------------------------"
echo "1. Execute: sudo certbot certonly --manual --preferred-challenges dns \\"
echo "   -d theshelter.foundation -d www.theshelter.foundation"
echo "2. Siga as instruções para adicionar registro TXT no DNS"
echo ""
echo "OPÇÃO C: Usar validação HTTP com proxy desativado"
echo "------------------------------------------------"
echo "1. Desative o proxy do Cloudflare (como na Opção A)"
echo "2. Aguarde 5-10 minutos para propagação"
echo "3. Execute o Certbot normalmente"
echo ""

read -p "Qual opção você prefere? (A/B/C): " option

case $option in
    A|a)
        echo ""
        echo "📋 Passo 4: Executar Certbot após desativar proxy"
        echo "-----------------------------------------------"
        echo "Após desativar o proxy do Cloudflare e aguardar alguns minutos,"
        echo "execute o comando abaixo:"
        echo ""
        echo "sudo certbot --nginx -d theshelter.foundation -d www.theshelter.foundation"
        echo ""
        echo "📋 Passo 5: Reativar proxy do Cloudflare"
        echo "--------------------------------------"
        echo "Após obter o certificado com sucesso:"
        echo "1. Volte ao Cloudflare Dashboard"
        echo "2. Reative o proxy (clique no ícone de nuvem para ficar laranja)"
        echo "3. Configure as regras de SSL no Cloudflare para 'Full (strict)'"
        echo ""
        ;;
    B|b)
        echo ""
        echo "📋 Passo 4: Validação DNS manual"
        echo "------------------------------"
        echo "Execute o comando abaixo e siga as instruções:"
        echo ""
        echo "sudo certbot certonly --manual --preferred-challenges dns \\"
        echo "  -d theshelter.foundation -d www.theshelter.foundation"
        echo ""
        echo "Nota: Este método requer que você adicione manualmente um"
        echo "registro TXT no DNS do Cloudflare e aguarde a propagação."
        echo ""
        ;;
    C|c)
        echo ""
        echo "📋 Passo 4: Executar Certbot com proxy desativado"
        echo "-----------------------------------------------"
        echo "1. Primeiro, desative o proxy do Cloudflare"
        echo "2. Aguarde 5-10 minutos para propagação DNS"
        echo "3. Verifique se o domínio resolve para o IP correto:"
        echo "   dig +short theshelter.foundation"
        echo "   Deve mostrar: 85.31.239.235"
        echo "4. Execute o Certbot:"
        echo ""
        echo "sudo certbot --nginx -d theshelter.foundation -d www.theshelter.foundation"
        echo ""
        echo "5. Após sucesso, reative o proxy do Cloudflare"
        echo ""
        ;;
    *)
        echo "Opção inválida. Saindo."
        exit 1
        ;;
esac

echo ""
echo "📋 Passo final: Verificar certificado"
echo "------------------------------------"
echo "Após obter o certificado, verifique com:"
echo "sudo certbot certificates"
echo ""
echo "O Nginx será automaticamente configurado para usar SSL."
echo "Teste o site em: https://theshelter.foundation"
echo ""
echo "✅ Script concluído. Siga as instruções acima para resolver o SSL."
echo ""
echo "💡 Dica: Se ainda tiver problemas, você pode usar o serviço"
echo "   ZeroSSL ou BuyPass que podem funcionar melhor com Cloudflare."