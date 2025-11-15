# 📚 Documentación de API - Endpoints

## 🔐 Autenticación (Auth)

### 1. Registro de Usuario
**Endpoint:** `POST /api/auth/signup`  
**Propósito:** Crear una nueva cuenta de usuario con email y contraseña hasheada  
**Autenticación:** No requerida  
**Validaciones:**
- Email válido y único
- Contraseña: mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial
- Nickname: mínimo 2 caracteres

**Request Body:**
```json
{
  "nickname": "Juan123",
  "email": "juan@example.com",
  "password": "MiPass123!",
  "confirmPassword": "MiPass123!"
}
```

**Response (201):**
```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": 1,
    "email": "juan@example.com",
    "nickname": "Juan123",
    "createdAt": "2025-11-08T10:30:00.000Z"
  }
}
```

---

### 2. Inicio de Sesión
**Endpoint:** `POST /api/auth/login`  
**Propósito:** Autenticar usuario y generar tokens de sesión (AccessToken y RefreshToken en cookies)  
**Autenticación:** No requerida  
**Funcionalidad Adicional:**
- Genera o reutiliza `deviceId` para gestionar sesiones por dispositivo
- Crea registro en `UserSession` con información del dispositivo

**Request Body:**
```json
{
  "email": "juan@example.com",
  "password": "MiPass123!"
}
```

**Response (200):**
```json
{
  "message": "Inicio de sesión exitoso",
  "user": {
    "id": 1,
    "email": "juan@example.com",
    "nickname": "Juan123",
    "createdAt": "2025-11-08T10:30:00.000Z"
  }
}
```

**Cookies establecidas:**
- `AccessToken` (httpOnly, 1 día)
- `RefreshToken` (httpOnly, 7 días)
- `deviceId` (httpOnly, 1 año)

---

### 3. Cerrar Sesión (Dispositivo Actual)
**Endpoint:** `POST /api/auth/logout`  
**Propósito:** Revocar la sesión del dispositivo actual (marca como `revoke: true`)  
**Autenticación:** Requerida (Bearer Token)  
**Nota:** No elimina la sesión, solo la marca como revocada

**Request Body:** Ninguno

**Response (200):**
```json
{
  "message": "Sesión cerrada exitosamente"
}
```

---

### 4. Cerrar Todas las Sesiones
**Endpoint:** `POST /api/auth/all-logout`  
**Propósito:** Eliminar todas las sesiones activas del usuario  
**Autenticación:** Requerida (Bearer Token)  
**Nota:** Útil si el usuario sospecha acceso no autorizado

**Request Body:** Ninguno

**Response (200):**
```json
{
  "message": "Sesión cerrada exitosamente"
}
```

---

### 5. Obtener Perfil
**Endpoint:** `GET /api/auth/profile`  
**Propósito:** Obtener información del usuario autenticado  
**Autenticación:** Requerida (Bearer Token)

