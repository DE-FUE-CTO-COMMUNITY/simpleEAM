# --- Build Stage ---
FROM node:20-alpine

WORKDIR /app

# Corepack/Yarn aktivieren
RUN corepack enable \
 && corepack prepare yarn@4.9.1 --activate

# Nur Client-Manifest(e) kopieren für bessere Layer-Caches
COPY client/package.json ./package.json
COPY client/yarn.lock ./yarn.lock

# Dependencies installieren
RUN yarn install --immutable

# Restlichen Client-Code kopieren und bauen
COPY client/ ./

# Build-Umgebung
ENV NODE_ENV=production
ENV NEXT_DISABLE_ESLINT=1
ENV NODE_OPTIONS="--max_old_space_size=4096"

RUN rm -rf .next \
 && yarn build

EXPOSE 3000

CMD ["yarn", "start"]