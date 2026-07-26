// src/gateways/coinpaymentsGateway.js
const crypto = require('crypto');

class CoinPaymentsGateway {
    // Procesa el webhook enviado por CoinPayments
    async processWebhook(body) {
        // CoinPayments envía los datos mediante POST application/x-www-form-urlencoded
        // El campo 'custom' lo usaremos para pasar el clienteId
        console.log('Procesando webhook de CoinPayments...');
        
        // Aquí deberías validar la firma (IPN_SIG) si configuras un secreto
        // Por ahora, procesamos el estado del pago
        if (body.status >= 100 || body.status === 2) { // 2 es pago completo, > 100 es pago completo
            return {
                clienteId: parseInt(body.custom), // Recuperamos el clienteId enviado en el pago
                plan: body.item_name, // Recuperamos el plan enviado
                status: 'success'
            };
        }
        
        return { status: 'pending' };
    }

    async generatePaymentLink(amount, currency, clienteId, plan) {
        // CoinPayments funciona creando una "transacción"
        // Este link es un ejemplo de cómo se estructuraría la llamada a su API
        // Normalmente generarías esto vía su API y retornarías la URL de checkout
        return `https://www.coinpayments.net/index.php?cmd=_pay&merchant=${process.env.COINPAYMENTS_MERCHANT_ID}&item_name=${plan}&amount=${amount}&currency=${currency}&custom=${clienteId}`;
    }
}
module.exports = CoinPaymentsGateway;
