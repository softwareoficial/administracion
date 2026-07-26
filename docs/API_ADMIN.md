# Documentación Técnica: API de Administración

Este documento detalla los comandos administrativos detectados en `infrastructure-engine` para la gestión de usuarios, suscripciones y configuración de clientes.

## Punto de Entrada
Todos los comandos se ejecutan a través de:
`POST /execute`

**Estructura del Request:**
```json
{
  "token": "TOKEN_ADMIN",
  "command": "DOMINIO:accion",
  "payload": { ... }
}
```

---

## 1. Gestión de Suscripciones (Dominio APP)

### `APP:update-client-plan`
Actualiza el plan de suscripción de un cliente.

- **Privilegios:** Requiere rol administrativo (DUEÑO, ADMINISTRADOR, SUPER_ADMIN).
- **Payload:**
  ```json
  {
    "clienteId": 123,
    "plan": "pro" // Opciones: "free", "pro", "enterprise"
  }
  ```
- **Respuesta Esperada:**
  ```json
  {
    "status": "success",
    "updatedData": { ... }
  }
  ```

---

## 2. Gestión de Configuración (Dominio USER)

### `USER:update-path`
Modifica valores específicos en el JSONB de configuración. Ideal para fechas, flags de trial, o configuración técnica.

- **Privilegios:** Requiere acceso al cliente.
- **Payload:**
  ```json
  {
    "clienteId": 123,
    "path": "private_config.trial_end_date", // Dot notation
    "value": "2026-12-31T23:59:59Z"
  }
  ```
- **Ejemplos de Paths:**
  - `private_config.trial_end_date` (Fecha fin trial)
  - `private_config.is_trial` (Booleano)
  - `private_config.last_payment_date` (Último pago)

### `USER:write`
Realiza un merge (actualización global) de la configuración.

- **Payload:**
  ```json
  {
    "clienteId": 123,
    "data": { "key": "new_value" }
  }
  ```

---

## 3. Auditoría y Reportes (Dominio SYSTEM/USER)

### `SYSTEM:list-users-detailed`
Listado masivo de todos los usuarios y sus estados.

- **Payload:** Ninguno.
- **Respuesta:** Objeto conteniendo un array `users` con detalles de `client` y `subscription`.

### `USER:audit-team`
Consulta el historial de eventos de un tenant.

- **Payload:**
  ```json
  {
    "limit": 10
  }
  ```
- **Respuesta:** Objeto con array `timeline` de operaciones.
