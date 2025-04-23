import * as cp from "child_process";
import * as path from "path";
import * as fs from "fs";
import { Logger } from "../utils/Logger";
import { BaseProtoCompiler } from "./BaseProtoCompiler";
import { SupportedLanguages } from "../constants/SupportedLanguages";

class JavaProtoCompiler extends BaseProtoCompiler {
    constructor(protoPath: string) {
        super(protoPath, SupportedLanguages.Java);
    }

    async checkDependencies(): Promise<boolean> {
        Logger.log("Checking dependencies for Go Proto Compiler...");

        try {
            if(!(await this.checkCommand("java --version"))) {
                Logger.error("`java` is not installed or not in PATH.");
                return false;
            }

            if(!(await this.checkCommand("protoc --version"))) {
                Logger.error("`protoc` is not installed or not in PATH.");
                return false;
            }

            if(!(await this.checkProtocDependency())) {
                Logger.error("`protoc` dependencies are not found in the project.");
                return false;
            }

            return true;
        } catch (error:any) {
            Logger.error("Dependency check failed", error);
            return false;
        }
    }

    async compile(): Promise<void> {
        Logger.log(`Starting compilation for: ${this.protoPath}`);

        const filePath = path.dirname(this.protoPath);
        const fileName = path.basename(this.protoPath);

        const command = `protoc -I=${filePath} --java_out=${filePath} ${fileName}`;

        return new Promise((resolve, reject) => {
            cp.exec(command, (error, stdout, stderr) => {
                if (error) {
                    Logger.error("Compilation failed", error);
                    Logger.error(`stderr: ${stderr}`);
                    reject(this.handleCompilationError(stderr || error.message));
                } else {
                    Logger.log("Compilation successful.");
                    Logger.log(`stdout: ${stdout}`);
                    resolve();
                }
            });
        });
    }

    private async checkCommand(command: string): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            cp.exec(command, (error:cp.ExecException | null) => {
                resolve(!error);
            });
        });
    }

    private async checkProtocDependency(): Promise<boolean> {
        let currentDir = this.protoDir;
    
        // "/src" dizinine veya kök dizine ulaşana kadar yukarı doğru gezin
        while (currentDir !== path.parse(currentDir).root) {
        // Önce bir seviye yukarı çık
            currentDir = path.dirname(currentDir);
            
            // pom.xml kontrolü
            const pomPath = path.join(currentDir, 'pom.xml');
            if (fs.existsSync(pomPath)) {
                const pomContent = fs.readFileSync(pomPath, 'utf8');
                if (pomContent.includes('com.google.protobuf') || 
                    pomContent.includes('protobuf-java') ||
                    pomContent.includes('protobuf-gradle-plugin')) {
                    return true;
                }
            }

            const gradlePath = path.join(currentDir, 'build.gradle');
            if (fs.existsSync(pomPath)) {
                const gradleContent = fs.readFileSync(gradlePath, 'utf8');
                if (gradleContent.includes('com.google.protobuf') || 
                    gradleContent.includes('protobuf-java') ||
                    gradleContent.includes('protobuf-gradle-plugin')) {
                    return true;
                }
            }
            // Eğer kök dizine ulaştıysak döngüyü sonlandır
            if (currentDir === path.parse(currentDir).root) {
                break;
            }
        }
        return false;
    }
}

export { JavaProtoCompiler };