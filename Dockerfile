# --- Step 1: Build Stage ---
FROM node:16-bullseye AS builder

# Install system dependencies for native modules
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    build-essential

WORKDIR /app


# Copy package files first for better caching
COPY package*.json ./

# Force install legacy peer deps (important for AntD 5 + Chakra + Next.js)
RUN npm config set legacy-peer-deps true
RUN npm ci


# After npm install
RUN npm install && npm run postinstall
# Copy rest of the application code
COPY . .

# Ensure TypeScript builds correctly
RUN npm run build

# --- Step 2: Production Runner Stage ---
FROM node:18-alpine AS runner


WORKDIR /app

# Only copy what’s needed to run

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.js ./next.config.js

ENV NODE_ENV=production

EXPOSE 3000

# Use node instead of npm (better control)
CMD ["node", "node_modules/next/dist/bin/next", "start"]
