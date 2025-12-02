# =============================================================================
# Stage 1: Build Stage - Using Bun
# =============================================================================
FROM oven/bun:1.3-alpine AS builder

# Set working directory
WORKDIR /app

# Install build dependencies (for native modules if needed)
RUN apk add --no-cache git

# Copy package files
COPY package.json ./
COPY bun.lock* ./

# Install dependencies
# --frozen-lockfile ensures reproducible builds (if lockfile exists)
# Installs all dependencies including devDependencies (omit --production flag)
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build arguments for environment variables
ARG VITE_API_URL
ARG VITE_APP_ENV=production

# Set environment variables for build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_APP_ENV=$VITE_APP_ENV
ENV NODE_ENV=production

# Build the application
RUN bun run build

# =============================================================================
# Stage 2: Production Stage - Using NGINX
# =============================================================================
FROM nginx:1.27-alpine AS production

# Install curl for healthchecks
RUN apk add --no-cache curl

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Verify files were copied (for debugging)
RUN ls -la /usr/share/nginx/html && \
    echo "Files copied successfully" && \
    test -f /usr/share/nginx/html/index.html || (echo "ERROR: index.html not found!" && exit 1)

# Test NGINX configuration
RUN nginx -t

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

