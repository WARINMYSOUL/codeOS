# Lab6 GUI (Qt + Qwt)

Клиент на C++/Qt, который показывает данные сервера лабораторной 5 (`/api/current`, `/api/stats`).

## Что нужно
- Qt 6 (Widgets, Network) — пример пути: `C:\dev\Qt\6.10.1\msvc2022_64`
- Qwt 6.3.0, собранный под этот Qt
- CMake 3.16+, MSVC x64

## Сборка Qwt 6.3.0 под Qt 6.10.1 (Release)
В “x64 Native Tools Command Prompt for VS 2022”:
```cmd
set QTDIR=C:\dev\Qt\6.10.1\msvc2022_64
set PATH=%QTDIR%\bin;%PATH%
cd C:\dev\qwt-6.3.0
"%QTDIR%\bin\qmake.exe" qwt.pro QWT_INSTALL_PREFIX=C:/Qwt-6.3.0 CONFIG+=qt6 CONFIG+=release CONFIG-=debug_and_release
nmake
nmake install
```
Итоговый префикс: `C:\Qwt-6.3.0` (lib/qwt.dll, include, plugins).

## Сборка lab6
```cmd
cmake -S lab6 -B lab6/build -G "Visual Studio 17 2022" -A x64 ^
  -DCMAKE_PREFIX_PATH="C:/dev/Qt/6.10.1/msvc2022_64;C:/Qwt-6.3.0"
cmake --build lab6/build --config Release   # или Debug, если Qwt/Qt в Debug
```

## Запуск (Release)
В той же консоли перед запуском:
```cmd
set PATH=C:\dev\Qt\6.10.1\msvc2022_64\bin;C:\Qwt-6.3.0\lib;%PATH%
set QT_PLUGIN_PATH=C:\dev\Qt\6.10.1\msvc2022_64\plugins
.\lab6\build\Release\lab6_gui.exe
```
Для Debug используйте соответствующие Debug-библиотеки Qt/Qwt и `--config Debug`.

## Сервер (лаба 5)
Перед запуском GUI поднимите сервер:
```cmd
.\lab5\build\bin\lab5_main.exe --simulate
```
Он должен слушать `http://localhost:8080`, куда ходит клиент.

## Объединять 5 и 6?
Сейчас lab6 — клиент к API лабы 5. Переносить серверную логику внутрь lab6 (один exe) можно, но это отдельная доработка (SQLite + симулятор + HTTP внутри GUI). Пока проще держать lab5_main отдельно и lab6_gui как клиент.
