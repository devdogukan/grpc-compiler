import * as cp from 'child_process';
import * as path from 'path';
import { BaseProtoCompiler } from './BaseProtoCompiler';

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

export { GoProtoCompiler };