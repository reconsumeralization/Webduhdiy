# WebduhVercel Bolt.DIY Dockerfile
FROM node:20-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    ca-certificates \
    curl \
    git \
    && rm -rf /var/cache/apk/*

# Create app directory and user
WORKDIR /app
RUN addgroup --system --gid 1001 boltuser
RUN adduser --system --uid 1001 boltuser

# Copy package files
COPY apps/bolt-diy/package*.json ./

# Install dependencies
RUN npm install && npm cache clean --force

# Copy application code
COPY --chown=boltuser:boltuser apps/bolt-diy/ .

# Build the application
RUN npm run build

# Create necessary directories
RUN mkdir -p /app/logs /app/.bolt /app/projects && \
    chown -R boltuser:boltuser /app/logs /app/.bolt /app/projects

# Switch to non-root user
USER boltuser

# Expose port
EXPOSE 5173

# Environment variables
ENV NODE_ENV=production
ENV PORT=5173
ENV VITE_LOG_LEVEL=info

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:5173 || exit 1

# Start the application
CMD ["npm", "run", "dockerstart"]
