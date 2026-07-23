import { BaseCommand, CommandContext, CommandResult } from './base';
import { PrismaClient } from '../../generated/prisma';
import { MPService } from '../../infrastructure/mp_service';

export class CreatePaymentCommand extends BaseCommand<object> {
  public readonly name = 'create_payment';
  private prisma: PrismaClient = new PrismaClient();
  private mpService: MPService = new MPService(this.prisma);

  public async execute(
    context: CommandContext,
  ): Promise<CommandResult<object>> {
    const { clientId, amount } = context;
    if (typeof amount !== 'number') {
      return { success: false, error: 'Amount must be a number' };
    }
    const preference = await this.mpService.createPreference(
      clientId as string,
      amount,
    );
    return { success: true, data: preference };
  }
}
