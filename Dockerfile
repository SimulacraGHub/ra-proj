# ===== Stage 1: Builder =====
FROM node:20-alpine AS builder
WORKDIR /app

# Set frontend env
ENV VITE_API_URL=https://ra-proj-production.up.railway.app
ENV NX_NO_CLOUD=true

# Copy root-level config files
COPY package*.json nx.json tsconfig.base.json ./

# Copy backend, frontend, libs
COPY server ./server
COPY react-app ./react-app
COPY libs ./libs

# Install deps
RUN npm install --package-lock-only && npm ci

# Build frontend and backend
RUN npx nx build react-app
RUN npx nx build server

# ===== Stage 2: Production =====
FROM node:20-alpine
WORKDIR /app

# Copy backend package files and install production deps
COPY server/package*.json ./server/
RUN cd server && npm install --omit=dev

# Copy backend build (flat structure)
COPY --from=builder /app/server/dist/. ./server/

# Copy frontend build
COPY --from=builder /app/react-app/dist ./server/react-app/dist

# Expose port
EXPOSE 3000

# Start server (matches copied path)
CMD ["node", "server/main.js"]