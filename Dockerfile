# ===== Stage 1: Builder =====
FROM node:20-alpine AS builder
WORKDIR /app

# Disable Nx Cloud for all builds inside Docker
ENV NX_SKIP_NX_CLOUD=true

# Copy only workspace files needed for building the apps
COPY package*.json nx.json ./
COPY server ./server
COPY react-app ./react-app
COPY libs ./libs

# Install all dependencies for building backend + frontend
RUN npm ci

# Build frontend and backend
RUN npx nx build react-app
RUN npx nx build server

# ===== Stage 2: Production image =====
FROM node:20-alpine
WORKDIR /app

# Copy backend build
COPY --from=builder /app/server/dist ./server

# Copy frontend build to backend folder where it will be served
COPY --from=builder /app/react-app/dist ./server/react-app/dist

# Copy only backend package files
COPY server/package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Expose port
EXPOSE 3000

# Start backend server
CMD ["node", "server/main.js"]