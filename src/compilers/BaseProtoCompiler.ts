import * as path from 'path';
import { IProtoCompiler } from './IProtoCompiler';

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

export { BaseProtoCompiler };