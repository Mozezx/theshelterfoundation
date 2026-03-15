# Guia de Deploy Oficial - The Shelter Foundation

Este documento descreve o fluxo de deploy definitivo para o projeto.

## 🏗️ Arquitetura
- **VPS**: Ubuntu 24.04 LTS
- **Docker**: Containers isolados para App e Banco de Dados.
- **Nginx (Host)**: Atua como Reverse Proxy e terminador SSL.
- **SSL**: Gerenciado pelo Certbot no Host.

## 🚀 Como fazer o Deploy

### 1. Preparação (Primeira vez)
1. Clone o repositório no VPS em `/opt/theshelter`.
2. Configure o Nginx (Host):
   ```bash
   sudo cp infra/nginx/nginx-theshelter.conf /etc/nginx/sites-available/theshelter.foundation
   sudo ln -s /etc/nginx/sites-available/theshelter.foundation /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

### 2. Configuração de Ambiente
Crie o arquivo `.env` na raiz do projeto (use o script auxiliar):
```bash
bash infra/scripts/setup_env_vps.sh
```

### 3. Execução do Deploy
Para atualizar a aplicação:
```bash
bash infra/scripts/deploy.sh
```

## 🛠️ Scripts Utilitários (em `infra/scripts/`)
- `deploy.sh`: Puxa do Git, reconstrói os containers e testa a saúde do sistema.
- `setup_env_vps.sh`: Ajuda a configurar o `.env` de produção.
- `diagnose_certbot.sh`: Ferramenta de diagnóstico para problemas de SSL.
- `fix_godaddy_dns.sh`: Guia para corrigir registros DNS na GoDaddy.
- `install_docker_compose.sh`: Instala o Docker Compose se necessário.

## 🗄️ Gerenciamento de Banco de Dados
O banco roda no container `shelter-db`.
- **Acessar**: `docker compose -f infra/docker/docker-compose.yml exec db psql -U shelter_user -d shelter_db`
- **Backup**: `docker compose -f infra/docker/docker-compose.yml exec db pg_dump -U shelter_user shelter_db > backup.sql`

## 🔐 SSL e DNS
Consulte o guia detalhado em [DNS e SSL](../dns-ssl/README.md).
