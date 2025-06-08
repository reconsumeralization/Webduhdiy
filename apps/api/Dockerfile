# WebduhVercel API Dockerfile
FROM node:20-alpine AS base

# Install dependencies and security updates
RUN apk add --no-cache \
    ca-certificates \
    curl \
    && rm -rf /var/cache/apk/*

# Create app directory and user
WORKDIR /app
RUN addgroup --system --gid 1001 apiuser
RUN adduser --system --uid 1001 apiuser

# Copy package files
COPY apps/api/package*.json ./

# Install dependencies
RUN npm install --only=production && npm cache clean --force

# Copy application code
COPY --chown=apiuser:apiuser apps/api/ .

# Create necessary directories
RUN mkdir -p /app/logs /app/uploads /app/temp && \
    chown -R apiuser:apiuser /app/logs /app/uploads /app/temp

# Switch to non-root user
USER apiuser

# Expose port
EXPOSE 3001

# Environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Start the application
CMD ["node", "src/index.js"] 