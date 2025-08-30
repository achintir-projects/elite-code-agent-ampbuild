import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  const cmds = [
    ['elite.plan', () => vscode.window.showInformationMessage('Elite: Plan Task')],
    ['elite.implement', () => vscode.window.showInformationMessage('Elite: Implement')],
    ['elite.generateTests', () => vscode.window.showInformationMessage('Elite: Generate Tests')],
    ['elite.runTests', () => vscode.window.showInformationMessage('Elite: Run Tests')],
    ['elite.package', () => vscode.window.showInformationMessage('Elite: Package')],
  ] as const
  cmds.forEach(([id, fn]) => context.subscriptions.push(vscode.commands.registerCommand(id, fn)))
}

export function deactivate() {}
