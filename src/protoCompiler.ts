import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as path from 'path';
import * as os from 'os';

// Interface for Proto Compiler
interface IProtoCompiler {
    compile(): Promise<void>;
    checkDependencies(): Promise<boolean>;
}

// Base class for Proto Compiler
abstract class BaseProtoCompiler implements IProtoCompiler {
    protected protoPath: string;
    protected protoDir: string;

    constructor(protoPath: string) {
        this.protoPath = protoPath;
        this.protoDir = path.dirname(protoPath);
    }

    abstract compile(): Promise<void>;
    abstract checkDependencies(): Promise<boolean>;
}

// Go Proto Compiler Implementation
class GoProtoCompiler extends BaseProtoCompiler {
    async checkDependencies(): Promise<boolean> {
        // protoc kontrolü
        const hasProtoc = await new Promise<boolean>((resolve) => {
            cp.exec('protoc --version', (error) => {
                resolve(!error);
            });
        });

        if (!hasProtoc) {
            return false;
        }

        // Go pluginleri kontrolü
        const hasGoPlugin = await new Promise<boolean>((resolve) => {
            cp.exec('protoc-gen-go --version', (error) => {
                resolve(!error);
            });
        });

        const hasGoGrpcPlugin = await new Promise<boolean>((resolve) => {
            cp.exec('protoc-gen-go-grpc --version', (error) => {
                resolve(!error);
            });
        });

        return hasGoPlugin && hasGoGrpcPlugin;
    }

    async compile(): Promise<void> {
        const command = `protoc --proto_path=${path.dirname(this.protoPath)} --go_out=${path.dirname(this.protoPath)} --go_opt=paths=source_relative --go-grpc_out=${path.dirname(this.protoPath)} --go-grpc_opt=paths=source_relative ${path.basename(this.protoPath)}`;
        return new Promise((resolve, reject) => {
            cp.exec(command, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }
}

// Python Proto Compiler Implementation
class PythonProtoCompiler extends BaseProtoCompiler {
    private pythonCmd: string;

    constructor(protoPath: string) {
        super(protoPath);
        this.pythonCmd = this.getPythonCommand();
    }

    private getPythonCommand(): string {
        switch (os.platform()) {
            case 'win32':
                return 'python';
            case 'darwin':
            case 'linux':
                return 'python3';
            default:
                return 'python';
        }
    }

    async compile(): Promise<void> {
        const command = `${this.pythonCmd} -m grpc_tools.protoc -I${this.protoDir} --python_out=${this.protoDir} --grpc_python_out=${this.protoDir} ${this.protoPath}`;
        return new Promise((resolve, reject) => {
            cp.exec(command, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    async checkDependencies(): Promise<boolean> {
        return new Promise((resolve) => {
            cp.exec(`${this.pythonCmd} -c "import grpc_tools.protoc"`, (error) => {
                resolve(!error);
            });
        });
    }
}

// Compiler Factory
class ProtoCompilerFactory {
    static createCompiler(type: 'go' | 'python', protoPath: string): IProtoCompiler {
        switch (type) {
            case 'go':
                return new GoProtoCompiler(protoPath);
            case 'python':
                return new PythonProtoCompiler(protoPath);
            default:
                throw new Error('Unsupported compiler type');
        }
    }
}

// Compiler Service
class ProtoCompilerService {
    async compileProto(type: 'go' | 'python', protoPath: string): Promise<void> {
        const compiler = ProtoCompilerFactory.createCompiler(type, protoPath);
        
        if (!(await compiler.checkDependencies())) {
            if (type === 'python') {
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