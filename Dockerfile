# ===== Stage 1: Builder =====
FROM node:20-alpine AS builder
WORKDIR /app

ENV VITE_API_URL=https://ra-proj-production.up.railway.app
ENV NX_NO_CLOUD=true

# Copy root configs
COPY package*.json nx.json tsconfig.base.json ./

# Copy source code
COPY server ./server
COPY react-app ./react-app
COPY libs ./libs

# Install all dependencies
RUN npm ci

# Build both apps
RUN npx nx build react-app
RUN npx nx build server

# ===== Stage 2: Production =====
FROM node:20-alpine
WORKDIR /app

# 1. Copy backend build 
# (Based on server/package.json: outputPath is "server/dist")
COPY --from=builder /app/server/dist ./server/dist

# 2. Copy frontend build
# (Nx default for Vite is usually dist/react-app at the root)
COPY --from=builder /app/dist/react-app ./public

# 3. Setup Backend Dependencies
COPY server/package*.json ./server/
RUN cd server && npm install --omit=dev

# Expose port
EXPOSE 3000

# 4. Start Server
# Since bundle is false, the entry point is mirrored from src
CMD ["node", "server/dist/src/main.js"]