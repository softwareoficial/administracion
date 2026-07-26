# Proyecto Administración

Sistema centralizado para la administración de usuarios, suscripciones y pasarelas de pago.

## Configuración (Obligatorio)

Para desplegar este backend (ej. en Railway), es obligatorio configurar las siguientes variables de entorno:

| Variable | Descripción |
| :--- | :--- |
| `ENGINE_URL` | URL completa del motor central (ej. `https://engine.url/execute`) |
| `ADMIN_TOKEN` | Token de autenticación del administrador |
| `PORT` | Puerto de escucha (opcional, default 3000) |
| `COINPAYMENTS_MERCHANT_ID` | ID de Comerciante de CoinPayments (para generar enlaces) |
| `MP_ACCESS_TOKEN` | Access Token de MercadoPago (para crear preferencias) |

El motor no iniciará si estas variables no están presentes.
