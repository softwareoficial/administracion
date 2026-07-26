// src/gateways/gatewayFactory.js
// Patrón Strategy para manejar múltiples pasarelas
const gateways = {
    stripe: require('./stripeGateway'),
    mercadopago: require('./mercadopagoGateway'),
    coinpayments: require('./coinpaymentsGateway')
};

class GatewayFactory {
    static getGateway(type) {
        if (!gateways[type]) throw new Error('Pasarela no soportada');
        return new gateways[type]();
    }
}
module.exports = GatewayFactory;
