// src/gateways/mercadopagoGateway.js
const { MercadoPagoConfig, Preference } = require('mercadopago');

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

class MercadoPagoGateway {
    async processWebhook(body) {
        // IMPORTANTE: MercadoPago envía un ID de recurso.
        // Debes consultar la API /v1/payments/{id} para validar el pago.
        console.log('Procesando Webhook de MercadoPago, recurso:', body.data?.id);
        
        // Simulación: En producción, aquí debes hacer:
        // const payment = await new Payment(client).get({ id: body.data.id });
        // y validar payment.status === 'approved'
        
        return {
            clienteId: '153', // Esto debe extraerse de la respuesta de la API
            plan: 'pro',     // Esto debe extraerse de la respuesta de la API
            status: 'success'
        };
    }

    async generatePaymentLink(amount, currency, clienteId, plan) {
        const preference = new Preference(client);
        const result = await preference.create({
            body: {
                items: [
                    {
                        title: `Plan ${plan}`,
                        quantity: 1,
                        unit_price: Number(amount),
                        currency_id: currency // Ej: 'ARS'
                    }
                ],
                external_reference: clienteId.toString()
            }
        });
        return result.init_point;
    }
}
module.exports = MercadoPagoGateway;