**Request Body:** Ninguno

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "email": "juan@example.com",
    "nickname": "Juan123",
    "createdAt": "2025-11-08T10:30:00.000Z"
  }
}
```

---

### 6. Recuperar Contraseña
**Endpoint:** `POST /api/auth/recover`  
**Propósito:** Enviar email con link para restablecer contraseña (válido 15 minutos)  
**Autenticación:** No requerida  
**Nota:** Siempre responde con 202 aunque el email no exista (seguridad)

**Request Body:**
```json
{
  "email": "juan@example.com"
}
```

**Response (200):**
```json
{
  "message": "Revisa tu correo para continuar"
}
```

---

### 7. Restablecer Contraseña
**Endpoint:** `POST /api/auth/reset/:token`  
**Propósito:** Cambiar contraseña usando token recibido por email  
**Autenticación:** No requerida (usa token en URL)  
**Validaciones:**
- Token válido y no usado
- Contraseñas coinciden
- Contraseña cumple requisitos de seguridad

**Request Body:**
```json
{
  "password": "NuevaPass456!",
  "confirmPassword": "NuevaPass456!"
}
```

**Response (200):**
```json
{
  "message": "Contraseña actualizada correctamente"
}
```

---

### 8. Refrescar Token
**Endpoint:** `POST /api/auth/refresh`  
**Propósito:** Generar nuevo AccessToken usando RefreshToken (de cookies)  
**Autenticación:** Requiere RefreshToken válido en cookies  
**Nota:** Extiende la sesión sin requerir login

**Request Body:** Ninguno

**Response (200):**
```json
{
  "message": "Token refreshed"
}
```

---

## 💰 Cuentas (Accounts)

### 1. Crear Cuenta
**Endpoint:** `POST /api/accounts`  
**Propósito:** Crear una cuenta financiera asociada a un usuario y categoría  
**Autenticación:** Requerida (Bearer Token)

**Request Body:**
```json
{
  "name": "Cuenta de Ahorros",
  "money": 1000.50,
  "userId": 1,
  "categoryId": 2
}
```

**Response (201):**
```json
{
  "message": "Cuenta creada exitosamente",
  "account": {
    "id": 1,
    "name": "Cuenta de Ahorros",
    "money": 1000.50,
    "userId": 1,
    "categoryId": 2,
    "createdAt": "2025-11-08T10:30:00.000Z"
  }
}
```

---

### 2. Obtener Cuentas por Usuario
**Endpoint:** `GET /api/accounts/:userId`  
**Propósito:** Listar todas las cuentas de un usuario específico con categorías y tags  
**Autenticación:** Requerida (Bearer Token)

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Cuenta de Ahorros",
    "money": 1000.50,
    "userId": 1,
    "categoryId": 2,
    "category": {
      "id": 2,
      "tipo": "Bancaria",
      "Isincome": false
    },
    "tags": [
      {
        "id": 1,
        "name": "Vacaciones",
        "description": "Fondo para viaje"
      }
    ]
  }
]
```

---

### 3. Actualizar Cuenta
**Endpoint:** `PUT /api/accounts/:id`  
**Propósito:** Modificar datos de una cuenta existente  
**Autenticación:** Requerida (Bearer Token)  
**Nota:** Solo actualiza los campos enviados

**Request Body:**
```json
{
  "name": "Cuenta Principal",
  "money": 2500.75,
  "categoryId": 3
}
```

**Response (200):**
```json
{
  "message": "Cuenta actualizada",
  "account": {
    "id": 1,
    "name": "Cuenta Principal",
    "money": 2500.75,
    "userId": 1,
    "categoryId": 3
  }
}
```

---

### 4. Eliminar Cuenta
**Endpoint:** `DELETE /api/accounts/:id`  
**Propósito:** Eliminar una cuenta permanentemente  
**Autenticación:** Requerida (Bearer Token)

**Response (200):**
```json
{
  "message": "Cuenta eliminada"
}
```

---

## 📂 Categorías (Categories)

### 1. Crear Categoría
**Endpoint:** `POST /api/categories`  
**Propósito:** Crear una nueva categoría para clasificar cuentas  
**Autenticación:** Requerida (Bearer Token)

**Request Body:**
```json
{
  "tipo": "Tarjeta de Crédito",
  "isIncome": false
}
```

**Response (201):**
```json
{
  "message": "Categoría creada exitosamente",
  "category": {
    "id": 1,
    "tipo": "Tarjeta de Crédito",
    "Isincome": false
  }
}
```

---

### 2. Obtener Todas las Categorías
**Endpoint:** `GET /api/categories`  
**Propósito:** Listar todas las categorías con sus cuentas asociadas  
**Autenticación:** Requerida (Bearer Token)

**Response (200):**
```json
[
  {
    "id": 1,
    "tipo": "Tarjeta de Crédito",
    "Isincome": false,
    "accounts": [
      {
        "id": 1,
        "name": "Visa Oro",
        "money": 500.00
      }
    ]
  },
  {
    "id": 2,
    "tipo": "Ingresos",
    "Isincome": true,
    "accounts": []
  }
]
```

---

### 3. Obtener Categoría por ID
**Endpoint:** `GET /api/categories/:id`  
**Propósito:** Obtener detalle de una categoría específica  
**Autenticación:** Requerida (Bearer Token)

