# Guia de Deploy: The Shelter Foundation

Este guia descreve como realizar o deploy do projeto **theshelter.foundation** no VPS (1267657) garantindo que ele fique **100% isolado** do sistema `oxservices` existente e não crie conflitos de portas ou banco de dados.

## 1. Arquitetura de Isolamento

Para garantir que o `theshelter` não interfira no `oxservices`, adotaremos a seguinte estratégia:
- **Rede Docker Exclusiva:** O `theshelter` rodará em sua própria rede Docker (ex: `shelter_network`).
- **Banco de Dados Dedicado:** Um container PostgreSQL exclusivo para o projeto. A porta não será exportada para o host público, rodando apenas internamente no ecossistema de rede do próprio docker.
- **Exposição Restrita:** Apenas a porta da aplicação web (Frontend/Backend) será exposta via `127.0.0.1:4100` (localhost) no host. **Nenhuma** porta será exposta publicamente de forma direta pelo Docker na interface `0.0.0.0`.
- **Nginx do Host como Intermediário:** O Nginx atual continuará sendo o dono absoluto das portas `80` e `443` e fará o *reverse proxy* para o app rodando localmente.

---

## 2. Preparação do Docker Compose (`docker-compose.yml`)

Sugere-se criar o seu `docker-compose.yml` (e os Dockerfiles pertinentes) com a seguinte base em mente para selar o isolamento:

```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    container_name: shelter-db
    restart: unless-stopped
    environment: # Utilize variáveis num .env preferencialmente
      POSTGRES_USER: shelter_user
      POSTGRES_PASSWORD: sua_senha_segura
      POSTGRES_DB: shelter_db
    volumes:
      - shelter_pgdata:/var/lib/postgresql/data
    networks:
      - shelter_network
    # ATENÇÃO: omitir o bloco "ports" aqui evita que conflite com o Postgres do oxservices (:5432), garantindo que apenas containers da shelter_network falem com esse banco pelo hostname "db"

  app:
    build: .
    container_name: shelter-app
    restart: unless-stopped
    depends_on:
      - db
    environment:
      - DATABASE_URL=postgresql://shelter_user:sua_senha_segura@db:5432/shelter_db
      - NODE_ENV=production
    ports:
      # Expõe a porta 4100 no host e direciona para a porta 3001 (padrão) do container
      - "127.0.0.1:4100:3001"
    networks:
      - shelter_network

networks:
  shelter_network:
    name: shelter_network
    driver: bridge

volumes:
  shelter_pgdata:
```

---

## 3. Configuração do Nginx (Reverse Proxy)

Crie um novo arquivo de configuração no Nginx para ser o host virtual do theshelter.

1. Acesse o servidor e crie o arquivo:
   ```bash
   sudo nano /etc/nginx/sites-available/theshelter.foundation
   ```

2. Adicione a configuração base (vamos focar na 80 primeiro para o Certbot validar depois):
   ```nginx
   server {
       listen 80;
       server_name theshelter.foundation www.theshelter.foundation;

       # Logs de acesso independentes
       access_log /var/log/nginx/theshelter.access.log;
       error_log /var/log/nginx/theshelter.error.log;

       location / {
           # Aponta para o app que foi mapeado unicamente no localhost do servidor
           proxy_pass http://127.0.0.1:4100;
           
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           
           # Repassando IP real e protocolo
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

3. Ative o site criando o symlink:
   ```bash
   sudo ln -s /etc/nginx/sites-available/theshelter.foundation /etc/nginx/sites-enabled/
   ```

4. Valide a configuração do Nginx antes de subir e recarregue:
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

---

## 4. Apontamento na GoDaddy & SSL

Como o domínio `theshelter.foundation` encontra-se na GoDaddy sem apontamento ainda, faça isso antes de tentar rodar o Certbot:

**Passo A: Apontamento no painel DNS GoDaddy**
- Crie/Edite um **Registro A** onde:
  - **Nome (Host):** `@`
  - **Valor (Aponta para):** `85.31.239.235` *(O IP do seu VPS)*
- Crie/Edite um **Registro CNAME**:
  - **Nome:** `www`
  - **Valor:** `theshelter.foundation`

*(Aguarde alguns minutos/horas pela propagação de DNS nas redes globais).*

**Passo B: Gerar certificado SSL (Certbot)**
Uma vez que ferramentas como [WhatsMyDNS](https://www.whatsmydns.net/) confirmarem que o domínio está chegando no seu IP `85.31.239.235`, aplique o SSL:

```bash
sudo certbot --nginx -d theshelter.foundation -d www.theshelter.foundation
```
*O Certbot modificará seu arquivo no Nginx automaticamente para hospedar o tráfego via porta `443` criptografado!*

---

## 5. Resumo e Procedimentos Diários de Tropa

1. **Deploy:** Baixe as novidades do git no VPS (`git pull`).
2. **Atualização docker:** Execute `docker-compose up -d --build`.
   > *Você notará que nenhuma aplicação atual (n8n, front/back do oxservices, ou postgres do host) reiniciará ou cairá, por garantirmos o portoamento em localhost.*
3. **Logs:** Caso algo dê errado subindo o container: `docker logs shelter-app -f`.
4. **Proxy:** Caso bata erro 502 Bad Gateway no browser, mas o container consta online, você pode verificar se ele de fato pegou a porta `4100` local usando o comando:
   `sudo ss -tulpn | grep 4100`
