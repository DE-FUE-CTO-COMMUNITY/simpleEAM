FROM node:20-alpine

WORKDIR /app

# Aktiviere Corepack für Yarn Berry
RUN corepack enable
RUN corepack prepare yarn@4.9.1 --activate

# Bei einem Monorepo-Setup mit Workspaces wird die Installation über das Root-Verzeichnis erfolgen
# Die Dateien werden durch Volume-Mounts bereitgestellt

# Die Dateien werden per Volume gemountet, daher kein COPY notwendig
# Wechsle in das Client-Verzeichnis
WORKDIR /app/client

# Stelle den Port bereit
EXPOSE 3000

# Starte den Client im Entwicklungsmodus
CMD ["yarn", "dev"]