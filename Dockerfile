# ===== Stage 1: Builder =====
FROM node:20-alpine AS builder
WORKDIR /app

ENV VITE_API_URL=https://ra-proj-production.up.railway.app
ENV NX_NO_CLOUD=true

# Copy configs and source
COPY package*.json nx.json tsconfig.base.json ./
COPY server ./server
COPY react-app ./react-app
COPY libs ./libs

# Install ALL dependencies (including devDeps for build)
RUN npm ci

# Build
RUN npx nx build react-app
RUN npx nx build server

# ===== Stage 2: Production =====
FROM node:20-alpine
WORKDIR /app

# Install production dependencies for the server
COPY server/package*.json ./
RUN npm install --omit=dev

# find the directories inside /app/dist/
# This assumes the build output is somewhere inside /app/dist/
COPY --from=builder /app/dist/ ./dist-temp/

# Expose port
EXPOSE 3000

# shell command to find the main.js and run it
CMD find ./dist-temp -name "main.js" -exec node {} \;