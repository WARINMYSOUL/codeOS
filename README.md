# Курсовка по C/C++ (CMake)

Лабораторные 1–6 и их сборка.

## Требования
- CMake 3.10+
- Компилятор C++17 (gcc/clang на Linux, MSVC на Windows; MinGW только для ранних лаб без Qt)
- git, VS Code (по желанию), gdb/отладчик
- Для лаб 5–6: Node.js 18+ (Vite) и Qt/Qwt (MSVC сборка)

## Лаба 1 — Hello, World
```bash
cmake -S lab1 -B lab1/build -DCMAKE_BUILD_TYPE=Debug
cmake --build lab1/build --config Debug
```
Выход: `lab1/build/bin/hello_cpp` (.exe).

## Лаба 2 — подпроцессы
```bash
cmake -S lab2 -B lab2/build -DCMAKE_BUILD_TYPE=Debug
cmake --build lab2/build --config Debug
```
Выход: `lab2/build/bin/bg_test`.

## Лаба 3 — shared память
```bash
cmake -S lab3 -B lab3/build -DCMAKE_BUILD_TYPE=Debug
cmake --build lab3/build --config Debug
```
Выход: `lab3/build/bin/lab3_main`.

## Лаба 4 — агрегаты/симулятор
```bash
cmake -S lab4 -B lab4/build -DCMAKE_BUILD_TYPE=Debug
cmake --build lab4/build --config Debug
```
Запуск симуляции: `./lab4/build/bin/lab4_main --simulate` (Windows: `.exe`).

## Лаба 5 — HTTP + веб (React/Vite) + SQLite
1) Фронт (Node 18+):
   ```bash
   cd lab5/web
   npm install
   node node_modules/vite/bin/vite.js build
   ```
2) Бэкенд:
   ```bash
   cmake -S lab5 -B lab5/build -DCMAKE_BUILD_TYPE=Debug
   cmake --build lab5/build --config Debug
   ```
3) Запуск: `./lab5/build/bin/lab5_main --simulate` (Windows: `.exe`).
   API (порт 8080): `/api/current`, `/api/stats?bucket=measurements|hourly|daily&start=<ms>&end=<ms>`.

## Лаба 6 — Qt/Qwt GUI с встроенным бэкендом (логика лаб5)
- Фронт: `lab6/src/frontend`, `lab6/include/frontend`.
- Бэк: `lab6/src/backend`, `lab6/include/backend` (HTTP на :8080 внутри GUI).
- Зависимости (Windows, MSVC): Qt 6.10.1 MSVC `C:\dev\Qt\6.10.1\msvc2022_64`, Qwt 6.3.0 `C:\Qwt-6.3.0`, SQLite3 (vcpkg).

Сборка (MSVC):
```cmd
cmake -S lab6 -B lab6/build-msvc -G "Visual Studio 17 2022" -A x64 ^
  -DCMAKE_TOOLCHAIN_FILE=C:/dev/tools/vcpkg/scripts/buildsystems/vcpkg.cmake ^
  "-DCMAKE_PREFIX_PATH=C:/dev/Qt/6.10.1/msvc2022_64;C:/Qwt-6.3.0;C:/dev/tools/vcpkg/installed/x64-windows"
cmake --build lab6/build-msvc --config Release   # или Debug
```

Запуск (Release):
```cmd
set PATH=C:\dev\Qt\6.10.1\msvc2022_64\bin;C:\Qwt-6.3.0\lib;%PATH%
set QT_PLUGIN_PATH=C:\dev\Qt\6.10.1\msvc2022_64\plugins
lab6\build-msvc\Release\lab6_gui.exe   # Debug -> lab6\build-msvc\Debug\lab6_gui.exe
```

Linux: собирать отдельно (например, `lab6/build-linux`) с Qt/Qwt, собранными под gcc/clang.

# Lab7 Kiosk GUI

## Build
- `cmake -S lab7 -B lab7/build-linux -G "Ninja" -DCMAKE_BUILD_TYPE=Release "-DCMAKE_PREFIX_PATH=/usr/lib/x86_64-linux-gnu/cmake/Qt5;/usr/lib/x86_64-linux-gnu/cmake/qwt"`  
- `cmake --build lab7/build-linux --config Release`

## Run
- `./lab7/build-linux/lab7_gui` — поднимает встроенный backend на `http://localhost:8080`, берёт/кладёт данные в `lab7/db/lab7.db`.
- Окно полноэкранное, без рамки, курсор скрыт, попытки Alt+F4/Alt+Tab/Esc/Ctrl+Q игнорируются, `closeEvent` блокируется.

## Кiosk-сценарий ( набросок )
- Пользователь `kiosk` с автологином на `tty1` и `~/.bash_profile` → `startx -- -nocursor`.
- `~/.xinitrc`: `exec /home/soul/codeOS/lab7/build-linux/lab7_gui`.
- Маскировать остальные `getty@tty*.service`; SSH оставить только для админа (ключи, без паролей).
- При падении можно оформить `systemd --user` юнит с `Restart=always` для `lab7_gui` или всего X.