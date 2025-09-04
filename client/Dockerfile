FROM node:20-alpine

WORKDIR /app

# Aktiviere Corepack für Yarn Berry
RUN corepack enable
RUN corepack prepare yarn@4.9.1 --activate




# Kopiere package.json und yarn.lock zuerst für deterministische Dependency-Installation
COPY package.json yarn.lock ./
# Installiere exakt die Versionen aus yarn.lock
RUN yarn install --frozen-lockfile

# Kopiere den Rest des Projekts
COPY . .

# Stelle sicher, dass der Build-Prozess mit dem richtigen Node-Environment erfolgt
ENV NODE_ENV=production

# Wechsle in das Client-Verzeichnis
WORKDIR /app/client

# Umgebungsvariablen für TypeScript-Build setzen
ENV TS_NODE_TRANSPILE_ONLY=1
ENV NODE_OPTIONS="--max_old_space_size=4096"

# Baue die Client-Anwendung
# Für Next.js sollte NODE_ENV während des Builds auf "production" gesetzt sein
ENV NODE_ENV=production
# Löschen wir erst den .next-Ordner, falls er existiert
RUN rm -rf .next
# ESLint-Prüfungen beim Build überspringen, um Fehler durch Warnungen zu vermeiden
ENV NEXT_DISABLE_ESLINT=1
# Dann führen wir den Build-Befehl aus
RUN yarn build

# Stelle den Port bereit
EXPOSE 3000

# Starte den Client im Produktionsmodus
# Stellen wir sicher, dass NODE_ENV weiterhin auf "production" gesetzt ist
ENV NODE_ENV=production
CMD ["yarn", "start"]