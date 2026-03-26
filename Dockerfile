# ===== Stage 1: Builder =====
FROM node:20-alpine AS builder
WORKDIR /app

ENV VITE_API_URL=https://ra-proj-production.up.railway.app
ENV NX_NO_CLOUD=true

COPY package*.json nx.json tsconfig.base.json ./
COPY server ./server
COPY react-app ./react-app
COPY libs ./libs

RUN npm ci
RUN npx nx build react-app
RUN npx nx build server

# ===== Stage 2: Production =====
FROM node:20-alpine
WORKDIR /app

# 1. Copy backend build into /app/server/dist
# This puts main.js at /app/server/dist/main.js
COPY --from=builder /app/server/dist/. ./server/dist/

# 2. Copy frontend build into /app/react-app/dist
COPY --from=builder /app/react-app/dist/. ./react-app/dist/

# 3. Setup Backend Dependencies
COPY server/package*.json ./server/
RUN cd server && npm install --omit=dev

# 4. Environment
ENV NODE_ENV=production
EXPOSE 3000

# 5. Start the server
CMD ["sh", "-c", "node $(find server/dist -name main.js | head -n 1)"]