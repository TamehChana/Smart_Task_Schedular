# 🚀 Smart Task Scheduler - Deployment Guide

This guide covers deploying the Smart Task Scheduler React application to various platforms and environments.

## 📋 **Prerequisites**

### **System Requirements**
- Node.js 16+ and npm
- Git for version control
- Access to deployment platform
- Domain name (optional but recommended)

### **Environment Setup**
```bash
# Check Node.js version
node --version  # Should be 16.0.0 or higher

# Check npm version
npm --version   # Should be 8.0.0 or higher

# Install global dependencies
npm install -g serve
npm install -g pm2  # For production process management
```

## 🏗️ **Build Process**

### **1. Production Build**
```bash
# Install dependencies
npm install

# Create production build
npm run build

# Verify build output
ls -la build/
```

### **2. Build Optimization**
```bash
# Analyze bundle size
npm install -g source-map-explorer
npm run build
npx source-map-explorer 'build/static/js/*.js'

# Environment-specific builds
REACT_APP_ENVIRONMENT=production npm run build
```

### **3. Build Configuration**
```javascript
// package.json
{
  "scripts": {
    "build": "react-scripts build",
    "build:prod": "GENERATE_SOURCEMAP=false react-scripts build",
    "build:analyze": "npm run build && npx serve -s build"
  }
}
```

## 🌐 **Deployment Options**

### **Option 1: Netlify (Recommended for Static Sites)**

#### **Setup Steps**
1. **Connect Repository**
   ```bash
   # Push your code to GitHub
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Netlify Dashboard**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Select the main branch

3. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: build
   ```

4. **Environment Variables**
   ```
   REACT_APP_ENVIRONMENT=production
   REACT_APP_VERSION=1.0.0
   ```

5. **Custom Domain (Optional)**
   - Add your domain in Netlify dashboard
   - Update DNS records
   - Enable HTTPS

#### **Netlify Configuration File**
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "build"

[build.environment]
  NODE_VERSION = "16"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
```

### **Option 2: Vercel (Great for React Apps)**

#### **Setup Steps**
1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   # Login to Vercel
   vercel login

   # Deploy
   vercel

   # Follow prompts:
   # - Set up and deploy: Yes
   # - Which scope: Select your account
   # - Link to existing project: No
   # - Project name: smart-task-scheduler
   # - Directory: ./
   # - Override settings: No
   ```

3. **Vercel Configuration**
   ```json
   // vercel.json
   {
     "version": 2,
     "builds": [
       {
         "src": "package.json",
         "use": "@vercel/static-build",
         "config": {
           "distDir": "build"
         }
       }
     ],
     "routes": [
       {
         "src": "/static/(.*)",
         "dest": "/static/$1"
       },
       {
         "src": "/favicon.ico",
         "dest": "/favicon.ico"
       },
       {
         "src": "/manifest.json",
         "dest": "/manifest.json"
       },
       {
         "src": "/(.*)",
         "dest": "/index.html"
       }
     ]
   }
   ```

### **Option 3: GitHub Pages**

#### **Setup Steps**
1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   ```json
   {
     "homepage": "https://yourusername.github.io/repository-name",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

4. **Enable GitHub Pages**
   - Go to repository Settings
   - Navigate to Pages section
   - Select gh-pages branch as source

### **Option 4: AWS S3 + CloudFront**

#### **Setup Steps**
1. **Install AWS CLI**
   ```bash
   # Install AWS CLI
   aws configure
   ```

2. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://your-app-name
   aws s3 website s3://your-app-name --index-document index.html --error-document index.html
   ```

3. **Upload Build Files**
   ```bash
   aws s3 sync build/ s3://your-app-name
   ```

