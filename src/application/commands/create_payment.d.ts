import { BaseCommand, CommandContext, CommandResult } from './base';
export declare class CreatePaymentCommand extends BaseCommand<object> {
    readonly name = "create_payment";
    private prisma;
    private mpService;
    execute(context: CommandContext): Promise<CommandResult<object>>;
}
//# sourceMappingURL=create_payment.d.ts.map