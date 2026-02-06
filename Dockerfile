# Multi-stage build for Next.js development

# Stage 1: Dependencies
FROM node:18-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Development
FROM node:18-alpine
WORKDIR /app

# Copy node_modules from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy package files
COPY package*.json ./

# Copy application source code
COPY . .

# Expose port 3000 for Next.js dev server
EXPOSE 3000

# Run Next.js in development mode
CMD ["npm", "run", "dev"]
