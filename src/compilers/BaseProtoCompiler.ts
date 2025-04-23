import * as path from 'path';
import { IProtoCompiler } from './IProtoCompiler';
import { ErrorHandler } from '../utils/ErrorHandler';

abstract class BaseProtoCompiler implements IProtoCompiler {
    protected protoPath: string;
    protected protoDir: string;

    constructor(protoPath: string) {
        this.protoPath = protoPath;
        this.protoDir = path.dirname(protoPath);
    }

    abstract compile(): Promise<void>;
    abstract checkDependencies(): Promise<boolean>;
    
    protected handleError(error: any, language: string): Error {
        // Parse the error and return a more user-friendly message
        const message = ErrorHandler.parseCompilationError(error, language);
        return new Error(message);
    }
}

export { BaseProtoCompiler };