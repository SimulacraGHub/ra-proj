# ==== Stage 1: Builder ====
FROM node:20-alpine AS builder
WORKDIR /app

# Copy all source files
COPY . .

# Install all dependencies (dev + prod) for Nx build
RUN npm ci

# Build frontend and backend
RUN npx nx build react-app
RUN npx nx build server

# ==== Stage 2: Production image ====
FROM node:20-alpine
WORKDIR /app

# Copy backend build
COPY --from=builder /app/server/dist ./server

# Copy frontend build to backend folder where it will be served
COPY --from=builder /app/react-app/dist ./server/react-app/dist

# Copy package files and install only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Ensure dotenv is available for environment variables
RUN npm install dotenv

# Expose port
EXPOSE 3000

# Start backend server
CMD ["node", "server/main.js"]