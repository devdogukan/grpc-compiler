import * as vscode from "vscode";

export class Logger {
    private static outputChannel: vscode.OutputChannel = vscode.window.createOutputChannel("Proto Compiler");

    static log(message: string): void {
        const timestamp = new Date().toISOString();
        this.outputChannel.appendLine(`[INFO] ${timestamp} - ${message}`);
    }

    static error(message: string, error?: Error): void {
        const timestamp = new Date().toISOString();
        this.outputChannel.appendLine(`[ERROR] ${timestamp} - ${message}`);
        if (error) {
            this.outputChannel.appendLine(`[ERROR] Stack: ${error.stack}`);
        }

        // write to console as well
        console.error(`[ERROR] ${timestamp} - ${message}`);
    }
}