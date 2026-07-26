require('dotenv').config();
const express = require('express');
const cron = require('node-cron');
const paymentController = require('./src/controllers/paymentController');
const CommandRegistry = require('./src/commands/commandRegistry');

// Configuración resiliente: advertir si no están configuradas pero no detener el proceso
if (!process.env.ENGINE_URL || !process.env.ADMIN_TOKEN) {
    console.warn('⚠️ WARNING: ENGINE_URL o ADMIN_TOKEN faltantes. El motor iniciará en modo limitado.');
}

const app = express();

// Middleware de registro de nivel superior: ¡Esto debe capturar TODO!
app.use((req, res, next) => {
    console.log(`[RAW LOG] ${req.method} ${req.url} - Headers:`, JSON.stringify(req.headers));
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Proxy directo al motor central
app.post('/api/proxy', async (req, res) => {
    try {
        const { command, payload } = req.body;
        const response = await axios.post(process.env.ENGINE_URL, {
            token: process.env.ADMIN_TOKEN,
            command,
            payload
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Endpoint para ejecutar comandos administrativos
app.post('/api/admin/command', async (req, res) => {
    try {
        const { command, payload } = req.body;
        const result = await CommandRegistry.execute(command, payload);
        res.json({ status: 'success', data: result });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

// Endpoint unificado y dinámico
app.post('/api/payments/:gatewayType/webhook', paymentController.handleWebhook);
// Endpoint para generar links de pago
app.post('/api/payments/create-link', paymentController.createPaymentLink);

// --- Automatización: Revisión diaria de suscripciones ---
cron.schedule('0 0 * * *', async () => {
    console.log('🔄 Ejecutando revisión automática de suscripciones...');
    await CommandRegistry.execute('SYSTEM:check-subscriptions', {});
});

app.listen(process.env.PORT || 3000, () => {
    console.log('🚀 Motor de Administración (Multi-Pasarela) activo.');
});
