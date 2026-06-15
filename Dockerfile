# syntax=docker/dockerfile:1.7

FROM node:20-bookworm-slim AS base
WORKDIR /app

ENV NPM_CONFIG_UPDATE_NOTIFIER=false \
    NPM_CONFIG_FUND=false

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS build
COPY . .
RUN npm run build

FROM node:20-bookworm-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000

RUN npm install -g serve@14.2.4

COPY --from=build /app/dist ./dist
RUN chown -R node:node /app

USER node

EXPOSE 3000

CMD ["sh", "-c", "serve -s dist -l ${PORT}"]
