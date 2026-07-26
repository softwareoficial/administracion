// src/commands/handlers/filterUsers.js
const UserService = require('../../services/userService');

module.exports = {
    execute: async (payload) => {
        const { plan, status, minDays } = payload;
        const allUsers = await UserService.listUsers(); // Necesitamos implementar esto
        
        return allUsers.filter(u => {
            let match = true;
            if (plan && u.client.subscription.plan !== plan) match = false;
            if (status && u.client.subscription.status !== status) match = false;
            if (minDays !== undefined && u.client.subscription.days_remaining < minDays) match = false;
            return match;
        });
    }
};
