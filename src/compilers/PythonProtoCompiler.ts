import * as cp from "child_process";
import { BaseProtoCompiler } from "./BaseProtoCompiler";
import { PlatformHelper } from "../utils/PlatformHelper";
import { Logger } from "../utils/Logger";

class PythonProtoCompiler extends BaseProtoCompiler {
    private pythonCmd: string;

    constructor(protoPath: string) {
        super(protoPath);
        this.pythonCmd = this.getPythonCommand();
        Logger.log(`PythonProtoCompiler initialized with command: ${this.pythonCmd}`);
    }

    private getPythonCommand(): string {
        switch (PlatformHelper.getPlatform()) {
            case "Windows":
                return "python";
            case "macOS":
            case "Linux":
                return "python3";
            default:
                throw new Error("Unsupported platform for Python command detection");
        }
    }

    async compile(): Promise<void> {
        Logger.log(`Starting Python protobuf compilation for: ${this.protoPath}`);

        const command = `${this.pythonCmd} -m grpc_tools.protoc -I${this.protoDir} --python_out=${this.protoDir} --grpc_python_out=${this.protoDir} ${this.protoPath}`;

        return new Promise((resolve, reject) => {
            cp.exec(command, (error, stdout, stderr) => {
                if (error) {
                    Logger.error(`Compilation failed: ${stderr}`);
                    reject(new Error(`Python gRPC compilation failed. Error: ${stderr || error.message}`));
                } else {
                    Logger.log("Python protobuf compilation successful.");
                    Logger.log(`stdout: ${stdout}`);
                    resolve();
                }
            });
        });
    }

    async checkDependencies(): Promise<boolean> {
        Logger.log("Checking Python gRPC dependencies...");

        return new Promise((resolve) => {
            cp.exec(`${this.pythonCmd} -c "import grpc_tools.protoc"`, (error) => {
                if (error) {
                    Logger.error(
                        "Missing dependency: grpc_tools.protoc. Install it using: pip install grpcio-tools"
                    );
                    resolve(false);
                } else {
                    Logger.log("All Python gRPC dependencies are installed.");
                    resolve(true);
                }
            });
        });
    }
}

export { PythonProtoCompiler };