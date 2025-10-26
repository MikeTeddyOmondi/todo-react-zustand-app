# CI/CD Documentation

## Available Workflows

### 1. Standard CI (ci.yaml)
Runs tests, linting, and formatting checks, then deploys to Render using traditional Node.js build.

**Triggers:** Push to `master`, `feature/*` branches, and version tags (`v*.*.*`)

**Stages:**
- Test, Format and Lint
- Deploy to Staging (feature branches) → Render
- Deploy to Production (version tags) → Render

**Required Secrets:**
- `RENDER_STAGING_SERVICE_ID`
- `RENDER_PRODUCTION_SERVICE_ID`
- `RENDER_API_KEY`

---

### 2. Docker CI (docker-ci.yaml)
Runs tests, linting, and formatting checks, then builds and pushes Docker images to Docker Hub using the multi-stage `Dockerfile`.

**Triggers:** Push to `master`, `feature/*` branches, and version tags (`v*.*.*`)

**Stages:**
- Test, Format and Lint
- Build and Push Staging Docker Image (feature branches)
- Build and Push Production Docker Image (version tags)

**Features:**
- Uses multi-stage `Dockerfile` (build + nginx runtime)
- Separates build cache by environment (staging vs production)
- Supports semantic versioning for production tags
- Creates GitHub releases for production deployments

**Required Secrets:**
- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`
- `GITHUB_TOKEN` (auto-generated)

**Docker Image Naming:**
- Staging: `{DOCKER_USERNAME}/vite-app:feature-branch-name`, `{DOCKER_USERNAME}/vite-app:staging-{commit-sha}`
- Production: `{DOCKER_USERNAME}/vite-app:v1.0.0`, `{DOCKER_USERNAME}/vite-app:1.0`, `{DOCKER_USERNAME}/vite-app:{commit-sha}`

---

## Environment Variables

- `VITE_ENV=staging` - Set for staging builds
- `VITE_ENV=production` - Set for production builds

---

## Docker Build Reference

### Main Dockerfile (Multi-stage Build)

Used by **docker-ci.yaml** - Production ready, recommended for both staging and production.

**Stages:**
1. **Build Stage** - Node 18.13.0 Alpine
   - Copies source code
   - Installs dependencies
   - Builds the Vite app
   - Outputs to `/usr/app/dist`

2. **Runtime Stage** - Nginx 1.19.0 Alpine  
   - Lightweight runtime
   - Serves static files from `/usr/share/nginx/html`
   - Uses custom nginx config (`nginx/react.conf`)
   - No build artifacts in final image

**Benefits:**
- Small final image size (only nginx + built files)
- No source code or dependencies in production
- Optimized for container deployments

**Usage:**
```bash
docker build -t vite-app:latest .
docker run -p 80:3000 vite-app:latest
```

---

### Dockerfile.staging (Legacy)

**⚠️ Deprecated** - Use main `Dockerfile` instead. This file only copies pre-built dist folder.

**Limitations:**
- Requires pre-built `dist/` directory
- Cannot use in CI/CD pipeline directly
- Static copy without build process
- Only uses nginx runtime

---

## Setup Instructions

### Option 1: Use Standard CI (ci.yaml)

1. **Add Render Secrets** to GitHub repository:
   - `Settings → Secrets and variables → Actions → New repository secret`
   - Add:
     - `RENDER_STAGING_SERVICE_ID`
     - `RENDER_PRODUCTION_SERVICE_ID`
     - `RENDER_API_KEY`

2. **Trigger Deployment:**
   - Feature branches (feature/*) → Automatically deploy to staging
   - Version tags (v1.0.0) → Automatically deploy to production

---

### Option 2: Use Docker CI (docker-ci.yaml)

1. **Add Docker Secrets** to GitHub repository:
   - `Settings → Secrets and variables → Actions → New repository secret`
   - Add:
     - `DOCKER_USERNAME` - Your Docker Hub username
     - `DOCKER_PASSWORD` - Your Docker Hub access token or password

2. **Build Docker Image Locally** (optional):
   ```bash
   docker build -t vite-app:latest .
   docker run -p 80:3000 vite-app:latest
   ```

3. **Trigger Deployment:**
   - Feature branches (feature/*) → Build and push staging image
   - Version tags (v1.0.0) → Build and push production image + create GitHub release

---

## Branching Strategy

- **feature/** branches → Staging deployment with latest code
- **master** branch → Code merges, tests, and validation
- **Version tags** (v1.0.0) → Production deployment with releases

**Example workflow:**
```bash
# Create feature branch and push
git checkout -b feature/new-feature
git push origin feature/new-feature
# → docker-ci.yaml builds and pushes staging image

# Merge to master after review
git checkout master
git merge feature/new-feature
git push origin master

# Tag for production release
git tag v1.0.0
git push origin v1.0.0
# → docker-ci.yaml builds production image and creates release
```
