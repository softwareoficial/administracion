// src/services/userService.js
// Lógica de negocio para usuarios y suscripciones
const axios = require('axios');

class UserService {
    static async listUsers() {
        const response = await axios.post(process.env.ENGINE_URL, {
            token: process.env.ADMIN_TOKEN,
            command: 'SYSTEM:list-users-detailed',
            payload: {}
        });
        return response.data.data.users;
    }

    static async updateSubscription(clienteId, plan) {
        return await axios.post(process.env.ENGINE_URL, {
            token: process.env.ADMIN_TOKEN,
            command: 'APP:update-client-plan',
            payload: { clienteId, plan }
        });
    }

    static async getClientStatus(clienteId) {
        // ... Lógica para consultar estado
    }
}
module.exports = UserService;
