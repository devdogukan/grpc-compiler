import * as vscode from 'vscode';
import * as cp from 'child_process';
import { ProtoCompilerFactory } from './ProtoCompilerFactory';
import { SupportedLanguages } from '../constants/SupportedLanguages';

class ProtoCompilerService {
    async compileProto(type: SupportedLanguages, protoPath: string): Promise<void> {
        const compiler = ProtoCompilerFactory.createCompiler(type, protoPath);
        
        // check dependencies
        const hasDependencies = await compiler.checkDependencies();
        if (!hasDependencies) {
            throw new Error('Dependencies are not installed. Please install them and try again.');
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