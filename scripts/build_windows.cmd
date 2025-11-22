@echo off
setlocal ENABLEEXTENSIONS

REM Usage: build_windows.cmd [BuildType]
REM Default build type is Debug. Requires git, cmake, and MinGW toolchain in PATH.

set BUILD_TYPE=%1
if "%BUILD_TYPE%"=="" set BUILD_TYPE=Debug

echo Updating repository...
git pull --rebase
if errorlevel 1 goto :error

echo Configuring CMake (%BUILD_TYPE%)...
cmake -S . -B build -DCMAKE_BUILD_TYPE=%BUILD_TYPE%
if errorlevel 1 goto :error

echo Building project...
cmake --build build --config %BUILD_TYPE%
if errorlevel 1 goto :error

echo Completed. Executable should be under .\build\
exit /b 0

:error
echo Build failed. See messages above.
exit /b 1
