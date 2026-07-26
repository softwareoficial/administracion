// src/controllers/paymentController.js
const GatewayFactory = require('../gateways/gatewayFactory');
const UserService = require('../services/userService');
const PricingService = require('../services/pricingService');

exports.handleWebhook = async (req, res) => {
    const { gatewayType } = req.params;
    
    try {
        const gateway = GatewayFactory.getGateway(gatewayType);
        const paymentData = await gateway.processWebhook(req.body);
        
        if (paymentData.status === 'success') {
            await UserService.updateSubscription(paymentData.clienteId, paymentData.plan);
        }
        
        res.status(200).send('OK');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createPaymentLink = async (req, res) => {
    const { gatewayType, clienteId, plan, currency } = req.body;
    const PLAN_PRICES = { pro: 10, enterprise: 50 }; // Precios en USD
    
    try {
        const amountUSD = PLAN_PRICES[plan] || 10;
        const finalAmount = PricingService.convert(amountUSD, currency);
        const gateway = GatewayFactory.getGateway(gatewayType);
        
        const link = await gateway.generatePaymentLink(finalAmount, currency, clienteId, plan);
        
        res.json({ status: 'success', paymentUrl: link, amount: finalAmount, currency });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
