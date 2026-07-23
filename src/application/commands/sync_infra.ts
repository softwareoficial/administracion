import {
  BaseCommand,
  CommandContext,
  CommandResult,
} from '../../application/commands/base';

export class SyncInfraCommand extends BaseCommand<object> {
  public readonly name = 'sync_infra';

  public async execute(
    context: CommandContext,
  ): Promise<CommandResult<object>> {
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
