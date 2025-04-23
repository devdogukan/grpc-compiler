import { Logger } from './Logger';

export class ErrorHandler {
    private static errorPatterns: Array<{ pattern: RegExp, message: string }> = [
        {
            // Go package path error
            pattern: /unable to determine Go import path|go_package/i,
            message: "Missing Go package definition in your proto file. Add 'option go_package = \"your/package/path\";' to your proto file."
        },
        {
            // Missing protoc plugins
            pattern: /program not found|cannot find the program/i,
            message: "Required protoc plugin not found. Make sure all required plugins are installed and available in your PATH."
        },
        {
            // Import errors
            pattern: /import not found|cannot import/i,
            message: "Proto import could not be resolved. Check the import paths in your proto file."
        },
        {
            // Python specific errors
            pattern: /grpc_tools\.protoc|ModuleNotFoundError/i,
            message: "Python gRPC tools not installed. Run 'pip install grpcio-tools' to install the required package."
        },
        {
            // Dart specific errors
            pattern: /protoc-gen-dart/i,
            message: "Dart protoc plugin not found. Run 'dart pub global activate protoc_plugin' and ensure it's in your PATH."
        },
        {
            // Ruby specific errors
            pattern: /grpc_tools_ruby_protoc/i,
            message: "Ruby gRPC tools not installed. Run 'gem install grpc grpc-tools' to install the required gems."
        },
        {
            // Java specific errors
            pattern: /java_out|javac/i,
            message: "Error compiling Java code. Make sure JDK is installed and protoc Java plugin is available."
        },
        {
            // Syntax errors
            pattern: /syntax error|unexpected/i,
            message: "Syntax error in proto file. Check your proto file for syntax errors."
        },
        {
            // Permission errors
            pattern: /permission denied|access is denied/i,
            message: "Permission denied when writing output files. Check folder permissions."
        },
        {
            // File not found
            pattern: /no such file|not found|does not exist/i,
            message: "File or directory not found. Verify that all referenced files exist."
        }
    ];

    static parseCompilationError(error: Error | string, language: string): string {
        const errorMsg = error instanceof Error ? error.message : error;
        Logger.error(`Raw error for ${language}: ${errorMsg}`);
        
        // Find specific error matches
        for (const { pattern, message } of this.errorPatterns) {
            if (pattern.test(errorMsg)) {
                return `${message}\n\nOriginal Error: ${errorMsg}`;
            }
        }

        // Default error message if no pattern matches
        return `Failed to compile proto for ${language}. Check the output log for details.`;
    }
}
