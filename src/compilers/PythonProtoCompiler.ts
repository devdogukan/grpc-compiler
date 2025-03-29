import * as cp from 'child_process';
import * as os from 'os';
import { BaseProtoCompiler } from './BaseProtoCompiler';

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

export { PythonProtoCompiler };