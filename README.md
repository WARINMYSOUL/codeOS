# Лабораторные по C/C++ (CMake)

Четыре лабораторные работы: лаба 1 (Hello World), лаба 2 (библиотека фонового запуска процессов), лаба 3 (фоновые таймеры, общий счётчик и форк собственных копий), лаба 4 (логер температуры).

## Общие требования
- git
- CMake 3.10+
- Компилятор C++17 (g++/clang++ на Linux, MinGW-w64 g++ на Windows)
- gdb (для отладки, опционально)
- VS Code (опционально, есть готовые задачи/конфигурации)

## Лаба 1 — Hello, world!
- Код и CMake: `lab1/src/main.cpp`, `lab1/CMakeLists.txt`.
- Скрипты сборки: `lab1/scripts/build_windows.cmd`, `lab1/scripts/build_linux.sh`.
- VS Code: `.vscode/tasks.json`, `.vscode/launch.json` (gdb).

Сборка обеих лаб из корня:
```bash
cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug
cmake --build build --config Debug
```
Бинарники будут в `build/bin/`.

Сборка только лабы 1:
```bash
cmake -S lab1 -B lab1/build -DCMAKE_BUILD_TYPE=Debug
cmake --build lab1/build --config Debug
```
Бинарник: `lab1/build/bin/hello_cpp` (или `.exe`).

Скрипты:
- Windows: `lab1\scripts\build_windows.cmd [Debug|Release]`
- Linux: `./lab1/scripts/build_linux.sh [Debug|Release]` (перед первым запуском `chmod +x lab1/scripts/build_linux.sh`)

## Лаба 2 — библиотека фонового запуска процессов
- Библиотека: `lab2/include/bg_process.h`, `lab2/src/bg_process.cpp` (API `start`, `wait`, `close`).
- Тестовая утилита: `lab2/src/bg_test.cpp` (запускает команду, ждёт завершения, печатает код выхода).
- Скрипты сборки: `lab2/scripts/build_windows.cmd`, `lab2/scripts/build_linux.sh`.

Сборка только лабы 2:
```bash
cmake -S lab2 -B lab2/build -DCMAKE_BUILD_TYPE=Debug
cmake --build lab2/build --config Debug
```
Бинарники: `lab2/build/bin/bg_test`, `lab2/build/bin/libbgproc.a` (или `.lib`/`.dll`).

Примеры запуска `bg_test` после сборки:
- Linux: `./lab2/build/bin/bg_test --timeout 2000 /bin/echo hello`
- Windows: `lab2\build\bin\bg_test.exe --timeout 2000 cmd /c "echo hello"`

## Лаба 3 — таймеры, общий счётчик и порождение копий
- Код: `lab3/src/main.cpp`, заголовок `lab3/include/shared.h`.
- Скрипты сборки: `lab3/scripts/build_windows.cmd`, `lab3/scripts/build_linux.sh`.
- Программа хранит общий счётчик в разделяемом файле и пишет лог `lab3.log`.
- Каждые 300 мс увеличивает счётчик на 1; командой `set <число>` в консоли можно задать значение.
- Раз в 1 секунду владелец (один из процессов) пишет в лог текущее время, PID и счётчик; владелец выбирается автоматически.
- Раз в 3 секунды владелец запускает две копии: первая +10 к счётчику и завершается; вторая удваивает счётчик, через 2 с делит обратно. Если предыдущие копии не завершились, новый запуск пропускается с записью в лог.
- Все запущенные экземпляры делят счётчик и могут брать на себя роль владельца, если предыдущий умер или перестал обновлять heartbeat.

Сборка только лабы 3:
```bash
cmake -S lab3 -B lab3/build -DCMAKE_BUILD_TYPE=Debug
cmake --build lab3/build --config Debug
```
Запуск основного процесса (пример):
- Linux: `./lab3/build/bin/lab3_main`
- Windows: `lab3\build\bin\lab3_main.exe`

Лог и shared-файл теперь лежат в папке `lab3/` проекта: `lab3/logs/lab3.log` и `lab3/lab3_shared.bin` (locks рядом). Команды для stdin: `set <число>`, `exit`/`quit`.



## Лаба 4 — логер температуры
- Код: `lab4/src/main.cpp`, хелперы `lab4/include/common.h`, `lab4/src/common.cpp`.
- Скрипты сборки: `lab4/scripts/build_windows.cmd`, `lab4/scripts/build_linux.sh`.
- Работает в двух режимах: `--simulate` генерирует случайные показания (нет реального устройства), без флага читает значения из stdin (можно перенаправить из файла/pipe).
- Логи: `lab4/logs/measurements.log` (измерения за последние 24 часа), `lab4/logs/hourly_avg.log` (средние за час, хранится последний месяц), `lab4/logs/daily_avg.log` (средние за день, копит текущий год). Формат строки: `epoch_ms;ISO;value`.
- Каждое новое измерение сразу пишется в общий лог; при смене часа/дня пишутся средние значения в соответствующие логи.

Сборка только лабы 4:
```bash
cmake -S lab4 -B lab4/build -DCMAKE_BUILD_TYPE=Debug
cmake --build lab4/build --config Debug
```
Запуск с симуляцией (пример):
- Linux: `./lab4/build/bin/lab4_main --simulate`
- Windows: `lab4\build\bin\lab4_main.exe --simulate`

Запуск с внешним источником (stdin):
```bash
echo "23.4" | ./lab4/build/bin/lab4_main
```
или подать поток значений из файла/скрипта.
