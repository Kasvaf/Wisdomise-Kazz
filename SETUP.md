# Goatx-Main Development Setup Guide

## Issue Summary

The initial setup took longer than expected due to several Windows-specific issues:

1. **Missing Git Submodules**: The `wiserpc` submodule containing proto files was not initialized after cloning
2. **Proto Generation Script Issues**: The `gen-proto.sh` script was written for Unix/Linux systems and failed on Windows:
   - Used `protoc` command directly without specifying the node_modules binary path
   - The protoc plugin path wasn't Windows-compatible (needed .bat wrapper)
   - Git Bash on Windows couldn't execute the Unix-style plugin paths

## Quick Setup Instructions

### Prerequisites
- Node.js 20 (as specified in package.json)
- Yarn package manager
- Git with submodule support

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kasvaf/Goatx-Main
   cd Goatx-Main
   ```

2. **Initialize git submodules** (CRITICAL - Don't skip this!)
   ```bash
   git submodule update --init --recursive
   ```

3. **Install dependencies**
   ```bash
   yarn install
   ```

   Note: Use `yarn` instead of `npm` as the project uses yarn.lock. If you use npm, you'll get peer dependency conflicts.

4. **Generate proto files** (Windows-specific fix already applied)
   ```bash
   yarn gen-proto
   ```

   The proto generation script has been fixed for Windows compatibility. If it fails:
   - Ensure the `protoc-gen-ts_proto.bat` wrapper file exists in the project root
   - Check that the wiserpc submodule is properly initialized

5. **Start development server**
   ```bash
   npm run dev
   ```

   The server will automatically find an available port (starting from 3002).
   Look for the output showing the actual port, e.g., `http://localhost:3006`

6. **Kill running localhost processes** (if needed)
   ```bash
   npx kill-port 3000 3002 3003 3004 3005 3006 5173 8080
   ```

## Important Files Created for Windows Compatibility

- **protoc-gen-ts_proto.bat**: Windows batch wrapper for the ts-proto plugin
  ```batch
  @echo off
  node "%~dp0node_modules\ts-proto\build\src\plugin"
  ```

- **.claudeignore**: Prevents Claude from reading heavy/unnecessary files
  - node_modules, build outputs, logs, markdown files, etc.

## Common Issues & Solutions

### Issue: "Failed to resolve import services/grpc/proto/..."
**Solution**: Run `yarn gen-proto` to generate missing proto files

### Issue: Proto generation fails with "protoc: command not found"
**Solution**: The script should use npx protoc from node_modules. Check that node_modules is installed.

### Issue: "Plugin failed with status code 1" or "%1 is not a valid Win32 application"
**Solution**: Ensure protoc-gen-ts_proto.bat wrapper exists in project root

### Issue: Peer dependency warnings during install
**Solution**: These are warnings only, safe to ignore. The project uses `--legacy-peer-deps` implicitly with Yarn.

## Project Structure

```
src/
├── modules/
│   ├── discovery/
│   │   ├── DetailView/
│   │   │   └── CoinDetail/          # Main coin details page
│   │   │       ├── index.tsx         # Main component
│   │   │       ├── CoinDetailsMobile/
│   │   │       ├── CoinDetailsExpanded/
│   │   │       ├── CoinDetailsCompact/
│   │   │       └── [various widgets]
│   └── ...
├── services/
│   └── grpc/
│       └── proto/                    # Generated proto files (don't edit manually)
└── ...
```

## Development Notes

- **Port**: Dev server starts on first available port from 3002+
- **Hot Reload**: Enabled via Vite
- **Warnings**: The deprecated 'enforce' and 'transform' warnings are from vite-plugin-html and can be ignored

## For Future Claude Instances

When setting up this project:
1. Always initialize submodules FIRST before yarn install
2. Verify proto files exist in `src/services/grpc/proto/` before starting dev server
3. If proto errors occur, regenerate with `yarn gen-proto`
4. The project is configured for Windows - the gen-proto script uses the .bat wrapper
5. Use Yarn, not npm, to avoid dependency resolution issues
