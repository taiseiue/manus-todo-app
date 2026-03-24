FROM node:22-slim AS base

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source code
COPY src ./src
COPY tsconfig.json ./

# Build
RUN pnpm build

# Production stage
FROM node:22-slim AS production

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod

COPY --from=base /app/dist ./dist

# Create data directory for SQLite
RUN mkdir -p /app/data

ENV PORT=3000
ENV DB_PATH=/app/data/todos.db

EXPOSE 3000

CMD ["node", "dist/index.js"]
