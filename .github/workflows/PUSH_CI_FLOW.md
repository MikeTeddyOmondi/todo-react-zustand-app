# What Happens When You Push to GitHub

## Overview
When you push code to GitHub, **two CI/CD workflows can run in parallel**:
- `ci.yaml` - Standard Node.js build and Render deployment
- `docker-ci.yaml` - Docker build and Docker Hub push

Both workflows are independent and won't interfere with each other.

---

## Scenario 1: Push to `feature/*` Branch

### Command:
```bash
git push origin feature/my-new-feature
```

### What Triggers:
✅ Both `ci.yaml` and `docker-ci.yaml` start automatically

### Timeline:

#### Workflow: `ci.yaml` (Render Deployment)
```
1. test_format_and_lint (5-10 minutes)
   ├─ Checkout code
   ├─ Setup Node.js 20
   ├─ Install dependencies (npm ci)
   ├─ Run: npm run lint
   ├─ Run: npm run format:check
   ├─ Run: npm run test
   └─ Run: npm run build
   
2. deploy_staging (5-10 minutes) [Only runs if step 1 passes]
   ├─ Setup Node.js 20
   ├─ Install dependencies
   ├─ Build with VITE_ENV=staging
   └─ Deploy to Render staging environment
   
✅ Status: Posted to GitHub Actions tab
📧 Optional: Email notification if you subscribed
```

#### Workflow: `docker-ci.yaml` (Docker Hub Push)
```
1. test_format_and_lint (5-10 minutes) [Same as above]
   
2. build_and_push_staging (3-5 minutes) [Only runs if step 1 passes]
   ├─ Setup Docker Buildx
   ├─ Login to Docker Hub
   ├─ Build image using main Dockerfile
   ├─ Tag: feature-my-new-feature
   ├─ Tag: staging-{commit-sha}
   └─ Push to Docker Hub
   
✅ Image available at: docker.io/{username}/vite-app:feature-my-new-feature
```

### Result:
- ✅ Code quality checks pass
- ✅ App deployed to Render staging
- ✅ Docker image pushed to Docker Hub
- 🟡 Both run in parallel (same tests run twice, but different build outputs)

---

## Scenario 2: Push to `master` Branch

### Command:
```bash
git push origin master
```

### What Triggers:
✅ Only `test_format_and_lint` from both workflows

### Timeline:

#### Workflow: `ci.yaml`
```
1. test_format_and_lint (5-10 minutes)
   ├─ Checkout code
   ├─ Setup Node.js 20
   ├─ Install dependencies
   ├─ Run: npm run lint
   ├─ Run: npm run format:check
   ├─ Run: npm run test
   └─ Run: npm run build
   
❌ deploy_staging: Skipped (not a feature/* branch)

Result: Tests pass, no deployment
```

#### Workflow: `docker-ci.yaml`
```
1. test_format_and_lint (5-10 minutes)
   
❌ build_and_push_staging: Skipped (not a feature/* branch)

Result: Tests pass, no image pushed
```

### Result:
- ✅ Code quality checks pass
- ❌ No deployment (master is for integration, not direct deployment)
- ❌ No Docker image pushed
- 📝 Merge commits to master should be from approved PRs

---

## Scenario 3: Push Version Tag

### Command:
```bash
git tag v1.0.0
git push origin v1.0.0
```

### What Triggers:
✅ Both `ci.yaml` and `docker-ci.yaml` production workflows

### Timeline:

#### Workflow: `ci.yaml` (Render Production)
```
1. test_format_and_lint (5-10 minutes)
   ├─ All checks as before
   
2. deploy_production (5-10 minutes) [Only runs if step 1 passes]
   ├─ Setup Node.js 20
   ├─ Build with VITE_ENV=production
   └─ Deploy to Render production environment
   
3. Create GitHub Release
   ├─ Create release "Release v1.0.0"
   ├─ Link to commit
   └─ Available in Releases tab

✅ Deployed to: Production Render service
```

