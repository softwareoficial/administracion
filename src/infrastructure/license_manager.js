export class LicenseManager {
    async grantFeature(clientId, feature) {
        await fetch(`${process.env.INFRA_URL}/api/license/grant`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.ADMIN_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ clientId, feature }),
        });
    }
    async revokeFeature(clientId, feature) {
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
//# sourceMappingURL=license_manager.js.map