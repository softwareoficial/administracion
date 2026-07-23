export class LicenseManager {
  public async grantFeature(clientId: string, feature: string): Promise<void> {
    await fetch(`${process.env.INFRA_URL}/api/license/grant`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.ADMIN_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ clientId, feature }),
    });
  }

  public async revokeFeature(clientId: string, feature: string): Promise<void> {
    await fetch(`${process.env.INFRA_URL}/api/license/revoke`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.ADMIN_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ clientId, feature }),
    });
  }
}
