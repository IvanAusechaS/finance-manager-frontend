# 🚀 Guía de Despliegue en Vercel - Finance Manager Frontend

## ✅ Estado Actual del Proyecto

- ✅ Build exitoso (1,076.52 kB bundle, 306.55 kB gzipped)
- ✅ Sin errores de compilación
- ✅ Tests configurados
- ✅ ESLint configurado (11 warnings no críticos)
- ✅ Configuración Vercel lista (`vercel.json`)
- ✅ Variables de entorno configuradas (`.env.production`)
- ✅ Todo commiteado en `main`

## 📋 Pre-requisitos

1. Cuenta en Vercel (https://vercel.com)
2. Backend desplegado y URL disponible
3. Git repository conectado a GitHub

## 🔧 Paso 1: Configurar Variables de Entorno en Vercel

**IMPORTANTE:** Debes actualizar estas variables en Vercel Dashboard:

```bash
VITE_API_BASE_URL=https://tu-backend-url.com
VITE_APP_NAME=Finance Manager
VITE_APP_VERSION=1.0.0
VITE_ENV=production
```

### Cómo agregar variables en Vercel:
1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Agrega cada variable con su valor
4. Aplica a: Production, Preview, y Development

## 🚀 Paso 2: Desplegar en Vercel

### Opción A: Desde Vercel Dashboard (Recomendado)

1. **Conectar GitHub:**
   - Ve a https://vercel.com/new
   - Click en "Import Git Repository"
   - Selecciona tu repositorio `finance-manager-frontend`

2. **Configurar Proyecto:**
   ```
   Framework Preset: Vite
   Root Directory: ./
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

3. **Variables de Entorno:**
   - Agrega las variables listadas arriba
   - **CRÍTICO:** Actualiza `VITE_API_BASE_URL` con tu backend real

4. **Deploy:**
   - Click "Deploy"
   - Espera 2-3 minutos

### Opción B: Desde CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Desplegar
vercel --prod

# Seguir los prompts:
# - Set up and deploy? Y
# - Which scope? [tu cuenta]
# - Link to existing project? N
# - What's your project's name? finance-manager-frontend
# - In which directory is your code located? ./
# - Want to override settings? N
```

## ⚙️ Paso 3: Configuración Post-Despliegue

### 1. Verificar Variables de Entorno
```bash
# En Vercel Dashboard → Settings → Environment Variables
# Asegúrate que todas las variables VITE_* estén configuradas
```

### 2. Configurar Dominios (Opcional)
- Settings → Domains
- Agregar dominio personalizado si tienes

### 3. Configurar Headers de Seguridad (Opcional)
El archivo `vercel.json` ya incluye rewrite rules para SPA.

## 🔍 Verificación del Despliegue

Una vez desplegado, verifica:

1. **Página Principal:**
   - Accede a tu URL de Vercel
   - Verifica que la landing page carga correctamente

2. **Routing:**
   - Prueba navegación: `/login`, `/register`, `/dashboard`
   - Verifica que SPA routing funciona (no 404s)

3. **Conexión con Backend:**
   - Intenta hacer login
   - Verifica que se conecta al backend
   - Revisa la consola del navegador para errores

4. **Assets:**
   - Verifica que imágenes y estilos cargan
   - Prueba en modo incógnito

## 🐛 Troubleshooting

### Error: "Failed to fetch"
- Verifica que `VITE_API_BASE_URL` esté correcta
- Verifica CORS en el backend
- Revisa que el backend esté funcionando

### Error: 404 en rutas
- Verifica que `vercel.json` tiene el rewrite rule
- Redeploy si es necesario

### Error: Variables de entorno no funcionan
- Las variables DEBEN empezar con `VITE_`
- Redeploy después de cambiar variables
- Verifica en build logs que se están usando

### Bundle muy grande
```bash
# Ya está configurado, pero puedes optimizar más con:
# - Code splitting adicional
# - Lazy loading de componentes pesados
# - Tree shaking manual
```

## 📊 Monitoreo

### En Vercel Dashboard:
- **Analytics:** Ver tráfico y performance
- **Logs:** Debugging de errores
- **Speed Insights:** Métricas de rendimiento

### Comandos útiles:
```bash
# Ver logs en tiempo real
vercel logs [deployment-url]

# Listar deployments
vercel ls

# Ver info del proyecto
vercel inspect [deployment-url]
```

## 🔄 CI/CD Automático

Vercel automáticamente:
- ✅ Despliega cada push a `main` (producción)
- ✅ Crea preview para cada PR
- ✅ Ejecuta builds en cada commit
- ✅ Notifica status en GitHub

## 📝 Notas Importantes

1. **Redeploys:** Cada push a main auto-despliega
2. **Rollbacks:** Puedes volver a versiones anteriores desde Dashboard
3. **Preview URLs:** Cada PR tiene su URL única para testing
4. **Cache:** Vercel cachea assets automáticamente
5. **SSL:** HTTPS habilitado automáticamente

## 🎯 Checklist Final

Antes de considerar el despliegue completo:

- [ ] Backend desplegado y funcionando
- [ ] Variables de entorno configuradas en Vercel
- [ ] VITE_API_BASE_URL apunta al backend correcto
- [ ] Login funciona end-to-end
- [ ] CORS configurado correctamente en backend
- [ ] Routing SPA funciona
- [ ] Assets cargan correctamente
- [ ] No hay errores en consola
- [ ] Tests principales pasan
- [ ] SonarCloud issues resueltos

## 📞 Soporte

- Vercel Docs: https://vercel.com/docs
- Vite Docs: https://vitejs.dev/guide/
- GitHub Issues: [tu repositorio]/issues

---

**¡Listo para desplegar!** 🚀

Recuerda actualizar `VITE_API_BASE_URL` con la URL real de tu backend antes de desplegar.
