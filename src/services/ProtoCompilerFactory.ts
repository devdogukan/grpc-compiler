import { IProtoCompiler } from '../compilers/IProtoCompiler';
import { GoProtoCompiler } from '../compilers/GoProtoCompiler';
import { PythonProtoCompiler } from '../compilers/PythonProtoCompiler';

class ProtoCompilerFactory {
    static createCompiler(type: 'go' | 'python', protoPath: string): IProtoCompiler {
        switch (type) {
            case 'go':
                return new GoProtoCompiler(protoPath);
            case 'python':
                return new PythonProtoCompiler(protoPath);
            default:
                throw new Error('Unsupported compiler type');
        }
    }
}

export { ProtoCompilerFactory };