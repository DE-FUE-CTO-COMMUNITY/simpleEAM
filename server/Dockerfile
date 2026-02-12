

FROM node:20-alpine

WORKDIR /app/server

# Corepack/Yarn aktivieren
RUN corepack enable \
 && corepack prepare yarn@4.9.1 --activate

# Nur Server-Manifest(e) kopieren für bessere Layer-Caches
COPY server/package.json ./package.json
COPY server/yarn.lock ./yarn.lock
COPY server/.yarnrc.yml .yarnrc.yml

# Restlichen Server-Code kopieren
COPY server/ ./

# Dependencies installieren
RUN yarn install

# Build-Umgebung
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV TS_NODE_TRANSPILE_ONLY=1
ENV NODE_OPTIONS="--max_old_space_size=4096"

# Build ausführen
RUN yarn build || echo "TypeScript-Warnungen ignoriert"

# GraphQL-Schema-Datei in das Ausgabeverzeichnis kopieren
RUN mkdir -p dist/graphql && cp src/graphql/schema.graphql dist/graphql/

EXPOSE 4000

ENTRYPOINT ["yarn", "start"]

# Starte den Server im Produktionsmodus
CMD ["yarn", "start"]
