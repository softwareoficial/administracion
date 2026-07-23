import { BaseCommand, CommandContext, CommandResult } from '../../application/commands/base';
export declare class SyncInfraCommand extends BaseCommand<object> {
    readonly name = "sync_infra";
    execute(context: CommandContext): Promise<CommandResult<object>>;
}
//# sourceMappingURL=sync_infra.d.ts.map