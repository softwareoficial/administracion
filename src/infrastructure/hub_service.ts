export class HubService {
  public async provisionService(
    clientId: string,
    serviceType: string,
  ): Promise<boolean> {
    const response = await fetch(
      `${process.env.INFRA_URL}/api/clients/${clientId}`,
      {
        headers: { Authorization: `Bearer ${process.env.ADMIN_TOKEN}` },
      },
    );
    if (!response.ok) throw new Error('Client not found on infra');

    console.log(`Provisioning ${serviceType} for client ${clientId}`);
    return true;
  }
}
