# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Configure Environment Variables
# Copy the example file and update it with API URL and Stripe keys
cp .env.example .env

# Set these variables in .env:
# VITE_API_BASE_URL=https://theshelter.foundation:4100
# VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Step 4: Install the necessary dependencies.
npm i

# Step 5: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## 🚀 Deploy e Infraestrutura

Este projeto foi organizado para facilitar o deploy em VPS usando Docker e Nginx.

### Fluxo Oficial
O fluxo de deploy oficial está documentado em: [docs/deploy/README.md](docs/deploy/README.md)

### Estrutura de Pastas
- `infra/docker/`: Arquivos Docker Compose e Dockerfile.
- `infra/nginx/`: Configurações de servidor Nginx.
- `infra/scripts/`: Scripts utilitários de deploy e manutenção.
- `docs/`: Documentação oficial consolidada.

### Como rodar localmente (Full Stack)
1. Instale as dependências na raiz: `npm install`
2. Instale as dependências do servidor: `cd server && npm install`
3. Configure o `.env` na raiz.
4. Inicie o servidor: `npm run dev:server`
5. Inicie o frontend: `npm run dev`

