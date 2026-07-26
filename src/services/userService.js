// src/services/userService.js
// Lógica de negocio para usuarios y suscripciones
const axios = require('axios');

class UserService {
    static async listUsers() {
        const url = process.env.ENGINE_URL.endsWith('/execute') ? process.env.ENGINE_URL : `${process.env.ENGINE_URL}/execute`;
        const response = await axios.post(url, {
            token: process.env.ADMIN_TOKEN,
            command: 'SYSTEM:list-users-detailed',
            payload: {}
        });
        return response.data.data.users;
    }

    static async updateSubscription(clienteId, plan) {
        const url = process.env.ENGINE_URL.endsWith('/execute') ? process.env.ENGINE_URL : `${process.env.ENGINE_URL}/execute`;
        return await axios.post(url, {
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
