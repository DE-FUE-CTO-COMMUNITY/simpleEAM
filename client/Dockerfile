FROM node:20-alpine

WORKDIR /app

# Kopiere package.json für die Installation der Abhängigkeiten
COPY package.json ./

# Installiere Abhängigkeiten basierend auf package.json
RUN yarn install

# Kopiere den Quellcode
COPY . .

# Stelle den Port bereit
EXPOSE 3000

# Starte den Client im Entwicklungsmodus
CMD ["yarn", "dev"]