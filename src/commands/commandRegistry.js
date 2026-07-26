// src/commands/commandRegistry.js
// Registro central de comandos administrativos
const handlers = {
    'USER:filter': require('./handlers/filterUsers'),
    'USER:bulk-update': require('./handlers/bulkUpdate'),
};

class CommandRegistry {
    static async execute(command, payload) {
        if (!handlers[command]) throw new Error(`Comando ${command} no encontrado`);
        return await handlers[command].execute(payload);
    }
}
module.exports = CommandRegistry;
