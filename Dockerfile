# --- Step 1: Build Stage ---
FROM node:18-bullseye AS builder

# Install dependencies for native modules
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    build-essential \
    linux-libc-dev

WORKDIR /app

# Copy dependencies and install
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy rest of the code and build
COPY . .
RUN npm run build

# --- Step 2: Production Stage ---
FROM node:18-alpine AS runner

WORKDIR /app

# Install runtime dependencies only (optional: smaller image)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.js ./next.config.js

# Set environment
ENV NODE_ENV=production

EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]
