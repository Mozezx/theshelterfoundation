# Instruções para Adicionar Registro TXT no Cloudflare

## 📋 Passo a Passo para Validação DNS do Certbot

### 1. Acesse o Cloudflare Dashboard
- URL: https://dash.cloudflare.com
- Faça login com sua conta

### 2. Selecione a Zona do Domínio
- Clique em **"theshelter.foundation"** na lista de domínios

### 3. Vá para a Seção DNS
- No menu lateral esquerdo, clique em **"DNS"**
- Clique em **"Records"** (Registros)

### 4. Adicionar Novo Registro TXT
- Clique no botão **"Add record"** (Adicionar registro)
- Configure os seguintes campos:

**Para o primeiro desafio (www.theshelter.foundation):**
```
Type: TXT
Name: _acme-challenge.www.theshelter.foundation
Content: 7Y53qzO3-dNue_doFLzXI_1evY-HFOAtBLyDUDKXMF4
TTL: Auto
Proxy status: DNS only (nuvem CINZA - NÃO laranja)
```

**Para o segundo desafio (theshelter.foundation):**
(O Certbot vai pedir outro valor depois - aguarde a próxima instrução)

### 5. Salvar e Aguardar Propagação
- Clique em **"Save"**
- Aguarde **2-5 minutos** para propagação DNS

### 6. Verificar Propagação
Use o comando no VPS para verificar:
```bash
dig TXT _acme-challenge.www.theshelter.foundation
```
Ou use ferramenta online: https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.www.theshelter.foundation

### 7. Continuar o Certbot
Após adicionar o registro TXT e verificar que está propagado:
1. Volte ao terminal do VPS
2. Pressione **Enter** para continuar
3. O Certbot vai pedir outro registro TXT para `_acme-challenge.theshelter.foundation`
4. Repita os passos 4-6 com o novo valor

### ⚠️ Importante
- **Proxy status DEVE estar CINZA** (DNS only) - NÃO laranja
- O TTL pode ser "Auto" (automatico)
- Aguarde propagação antes de continuar no Certbot

### 🔄 Fluxo Completo
1. Certbot pede primeiro registro TXT para `www.theshelter.foundation`
2. Você adiciona no Cloudflare
3. Aguarda propagação
4. Pressiona Enter no Certbot
5. Certbot pede segundo registro TXT para `theshelter.foundation`
6. Você adiciona no Cloudflare
7. Aguarda propagação
8. Pressiona Enter no Certbot
9. Certbot emite o certificado

### 📞 Suporte
Se tiver problemas:
- Verifique se o registro TXT está correto (cópia exata do valor)
- Confirme que a nuvem está CINZA (DNS only)
- Aguarde mais tempo para propagação (até 10 minutos)
- Use `dig TXT _acme-challenge.www.theshelter.foundation` para testar