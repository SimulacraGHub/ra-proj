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

# Install all dependencies
RUN npm ci

# Force explicit output paths so we know exactly where the files are
RUN npx nx build react-app --outputPath=dist/react-app
RUN npx nx build server --outputPath=dist/server

# ===== Stage 2: Production =====
FROM node:20-alpine
WORKDIR /app

# Copy production dependencies for the server
COPY server/package*.json ./
RUN npm install --omit=dev

# 1. Copy backend build (Now we know exactly where it is)
COPY --from=builder /app/dist/server/. ./

# 2. Copy frontend build into a 'public' folder for the server to serve
COPY --from=builder /app/dist/react-app ./public

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "main.js"]