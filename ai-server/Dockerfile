FROM node:20-bookworm-slim

WORKDIR /app/ai-server

RUN corepack enable \
 && corepack prepare yarn@4.9.1 --activate

COPY ai-server/package.json ./package.json
COPY ai-server/yarn.lock ./yarn.lock
COPY ai-server/.yarnrc.yml .yarnrc.yml

COPY ai-server/ ./

RUN yarn install

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV TS_NODE_TRANSPILE_ONLY=1
ENV NODE_OPTIONS="--max_old_space_size=4096"

RUN yarn build || echo "TypeScript warnings ignored"

EXPOSE 4001

ENTRYPOINT ["yarn", "start"]
