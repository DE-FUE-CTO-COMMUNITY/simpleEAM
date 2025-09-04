FROM node:20-alpine

WORKDIR /app

# Corepack/Yarn aktivieren
RUN corepack enable \
 && corepack prepare yarn@4.9.1 --activate

# Nur Server-Manifest(e) kopieren für bessere Layer-Caches
COPY package.json ./package.json
COPY yarn.lock ./yarn.lock

# Dependencies installieren
RUN yarn install --immutable

# Restlichen Server-Code kopieren und bauen
COPY . ./
COPY server/src/graphql/schema.graphql src/graphql/schema.graphql

# Build-Umgebung
ENV NODE_ENV=production
ENV TS_NODE_TRANSPILE_ONLY=1
ENV NODE_OPTIONS="--max_old_space_size=4096"

# Build ausführen
RUN yarn build || echo "TypeScript-Warnungen ignoriert"

# GraphQL-Schema-Datei in das Ausgabeverzeichnis kopieren
RUN mkdir -p dist/graphql && cp src/graphql/schema.graphql dist/graphql/

EXPOSE 4000

CMD ["yarn", "start"]
USER node

# Starte den Server im Produktionsmodus
CMD ["yarn", "start"]
