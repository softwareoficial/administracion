import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
const app = fastify();
app.register(fastifyCors, { origin: '*' });
const INFRA_URL = process.env.INFRA_URL;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
async function executeInfraCommand(command, payload) {
    const response = await fetch(`${INFRA_URL}/execute`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${ADMIN_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: ADMIN_TOKEN, command, payload }),
    });
    return await response.json();
}
// --- Endpoints de Administración de Clientes y Licencias ---
app.get('/api/clients', async () => {
    return await executeInfraCommand('SYSTEM:list-owners', {});
});
app.post('/api/clients', async (req) => {
    const { nombre } = req.body;
    return await executeInfraCommand('APP:client-create', { nombre });
});
app.patch('/api/clients/:id/plan', async (req) => {
    const { id } = req.params;
    const { plan } = req.body;
    return await executeInfraCommand('APP:update-client-plan', {
        clienteId: parseInt(id),
        plan,
    });
});
app.post('/api/payments', async (req) => {
    const { clientId, amount } = req.body;
    return {
        success: true,
        message: 'Pago generado para ' + clientId + ' de ' + amount,
    };
});
app.listen({ port: Number(process.env.PORT) || 8080, host: '0.0.0.0' }, (err) => {
    if (err)
        throw err;
    console.log('Backend listening on port ' + (process.env.PORT || 8080));
});
//# sourceMappingURL=server.js.map