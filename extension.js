const vscode = require('vscode');
const CodeRunner = require('./codeRunner');
const { spawn } = require('child_process');

let codeRunner;

function setupDefaultConfiguration(context) {
  const config = vscode.workspace.getConfiguration('AntScript');

  // 如果Path未设置，则设置默认值
  if (!config.has('Path') || config.get('Path') === '') {
    const defaultInterpreterPath = ''
    config.update('Path', defaultInterpreterPath, vscode.ConfigurationTarget.Global)
      .then(() => {
        vscode.window.showInformationMessage(
          `AntScript: Path set to default: ${defaultInterpreterPath}`
        );
      });
  }
}


function activate(context) {
  codeRunner = new CodeRunner();

  // 自动配置默认参数
  setupDefaultConfiguration()

  // 注册命令
  context.subscriptions.push(
    vscode.commands.registerCommand('AntScript.RunCode', async () => {
      codeRunner.runCode();
    }),
    vscode.commands.registerCommand('AntScript.StopExecution', () => {
      codeRunner.stopExecution();
    })
  );

  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.text = "$(play) Run AntScript";
  statusBarItem.command = 'AntScript.RunCode';
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);


  context.subscriptions.push(vscode.languages.registerCompletionItemProvider('AntScript', {
    provideCompletionItems(document, position) {
      // 创建一个CompletionItem数组
      const completionItems = [
        new vscode.CompletionItem('print()', vscode.CompletionItemKind.Function),
        new vscode.CompletionItem('len()', vscode.CompletionItemKind.Function),
        new vscode.CompletionItem('input()', vscode.CompletionItemKind.Function),
        new vscode.CompletionItem('clear()', vscode.CompletionItemKind.Function),
        new vscode.CompletionItem('force_exit()', vscode.CompletionItemKind.Function),
      ];

      // 返回CompletionItem数组
      return completionItems;
    }
  }));
}

function deactivate() { }

module.exports = {
  activate,
  deactivate
};