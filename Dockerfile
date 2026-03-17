# ===== Stage 1: Builder =====
FROM node:20-alpine AS builder
WORKDIR /app

# Copy only workspace files needed for building the apps
COPY package*.json nx.json ./
COPY apps/server ./apps/server
COPY apps/react-app ./apps/react-app
COPY libs/shared ./libs/shared

# Install dependencies needed to build backend + frontend
RUN npm ci

# Build frontend and backend
RUN npx nx build react-app
RUN npx nx build server

# ===== Stage 2: Production image =====
FROM node:20-alpine
WORKDIR /app

# Copy backend build
COPY --from=builder /app/apps/server/dist ./server

# Copy frontend build to backend folder where it will be served
COPY --from=builder /app/apps/react-app/dist ./server/react-app/dist

# Copy only backend package files
COPY apps/server/package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Expose port
EXPOSE 3000

# Start backend server
CMD ["node", "server/main.js"]