export class MPService {
  public async createPreference(
    clientId: string,
    _amount: number,
  ): Promise<object> {
    const response = await fetch(
      `${process.env.INFRA_URL}/api/clients/${clientId}`,
      {
        headers: { Authorization: `Bearer ${process.env.ADMIN_TOKEN}` },
      },
    );
    if (!response.ok) throw new Error('Client not found on infra');

     
    const amount = _amount;
    console.log(`Creating MP preference for client ${clientId} with amount ${amount}`);
    return {
      id: 'pref_' + Math.random().toString(36).substring(7),
      status: 'pending',
    };
  }
}
