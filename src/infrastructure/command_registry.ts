import { glob } from 'glob';
import path from 'path';
import { BaseCommand } from '../application/commands/base';

export class CommandRegistry {
  private commands: Map<string, BaseCommand> = new Map();

  public async registerCommands(): Promise<void> {
    const files = await glob('src/application/commands/**/*.ts', {
      ignore: ['**/base.ts', '**/*.test.ts'],
    });

    for (const file of files) {
      const commandModule = await import(path.resolve(file));
      for (const key in commandModule) {
        const CommandClass = commandModule[key];
        if (CommandClass.prototype instanceof BaseCommand) {
          const command = new CommandClass();
          this.commands.set(command.name, command);
        }
      }
    }
  }

  public getCommand(name: string): BaseCommand | undefined {
    return this.commands.get(name);
  }
}
