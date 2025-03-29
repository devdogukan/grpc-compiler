interface IProtoCompiler {
    compile(): Promise<void>;
    checkDependencies(): Promise<boolean>;
}

export { IProtoCompiler };