# 🚀 Guía de Deployment y Producción

*Todo lo que necesitas saber para desplegar Ciderbrew en producción*

## 🎯 Overview de Deployment

Ciderbrew es una **Single Page Application (SPA)** construida con Vite que genera archivos estáticos. Esto significa que puede desplegarse en cualquier servicio de hosting estático.

### Opciones de Hosting Recomendadas

#### 🏆 **Tier 1: Gratuitos y Excelentes**
- **Netlify** - Deploy automático desde Git, CDN global
- **Vercel** - Optimizado para React, preview deploys
- **GitHub Pages** - Integrado con repositorio, gratis para proyectos públicos

#### 🥈 **Tier 2: Más Control**
- **AWS S3 + CloudFront** - Máximo control, escalable
- **Google Cloud Storage** - Integración con otros servicios de Google
- **Azure Static Web Apps** - Integración con Azure DevOps

#### 🥉 **Tier 3: Servidores Tradicionales**
- **DigitalOcean** - VPS con Nginx
- **Heroku** - Platform as a Service
- **Railway** - Moderno PaaS

## 📦 Build de Producción

### Comando de Build

```bash
# Generar build optimizado
npm run build

# El resultado estará en dist/
ls dist/
# index.html
# assets/
#   ├── index-[hash].js
#   ├── index-[hash].css
#   └── [otros assets]
```

### Configuración de Build

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',                    // Directorio de salida
    assetsDir: 'assets',               // Subdirectorio para assets
    sourcemap: false,                  // No source maps en producción
    minify: 'terser',                  // Minificación agresiva
    target: 'es2015',                  // Compatibilidad con navegadores
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar vendor bundle
          vendor: ['react', 'react-dom'],
          utils: ['./src/utils'],
        },
        // Nombres de archivos con hash para cache busting
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Configuración de terser para minificación
    terserOptions: {
      compress: {
        drop_console: true,            // Remover console.logs
        drop_debugger: true            // Remover debuggers
      }
    }
  }
})
```

### Variables de Entorno de Producción

```bash
# .env.production
VITE_API_BASE_URL=https://api.ciderbrew.app
VITE_HOMEBREW_API=https://formulae.brew.sh/api
VITE_ANALYTICS_ID=GA_MEASUREMENT_ID
VITE_SENTRY_DSN=https://your-sentry-dsn
VITE_APP_VERSION=2.1.0
```

## 🌐 Deployment con Netlify

### Setup Automático

1. **Conectar Repositorio**
   ```bash
   # En Netlify Dashboard
   # New site from Git → GitHub → Seleccionar repo
   ```

2. **Configuración de Build**
   ```yaml
   # netlify.toml
   [build]
     command = "npm run build"
     publish = "dist"
     
   [build.environment]
     NODE_VERSION = "18"
     NPM_VERSION = "8"

   # Headers para optimización
   [[headers]]
     for = "/*"
     [headers.values]
       X-Frame-Options = "DENY"
       X-XSS-Protection = "1; mode=block"
       X-Content-Type-Options = "nosniff"
       Referrer-Policy = "strict-origin-when-cross-origin"

   # Cache para assets estáticos
   [[headers]]
     for = "/assets/*"
     [headers.values]
       Cache-Control = "public, max-age=31536000, immutable"

   # SPA routing
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

3. **Deploy Automático**
   ```bash
   git push origin main
   # → Netlify detecta el push
   # → Ejecuta build automáticamente
   # → Deploy a producción
   ```

### Netlify CLI (Opcional)

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy manual
npm run build
netlify deploy --prod --dir=dist

# Preview deploy
netlify deploy --dir=dist
```

## ⚡ Deployment con Vercel

### Setup con Vercel CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# En el directorio del proyecto
vercel

# Seguir las instrucciones:
# ? Set up and deploy "~/ciderbrew"? [Y/n] y
# ? Which scope? Your Personal Account
# ? Link to existing project? [y/N] n
# ? What's your project's name? ciderbrew
# ? In which directory is your code located? ./
```

### Configuración

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Deploy Automático

```bash
# Push a main → deploy automático
git push origin main

# Deploy manual
vercel --prod

# Preview deploy
vercel
```

## 📄 Deployment con GitHub Pages

### Setup con GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run tests
      run: npm test -- --watchAll=false

    - name: Build
      run: npm run build
      env:
        VITE_BASE_URL: /ciderbrew/  # Ajustar según tu repo

    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### Configuración de Vite para GitHub Pages

```typescript
// vite.config.ts
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/ciderbrew/' : '/',
  plugins: [react()],
  // ... resto de configuración
})
```

## ☁️ Deployment con AWS S3

### Setup de S3 Bucket