**Response (200):**
```json
{
  "id": 1,
  "tipo": "Tarjeta de Crédito",
  "Isincome": false,
  "accounts": [
    {
      "id": 1,
      "name": "Visa Oro",
      "money": 500.00
    }
  ]
}
```

---

### 4. Actualizar Categoría
**Endpoint:** `PUT /api/categories/:id`  
**Propósito:** Modificar una categoría existente  
**Autenticación:** Requerida (Bearer Token)

**Request Body:**
```json
{
  "tipo": "Tarjeta Débito",
  "isIncome": false
}
```

**Response (200):**
```json
{
  "message": "Categoría actualizada",
  "category": {
    "id": 1,
    "tipo": "Tarjeta Débito",
    "Isincome": false
  }
}
```

---

### 5. Eliminar Categoría
**Endpoint:** `DELETE /api/categories/:id`  
**Propósito:** Eliminar una categoría  
**Autenticación:** Requerida (Bearer Token)

**Response (200):**
```json
{
  "message": "Categoría eliminada correctamente"
}
```

---

## 🏷️ Etiquetas de Bolsillo (TagPockets)

### 1. Crear TagPocket
**Endpoint:** `POST /api/tagpockets`  
**Propósito:** Crear una etiqueta para organizar transacciones dentro de una cuenta  
**Autenticación:** Requerida (Bearer Token)

**Request Body:**
```json
{
  "name": "Comida",
  "description": "Gastos en alimentación",
  "accountId": 1
}
```

**Response (201):**
```json
{
  "message": "TagPocket creado",
  "tag": {
    "id": 1,
    "name": "Comida",
    "description": "Gastos en alimentación",
    "accountId": 1,
    "createdAt": "2025-11-08T10:30:00.000Z"
  }
}
```

---

