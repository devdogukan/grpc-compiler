// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ProtoCompilerService } from './services/ProtoCompilerService';
import { SupportedLanguages } from './constants/SupportedLanguages';
import { Logger } from './utils/Logger';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "grpc-compiler" is now active!');

	const compilerService = new ProtoCompilerService();

	// Helper function for displaying appropriate error messages
	const handleCompilationError = (error: any, language: string): void => {
		Logger.error(`Failed to compile proto for ${language}`, error);
		
		const errorMessage = error instanceof Error ? error.message : String(error);
		
		// Show the error message and offer options to view documentation or log
		vscode.window.showErrorMessage(
			`${errorMessage}`, 
			'Show Log',
			'View Documentation'
		).then(selection => {
			if (selection === 'Show Log') {
				Logger.outputChannel.show();
			} else if (selection === 'View Documentation') {
				vscode.env.openExternal(vscode.Uri.parse('https://grpc-compiler.netlify.app'));
			}
		});
	};

	// compile command for Go
	let goDisposable = vscode.commands.registerCommand('grpc-compiler.compileProtoGo', async (uri: vscode.Uri) => {
		try {
			await compilerService.compileProto(SupportedLanguages.Go, uri.fsPath);
			vscode.window.showInformationMessage('Proto file successfully compiled for Go gRPC');
		} catch (error: any) {
			handleCompilationError(error, 'Go');
		}
	});

	// compile command for Python
	let pythonDisposable = vscode.commands.registerCommand('grpc-compiler.compileProtoPython', async (uri: vscode.Uri) => {
		try {
			await compilerService.compileProto(SupportedLanguages.Python, uri.fsPath);
			vscode.window.showInformationMessage('Proto file successfully compiled for Python gRPC');
		} catch (error: any) {
			handleCompilationError(error, 'Python');
		}
	});

	// compile command for Java
	let javaDisposable = vscode.commands.registerCommand('grpc-compiler.compileProtoJava', async (uri: vscode.Uri) => {
		try {
			await compilerService.compileProto(SupportedLanguages.Java, uri.fsPath);
			vscode.window.showInformationMessage('Proto file successfully compiled for Java gRPC');
		} catch (error: any) {
			handleCompilationError(error, 'Java');
		}
	});
	
	// compile command for Ruby
	let rubyDisposable = vscode.commands.registerCommand('grpc-compiler.compileProtoRuby', async (uri: vscode.Uri) => {
		try {
			await compilerService.compileProto(SupportedLanguages.Ruby, uri.fsPath);
			vscode.window.showInformationMessage('Proto file successfully compiled for Ruby gRPC');
		} catch (error: any) {
			handleCompilationError(error, 'Ruby');
		}
	});

	// compile command for Dart
	let dartDisposable = vscode.commands.registerCommand('grpc-compiler.compileProtoDart', async (uri: vscode.Uri) => {
		try {
			await compilerService.compileProto(SupportedLanguages.Dart, uri.fsPath);
			vscode.window.showInformationMessage('Proto file successfully compiled for Dart gRPC');
		} catch (error: any) {
			handleCompilationError(error, 'Dart');
		}
	});

	context.subscriptions.push(goDisposable);
	context.subscriptions.push(pythonDisposable);
	context.subscriptions.push(javaDisposable);
	context.subscriptions.push(rubyDisposable);
	context.subscriptions.push(dartDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
