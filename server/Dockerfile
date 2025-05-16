FROM node:20-alpine

WORKDIR /app

# Aktiviere Corepack für Yarn Berry
RUN corepack enable
RUN corepack prepare yarn@4.9.1 --activate

# Kopiere das gesamte Projekt (für ein isoliertes Paketmanagement)
COPY . .

# Installiere die notwendigen Tools direkt
RUN npm install -g ts-node-dev typescript

# Installiere Abhängigkeiten im Workspace-Modus
RUN yarn install

# Stelle den Port bereit
EXPOSE 4000

# Wechsle zum node-Benutzer für mehr Sicherheit
USER node

# Wechsle in das Server-Verzeichnis
WORKDIR /app/server

# Starte den Server im Entwicklungsmodus
CMD ["yarn", "dev"]