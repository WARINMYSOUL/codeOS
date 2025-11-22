#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/build_linux.sh [BuildType]
# Default build type is Debug. Requires git, cmake, and a C++ toolchain in PATH.

BUILD_TYPE="${1:-Debug}"

echo "Updating repository..."
git pull --rebase

echo "Configuring CMake (${BUILD_TYPE})..."
cmake -S . -B build -DCMAKE_BUILD_TYPE="${BUILD_TYPE}"

echo "Building project..."
cmake --build build --config "${BUILD_TYPE}"

echo "Done. Executable should be under ./build/"
