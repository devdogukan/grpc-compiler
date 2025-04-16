import * as cp from "child_process";
import * as path from "path";
import * as fs from "fs";
import { BaseProtoCompiler } from "./BaseProtoCompiler";
import { Logger } from "../utils/Logger";

class DartProtoCompiler extends BaseProtoCompiler {
    async checkDependencies(): Promise<boolean> {
        Logger.log("Checking dependencies for Dart Proto Compiler...");

        try {
            // Check for dart
            const hasDart = await this.checkCommand("dart --version");
            if (!hasDart) {
                Logger.error("`dart` is not installed or not in PATH.");
                return false;
            }

            // Check for protoc
            const hasProtoc = await this.checkCommand("protoc --version");
            if (!hasProtoc) {
                Logger.error("`protoc` is not installed or not in PATH.");
                return false;
            }

            // Check for Dart protoc plugin
            const hasDartPlugin = await this.checkDartPlugin();
            if (!hasDartPlugin) {
                Logger.error("`protoc-gen-dart` plugin is missing. Install it with: `dart pub global activate protoc_plugin`");
                return false;
            }

            Logger.log("All Dart gRPC dependencies are installed.");
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

    private async checkDartPlugin(): Promise<boolean> {
        // Check if the dart protoc plugin is in PATH or in pub global
        return new Promise<boolean>((resolve) => {
            cp.exec("dart pub global list | grep protoc_plugin", (error, stdout) => {
                if (error || !stdout.includes("protoc_plugin")) {
                    // If not found, try to check if the binary is in PATH
                    cp.exec("where protoc-gen-dart || which protoc-gen-dart", (err) => {
                        resolve(!err);
                    });
                } else {
                    resolve(true);
                }
            });
        });
    }

    async compile(): Promise<void> {
        Logger.log(`Starting Dart protobuf compilation for: ${this.protoPath}`);

        const filePath = path.dirname(this.protoPath);
        const fileName = path.basename(this.protoPath);
        
        // Create the Dart output directory structure if it doesn't exist
        const dartOutDir = path.join(filePath, 'lib', 'src', 'generated');
        
        try {
            fs.mkdirSync(dartOutDir, { recursive: true });
        } catch (error: any) {
            Logger.log(`Note: Could not create directory ${dartOutDir}: ${error.message}`);
            // Continue anyway as the directory might already exist
        }
        
        // Build the command to generate Dart gRPC code
        const command = `protoc --dart_out=grpc:${dartOutDir} -I${filePath} ${fileName}`;

        return new Promise((resolve, reject) => {
            cp.exec(command, { cwd: filePath }, (error, stdout, stderr) => {
                if (error) {
                    Logger.error(`Dart gRPC compilation failed: ${stderr}`);
                    reject(new Error(`Dart gRPC compilation failed. Error: ${stderr || error.message}`));
                } else {
                    Logger.log("Dart protobuf compilation successful.");
                    Logger.log(`stdout: ${stdout}`);
                    resolve();
                }
            });
        });
    }
}

export { DartProtoCompiler };
