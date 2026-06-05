# --- STAGE 1: BUILD THE APPLICATION ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency mappings
COPY package*.json ./

# Install all workspace dependencies
RUN npm ci || npm install

# Copy source configuration files
COPY . .

# Run production build (compiles the spa client and bundles server.ts)
RUN npm run build

# --- STAGE 2: PRODUCTION RUNTIME ---
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=7860

# Custom port configuration for Hugging Face Spaces compatibility
EXPOSE 7860

# Copy output bundles and core manifests from Builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install production dependencies only to minimize image size
RUN npm prune --production || npm install --omit=dev

# Start Express server hosting compiled React client side page
CMD ["npm", "run", "start"]