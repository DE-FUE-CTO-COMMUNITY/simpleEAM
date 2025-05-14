FROM node:20-alpine

WORKDIR /app

# Kopiere package.json für die Installation der Abhängigkeiten
COPY package.json ./

# Installiere Abhängigkeiten
RUN yarn install

# Globale Installation von ts-node-dev und typescript
RUN yarn global add ts-node-dev typescript

# Stelle sicher, dass die yarn global binaries im PATH sind
ENV PATH /usr/local/share/.config/yarn/global/node_modules/.bin:$PATH

# Kopiere den Quellcode
COPY . .

# Stelle den Port bereit
EXPOSE 4000

# Starte den Server im Entwicklungsmodus
CMD ["yarn", "dev"]