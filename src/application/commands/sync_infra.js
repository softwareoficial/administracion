import { BaseCommand, } from '../../application/commands/base';
export class SyncInfraCommand extends BaseCommand {
    name = 'sync_infra';
    async execute(context) {
        const response = await fetch(`${process.env.INFRA_URL}/api/sync`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.ADMIN_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(context),
        });
        return { success: response.ok, data: await response.json() };
    }
}
//# sourceMappingURL=sync_infra.js.map