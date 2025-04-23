import * as cp from "child_process";
import * as path from "path";
import { BaseProtoCompiler } from "./BaseProtoCompiler";
import { Logger } from "../utils/Logger";
import { SupportedLanguages } from "../constants/SupportedLanguages";

class RubyProtoCompiler extends BaseProtoCompiler {
    constructor(protoPath: string) {
        super(protoPath, SupportedLanguages.Ruby);
    }

    async checkDependencies(): Promise<boolean> {
        Logger.log("Checking dependencies for Ruby Proto Compiler...");

        try {
            // Check for Ruby
            const hasRuby = await this.checkCommand("ruby --version");
            if (!hasRuby) {
                Logger.error("`ruby` is not installed or not in PATH.");
                return false;
            }

            // Check for protoc
            const hasProtoc = await this.checkCommand("protoc --version");
            if (!hasProtoc) {
                Logger.error("`protoc` is not installed or not in PATH.");
                return false;
            }

            // Check for grpc gems
            const hasGrpcGems = await this.checkGrpcGems();
            if (!hasGrpcGems) {
                Logger.error("Required Ruby gems are missing. Install them using: `gem install grpc grpc-tools`");
                return false;
            }

            Logger.log("All Ruby gRPC dependencies are installed.");
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

    private async checkGrpcGems(): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            cp.exec("gem list grpc grpc-tools", (error, stdout) => {
                if (error) {
                    resolve(false);
                } else {
                    const hasGrpc = stdout.includes("grpc") && stdout.includes("grpc-tools");
                    resolve(hasGrpc);
                }
            });
        });
    }

    async compile(): Promise<void> {
        Logger.log(`Starting Ruby protobuf compilation for: ${this.protoPath}`);

        const filePath = path.dirname(this.protoPath);
        const fileName = path.basename(this.protoPath);
        
        // Create the Ruby output directory if it doesn't exist
        const rubyOutDir = path.join(filePath, 'lib');
        
        // Build the command to generate Ruby gRPC code
        const command = `grpc_tools_ruby_protoc --proto_path=${filePath} --ruby_out=${rubyOutDir} --grpc_out=${rubyOutDir} ${fileName}`;

        return new Promise((resolve, reject) => {
            // Create output directory first
            cp.exec(`mkdir -p ${rubyOutDir}`, (mkdirError) => {
                if (mkdirError) {
                    Logger.log(`Warning: Could not create directory ${rubyOutDir}: ${mkdirError.message}`);
                    // Continue anyway as the directory might already exist
                }
                
                // Execute the protoc command
                cp.exec(command, { cwd: filePath }, (error, stdout, stderr) => {
                    if (error) {
                        Logger.error(`Ruby gRPC compilation failed: ${stderr}`);
                        reject(this.handleCompilationError(stderr || error.message));
                    } else {
                        Logger.log("Ruby protobuf compilation successful.");
                        Logger.log(`stdout: ${stdout}`);
                        resolve();
                    }
                });
            });
        });
    }
}

export { RubyProtoCompiler };
