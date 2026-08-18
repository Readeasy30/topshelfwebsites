# Top Shelf Cloud Workflow

## Source of truth
GitHub — `Readeasy30/topshelfwebsites`

## Cloud development
GitHub Codespaces uses `.devcontainer/devcontainer.json`.

No local installation of Node, npm, React, or Vite is required.

## Hosting
Cloudflare Pages remains the production hosting/deployment layer.

## Daily workflow
1. Open GitHub.
2. Open the repository.
3. Choose **Code → Codespaces → Create codespace on main**.
4. Work in the browser.
5. Commit changes to `main`.
6. Cloudflare Pages deploys from the GitHub repository.
7. GitHub Actions validates the static site.

## Architecture

Library/Home computer
        ↓
GitHub Codespaces
        ↓
GitHub main
        ↓
Cloudflare Pages
        ↓
TopShelfWebsites.com

The local Windows Git/SSH setup is no longer required for cloud development.
