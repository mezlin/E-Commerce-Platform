# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Production stage
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Add non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Create app directory and set permissions
RUN mkdir -p /app/node_modules && \
    chown -R appuser:appgroup /app

# Copy package files
COPY --from=builder --chown=appuser:appgroup /app/package*.json ./

# Copy node_modules and source code
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app .

# Switch to non-root user
USER appuser

# Environment variables
ENV NODE_ENV=production

# Healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD node -e "fetch('http://localhost:4001/api/health').then(r => process.exit(r.ok ? 0 : 1))"

# Expose port
EXPOSE 4000

# Start command
CMD ["node", "server.js"]