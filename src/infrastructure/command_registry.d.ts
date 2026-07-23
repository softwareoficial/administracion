import { BaseCommand } from '../application/commands/base';
export declare class CommandRegistry {
    private commands;
    registerCommands(): Promise<void>;
    getCommand(name: string): BaseCommand | undefined;
}
//# sourceMappingURL=command_registry.d.ts.map