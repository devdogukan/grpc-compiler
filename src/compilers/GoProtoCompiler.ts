import * as cp from "child_process";
import * as path from "path";
import { BaseProtoCompiler } from "./BaseProtoCompiler";
import { Logger } from "../utils/Logger";

class GoProtoCompiler extends BaseProtoCompiler {
    async checkDependencies(): Promise<boolean> {
        Logger.log("Checking dependencies for Go Proto Compiler...");

        try {
            const hasProtoc = await this.checkCommand("protoc --version");
            if (!hasProtoc) {
                Logger.error("`protoc` is not installed or not in PATH.");
                return false;
            }

            const hasGoPlugin = await this.checkCommand("protoc-gen-go --version");
            if (!hasGoPlugin) {
                Logger.error("`protoc-gen-go` is missing. Install it with: `go install google.golang.org/protobuf/cmd/protoc-gen-go@latest`");
                return false;
            }

            const hasGoGrpcPlugin = await this.checkCommand("protoc-gen-go-grpc --version");
            if (!hasGoGrpcPlugin) {
                Logger.error("`protoc-gen-go-grpc` is missing. Install it with: `go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest`");
                return false;
            }

            Logger.log("All dependencies are installed.");
            return true;
        } catch (error: any) {
            Logger.error("Dependency check failed", error);
            return false;
        }
    }

    private async checkCommand(command: string): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            cp.exec(command, (error) => {
                resolve(!error);
            });
        });
    }

    async compile(): Promise<void> {
        Logger.log(`Starting compilation for: ${this.protoPath}`);

        const filePath = path.dirname(this.protoPath);
        const fileName = path.basename(this.protoPath);

        const command = `protoc --proto_path=${filePath} --go_out=${filePath} --go_opt=paths=source_relative --go-grpc_out=${filePath} --go-grpc_opt=paths=source_relative ${fileName}`;

        return new Promise((resolve, reject) => {
            cp.exec(command, (error, stdout, stderr) => {
                if (error) {
                    Logger.error("Compilation failed", error);
                    Logger.error(`stderr: ${stderr}`);
                    reject(this.handleError(stderr || error.message, "Go"));
                } else {
                    Logger.log("Compilation successful.");
                    Logger.log(`stdout: ${stdout}`);
                    resolve();
                }
            });
        });
    }
}

export { GoProtoCompiler };