# Guia de DNS e SSL - The Shelter Foundation

Este documento cobre a configuração de domínios na GoDaddy e a emissão de certificados SSL com Certbot.

## 📍 Configuração DNS (GoDaddy)

O domínio `theshelter.foundation` deve apontar diretamente para o IP do VPS: `85.31.239.235`.

### Registros Necessários
- **Tipo A**: `@` -> `85.31.239.235`
- **Tipo CNAME**: `www` -> `theshelter.foundation`

**Dica**: Se houver registros antigos do Cloudflare, remova-os. Use o script `infra/scripts/fix_godaddy_dns.sh` para diagnosticar.

## 🔐 Configuração SSL (Certbot)

A recomendação atual é usar o Certbot diretamente no Nginx do Host, sem proxy do Cloudflare intermediário.

### Passo a Passo
1. Certifique-se de que o site está respondendo em HTTP (porta 80).
2. Execute o Certbot:
   ```bash
   sudo certbot --nginx -d theshelter.foundation -d www.theshelter.foundation
   ```
3. Escolha a opção de Redirecionamento (2: Redirect) para forçar HTTPS.

### Problemas Comuns
- **Desafios ACME falhando**: Verifique se o DNS já propagou.
- **Cloudflare**: Se estiver usando Cloudflare, o proxy (nuvem laranja) deve estar desativado durante a emissão inicial, ou use o script `infra/scripts/fix_ssl_cloudflare.sh`.

## 🔄 Renovação
O Certbot configura um timer de renovação automática. Verifique com:
```bash
sudo systemctl list-timers | grep certbot
```
