# 🐳 Docker Setup Guide for Azeel Dashboard

This guide explains how to run the Azeel Dashboard React application using Docker for both development and production environments.

## 📋 Prerequisites

- Docker Engine 20.10+ ([Install Docker](https://docs.docker.com/get-docker/))
- Docker Compose 2.0+ (included with Docker Desktop)
- (Optional) Bun 1.3+ for local development

## 📁 Docker Files Overview

- **`Dockerfile`**: Multi-stage production build (Bun → NGINX)
- **`docker-compose.yml`**: Orchestrates dev and prod services
- **`nginx.conf`**: NGINX configuration optimized for SPAs
- **`.dockerignore`**: Excludes unnecessary files from Docker context
- **`env.docker.example`**: Example environment configuration

---

## 🚀 Quick Start

### 1. Setup Environment Variables

Copy the example environment file:

```bash
cp env.docker.example .env
```

Edit `.env` and configure your environment variables:

```bash
# Development
DEV_PORT=3000
PROD_PORT=8080
VITE_API_URL=http://localhost:8000/api
```

### 2. Development Mode (with Hot Reload)

Run the development server with live code reloading:

```bash
# Start development container
docker-compose up dev

# Or run in detached mode (background)
docker-compose up -d dev
```

The app will be available at: **http://localhost:3000**

#### Development Features:
- ✅ Hot Module Replacement (HMR)
- ✅ Source code mounted as volume
- ✅ Changes reflect immediately
- ✅ Uses Bun for fast package management

#### Useful Development Commands:

```bash
# View logs
docker-compose logs -f dev

# Stop the container
docker-compose stop dev

# Restart the container
docker-compose restart dev

# Remove the container
docker-compose down dev
```

### 3. Production Mode (NGINX + Optimized Build)

Build and run the production-optimized container:

```bash
# Build the production image
docker-compose build prod

# Start production container
docker-compose up -d prod
```

The app will be available at: **http://localhost:8080**

#### Production Features:
- ✅ Multi-stage build for minimal image size
- ✅ NGINX serving static assets
- ✅ Gzip compression enabled
- ✅ Security headers configured
- ✅ Long-term caching for assets
- ✅ Health check endpoint at `/health`

---

## 🔧 Configuration

### Customizing Ports

Edit `.env` to change default ports:

```bash
DEV_PORT=3001    # Change dev server port
PROD_PORT=8081   # Change production server port
```

### Environment Variables at Build Time

Pass build arguments when building the production image:

```bash
docker-compose build prod \
  --build-arg VITE_API_URL=https://azeelapp.com/api/admin/ \
  --build-arg VITE_APP_ENV=production
```

### Customizing NGINX Configuration

Edit `nginx.conf` to modify:
- Cache duration
- Security headers
- Compression settings
- Client max body size

---

## 📦 Docker Commands Reference

### Building Images

```bash
# Build production image
docker-compose build prod

# Build with no cache (fresh build)
docker-compose build --no-cache prod

# Build with specific build args
docker build -t azeel-dashboard \
  --build-arg VITE_API_URL=https://api.azeel.com/api \
  .
```

### Running Containers

```bash
# Start services
docker-compose up dev        # Development
docker-compose up prod       # Production
docker-compose up -d prod    # Production (detached)

# Start all services
docker-compose up

# Start specific service with logs
docker-compose up dev --no-deps
```

### Managing Containers

```bash
# List running containers
docker-compose ps

# View logs
docker-compose logs -f dev
docker-compose logs -f prod

# Execute commands in running container
docker-compose exec dev sh
docker-compose exec prod sh

# Stop containers
docker-compose stop

# Remove containers
docker-compose down

# Remove containers and volumes
docker-compose down -v

# Remove containers, volumes, and images
docker-compose down -v --rmi all
```

### Inspecting and Debugging

```bash
# Check container health
docker-compose ps

# Inspect container
docker inspect azeel-dashboard-prod

# View resource usage
docker stats azeel-dashboard-prod

# Access container shell
docker-compose exec prod sh

# Test health endpoint
curl http://localhost:8080/health
```

---

## 🏗️ Advanced Usage

### Running Production Build Locally (without Docker Compose)

```bash
# Build the image
docker build -t azeel-dashboard:latest \
  --build-arg VITE_API_URL=https://azeelapp.com/api/admin/ \
  .

# Run the container
docker run -d \
  --name azeel-dashboard \
  -p 8080:80 \
  --restart unless-stopped \
  azeel-dashboard:latest

# Check logs
docker logs -f azeel-dashboard

# Stop and remove
docker stop azeel-dashboard
docker rm azeel-dashboard
```

### Multi-Environment Setup

Create environment-specific compose files:

**docker-compose.staging.yml**:
```yaml
version: '3.9'
services:
  prod:
    build:
      args:
        VITE_API_URL: https://api.staging.azeel.com/api
    ports:
      - "8081:80"
```

Run with:
```bash
docker-compose -f docker-compose.yml -f docker-compose.staging.yml up prod
```

---

## 🔍 Troubleshooting

### Port Already in Use

```bash
# Check what's using the port
lsof -i :3000
lsof -i :8080

# Kill the process or change port in .env
```

### Permission Issues (Linux)

```bash
# Add your user to docker group
sudo usermod -aG docker $USER

# Log out and back in, then test
docker ps
```

### Build Failures

```bash
# Clean Docker cache
docker system prune -a

# Rebuild with no cache
docker-compose build --no-cache prod
```

### Container Won't Start

```bash
# Check logs
docker-compose logs prod

# Check container status
docker-compose ps

# Inspect container
docker inspect azeel-dashboard-prod
```

### Hot Reload Not Working in Dev

```bash
# Ensure code is mounted correctly
docker-compose down -v
docker-compose up dev

# Check if node_modules volume exists
docker volume ls | grep node_modules
```

---

## 🚢 Deployment

### Pushing to Docker Registry

```bash
# Tag image
docker tag azeel-dashboard:latest your-registry/azeel-dashboard:latest
docker tag azeel-dashboard:latest your-registry/azeel-dashboard:v1.0.0

# Push to registry
docker push your-registry/azeel-dashboard:latest
docker push your-registry/azeel-dashboard:v1.0.0
```

### Using with CI/CD

See `.github/workflows/docker-build.yml` for a complete GitHub Actions example.

**Key steps:**
1. Build the Docker image
2. Run tests (if applicable)
3. Tag with version/commit SHA
4. Push to registry (Docker Hub, ECR, GCR, etc.)
5. Deploy to your infrastructure

---

## 🛡️ Security Best Practices

✅ **Implemented in this setup:**
- Multi-stage builds (smaller attack surface)
- Non-root user in production container
- Security headers in NGINX
- No secrets in Dockerfile
- `.dockerignore` to exclude sensitive files
- Health checks for container monitoring

❗ **Additional recommendations:**
- Use Docker secrets for sensitive data
- Scan images for vulnerabilities: `docker scan azeel-dashboard:latest`
- Keep base images updated
- Use specific image versions (not `latest`)
- Implement rate limiting in NGINX
- Use HTTPS in production with reverse proxy

---

## 📊 Image Size Optimization

This setup uses several optimization techniques:

- **Multi-stage build**: Only production artifacts in final image
- **Alpine Linux**: Minimal base image (~5MB)
- **Bun**: Faster than npm/yarn
- **Tree-shaking**: Vite removes unused code
- **Gzip compression**: Reduces transfer size

**Typical image sizes:**
- Builder stage: ~800MB (temporary)
- Final production image: ~50-80MB

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [NGINX Documentation](https://nginx.org/en/docs/)
- [Bun Documentation](https://bun.sh/docs)
- [Vite Documentation](https://vitejs.dev/)

---

## 🆘 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review container logs: `docker-compose logs`
3. Verify environment variables in `.env`
4. Ensure Docker is running and up to date
5. Check Docker disk space: `docker system df`

---

## 📝 Notes

- Development mode mounts source code, so changes are reflected immediately
- Production build embeds environment variables at build time
- NGINX serves on port 80 inside container, mapped to 8080 on host
- Health checks ensure container is running correctly
- Volumes persist between container restarts

---

**Happy Dockerizing! 🐳**