```bash
# Crear bucket
aws s3 mb s3://ciderbrew-app

# Configurar para website estático
aws s3 website s3://ciderbrew-app \
    --index-document index.html \
    --error-document index.html

# Política de bucket para acceso público
cat > bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::ciderbrew-app/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy \
    --bucket ciderbrew-app \
    --policy file://bucket-policy.json
```

### Deploy Script

```bash
#!/bin/bash
# deploy-s3.sh

set -e

echo "🔨 Building application..."
npm run build

echo "📤 Uploading to S3..."
aws s3 sync dist/ s3://ciderbrew-app \
    --delete \
    --cache-control "public, max-age=31536000, immutable" \
    --exclude "*.html"

# HTML files sin cache para SPA routing
aws s3 sync dist/ s3://ciderbrew-app \
    --cache-control "public, max-age=0, must-revalidate" \
    --include "*.html"

echo "🌍 Invalidating CloudFront..."
aws cloudfront create-invalidation \
    --distribution-id E1234567890123 \
    --paths "/*"

echo "✅ Deploy completed!"
echo "🌐 Website: http://ciderbrew-app.s3-website-us-east-1.amazonaws.com"
```

### CloudFront Distribution

```json
{
  "CallerReference": "ciderbrew-cf-2025",
  "Aliases": {
    "Quantity": 1,
    "Items": ["app.ciderbrew.com"]
  },
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-ciderbrew-app",
        "DomainName": "ciderbrew-app.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-ciderbrew-app",
    "ViewerProtocolPolicy": "redirect-to-https",
    "Compress": true,
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {"Forward": "none"}
    }
  },
  "CustomErrorResponses": {
    "Quantity": 1,
    "Items": [
      {
        "ErrorCode": 404,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200"
      }
    ]
  }
}
```

## 🐳 Deployment con Docker

### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Logging
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    server {
        listen 80;
        server_name _;
        root /usr/share/nginx/html;
        index index.html;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;

        # Cache static assets
        location /assets/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # SPA routing - serve index.html for all routes
        location / {
            try_files $uri $uri/ /index.html;
            
            # No cache for HTML files
            add_header Cache-Control "no-cache, no-store, must-revalidate";
            add_header Pragma "no-cache";
            add_header Expires "0";
        }

        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

### Docker Commands

```bash
# Build image
docker build -t ciderbrew:latest .

# Run locally
docker run -p 8080:80 ciderbrew:latest

# Push to registry
docker tag ciderbrew:latest your-registry/ciderbrew:latest
docker push your-registry/ciderbrew:latest
```

## 🔄 CI/CD Pipeline Completo

### GitHub Actions

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  NODE_VERSION: '18'

jobs:
  # Testing stage
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run linting
      run: npm run lint

    - name: Run type checking
      run: npm run type-check

    - name: Run unit tests
      run: npm test -- --coverage --watchAll=false

    - name: Run integration tests
      run: npm run test:integration

    - name: Upload coverage
      uses: codecov/codecov-action@v3

  # Security scanning
  security:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Run security audit
      run: npm audit --audit-level high

    - name: Run Snyk security scan
      uses: snyk/actions/node@master
      env:
        SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  # Build stage
  build:
    needs: [test, security]
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Build application
      run: npm run build
      env:
        VITE_APP_VERSION: ${{ github.sha }}

    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: dist
        path: dist/

  # Deploy to staging
  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    environment: staging
    steps:
    - uses: actions/checkout@v3
    
    - name: Download build artifacts
      uses: actions/download-artifact@v3
      with:
        name: dist
        path: dist/

    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v1.2
      with:
        publish-dir: './dist'
        production-deploy: false
        github-token: ${{ secrets.GITHUB_TOKEN }}
        deploy-message: "Deploy from GitHub Actions"
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_STAGING_SITE_ID }}

  # E2E tests on staging
  e2e-staging:
    needs: deploy-staging
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    steps:
    - uses: actions/checkout@v3
    
    - name: Run E2E tests
      uses: cypress-io/github-action@v4
      with:
        config: baseUrl=https://staging--ciderbrew.netlify.app

  # Deploy to production
  deploy-production:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
    - uses: actions/checkout@v3
    
    - name: Download build artifacts
      uses: actions/download-artifact@v3
      with:
        name: dist
        path: dist/

    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v1.2
      with:
        publish-dir: './dist'
        production-deploy: true
        github-token: ${{ secrets.GITHUB_TOKEN }}
        deploy-message: "Production deploy from GitHub Actions"
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}

    - name: Notify deployment
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        text: "🚀 Ciderbrew deployed to production!"
      env:
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

## 📊 Monitoreo y Analytics

### Error Tracking con Sentry

