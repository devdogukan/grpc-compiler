# gRPC Compiler

![Build & Test](https://github.com/devdogukan/grpc-compiler/workflows/Build%20&%20Test/badge.svg)
[![Version](https://img.shields.io/visual-studio-marketplace/v/devdogukan.grpc-compiler)](https://marketplace.visualstudio.com/items?itemName=devdogukan.grpc-compiler)

A Visual Studio Code extension for compiling Protocol Buffers (.proto) files to gRPC code in multiple programming languages.

## Features

This extension allows you to easily compile .proto files to generate gRPC client and server code directly from the VS Code explorer context menu.

Simply right-click on any .proto file and select "Compile Proto for gRPC" to generate code in your desired language.

Currently supported languages:
- [Go](#go)
- [Python](#python)

## Requirements

For this extension to work properly, you need to have the following dependencies installed for each supported language:

### Protocol Buffers Compiler (protoc)

The Protocol Buffers compiler is required for all supported languages. Here's how to install it on different platforms:

#### Windows
- Download the pre-built binary from the [Protocol Buffers GitHub releases](https://github.com/protocolbuffers/protobuf/releases)
- Extract the zip file and add the `bin` directory to your PATH

#### macOS
- Install using Homebrew:
  ```
  brew install protobuf
  ```

#### Linux
- Install using your package manager, for example on Ubuntu:
  ```
  sudo apt-get install -y protobuf-compiler
  ```

### Go

- **Protocol Buffers compiler** (`protoc`)
  - Must be installed and available in your PATH
- **Go Plugin for Protocol Buffers** (`protoc-gen-go`)
  - Install using: 
    ```
    go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
    ```
- **Go gRPC Plugin** (`protoc-gen-go-grpc`)
  - Install using:
    ```
    go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
    ```

### Python

- **Python 3.x**
- **gRPC tools**
  - Install using:
    ```
    pip install grpcio grpcio-tools
    ```

The extension will check for these dependencies and offer to install them if they are missing.

## How To Use

1. Open a project containing .proto files
2. Right-click on any .proto file in the explorer
3. Select "Compile Proto for gRPC" from the context menu
4. Choose the target language (Go or Python)
5. The compiler will generate the appropriate files in the same directory as the .proto file

## Extension Settings

This extension currently doesn't have any configurable settings.

## Known Issues

- The extension requires all dependencies to be properly installed and available in the system PATH
- Complex proto imports may require manual configuration

## Release Notes

### 0.0.1

Initial release with support for:
- Go gRPC code generation
- Python gRPC code generation

---

**Enjoy!**