#### Workflow: `docker-ci.yaml` (Docker Hub Production)
```
1. test_format_and_lint (5-10 minutes)
   
2. build_and_push_production (3-5 minutes) [Only runs if step 1 passes]
   ├─ Setup Docker Buildx
   ├─ Login to Docker Hub
   ├─ Build image using main Dockerfile
   ├─ Tag: v1.0.0
   ├─ Tag: 1.0
   ├─ Tag: {commit-sha}
   └─ Push all tags to Docker Hub
   
3. Create GitHub Release
   ├─ Create release "Release v1.0.0"
   └─ Available in Releases tab

✅ Images available at:
   - docker.io/{username}/vite-app:v1.0.0
   - docker.io/{username}/vite-app:1.0
   - docker.io/{username}/vite-app:{commit-sha}
```

### Result:
- ✅ Code quality checks pass
- ✅ App deployed to Render production
- ✅ Docker images pushed to Docker Hub
- ✅ GitHub Release created
- 🎉 Production ready!

---

## Scenario 4: Pull Request to Master

### Command:
```bash
git push origin feature/my-feature
# Then open PR on GitHub
```

### What Triggers:
✅ Both `ci.yaml` and `docker-ci.yaml` test jobs

### Timeline:

```
1. test_format_and_lint runs for BOTH workflows
   ├─ Checkout PR code
   ├─ npm run lint
   ├─ npm run format:check
   ├─ npm run test
   └─ npm run build
   
2. Check results in PR
   ├─ ✅ All checks pass → Green checkmark
   ├─ ❌ Any check fails → Red X
   └─ View details by clicking workflow name

3. Deployment jobs are SKIPPED
   ❌ No staging deployment for PRs
   ❌ No Docker image pushed
```

### Result:
- ✅ Code quality verified
- ✅ Safe to merge when all checks pass
- ❌ No deployment (deployment only on merge to master or tag)

---

## Decision Tree: When Do Deployments Happen?

```
┌─ git push origin feature/my-feature ──→ Staging Deployment ✅
│
├─ git push origin master ──→ Tests Only, No Deployment ❌
│
├─ git push origin v1.0.0 ──→ Production Deployment ✅
│
└─ PR to master ──→ Tests Only, No Deployment ❌
```

---

## Monitoring CI/CD Status

### In GitHub:
1. Go to **Actions** tab
2. See both workflows running in parallel
3. Click workflow name for detailed logs
4. Each job shows: ✅ Passed, ❌ Failed, or ⏳ Running

### In Render (ci.yaml):
- Go to Render dashboard
- View staging or production deployments
- Check logs and health status

### In Docker Hub (docker-ci.yaml):
- Go to Docker Hub repository
- View `Tags` section
- See `feature-*` (staging) and `v*.*.*` (production) tags
- Check image size, creation date, scan results

---

## Potential Issues & Troubleshooting

### Issue: Tests fail, deployment blocked
```
Solution: Fix the failing test/lint/format issue locally
- git add .
- npm run lint:fix
- npm run format
- git push origin feature/...
```

### Issue: Deployment failed but tests passed
```
Check in GitHub Actions:
1. Find the failed job
2. Scroll to error message
3. Common causes:
   - Missing secrets (RENDER_API_KEY, DOCKER_PASSWORD)
   - Service not running
   - Incorrect service ID
```

### Issue: Both workflows running but I only want one
```
Solution: Disable one workflow in GitHub:
1. Go to Actions tab
2. Click workflow name
3. Click "..." menu
4. Select "Disable workflow"

Or delete the workflow file:
- rm .github/workflows/docker-ci.yaml  (to keep only Render)
- rm .github/workflows/ci.yaml  (to keep only Docker)
```

---

## Summary Table

| Push Destination | ci.yaml | docker-ci.yaml | Result |
|---|---|---|---|
| `feature/*` | Tests ✅ + Deploy | Tests ✅ + Build | Staging deployed |
| `master` | Tests ✅ | Tests ✅ | No deployment |
| `v*.*.*` tag | Tests ✅ + Deploy | Tests ✅ + Build | Prod deployed |
| PR → master | Tests ✅ | Tests ✅ | No deployment |

---

## Next Steps

1. **Setup Secrets** (choose based on workflow):
   - For `ci.yaml`: Add Render secrets to GitHub
   - For `docker-ci.yaml`: Add Docker secrets to GitHub

2. **Test a feature branch**:
   ```bash
   git checkout -b feature/test-ci
   echo "# Test" >> README.md
   git push origin feature/test-ci
   # Watch Actions tab for results
   ```

3. **Monitor the workflow** in GitHub Actions tab

4. **Verify deployment**:
   - Check Render dashboard or Docker Hub
   - Confirm app is running
