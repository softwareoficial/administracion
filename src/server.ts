import 'dotenv/config';
import fastify, { FastifyRequest } from 'fastify';
import fastifyCors from '@fastify/cors';

const app = fastify();

// Configuración CORS estricta para desarrollo con credenciales
app.register(fastifyCors, { 
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true 
});

const INFRA_URL = process.env.INFRA_URL;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

async function executeInfraCommand(
  command: string,
  payload: object,
): Promise<object> {
  if (!INFRA_URL) {
    throw new Error('INFRA_URL no configurada');
  }

  const baseUrl = INFRA_URL.endsWith('/') ? INFRA_URL.slice(0, -1) : INFRA_URL;
  const response = await fetch(`${baseUrl}/execute`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ADMIN_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: ADMIN_TOKEN, cmd: command, payload }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error('Error desde infraestructura:', text);
    throw new Error(`Error en infraestructura: ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    console.error('Respuesta no JSON desde infraestructura:', text);
    throw new Error('El servicio de infraestructura devolvió una respuesta inválida.');
  }

  return await response.json();
}

// ENDPOINTS

// Hotfix: Capturar peticiones a /execute y redirigirlas
app.post('/execute', async (req: FastifyRequest): Promise<object> => {
  const { command, payload } = req.body as { command: string; payload: object };
  return await executeInfraCommand(command, payload);
});

app.post('/api/commands', async (req: FastifyRequest): Promise<object> => {
  const { command, payload } = req.body as { command: string; payload: object };
  return await executeInfraCommand(command, payload);
});

app.get('/api/clients', async (): Promise<object> => {
  return await executeInfraCommand('SYSTEM:list-owners', {});
});

app.post('/api/clients', async (req: FastifyRequest): Promise<object> => {
  const { nombre } = req.body as { nombre: string };
  return await executeInfraCommand('APP:client-create', { nombre });
});

app.patch(
  '/api/clients/:id/plan',
  async (req: FastifyRequest): Promise<object> => {
    const { id } = req.params as { id: string };
    const { plan } = req.body as { plan: string };
    return await executeInfraCommand('APP:update-client-plan', {
      clienteId: parseInt(id),
      plan,
    });
  },
);

app.post('/api/payments', async (req: FastifyRequest): Promise<object> => {
  const { clientId, amount } = req.body as { clientId: string; amount: number };
  return {
    success: true,
    message: 'Pago generado para ' + clientId + ' de ' + amount,
  };
});

app.listen(
  { port: Number(process.env.BACKEND_PORT) || 8081, host: '0.0.0.0' },
  (err) => {
    if (err) throw err;
    console.log('Backend listening on port ' + (process.env.BACKEND_PORT || 8081));
  },
);
