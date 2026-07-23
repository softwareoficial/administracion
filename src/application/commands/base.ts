export interface CommandContext {
  clientId: string;
  [key: string]: unknown;
}

export interface CommandResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export abstract class BaseCommand<T = unknown> {
  public abstract readonly name: string;
  public abstract execute(context: CommandContext): Promise<CommandResult<T>>;
}
