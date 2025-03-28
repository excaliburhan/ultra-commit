import * as vscode from 'vscode';
import { generateCommitMsg } from './generate-commit-msg';
import { ConfigurationManager } from './config';

/**
 * Manages the registration and disposal of commands.
 */
export class CommandManager {
  private disposables: vscode.Disposable[] = [];

  constructor(private context: vscode.ExtensionContext) {}

  registerCommands() {
    this.registerCommand('extension.ultra-commit', generateCommitMsg);
    this.registerCommand('extension.configure-ultra-commit', () =>
      vscode.commands.executeCommand('workbench.action.openSettings', 'ultra-commit')
    );

    // Show available OpenAI models
    this.registerCommand('ultra-commit.showAvailableModels', async () => {
      const configManager = ConfigurationManager.getInstance();
      const models = await configManager.getAvailableOpenAIModels();
      const selected = await vscode.window.showQuickPick(models, {
        placeHolder: 'Please select a model'
      });

      if (selected) {
        const config = vscode.workspace.getConfiguration('ultra-commit');
        await config.update(
          'OPENAI_MODEL',
          selected,
          vscode.ConfigurationTarget.Global
        );
      }
    });
  }

  private registerCommand(command: string, handler: (...args: any[]) => any) {
    const disposable = vscode.commands.registerCommand(command, async (...args) => {
      try {
        await handler(...args);
      } catch (error) {
        const result = await vscode.window.showErrorMessage(
          `Failed: ${error.message}`,
          'Retry',
          'Configure'
        );

        if (result === 'Retry') {
          await handler(...args);
        } else if (result === 'Configure') {
          await vscode.commands.executeCommand(
            'workbench.action.openSettings',
            'ultra-commit'
          );
        }
      }
    });

    this.disposables.push(disposable);
    this.context.subscriptions.push(disposable);
  }

  dispose() {
    this.disposables.forEach((d) => d.dispose());
  }
}
