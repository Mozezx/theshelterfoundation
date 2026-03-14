# Guia: Configuração Completa com Apenas GoDaddy (Sem Cloudflare)

## 📋 Visão Geral
Este guia descreve como configurar o site **theshelter.foundation** usando apenas o DNS da GoDaddy, removendo o Cloudflare para simplificar o processo e permitir SSL direto.

## 🎯 Objetivo Final
- Site funcionando em **http://theshelter.foundation** (já configurado)
- SSL/HTTPS configurado com Let's Encrypt
- Sem intermediários (Cloudflare)
- Configuração mais simples e direta

## 🔄 Passo 1: Remover Domínio do Cloudflare

### 1.1 Acessar Cloudflare Dashboard
- URL: https://dash.cloudflare.com
- Faça login com a conta onde o domínio está adicionado

### 1.2 Remover Domínio
1. Na lista de domínios, clique em **"theshelter.foundation"**
2. Vá para **"Overview"** (Visão Geral)
3. Role até o final da página
4. Clique em **"Remove Site"** (Remover Site)
5. Confirme a remoção

**Importante:** Isso não afeta o registro do domínio, apenas remove do Cloudflare.

## 📍 Passo 2: Verificar Nameservers na GoDaddy

### 2.1 Acessar GoDaddy
- URL: https://godaddy.com
- Faça login na sua conta

### 2.2 Verificar Nameservers
1. Vá para **"Domínios"** → **"theshelter.foundation"**
2. Clique em **"Gerenciar DNS"** ou **"Nameservers"**
3. **Verifique** se está configurado como:
   - **"Usar nameservers padrão da GoDaddy"** OU
   - **"Usar nameservers personalizados"** (com servidores da GoDaddy)

### 2.3 Nameservers Corretos (GoDaddy)
Os nameservers devem ser algo como:
```
ns01.domaincontrol.com
ns02.domaincontrol.com
```

**Não altere** se já estiver assim.

## 🌐 Passo 3: Verificar Registros DNS na GoDaddy

### 3.1 Registros Necessários
Na GoDaddy, em **"DNS Management"**, verifique:

**Registro A (Principal):**
```
Type: A
Host: @
Points to: 85.31.239.235
TTL: 1 hora
```

**Registro CNAME (WWW):**
```
Type: CNAME
Host: www
Points to: theshelter.foundation
TTL: 1 hora
```

### 3.2 Status Atual (da sua imagem)
✅ **Registro A**: Correto (85.31.239.235)  
✅ **Registro CNAME**: Correto (aponta para theshelter.foundation)  
✅ **Nameservers**: Provavelmente corretos (GoDaddy)

## ⏱️ Passo 4: Aguardar Propagação DNS

### 4.1 Tempo de Propagação
- **Remoção do Cloudflare**: Imediato
- **Propagação DNS**: 1-2 horas (pode ser mais rápido)

### 4.2 Verificar Propagação
No seu computador, execute:
```cmd
nslookup theshelter.foundation
```
Deve mostrar: **85.31.239.235**

**Ferramenta online:** https://www.whatsmydns.net/#A/theshelter.foundation

## 🚀 Passo 5: Configurar SSL no VPS

### 5.1 Pré-requisitos no VPS
Certifique-se de que no VPS:
- Nginx está funcionando
- Site responde localmente:
  ```bash
  curl -H "Host: theshelter.foundation" http://localhost
  ```

### 5.2 Instalar Certbot (se necessário)
```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

### 5.3 Executar Certbot
```bash
sudo certbot --nginx -d theshelter.foundation -d www.theshelter.foundation
```

### 5.4 Processo Interativo
O Certbot vai perguntar:
1. **Email** para notificações (opcional)
2. **Termos de serviço** (aceitar)
3. **Compartilhar email** (não recomendado)
4. **Redirecionar HTTP→HTTPS** (escolha opção 2: Redirect)

### 5.5 Verificar Configuração
```bash
# Testar configuração Nginx
sudo nginx -t

# Reiniciar Nginx
sudo systemctl reload nginx

# Verificar certificado
sudo certbot certificates
```

## ✅ Passo 6: Testes Finais

### 6.1 Testar HTTP (Redirecionamento)
Acesse: http://theshelter.foundation
- Deve redirecionar automaticamente para HTTPS
- Deve mostrar SEU site (não GoDaddy)

### 6.2 Testar HTTPS
Acesse: https://theshelter.foundation
- Cadeado verde no navegador
- Site carrega normalmente
- Conexão segura

### 6.3 Testar WWW
Acesse: https://www.theshelter.foundation
- Deve funcionar igual

## 🔧 Passo 7: Configurações Adicionais

### 7.1 Renovação Automática
O Certbot configura renovação automática. Verifique:
```bash
sudo systemctl list-timers | grep certbot
```

### 7.2 Testar Renovação
```bash
sudo certbot renew --dry-run
```

### 7.3 Logs do Certbot
```bash
sudo tail -f /var/log/letsencrypt/letsencrypt.log
```

## 🚨 Solução de Problemas

### Problema: Site ainda mostra GoDaddy
**Solução:** Aguarde mais tempo para propagação DNS (até 24 horas).

### Problema: Certbot falha
**Solução:** Verifique se o domínio resolve corretamente:
```bash
dig theshelter.foundation
```
Deve mostrar: **85.31.239.235**

### Problema: Nginx não redireciona
**Solução:** Verifique configuração:
```bash
sudo nginx -t
sudo systemctl restart nginx
```

## 📊 Cronograma Estimado

| Etapa | Tempo | Status |
|-------|-------|--------|
| 1. Remover Cloudflare | 5 min | ✅ |
| 2. Verificar GoDaddy | 10 min | ✅ |
| 3. Propagação DNS | 1-2 horas | ⏳ |
| 4. Configurar SSL | 15 min | ⏳ |
| 5. Testes finais | 10 min | ⏳ |
| **TOTAL** | **2-3 horas** | |

## 📞 Suporte

### Verificações Importantes
1. **DNS propagado?** `nslookup theshelter.foundation`
2. **Site local funciona?** `curl -H "Host: theshelter.foundation" http://localhost`
3. **Nginx configurado?** `sudo nginx -t`
4. **Certificado válido?** `sudo certbot certificates`

### Links Úteis
- Verificação DNS: https://www.whatsmydns.net
- Teste SSL: https://www.ssllabs.com/ssltest
- Logs do VPS: `/var/log/nginx/theshelter.error.log`

## 🎉 Conclusão
Seguindo este guia, você terá:
- ✅ Site funcionando em HTTP e HTTPS
- ✅ SSL Let's Encrypt configurado
- ✅ Redirecionamento automático HTTP→HTTPS
- ✅ Sem Cloudflare (configuração mais simples)
- ✅ Renovação automática de SSL

**Próximo passo:** Após remover do Cloudflare, aguarde 1-2 horas e prossiga com a configuração do SSL no VPS.
