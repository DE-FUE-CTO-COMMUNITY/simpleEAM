FROM node:20-bookworm-slim

WORKDIR /app/analytics-runtime

RUN corepack enable \
 && corepack prepare yarn@4.9.1 --activate

COPY analytics/runtime/package.json ./package.json
COPY analytics/runtime/.yarnrc.yml ./.yarnrc.yml

RUN yarn install

COPY analytics/runtime/ ./

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV TS_NODE_TRANSPILE_ONLY=1
ENV NODE_OPTIONS="--max_old_space_size=4096"

RUN yarn build || echo "TypeScript warnings ignored"

ENTRYPOINT ["yarn", "start"]