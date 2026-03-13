# Instruções de Deploy - The Shelter Foundation

Este documento contém instruções detalhadas para realizar o deploy do projeto **theshelter.foundation** no VPS, garantindo isolamento completo do sistema `oxservices` existente.

## 📋 Pré-requisitos

- VPS Ubuntu 24.04 LTS com Docker e Docker Compose instalados
- Domínio `theshelter.foundation` apontando para o IP do VPS (85.31.239.235)
- Nginx instalado e configurado
- Acesso SSH ao servidor

## 🚀 Passo a Passo do Deploy

### 1. Preparação do Ambiente

```bash
# Acessar o servidor via SSH
ssh root@85.31.239.235

# Clonar o repositório (se ainda não tiver)
git clone <URL_DO_REPOSITORIO> /opt/theshelter
cd /opt/theshelter
```

### 2. Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar o arquivo .env com as configurações de produção
nano .env
```

**Variáveis importantes:**
- `STRIPE_SECRET_KEY`: Chave secreta do Stripe (produção)
- `VITE_STRIPE_PUBLISHABLE_KEY`: Chave pública do Stripe (produção)
- `DB_PASSWORD`: Senha segura para o banco de dados PostgreSQL

### 3. Configurar Nginx

```bash
# Copiar configuração do Nginx
sudo cp nginx-theshelter.conf /etc/nginx/sites-available/theshelter.foundation

# Criar link simbólico
sudo ln -s /etc/nginx/sites-available/theshelter.foundation /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Recarregar Nginx
sudo systemctl reload nginx
```

### 4. Executar Deploy

```bash
# Tornar script executável
chmod +x deploy.sh

# Executar deploy
./deploy.sh
```

### 5. Configurar SSL (Certbot)

**Aguardar propagação do DNS** (pode levar algumas horas)

```bash
# Instalar Certbot (se não tiver)
sudo apt install certbot python3-certbot-nginx

# Obter certificado SSL
sudo certbot --nginx -d theshelter.foundation -d www.theshelter.foundation
```

## 🐳 Arquitetura Docker

O projeto utiliza uma arquitetura Docker isolada:

### Containers:
1. **shelter-db**: PostgreSQL 15 (banco de dados dedicado)
   - Porta interna: 5432 (não exposta ao host)
   - Rede: `shelter_network`

2. **shelter-app**: Aplicação Node.js + React
   - Porta exposta: `127.0.0.1:4100 → 3001`
   - Rede: `shelter_network`

### Rede Isolada:
- `shelter_network`: Rede Docker bridge exclusiva
- Isolamento completo do sistema `oxservices`

## 🔧 Comandos Úteis

### Gerenciamento de Containers:
```bash
# Iniciar aplicação
docker-compose up -d

# Parar aplicação
docker-compose down

# Reiniciar
docker-compose restart

# Ver logs
docker-compose logs -f web
docker-compose logs -f db
```

### Monitoramento:
```bash
# Ver status dos containers
docker-compose ps

# Ver uso de recursos
docker stats

# Acessar banco de dados
docker-compose exec db psql -U shelter_user -d shelter_db
```

### Manutenção:
```bash
# Backup do banco de dados
docker-compose exec db pg_dump -U shelter_user shelter_db > backup_$(date +%Y%m%d).sql

# Restaurar backup
cat backup.sql | docker-compose exec -T db psql -U shelter_user shelter_db
```

## 🛡️ Considerações de Segurança

### Isolamento:
- Aplicação roda em rede Docker exclusiva
- Banco de dados não exposto publicamente
- Porta 4100 acessível apenas via localhost
- Nginx como único ponto de entrada público

### SSL/TLS:
- Certificado Let's Encrypt via Certbot
- Redirecionamento HTTP → HTTPS automático
- Headers de segurança configurados no Nginx

### Banco de Dados:
- Senhas armazenadas em variáveis de ambiente
- Backup automático recomendado
- Acesso restrito à rede Docker interna

## 🚨 Solução de Problemas

### Aplicação não responde (502 Bad Gateway):
```bash
# Verificar se container está rodando
docker-compose ps

# Verificar logs
docker-compose logs web

# Testar porta local
curl -v http://localhost:4100

# Verificar se porta está ouvindo
sudo ss -tulpn | grep 4100
```

### Problemas com banco de dados:
```bash
# Verificar logs do PostgreSQL
docker-compose logs db

# Testar conexão com banco
docker-compose exec db pg_isready -U shelter_user -d shelter_db

# Reiniciar banco de dados
docker-compose restart db
```

### Problemas com Nginx:
```bash
# Testar configuração
sudo nginx -t

# Verificar logs do Nginx
sudo tail -f /var/log/nginx/theshelter.error.log
sudo tail -f /var/log/nginx/theshelter.access.log
```

## 📞 Suporte

Em caso de problemas:
1. Verificar logs dos containers
2. Consultar este documento
3. Verificar configurações de firewall
4. Confirmar propagação DNS

**IP do VPS:** 85.31.239.235  
**Domínio:** theshelter.foundation  
**Porta da aplicação:** 4100 (localhost only)