4. **Set Bucket Policy**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::your-app-name/*"
       }
     ]
   }
   ```

5. **Configure CloudFront (Optional)**
   - Create CloudFront distribution
   - Set S3 bucket as origin
   - Configure custom domain and SSL

### **Option 5: Docker Deployment**

#### **Dockerfile**
```dockerfile
# Multi-stage build
FROM node:16-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### **Nginx Configuration**
```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location /static/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

#### **Docker Commands**
```bash
# Build image
docker build -t smart-task-scheduler .

# Run container
docker run -p 80:80 smart-task-scheduler

# Docker Compose
docker-compose up -d
```

## 🔧 **Environment Configuration**

### **Environment Variables**
```bash
# .env.production
REACT_APP_ENVIRONMENT=production
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_VERSION=1.0.0
REACT_APP_ANALYTICS_ID=UA-XXXXXXXXX-X
```

### **Build-time Variables**
```bash
# Set during build
REACT_APP_BUILD_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ") npm run build
```

## 📱 **PWA Configuration**

### **Service Worker Setup**
```javascript
// src/serviceWorker.js
export function register(config) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
      registerValidSW(swUrl, config);
    });
  }
}
```

### **Manifest Configuration**
```json
// public/manifest.json
{
  "short_name": "TaskFlow",
  "name": "Smart Task Scheduler",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#3b82f6",
  "background_color": "#ffffff"
}
```

## 🚀 **CI/CD Pipeline**

### **GitHub Actions**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '16'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
      env:
        REACT_APP_ENVIRONMENT: production
    
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v1.2
      with:
        publish-dir: './build'
        production-branch: main
        github-token: ${{ secrets.GITHUB_TOKEN }}
        deploy-message: "Deploy from GitHub Actions"
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

### **GitLab CI**
```yaml
# .gitlab-ci.yml
stages:
  - build
  - deploy

build:
  stage: build
  image: node:16
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - build/
    expire_in: 1 hour

deploy:
  stage: deploy
  image: alpine:latest
  script:
    - apk add --no-cache curl
    - curl -X POST -H "Content-Type: application/zip" -H "Authorization: Bearer $NETLIFY_TOKEN" --data-binary "@build.zip" "https://api.netlify.com/api/v1/sites/$NETLIFY_SITE_ID/deploys"
  only:
    - main
```

## 🔒 **Security Configuration**

### **Security Headers**
```javascript
// Add to your server configuration
{
  "headers": {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  }
}
```

### **HTTPS Configuration**
- Enable HTTPS on your hosting platform
- Redirect HTTP to HTTPS
- Use HSTS headers
- Configure SSL certificates

## 📊 **Monitoring & Analytics**

### **Performance Monitoring**
```javascript
// Add to your app
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to your analytics service
  console.log(metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### **Error Tracking**
```javascript
// Add error boundary and logging
window.addEventListener('error', (event) => {
  // Send to error tracking service
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  // Handle unhandled promise rejections
  console.error('Unhandled rejection:', event.reason);
});
```

## 🔄 **Deployment Checklist**

### **Pre-Deployment**
- [ ] All tests passing
- [ ] Build successful
- [ ] Environment variables configured
- [ ] Security headers configured
- [ ] PWA assets ready
- [ ] Analytics configured

### **Post-Deployment**
- [ ] Application loads correctly
- [ ] All routes working
- [ ] PWA installable
- [ ] Performance metrics acceptable
- [ ] Error monitoring active
- [ ] Backup strategy in place

## 🚨 **Troubleshooting**

### **Common Issues**

**Build Fails**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Routing Issues**
- Ensure SPA routing is configured
- Check server configuration for fallback routes
- Verify build output structure

**Performance Issues**
- Analyze bundle size
- Enable gzip compression
- Use CDN for static assets
- Implement lazy loading

### **Debug Commands**
```bash
# Check build size
npx serve -s build
npx source-map-explorer 'build/static/js/*.js'

# Test production build locally
npm run build
npx serve -s build -l 3000
```

## 📚 **Additional Resources**

### **Deployment Platforms**
- [Netlify Documentation](https://docs.netlify.com/)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Pages](https://pages.github.com/)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)

### **Performance Tools**
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)
- [PageSpeed Insights](https://pagespeed.web.dev/)

---

**Happy Deploying! 🚀**

*For deployment issues, check the troubleshooting section or create an issue in the repository.*
