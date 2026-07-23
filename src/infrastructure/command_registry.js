import { glob } from 'glob';
import path from 'path';
import { BaseCommand } from '../application/commands/base';
export class CommandRegistry {
    commands = new Map();
    async registerCommands() {
        const files = await glob('src/application/commands/**/*.ts', {
            ignore: ['**/base.ts', '**/*.test.ts'],
        });
        for (const file of files) {
            const module = await import(path.resolve(file));
            for (const key in module) {
                const CommandClass = module[key];
                if (CommandClass.prototype instanceof BaseCommand) {
                    const command = new CommandClass();
                    this.commands.set(command.name, command);
                }
            }
        }
    }
    getCommand(name) {
        return this.commands.get(name);
    }
}
//# sourceMappingURL=command_registry.js.map