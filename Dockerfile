# ===== Stage 1: Builder =====
FROM node:20-alpine AS builder
WORKDIR /app

# Set VITE_API_URL for frontend build
ENV VITE_API_URL=https://ra-proj-production.up.railway.app

# Copy root-level config files first
COPY package*.json nx.json tsconfig.base.json ./

# Copy apps and libs
COPY server ./server
COPY react-app ./react-app
COPY libs ./libs

# Fix lockfile mismatch inside the container, then install dependencies
RUN npm install --package-lock-only && npm ci

# Build frontend and backend
RUN npx nx build react-app
RUN npx nx build server

# ===== Stage 2: Production image =====
FROM node:20-alpine
WORKDIR /app

# Copy only backend package files first
COPY server/package*.json ./server/

# Install production dependencies
RUN cd server && npm install --omit=dev

# Copy backend build AFTER dependencies
COPY --from=builder /app/server/dist/. ./server/

# Copy frontend build
COPY --from=builder /app/react-app/dist ./server/react-app/dist

# Expose port
EXPOSE 3000

# Start backend server
CMD ["node", "server/dist/main.js"]