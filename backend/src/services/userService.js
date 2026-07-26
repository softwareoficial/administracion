// src/services/userService.js
// Lógica de negocio para usuarios y suscripciones
const axios = require('axios');

class UserService {
    static async listUsers() {
        // Aseguramos que la URL sea limpia eliminando posibles dobles barras
        const url = process.env.ENGINE_URL.replace(/\/+$/, '') + '/execute';
        const response = await axios.post(url, {
            token: process.env.ADMIN_TOKEN,
            command: 'SYSTEM:list-users-detailed',
            payload: {}
        });
        return response.data.data.users;
    }

    static async updateSubscription(clienteId, plan) {
        // Aseguramos que la URL sea limpia eliminando posibles dobles barras
        const url = process.env.ENGINE_URL.replace(/\/+$/, '') + '/execute';
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
