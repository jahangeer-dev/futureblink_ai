# Use official Node.js Alpine base for smaller footprint
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy dependency files
COPY package*.json ./
COPY tsconfig*.json ./

# Install all dependencies (including dev)
RUN npm ci

# Copy raw source code
COPY . .

# Build the TypeScript output
RUN npm run build

# --- Production Image ---
FROM node:20-alpine AS production

WORKDIR /usr/src/app

# Set Node to production
ENV NODE_ENV=production

# Copy package info
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy compiled files from builder
COPY --from=builder /usr/src/app/dist ./dist

# Create a non-root user for security (AWS Best Practice)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Expose server port
EXPOSE 5000

# Start command
CMD ["node", "dist/server.js"]
