import { BaseCommand } from './base';
import { PrismaClient } from '../../generated/prisma';
import { MPService } from '../../infrastructure/mp_service';
export class CreatePaymentCommand extends BaseCommand {
    name = 'create_payment';
    prisma = new PrismaClient();
    mpService = new MPService(this.prisma);
    async execute(context) {
        const { clientId, amount } = context;
        if (typeof amount !== 'number') {
            return { success: false, error: 'Amount must be a number' };
        }
        const preference = await this.mpService.createPreference(clientId, amount);
        return { success: true, data: preference };
    }
}
//# sourceMappingURL=create_payment.js.map