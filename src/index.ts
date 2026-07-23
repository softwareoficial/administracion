import { CommandRegistry } from './infrastructure/command_registry';

async function main(): Promise<void> {
  const registry = new CommandRegistry();
  await registry.registerCommands();

  const command = registry.getCommand('create_payment');
  if (command) {
    await command.execute({ clientId: 'client_123', amount: 100 });
  } else {
    console.log('Command not found');
  }
}

main().catch(console.error);
