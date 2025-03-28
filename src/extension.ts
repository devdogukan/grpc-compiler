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

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('grpc-compiler.compileProto', async (uri: vscode.Uri) => {
		// Kullanıcıya dil seçimi için quickpick göster
		const selectedLanguage = await vscode.window.showQuickPick(
			['Python', 'Go'],
			{
				placeHolder: 'Select target language for gRPC compilation'
			}
		);

		if (!selectedLanguage) {
			return; // Kullanıcı seçim yapmadan çıktı
		}

		try {
			const protoPath = uri.fsPath;
			const protoDir = path.dirname(protoPath);
			
			if (selectedLanguage === 'Python') {
				// Python için gRPC compile
				const command = `python -m grpc_tools.protoc -I${protoDir} --python_out=${protoDir} --grpc_python_out=${protoDir} ${protoPath}`;
				cp.exec(command, (error, stdout, stderr) => {
					if (error) {
						vscode.window.showErrorMessage(`Failed to compile proto: ${error.message}`);
						return;
					}
					vscode.window.showInformationMessage('Proto file successfully compiled for Python gRPC');
				});
			} else {
				// Go için gRPC compile
				const command = `protoc --go_out=${protoDir} --go-grpc_out=${protoDir} ${protoPath}`;
				cp.exec(command, (error, stdout, stderr) => {
					if (error) {
						vscode.window.showErrorMessage(`Failed to compile proto: ${error.message}`);
						return;
					}
					vscode.window.showInformationMessage('Proto file successfully compiled for Go gRPC');
				});
			}
		} catch (error) {
			vscode.window.showErrorMessage(`An error occurred: ${error}`);
		}
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
