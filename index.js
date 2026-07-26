require('dotenv').config();
const express = require('express');
const cron = require('node-cron');
const paymentController = require('./src/controllers/paymentController');
const CommandRegistry = require('./src/commands/commandRegistry');

// Configuración estricta
if (!process.env.ENGINE_URL || !process.env.ADMIN_TOKEN) {
    console.error('❌ ERROR: ENGINE_URL y ADMIN_TOKEN son obligatorios.');
    process.exit(1);
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Necesario para webhooks de CoinPayments

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

// Proxy directo al motor central
const axios = require('axios');
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

// Endpoint unificado: /api/payments/:gatewayType/webhook
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
