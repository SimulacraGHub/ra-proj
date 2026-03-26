# ===== Stage 1: Builder =====
FROM node:20-alpine AS builder
WORKDIR /app

ENV VITE_API_URL=https://ra-proj-production.up.railway.app
ENV NX_NO_CLOUD=true

# Copy config and source
COPY package*.json nx.json tsconfig.base.json ./
COPY server ./server
COPY react-app ./react-app
COPY libs ./libs

# Install deps (including devDeps for the build)
RUN npm ci

# Build frontend and backend
RUN npx nx build react-app
RUN npx nx build server

# ===== Stage 2: Production =====
FROM node:20-alpine
WORKDIR /app

# Copy production dependencies for the server
COPY server/package*.json ./
RUN npm install --omit=dev

# 1. Copy backend build 
COPY --from=builder /app/dist/server ./

# 2. Copy frontend build into a subfolder the server can serve
COPY --from=builder /app/dist/react-app ./react-app-dist

# Expose port
EXPOSE 3000

# Start server from the root of /app since we copied content into ./
CMD ["node", "main.js"]