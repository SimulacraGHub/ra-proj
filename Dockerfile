# ===== Stage 1: Builder =====
FROM node:20-alpine AS builder
WORKDIR /app

# Set frontend env
ENV VITE_API_URL=https://ra-proj-production.up.railway.app
ENV NX_NO_CLOUD=true

# Copy root-level config files
COPY package*.json nx.json tsconfig.base.json ./

# Copy source code
COPY server ./server
COPY react-app ./react-app
COPY libs ./libs

# Install deps
RUN npm ci

# Build frontend and backend
RUN npx nx build react-app
RUN npx nx build server

RUN ls -R /app/dist

# ===== Stage 2: Production =====
FROM node:20-alpine
WORKDIR /app

# Copy backend package files and install production deps
COPY server/package*.json ./
RUN npm install --omit=dev

# 1. Copy backend build
COPY --from=builder /app/dist/apps/server/. ./

# 2. Copy frontend build
COPY --from=builder /app/dist/apps/react-app ./public

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "main.js"]