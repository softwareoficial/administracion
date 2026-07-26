// src/gateways/stripeGateway.js
class StripeGateway {
    async processWebhook(body) {
        return {
            clienteId: body.data.object.metadata.clienteId,
            plan: body.data.object.metadata.plan,
            status: 'success'
        };
    }

    async generatePaymentLink(amount, currency, clienteId, plan) {
        // Aquí iría la integración real con Stripe API (Checkout Session)
        return `https://checkout.stripe.com/pay/mock_link?amount=${amount}&currency=${currency}&clienteId=${clienteId}`;
    }
}
module.exports = StripeGateway;
