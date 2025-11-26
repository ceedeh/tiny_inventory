# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for building)
RUN npm ci

# Copy source code
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Set environment to development
ENV NODE_ENV=development

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for development mode)
RUN npm ci

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Copy source files for dev tools (drizzle-kit, tsx)
COPY tsconfig.json ./
COPY drizzle.config.ts ./
COPY src ./src

EXPOSE 3000

# Use node to run the built application
CMD ["node", "dist/index.js"]
