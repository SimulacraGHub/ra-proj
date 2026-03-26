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

COPY --from=builder /app/server/dist ./server/dist

# 2. Put frontend exactly in /app/react-app/dist
COPY --from=builder /app/react-app/dist ./react-app/dist

# 3. Setup Backend Dependencies
COPY server/package*.json ./server/
RUN cd server && npm install --omit=dev

EXPOSE 3000

# Start from the root so the relative paths match
CMD ["node", "server/dist/src/main.js"]