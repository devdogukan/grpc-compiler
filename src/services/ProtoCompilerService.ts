import * as vscode from 'vscode';
import * as cp from 'child_process';
import { ProtoCompilerFactory } from './ProtoCompilerFactory';
import { SupportedLanguages } from '../constants/SupportedLanguages';

class ProtoCompilerService {
    async compileProto(type: SupportedLanguages, protoPath: string): Promise<void> {
        const compiler = ProtoCompilerFactory.createCompiler(type, protoPath);
        
        if (!(await compiler.checkDependencies())) {
            if (type === SupportedLanguages.Python) {
                const install = await vscode.window.showErrorMessage(
                    'grpcio-tools is not installed. Would you like to install it?',
                    'Yes', 'No'
                );
                
                if (install === 'Yes') {
                    await this.installPythonDependencies();
                } else {
                    throw new Error('Required dependencies not installed');
                }
            } else {
                throw new Error('protoc is not installed. Please install Protocol Buffers compiler.');
            }
        }

        await compiler.compile();
    }

    private async installPythonDependencies(): Promise<void> {
        return new Promise((resolve, reject) => {
            cp.exec('python -m pip install grpcio-tools', (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }
}

export { ProtoCompilerService }; 