# ⚙️ Configuración de Variables de Entorno en Vercel

## 🚨 IMPORTANTE: Variables de Entorno Correctas

Para que tu aplicación funcione correctamente en Vercel, debes configurar estas variables **EXACTAMENTE** como se muestra:

## 📋 Variables Requeridas

```bash
# ⚠️ SIN BARRA FINAL - MUY IMPORTANTE
VITE_API_BASE_URL=https://finance-manager-backend-mhf8.onrender.com

VITE_APP_NAME=Finance Manager
VITE_APP_VERSION=1.0.0
VITE_ENV=production
```

## ⚠️ Errores Comunes

### ❌ INCORRECTO (con barra final):
```bash
VITE_API_BASE_URL=https://finance-manager-backend-mhf8.onrender.com/
```
Esto causará URLs como: `https://...com//api/auth/login` (doble barra)

### ✅ CORRECTO (sin barra final):
```bash
VITE_API_BASE_URL=https://finance-manager-backend-mhf8.onrender.com
```
Esto generará URLs correctas: `https://...com/api/auth/login`

## 🔧 Cómo Configurar en Vercel

### Paso 1: Ir a Environment Variables
1. Ve a tu proyecto en Vercel Dashboard
2. Click en **Settings** (en la barra superior)
3. Click en **Environment Variables** (menú lateral)

### Paso 2: Agregar Variables
Para cada variable:

1. **Name:** `VITE_API_BASE_URL`
2. **Value:** `https://finance-manager-backend-mhf8.onrender.com` (sin barra final)
3. **Environment:** Selecciona todos (Production, Preview, Development)
4. Click **Save**

Repite para las otras variables:
- `VITE_APP_NAME` = `Finance Manager`
- `VITE_APP_VERSION` = `1.0.0`
- `VITE_ENV` = `production`

### Paso 3: Redeploy
**CRÍTICO:** Después de agregar/cambiar variables:

1. Ve a **Deployments** tab
2. Click en los tres puntos (...) del último deployment
3. Click **Redeploy**
4. Espera a que termine (2-3 minutos)

## 🔍 Verificar que Funciona

### Método 1: En el Navegador
1. Abre tu app desplegada en Vercel
2. Abre DevTools (F12)
3. Ve a Console
4. Ejecuta:
```javascript
console.log(import.meta.env.VITE_API_BASE_URL)
```
Debe mostrar: `https://finance-manager-backend-mhf8.onrender.com`

### Método 2: En Network Tab
1. Intenta hacer login
2. Abre DevTools → Network tab
3. Verifica que las requests vayan a:
   - ✅ `https://finance-manager-backend-mhf8.onrender.com/api/auth/login`
   - ❌ NO a `http://localhost:3000/api/auth/login`

### Método 3: Build Logs
1. Ve a tu deployment en Vercel
2. Click en **View Function Logs** o **Building**
3. Busca referencias a las variables de entorno
4. Verifica que se estén usando correctamente

## 🐛 Troubleshooting

### Error: "Failed to load resource: net::ERR_CONNECTION_REFUSED"
**Causa:** La app está intentando conectarse a localhost
**Solución:**
1. Verifica que las variables estén configuradas en Vercel
2. Asegúrate de haber hecho **Redeploy** después de agregarlas
3. Verifica que `VITE_API_BASE_URL` NO tenga barra final

### Error: "404 Not Found" en las requests
**Causa:** URL del backend incorrecta
**Solución:**
1. Verifica que tu backend en Render esté funcionando
2. Prueba la URL directamente: `https://finance-manager-backend-mhf8.onrender.com/api/health`
3. Verifica que no haya typos en la URL

### Error: CORS
**Causa:** Backend no permite requests desde tu dominio de Vercel
**Solución:** Configura CORS en el backend para permitir tu dominio de Vercel

### Variables no se actualizan
**Causa:** Vercel cachea el build anterior
**Solución:**
1. Settings → Environment Variables
2. Modifica la variable (agrega un espacio y quítalo)
3. Save
4. Redeploy FORZADO (no automático)

## 📝 Notas Importantes

1. **Prefijo VITE_** es obligatorio para que Vite las exponga al frontend
2. Las variables se "baken" en el build, no son dinámicas
3. Cambios requieren redeploy completo
4. Production, Preview y Development pueden tener valores diferentes
5. NO incluyas secretos sensibles (estas variables son públicas en el bundle)

## ✅ Checklist de Verificación

Antes de considerar que está todo bien:

- [ ] Variables configuradas en Vercel (sin typos)
- [ ] `VITE_API_BASE_URL` SIN barra final
- [ ] Redeployed después de agregar variables
- [ ] Deployment completado exitosamente
- [ ] Console muestra URL correcta (no localhost)
- [ ] Network requests van a Render (no localhost)
- [ ] Backend responde correctamente
- [ ] CORS configurado en backend
- [ ] Login funciona end-to-end

## 🔗 URLs de Referencia

- **Tu Backend:** https://finance-manager-backend-mhf8.onrender.com
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Render Dashboard:** https://dashboard.render.com

---

**Si sigues teniendo problemas con localhost**, es probable que:
1. No hayas redeployado después de agregar las variables
2. Estés viendo un deployment antiguo cacheado
3. Las variables tengan typos o barras finales

**Solución:** Redeploy FORZADO desde Vercel Dashboard.
