export interface CommandContext {
    clientId: string;
    [key: string]: unknown;
}
export interface CommandResult<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
}
export declare abstract class BaseCommand<T = unknown> {
    abstract readonly name: string;
    abstract execute(context: CommandContext): Promise<CommandResult<T>>;
}
//# sourceMappingURL=base.d.ts.map