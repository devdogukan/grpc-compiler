import { IProtoCompiler } from '../compilers/IProtoCompiler';
import { GoProtoCompiler } from '../compilers/GoProtoCompiler';
import { PythonProtoCompiler } from '../compilers/PythonProtoCompiler';
import { SupportedLanguages } from '../constants/SupportedLanguages';

class ProtoCompilerFactory {
    static createCompiler(type: SupportedLanguages, protoPath: string): IProtoCompiler {
        switch (type) {
            case SupportedLanguages.Go:
                return new GoProtoCompiler(protoPath);
            case SupportedLanguages.Python:
                return new PythonProtoCompiler(protoPath);
            default:
                throw new Error('Unsupported compiler type');
        }
    }
}

export { ProtoCompilerFactory };