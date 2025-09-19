const vscode = require('vscode');
const path = require('path');

class CodeRunner {
  constructor() {
    // 日志通道保留，用来给“超时/异常”做备忘
    this.outputChannel = vscode.window.createOutputChannel('AntScript Execution');
    /** @type {vscode.Terminal} */
    this.terminal = null;
  }

  async runCode() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }

    const doc = editor.document;
    if (doc.languageId !== 'AntScript') { return; }

    const config = vscode.workspace.getConfiguration('AntScript');
    const antPath = config.get('Path');   // 你的解释器绝对路径
    if (!antPath) {
      vscode.window.showErrorMessage('AntScript.Path undefined!');
      return;
    }

    const filePath = doc.uri.fsPath;

    // 如果终端已存在且被用户关了，就重新创建
    if (!this.terminal || this.terminal.exitStatus) {
      this.terminal = vscode.window.createTerminal('AntScript');
    }

    this.terminal.show(); // 聚焦终端

    const cmd = `${antPath} --file "${filePath}"`;
    this.terminal.sendText(cmd);
  }

  /** 手动停止（命令面板可绑定） */
  stopExecution() {
    if (this.terminal && !this.terminal.exitStatus) {
      this.terminal.sendText('\x03'); // Ctrl+C
      this.outputChannel.appendLine('🛑 Execution stopped by user');
      this.outputChannel.show(true);
    }
  }

  dispose() {
    if (this.terminal) { this.terminal.dispose(); }
    this.outputChannel.dispose();
  }
}

module.exports = CodeRunner;