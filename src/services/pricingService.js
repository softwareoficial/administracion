// src/services/pricingService.js
// Tasas de cambio simuladas. En producción, esto vendría de una API externa.
const exchangeRates = { USD: 1, USDT: 1, ARS: 1200, BRL: 5.5, EUR: 0.9 }; 

class PricingService {
    static convert(amountInUSD, targetCurrency) {
        const rate = exchangeRates[targetCurrency.toUpperCase()] || 1;
        return (amountInUSD * rate).toFixed(2);
    }
}
module.exports = PricingService;
