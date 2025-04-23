import * as path from 'path';
import { IProtoCompiler } from './IProtoCompiler';
import { ErrorHandler } from '../utils/ErrorHandler';

abstract class BaseProtoCompiler implements IProtoCompiler {
    protected protoPath: string;
    protected protoDir: string;
    protected language: string;

    constructor(protoPath: string, language: string) {
        this.protoPath = protoPath;
        this.protoDir = path.dirname(protoPath);
        this.language = language;
    }

    abstract compile(): Promise<void>;
    abstract checkDependencies(): Promise<boolean>;
    
    protected handleCompilationError(error: any): Error {
        // Parse the error and return a more user-friendly message
        const message = ErrorHandler.parseCompilationError(error, this.language);
        return new Error(message);
    }
}

export { BaseProtoCompiler };