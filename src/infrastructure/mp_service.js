export class MPService {
    async createPreference(clientId, _amount) {
        const response = await fetch(`${process.env.INFRA_URL}/api/clients/${clientId}`, {
            headers: { Authorization: `Bearer ${process.env.ADMIN_TOKEN}` },
        });
        if (!response.ok)
            throw new Error('Client not found on infra');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const amount = _amount;
        console.log(`Creating MP preference for client ${clientId}`);
        return {
            id: 'pref_' + Math.random().toString(36).substring(7),
            status: 'pending',
        };
    }
}
//# sourceMappingURL=mp_service.js.map