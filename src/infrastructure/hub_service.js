export class HubService {
    async provisionService(clientId, serviceType) {
        const response = await fetch(`${process.env.INFRA_URL}/api/clients/${clientId}`, {
            headers: { Authorization: `Bearer ${process.env.ADMIN_TOKEN}` },
        });
        if (!response.ok)
            throw new Error('Client not found on infra');
        console.log(`Provisioning ${serviceType} for client ${clientId}`);
        return true;
    }
}
//# sourceMappingURL=hub_service.js.map