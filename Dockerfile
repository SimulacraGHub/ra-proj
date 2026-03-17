# ===== Stage 1: Builder =====
FROM node:20-alpine AS builder
WORKDIR /app

# Copy root-level config files first
COPY package*.json nx.json tsconfig.base.json ./

# Copy apps and libs
COPY server ./server
COPY react-app ./react-app
COPY libs ./libs

# Install dependencies
RUN npm ci

# Build frontend and backend
RUN npx nx build react-app
RUN npx nx build server

# ===== Stage 2: Production image =====
FROM node:20-alpine
WORKDIR /app

# Copy backend build
COPY --from=builder /app/server/dist ./server

# Copy frontend build
COPY --from=builder /app/react-app/dist ./server/react-app/dist

# Copy only backend package files
COPY server/package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Expose port
EXPOSE 3000

# Start backend server
CMD ["node", "server/main.js"]