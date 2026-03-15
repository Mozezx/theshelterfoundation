# Plano de limpeza e organização do projeto

Este documento descreve o plano para limpar arquivos de deploy e infra não utilizados, organizar a estrutura e remover assets órfãos, com foco em manter apenas o fluxo de deploy oficial.

## Objetivos

- Ter um único fluxo de deploy oficial documentado.
- Tirar scripts e configs da raiz, organizando em pastas de infra.
- Remover scripts, guias e assets que não são mais usados.

## Fase 1 – Entender o fluxo de deploy atual

1. Revisar os artefatos principais:
   - [`docker-compose.yml`](docker-compose.yml:1)
   - [`Dockerfile`](Dockerfile:1)
   - [`nginx-theshelter.conf`](nginx-theshelter.conf:1)
   - [`nginx.conf`](nginx.conf:1)
   - [`server/index.js`](server/index.js:1)
2. Ler os guias existentes:
   - [`DEPLOY_INSTRUCTIONS.md`](DEPLOY_INSTRUCTIONS.md:1)
   - [`deployment_guide.md`](deployment_guide.md:1)
   - [`cloudflare_dns_instructions.md`](cloudflare_dns_instructions.md:1)
   - [`guia_godaddy_only.md`](guia_godaddy_only.md:1)
3. Registrar em poucas linhas qual é o fluxo de deploy realmente usado hoje (exemplo: VPS + Docker Compose + Nginx) em um trecho do [`README.md`](README.md:1) ou neste arquivo.

## Fase 2 – Classificar scripts de deploy/infra da raiz

Arquivos a revisar:

- [`deploy.sh`](deploy.sh:1)
- [`setup_env_vps.sh`](setup_env_vps.sh:1)
- [`ssl_setup_vps.sh`](ssl_setup_vps.sh:1)
- [`diagnose_certbot.sh`](diagnose_certbot.sh:1)
- [`fix_ssl_cloudflare.sh`](fix_ssl_cloudflare.sh:1)
- [`fix_godaddy_dns.sh`](fix_godaddy_dns.sh:1)
- [`install_docker_compose.sh`](install_docker_compose.sh:1)
- [`fix_favicon.ps1`](fix_favicon.ps1:1)

Para cada script, classificar:

- Função real (provisionar VPS, ajustar DNS, SSL etc.).
- Se ainda é usado no fluxo oficial.
- Ação: **Manter**, **Mover para infra**, **Arquivar como legado** ou **Remover**.

## Fase 3 – Consolidar documentação de deploy e DNS

1. Definir onde ficará a documentação oficial:
   - Seção no [`README.md`](README.md:1) **ou**
   - Pasta `docs/deploy/` com 1–2 arquivos enxutos.
2. Unificar o conteúdo de:
   - [`DEPLOY_INSTRUCTIONS.md`](DEPLOY_INSTRUCTIONS.md:1)
   - [`deployment_guide.md`](deployment_guide.md:1)
   - [`cloudflare_dns_instructions.md`](cloudflare_dns_instructions.md:1)
   - [`guia_godaddy_only.md`](guia_godaddy_only.md:1)
3. Decidir o que fica como guia oficial e o que vira legado ou é removido.

## Fase 4 – Nova estrutura de pastas de infra e docs

Estrutura alvo sugerida:

- `infra/`
  - `infra/docker/`
    - [`docker-compose.yml`](docker-compose.yml:1)
    - [`Dockerfile`](Dockerfile:1)
  - `infra/nginx/`
    - [`nginx-theshelter.conf`](nginx-theshelter.conf:1)
    - [`nginx.conf`](nginx.conf:1)
  - `infra/scripts/` – scripts classificados como **Manter**.
  - `infra/legacy/` – opcional, para scripts antigos.
- `docs/`
  - `docs/deploy/` – guia oficial de deploy.
  - `docs/dns-ssl/` – se quiser separar.
  - `docs/legacy/` – guias antigos, se forem arquivados.

## Fase 5 – Auditoria do backend

1. Revisar [`server/package.json`](server/package.json:1) e [`server/index.js`](server/index.js:1):
   - Ver quais scripts npm são realmente usados.
   - Identificar dependências e configs obsoletas.
2. Verificar alinhamento com o que está em [`docker-compose.yml`](docker-compose.yml:1) (containerização) e com os scripts de deploy mantidos.

## Fase 6 – Auditoria de frontend e assets

1. Listar assets em:
   - `src/assets/`
   - `public/`
2. Para cada imagem/asset, buscar referências em:
   - Arquivos `.tsx` e `.ts` em `src/` (páginas e componentes).
   - [`index.html`](index.html:1).
3. Marcar como candidatos à remoção os arquivos que não aparecem em lugar nenhum.
4. Resolver duplicidades entre `public/` e `src/assets/`.

## Fase 7 – Aplicar movimentos e remoções

1. Criar pastas `infra/` e `docs/` conforme a Fase 4.
2. Mover configs e scripts marcados como **Manter**.
3. Mover itens históricos para `infra/legacy/` ou `docs/legacy/`, se desejado.
4. Remover do repositório:
   - Scripts obsoletos.
   - Guias substituídos.
   - Assets órfãos.

## Fase 8 – Validação

1. Rodar no frontend os scripts de [`package.json`](package.json:6):
   - `npm run lint`
   - `npm run test`
   - `npm run build`
2. Validar o backend com os scripts de [`server/package.json`](server/package.json:1).
3. Se o fluxo oficial for Docker, subir o ambiente com [`docker-compose.yml`](docker-compose.yml:1) e testar manualmente.
4. Atualizar o [`README.md`](README.md:1) explicando:
   - Fluxo de deploy oficial.
   - Onde estão os scripts de infra.
   - Como rodar, testar e fazer deploy.

