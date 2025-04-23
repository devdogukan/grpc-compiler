import { Logger } from './Logger';
import { SupportedLanguages } from '../constants/SupportedLanguages';

export class ErrorHandler {
    // Common error patterns for all languages
    private static commonErrors: Array<{ pattern: RegExp, message: string }> = [
        {
            pattern: /permission denied|access is denied/i,
            message: "Permission denied when writing output files. Check folder permissions."
        },
        {
            pattern: /no such file|not found|does not exist/i,
            message: "File or directory not found. Verify that all referenced files exist."
        },
        {
            pattern: /syntax error|unexpected/i,
            message: "Syntax error in proto file. Check your proto file for syntax errors."
        }
    ];

    // Go-specific errors
    private static goErrors: Array<{ pattern: RegExp, message: string }> = [
        {
            pattern: /unable to determine Go import path/i,
            message: "Missing Go package definition. Add 'option go_package = \"your/package/path\";' to your proto file."
        },
        {
            pattern: /protoc-gen-go: program not found/i,
            message: "protoc-gen-go plugin not found. Run 'go install google.golang.org/protobuf/cmd/protoc-gen-go@latest' to install it."
        },
        {
            pattern: /protoc-gen-go-grpc: program not found/i,
            message: "protoc-gen-go-grpc plugin not found. Run 'go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest' to install it."
        }
    ];

    // Python-specific errors
    private static pythonErrors: Array<{ pattern: RegExp, message: string }> = [
        {
            pattern: /ModuleNotFoundError: No module named 'grpc_tools'/i,
            message: "Python gRPC tools not installed. Run 'pip install grpcio-tools' to install the required package."
        },
        {
            pattern: /ImportError: No module named/i,
            message: "Missing Python module. Make sure you have installed all required Python dependencies with 'pip install grpcio grpcio-tools'."
        }
    ];

    // Java-specific errors
    private static javaErrors: Array<{ pattern: RegExp, message: string }> = [
        {
            pattern: /javac: command not found/i,
            message: "Java compiler not found. Make sure JDK is installed and available in your PATH."
        },
        {
            pattern: /protoc-java: program not found/i,
            message: "Java protoc plugin not found. Make sure protoc-gen-java is installed and available."
        },
        {
            pattern: /java_out: protoc-gen-java: Plugin failed/i,
            message: "Java code generation failed. Check that you have correct Java dependencies in your project."
        }
    ];

    // Ruby-specific errors
    private static rubyErrors: Array<{ pattern: RegExp, message: string }> = [
        {
            pattern: /grpc_tools_ruby_protoc: command not found/i,
            message: "Ruby gRPC tools not found. Run 'gem install grpc grpc-tools' to install the required gems."
        },
        {
            pattern: /no such file to load/i,
            message: "Missing Ruby dependency. Make sure you have installed the grpc and grpc-tools gems."
        }
    ];

    // Dart-specific errors
    private static dartErrors: Array<{ pattern: RegExp, message: string }> = [
        {
            pattern: /protoc-gen-dart: program not found/i,
            message: "Dart protoc plugin not found. Run 'dart pub global activate protoc_plugin' and make sure it's in your PATH."
        },
        {
            pattern: /Unrecognized flag: dart_out/i,
            message: "protoc-gen-dart plugin not installed or not available in PATH. Run 'dart pub global activate protoc_plugin'."
        }
    ];

    static parseCompilationError(error: Error | string, language: string): string {
        const errorMsg = error instanceof Error ? error.message : error;
        Logger.error(`Raw ${language} compilation error: ${errorMsg}`);
        
        // Get language-specific error patterns
        let languageErrors: Array<{ pattern: RegExp, message: string }> = [];
        
        switch(language.toLowerCase()) {
            case SupportedLanguages.Go:
                languageErrors = this.goErrors;
                break;
            case SupportedLanguages.Python:
                languageErrors = this.pythonErrors;
                break;
            case SupportedLanguages.Java:
                languageErrors = this.javaErrors;
                break;
            case SupportedLanguages.Ruby:
                languageErrors = this.rubyErrors;
                break;
            case SupportedLanguages.Dart:
                languageErrors = this.dartErrors;
                break;
        }
        
        // Check language-specific errors first
        for (const { pattern, message } of languageErrors) {
            if (pattern.test(errorMsg)) {
                return message;
            }
        }
        
        // Then check common errors
        for (const { pattern, message } of this.commonErrors) {
            if (pattern.test(errorMsg)) {
                return message;
            }
        }
        
        // If no specific error message found, create a language-specific default message
        switch(language.toLowerCase()) {
            case SupportedLanguages.Go:
                return `Go gRPC compilation failed. Make sure protoc, protoc-gen-go, and protoc-gen-go-grpc are installed and your proto file has a go_package option.`;
            case SupportedLanguages.Python:
                return `Python gRPC compilation failed. Verify that grpcio-tools is installed via pip and your proto file is valid.`;
            case SupportedLanguages.Java:
                return `Java gRPC compilation failed. Ensure JDK is installed and your project has the necessary protobuf dependencies.`;
            case SupportedLanguages.Ruby:
                return `Ruby gRPC compilation failed. Verify that grpc and grpc-tools gems are installed.`;
            case SupportedLanguages.Dart:
                return `Dart gRPC compilation failed. Make sure dart protoc plugin is installed and available in your PATH.`;
            default:
                return `gRPC compilation failed for ${language}. Check the output log for details.`;
        }
    }
}
