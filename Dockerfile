ARG NODE_VERSION=20.6.1

FROM node:${NODE_VERSION}-alpine AS base
RUN apk update
RUN apk add --no-cache libc6-compat
RUN npm install pnpm@9.1.1 turbo@2.5.4 --global
RUN pnpm config set store-dir ~/.pnpm-store


# Prune projects
FROM base AS pruner
ARG PROJECT
RUN echo "Project: ${PROJECT}"
WORKDIR /app
COPY . .
RUN turbo prune --scope=${PROJECT} --docker

FROM base AS build
ARG PROJECT

WORKDIR /app
# Copy lockfile and package.json's of isolated subworkspace
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /app/out/json/ .

# First install the dependencies (as they change less often)
RUN --mount=type=cache,id=s/8e8cd2a4-9fb6-43d1-8323-bb786326aa0a,target=~/.pnpm-store pnpm install --frozen-lockfile

# Copy source code of isolated subworkspace
COPY --from=pruner /app/out/full/ .

RUN pnpm run build --filter=${PROJECT}
RUN pnpm deploy --filter=${PROJECT} --prod /prod/${PROJECT}

# Final image
FROM gcr.io/distroless/nodejs20-debian11
# FROM node:${NODE_VERSION}-slim
ARG PROJECT

WORKDIR /app
ARG PROJECT
COPY --from=build --chown=nonroot:nonroot /prod/${PROJECT} /prod/${PROJECT}
COPY --from=build  --chown=nonroot:nonroot /app/services/${PROJECT}/dist /prod/${PROJECT}/dist
WORKDIR /prod/${PROJECT}

CMD ["npm", "run", "start"]
