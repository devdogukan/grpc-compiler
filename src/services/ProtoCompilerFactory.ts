import { IProtoCompiler, 
    GoProtoCompiler, 
    PythonProtoCompiler, 
    JavaProtoCompiler, 
    RubyProtoCompiler, 
    DartProtoCompiler } from '../compilers';
import { SupportedLanguages } from '../constants/SupportedLanguages';

class ProtoCompilerFactory {
    static createCompiler(type: SupportedLanguages, protoPath: string): IProtoCompiler {
        switch (type) {
            case SupportedLanguages.Go:
                return new GoProtoCompiler(protoPath);
            case SupportedLanguages.Python:
                return new PythonProtoCompiler(protoPath);
            case SupportedLanguages.Java:
                return new JavaProtoCompiler(protoPath);
            case SupportedLanguages.Ruby:
                return new RubyProtoCompiler(protoPath);
            case SupportedLanguages.Dart:
                return new DartProtoCompiler(protoPath);
            default:
                throw new Error('Unsupported compiler type');
        }
    }
}

export { ProtoCompilerFactory };