```typescript
// src/main.tsx
import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      new BrowserTracing(),
    ],
    tracesSampleRate: 1.0,
    environment: import.meta.env.MODE,
    beforeSend(event) {
      // Filtrar errores conocidos
      if (event.exception) {
        const error = event.exception.values?.[0]
        if (error?.value?.includes('Non-Error promise rejection')) {
          return null
        }
      }
      return event
    }
  })
}
```

### Analytics con Google Analytics

```typescript
// src/utils/analytics.ts
import { gtag } from 'ga-gtag'

export const analytics = {
  init() {
    if (import.meta.env.PROD && import.meta.env.VITE_GA_ID) {
      gtag('config', import.meta.env.VITE_GA_ID, {
        page_title: 'Ciderbrew',
        page_location: window.location.href
      })
    }
  },

  trackEvent(action: string, category: string, label?: string, value?: number) {
    if (import.meta.env.PROD) {
      gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value
      })
    }
  },

  trackAppSelection(appName: string) {
    this.trackEvent('select_app', 'apps', appName)
  },

  trackScriptGeneration(appCount: number) {
    this.trackEvent('generate_script', 'scripts', 'app_count', appCount)
  }
}
```

### Performance Monitoring

```typescript
// src/utils/performance.ts
export const performance = {
  measurePageLoad() {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        const { loadEventEnd, navigationStart } = window.performance.timing
        const loadTime = loadEventEnd - navigationStart
        
        analytics.trackEvent('page_load_time', 'performance', 'load_time', loadTime)
      })
    }
  },

  measureComponentRender(componentName: string, renderTime: number) {
    if (renderTime > 100) { // Solo trackear renders lentos
      analytics.trackEvent('slow_render', 'performance', componentName, renderTime)
    }
  }
}
```

## 🔒 Consideraciones de Seguridad

### Content Security Policy

```html
<!-- En dist/index.html después del build -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.google-analytics.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https: ;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://formulae.brew.sh https://api.github.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
">
```

### HTTPS y SSL

```nginx
# nginx SSL configuration
server {
    listen 443 ssl http2;
    server_name ciderbrew.app;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/private.key;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=63072000" always;
    
    # ... resto de configuración
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name ciderbrew.app;
    return 301 https://$server_name$request_uri;
}
```

## 🚨 Troubleshooting Común

### Build Failures

```bash
# Error: Out of memory
export NODE_OPTIONS="--max-old-space-size=8192"
npm run build

# Error: Module not found
rm -rf node_modules package-lock.json
npm install
npm run build

# Error: TypeScript errors
npm run type-check
# Arreglar errores mostrados
npm run build
```

### Deployment Issues

```bash
# Netlify: Function timeout
# En netlify.toml
[build]
  command = "npm run build"
  functions = "netlify/functions"
  
[functions]
  timeout = 300  # 5 minutos

# Vercel: Deployment failed
vercel logs
# Revisar logs para errores específicos

# GitHub Pages: 404 errors
# Verificar que base path sea correcto en vite.config.ts
base: '/repository-name/'
```

### Performance Issues

```bash
# Analizar bundle size
npm run build
npx vite-bundle-analyzer dist/

# Optimizar imágenes
npm install -D vite-plugin-imagemin
# Agregar plugin en vite.config.ts

# Code splitting más agresivo
# En vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks(id) {
        if (id.includes('node_modules')) {
          if (id.includes('react')) return 'react'
          if (id.includes('lodash')) return 'lodash'
          return 'vendor'
        }
      }
    }
  }
}
```

## 📋 Checklist de Deployment

### Pre-deployment

- [ ] Tests pasando al 100%
- [ ] No errores de TypeScript
- [ ] No errores de ESLint
- [ ] Build exitoso localmente
- [ ] Variables de entorno configuradas
- [ ] URLs de API actualizadas
- [ ] Analytics configurado
- [ ] Error tracking configurado

### Post-deployment

- [ ] Sitio accesible en la URL
- [ ] Todas las rutas funcionan (SPA routing)
- [ ] Formularios funcionan correctamente
- [ ] Búsqueda y selección funcionan
- [ ] Generación de scripts funciona
- [ ] Perfiles se guardan/cargan correctamente
- [ ] Performance aceptable (< 3s First Contentful Paint)
- [ ] SEO optimizado
- [ ] Accesibilidad verificada

---

## 🎓 Recursos Adicionales

- **[Vite Production Build](https://vitejs.dev/guide/build.html)** - Guía oficial de build
- **[Netlify Docs](https://docs.netlify.com/)** - Documentación completa
- **[Vercel Docs](https://vercel.com/docs)** - Guías de deployment
- **[AWS S3 Static Hosting](https://docs.aws.amazon.com/s3/latest/userguide/WebsiteHosting.html)** - Hosting en AWS

**¡Con esta guía puedes desplegar Ciderbrew en cualquier plataforma! 🚀🌐**
