# 🐳 Docker Quick Start

## Files Created

✅ **Dockerfile** - Multi-stage production build (Bun → NGINX)  
✅ **docker-compose.yml** - Orchestrates dev and prod services  
✅ **nginx.conf** - NGINX config optimized for SPAs  
✅ **.dockerignore** - Excludes unnecessary files  
✅ **env.docker.example** - Environment variables template  
✅ **DOCKER.md** - Complete documentation  
✅ **.github/workflows/docker-build.yml** - CI/CD workflow  

---

## 🚀 Get Started in 3 Steps

### 1️⃣ Setup Environment

```bash
cp env.docker.example .env
```

### 2️⃣ Run Development (Hot Reload)

```bash
docker-compose up dev
```

Access at: **http://localhost:3000**

### 3️⃣ Run Production (NGINX)

```bash
docker-compose up -d prod
```

Access at: **http://localhost:8080**

---

## 📝 Common Commands

```bash
# Development
docker-compose up dev              # Start dev server
docker-compose logs -f dev         # View logs
docker-compose stop dev            # Stop server

# Production
docker-compose build prod          # Build image
docker-compose up -d prod          # Start production
docker-compose logs -f prod        # View logs
docker-compose down                # Stop all

# Cleanup
docker-compose down -v             # Remove containers + volumes
docker system prune -a             # Clean all unused Docker data
```

---

## 🔧 Configuration

Edit `.env` to customize:

```bash
DEV_PORT=3000                      # Dev server port
PROD_PORT=8080                     # Production port
VITE_API_URL=http://127.0.0.1:8000/api/admin/  # Dev API URL
# VITE_API_URL=https://azeelapp.com/api/admin/ # Prod API URL
```

---

## 📚 Full Documentation

See **DOCKER.md** for:
- Advanced usage
- Troubleshooting
- Deployment strategies
- Security best practices
- CI/CD pipeline details

---

## 🎯 What's Included

### Development Mode
- ✅ Hot Module Replacement
- ✅ Source code mounted
- ✅ Fast with Bun
- ✅ Port 3000

### Production Mode
- ✅ Optimized build
- ✅ NGINX serving
- ✅ Gzip compression
- ✅ Security headers
- ✅ Small image (~50-80MB)
- ✅ Health checks
- ✅ Port 8080

### CI/CD (GitHub Actions)
- ✅ Automated builds
- ✅ Multi-platform (amd64, arm64)
- ✅ Security scanning
- ✅ Push to registry
- ✅ Optional deployment

---

## ✅ Verification

Check if everything works:

```bash
# 1. Start dev mode
docker-compose up -d dev

# 2. Wait 30 seconds, then test
curl http://localhost:3000

# 3. Check health
docker-compose ps

# 4. Build and test production
docker-compose build prod
docker-compose up -d prod
curl http://localhost:8080/health

# Expected: "healthy"
```

---

## 🆘 Quick Troubleshooting

**Port in use?**
```bash
lsof -i :3000
# Change DEV_PORT in .env
```

**Build failing?**
```bash
docker-compose build --no-cache prod
```

**Need clean start?**
```bash
docker-compose down -v
docker system prune -a
```

---

**Need help?** Check **DOCKER.md** for detailed troubleshooting! 🚀