### 2. Obtener Tags por Cuenta
**Endpoint:** `GET /api/tagpockets/:accountId`  
**Propósito:** Listar todos los tags de una cuenta específica  
**Autenticación:** Requerida (Bearer Token)

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Comida",
    "description": "Gastos en alimentación",
    "accountId": 1,
    "transactions": [
      {
        "id": 1,
        "amount": 50.00,
        "description": "Supermercado"
      }
    ],
    "goals": []
  }
]
```

---

### 3. Actualizar TagPocket
**Endpoint:** `PUT /api/tagpockets/:id`  
**Propósito:** Modificar un tag existente  
**Autenticación:** Requerida (Bearer Token)

**Request Body:**
```json
{
  "name": "Alimentación",
  "description": "Compras de comida y supermercado"
}
```

**Response (200):**
```json
{
  "message": "TagPocket actualizado",
  "tag": {
    "id": 1,
    "name": "Alimentación",
    "description": "Compras de comida y supermercado",
    "accountId": 1
  }
}
```

---

### 4. Eliminar TagPocket
**Endpoint:** `DELETE /api/tagpockets/:id`  
**Propósito:** Eliminar un tag  
**Autenticación:** Requerida (Bearer Token)

**Response (200):**
```json
{
  "message": "TagPocket eliminado"
}
```

---

## 💸 Transacciones (Transactions)

### 1. Crear Transacción
**Endpoint:** `POST /api/transactions`  
**Propósito:** Registrar una nueva transacción (ingreso o egreso)  
**Autenticación:** Requerida (Bearer Token)

**Request Body:**
```json
{
  "amount": 150.50,
  "isIncome": false,
  "transactionDate": "2025-11-08T10:30:00.000Z",
  "description": "Compra en supermercado",
  "tagId": 1
}
```

**Response (201):**
```json
{
  "message": "Transacción creada",
  "transaction": {
    "id": 1,
    "amount": 150.50,
    "isIncome": false,
    "transactionDate": "2025-11-08T10:30:00.000Z",
    "description": "Compra en supermercado",
    "tagId": 1,
    "createdAt": "2025-11-08T10:30:00.000Z"
  }
}
```

---

### 2. Obtener Todas las Transacciones
**Endpoint:** `GET /api/transactions`  
**Propósito:** Listar todas las transacciones con sus tags  
**Autenticación:** Requerida (Bearer Token)

**Response (200):**
```json
[
  {
    "id": 1,
    "amount": 150.50,
    "isIncome": false,
    "transactionDate": "2025-11-08T10:30:00.000Z",
    "description": "Compra en supermercado",
    "tagId": 1,
    "tag": {
      "id": 1,
      "name": "Comida",
      "description": "Gastos en alimentación"
    }
  }
]
```

---

### 3. Obtener Transacción por ID
**Endpoint:** `GET /api/transactions/:id`  
**Propósito:** Obtener detalle de una transacción específica  
**Autenticación:** Requerida (Bearer Token)

**Response (200):**
```json
{
  "id": 1,
  "amount": 150.50,
  "isIncome": false,
  "transactionDate": "2025-11-08T10:30:00.000Z",
  "description": "Compra en supermercado",
  "tagId": 1,
  "tag": {
    "id": 1,
    "name": "Comida",
    "description": "Gastos en alimentación"
  }
}
```

---

### 4. Obtener Transacciones por Fecha
**Endpoint:** `GET /api/transactions/byDate?date=2025-11-08`  
**Propósito:** Listar todas las transacciones de un día específico  
**Autenticación:** Requerida (Bearer Token)

**Query Parameters:**
- `date`: Fecha en formato ISO (YYYY-MM-DD)

**Response (200):**
```json
[
  {
    "id": 1,
    "amount": 150.50,
    "isIncome": false,
    "transactionDate": "2025-11-08T10:30:00.000Z",
    "description": "Compra en supermercado",
    "tag": {
      "id": 1,
      "name": "Comida"
    }
  }
]
```

---

### 5. Obtener Transacciones por Tipo y Fecha
**Endpoint:** `GET /api/transactions/byTypeDate?date=2025-11-08&type=expense`  
**Propósito:** Filtrar transacciones por tipo (ingreso/egreso) y fecha  
**Autenticación:** Requerida (Bearer Token)

**Query Parameters:**
- `date`: Fecha en formato ISO (YYYY-MM-DD)
- `type`: "income" o "expense"

**Response (200):**
```json
[
  {
    "id": 1,
    "amount": 150.50,
    "isIncome": false,
    "transactionDate": "2025-11-08T10:30:00.000Z",
    "description": "Compra en supermercado",
    "tag": {
      "id": 1,
      "name": "Comida"
    }
  }
]
```

---

### 6. Actualizar Transacción
**Endpoint:** `PUT /api/transactions/:id`  
**Propósito:** Modificar una transacción existente  
**Autenticación:** Requerida (Bearer Token)  
**Nota:** Solo actualiza campos enviados

**Request Body:**
```json
{
  "amount": 175.00,
  "description": "Compra en supermercado XYZ",
  "transactionDate": "2025-11-08T14:00:00.000Z"
}
```

**Response (200):**
```json
{
  "message": "Transacción actualizada correctamente",
  "transaction": {
    "id": 1,
    "amount": 175.00,
    "isIncome": false,
    "transactionDate": "2025-11-08T14:00:00.000Z",
    "description": "Compra en supermercado XYZ",
    "tagId": 1
  }
}
```

---

### 7. Eliminar Transacción
**Endpoint:** `DELETE /api/transactions/:id`  
**Propósito:** Eliminar una transacción permanentemente  
**Autenticación:** Requerida (Bearer Token)

**Response (200):**
```json
{
  "message": "Transacción eliminada"
}
```

---

## 🔒 Notas de Seguridad

### Headers Requeridos para Rutas Protegidas
```javascript
{
  "Authorization": "Bearer <accessToken>",
  "Content-Type": "application/json"
}
```

### Cookies Utilizadas
- **AccessToken**: Token de corta duración (1 día) para autenticación
- **RefreshToken**: Token de larga duración (7 días) para renovar sesión
- **deviceId**: Identificador único del dispositivo (1 año)

### Códigos de Error Comunes
- **400**: Solicitud incorrecta (datos faltantes o inválidos)
- **401**: No autenticado (token ausente o inválido)
- **403**: Token expirado o sesión revocada
- **404**: Recurso no encontrado
- **500**: Error interno del servidor

---
