// src/commands/handlers/bulkUpdate.js
const UserService = require('../../services/userService');

module.exports = {
    execute: async (payload) => {
        const { clienteIds, action, value } = payload;
        const results = [];
        
        for (const clienteId of clienteIds) {
            try {
                if (action === 'update-plan') {
                    await UserService.updateSubscription(clienteId, value);
                    results.push({ clienteId, status: 'success' });
                }
                // Aquí podrías agregar más acciones (set-trial, etc)
            } catch (e) {
                results.push({ clienteId, status: 'error', error: e.message });
            }
        }
        return results;
    }
};
