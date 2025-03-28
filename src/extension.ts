// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as path from 'path';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "grpc-compiler" is now active!');

	// Go için compile komutu
	let goDisposable = vscode.commands.registerCommand('grpc-compiler.compileProtoGo', async (uri: vscode.Uri) => {
		try {
			const protoPath = uri.fsPath;
			const protoDir = path.dirname(protoPath);
			
			const command = `protoc --go_out=${protoDir} --go-grpc_out=${protoDir} ${protoPath}`;
			cp.exec(command, (error, stdout, stderr) => {
				if (error) {
					vscode.window.showErrorMessage(`Failed to compile proto: ${error.message}`);
					return;
				}
				vscode.window.showInformationMessage('Proto file successfully compiled for Go gRPC');
			});
		} catch (error) {
			vscode.window.showErrorMessage(`An error occurred: ${error}`);
		}
	});

	// Python için compile komutu
	let pythonDisposable = vscode.commands.registerCommand('grpc-compiler.compileProtoPython', async (uri: vscode.Uri) => {
		try {
			const protoPath = uri.fsPath;
			const protoDir = path.dirname(protoPath);
			
			const command = `python -m grpc_tools.protoc -I${protoDir} --python_out=${protoDir} --grpc_python_out=${protoDir} ${protoPath}`;
			cp.exec(command, (error, stdout, stderr) => {
				if (error) {
					vscode.window.showErrorMessage(`Failed to compile proto: ${error.message}`);
					return;
				}
				vscode.window.showInformationMessage('Proto file successfully compiled for Python gRPC');
			});
		} catch (error) {
			vscode.window.showErrorMessage(`An error occurred: ${error}`);
		}
	});

	context.subscriptions.push(goDisposable);
	context.subscriptions.push(pythonDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
