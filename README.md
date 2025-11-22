# Hello C++ (CMake)

Небольшой проект «Hello, world!» на C++ с кроссплатформенной сборкой через CMake и готовыми скриптами для Windows и Linux.

## Требования
- git
- CMake 3.10+
- Компилятор C++17 (g++/clang++ на Linux, MinGW-w64 g++ на Windows)
- gdb для отладки (опционально)
- VS Code (опционально, для готовых задач и конфигураций запуска)

## Структура
- `src/main.cpp` — исходник программы.
- `CMakeLists.txt` — настройки проекта.
- `scripts/build_windows.cmd`, `scripts/build_linux.sh` — автоматизация обновления и сборки.
- `.vscode/` — задачи и конфигурации отладки gdb.

## Сборка и запуск вручную
```bash
cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug
cmake --build build --config Debug
./build/hello_cpp          # Linux/macOS
# .\build\hello_cpp.exe    # Windows
```
Для Release замените `Debug` на `Release`.

## Автоматическая сборка
- Windows (MinGW): `scripts\build_windows.cmd [Debug|Release]`
- Linux: `./scripts/build_linux.sh [Debug|Release]`
  - Перед первым запуском сделать исполняемым: `chmod +x scripts/build_linux.sh`

Скрипты выполняют `git pull --rebase`, настраивают CMake и собирают проект.

## VS Code
- Задача сборки: **Build (CMake Debug)** (`.vscode/tasks.json`).
- Конфигурации отладки: **Debug (gdb, Linux)** и **Debug (gdb, Windows MinGW)** (`.vscode/launch.json`), запускают бинарник из `build/`.
- При необходимости укажите путь к вашему `gdb` в поле `miDebuggerPath` для Windows-конфигурации.
