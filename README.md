# Лабораторные по C/C++ (CMake)

Две лабораторные работы: лаба 1 (Hello World) и лаба 2 (библиотека фонового запуска процессов).

## Общие требования
- git
- CMake 3.10+
- Компилятор C++17 (g++/clang++ на Linux, MinGW-w64 g++ на Windows)
- gdb (для отладки, опционально)
- VS Code (опционально, есть готовые задачи/конфигурации)

## Лаба 1 — Hello, world!
- Код и CMake: `lab1/src/main.cpp`, `lab1/CMakeLists.txt`.
- Скрипты сборки: `lab1/scripts/build_windows.cmd`, `lab1/scripts/build_linux.sh`.
- VS Code (корень репозитория): `.vscode/tasks.json`, `.vscode/launch.json` (gdb).

Сборка всего репозитория (обе лабы) из корня:
```bash
cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug
cmake --build build --config Debug
```
Бинарники оказываются в `build/bin/`.

Сборка только лабы 1:
```bash
cmake -S lab1 -B lab1/build -DCMAKE_BUILD_TYPE=Debug
cmake --build lab1/build --config Debug
```
Бинарник: `lab1/build/bin/hello_cpp` (или `.exe`).

Скрипты:
- Windows (MinGW): `lab1\scripts\build_windows.cmd [Debug|Release]`
- Linux: `./lab1/scripts/build_linux.sh [Debug|Release]` (сделать исполняемым: `chmod +x lab1/scripts/build_linux.sh`)

Скрипты выполняют `git pull --rebase`, настраивают CMake и собирают проект.

## Лаба 2 — библиотека фонового запуска процессов
- Библиотека: `lab2/include/bg_process.h`, `lab2/src/bg_process.cpp` (API `start`, `wait`, `close`).
- Тестовая утилита: `lab2/src/bg_test.cpp` (запускает команду, ждёт завершения, печатает код выхода).
- Скрипты сборки: `lab2/scripts/build_windows.cmd`, `lab2/scripts/build_linux.sh` (аналогично лабе 1, сборка в `lab2/build/`).

Сборка только лабы 2:
```bash
cmake -S lab2 -B lab2/build -DCMAKE_BUILD_TYPE=Debug
cmake --build lab2/build --config Debug
```
Бинарники: `lab2/build/bin/bg_test`, `lab2/build/bin/libbgproc.a` (или `.lib`/`.dll` в зависимости от конфигурации).

Примеры запуска тестовой утилиты после сборки:
- Linux: `./lab2/build/bin/bg_test --timeout 2000 /bin/echo hello`
- Windows: `lab2\build\bin\bg_test.exe --timeout 2000 cmd /c "echo hello"`

`--timeout` — миллисекунды; по умолчанию ожидание бесконечное. Код завершения дочернего процесса печатается в stdout и возвращается как код выхода `bg_test`.
