cmake_minimum_required(VERSION 3.16)

project(lab6_gui LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)
set(CMAKE_AUTOUIC ON)

# Help CMake find Qt if QTDIR is set (e.g. C:\dev\Qt\6.10.1\msvc2022_64).
if (NOT Qt6_DIR AND DEFINED ENV{QTDIR})
    list(APPEND CMAKE_PREFIX_PATH "$ENV{QTDIR}")
    set(Qt6_DIR "$ENV{QTDIR}/lib/cmake/Qt6")
endif()

find_package(Qt6 REQUIRED COMPONENTS Widgets Network)
find_package(SQLite3 REQUIRED)
find_package(Threads REQUIRED)

# Qwt: если нет QwtConfig.cmake (qmake-сборка), ищем вручную
find_package(Qwt CONFIG QUIET)
if (NOT Qwt_FOUND)
    set(QWT_ROOT "C:/Qwt-6.3.0" CACHE PATH "Qwt install prefix")
    find_path(QWT_INCLUDE_DIR qwt.h
        HINTS "${QWT_ROOT}/include" "${QWT_ROOT}")
    # Предпочитаем релизную библиотеку
    find_library(QWT_LIBRARY_RELEASE qwt
        HINTS "${QWT_ROOT}/lib" "${QWT_ROOT}")
    find_library(QWT_LIBRARY_DEBUG qwtd
        HINTS "${QWT_ROOT}/lib" "${QWT_ROOT}")
    if (QWT_INCLUDE_DIR AND (QWT_LIBRARY_RELEASE OR QWT_LIBRARY_DEBUG))
        add_library(Qwt::Qwt UNKNOWN IMPORTED)
        if (QWT_LIBRARY_RELEASE)
            set_property(TARGET Qwt::Qwt APPEND PROPERTY IMPORTED_CONFIGURATIONS RELEASE)
            set_target_properties(Qwt::Qwt PROPERTIES
                IMPORTED_LOCATION_RELEASE "${QWT_LIBRARY_RELEASE}")
        endif()
        if (QWT_LIBRARY_DEBUG)
            set_property(TARGET Qwt::Qwt APPEND PROPERTY IMPORTED_CONFIGURATIONS DEBUG)
            set_target_properties(Qwt::Qwt PROPERTIES
                IMPORTED_LOCATION_DEBUG "${QWT_LIBRARY_DEBUG}")
        endif()
        target_include_directories(Qwt::Qwt INTERFACE "${QWT_INCLUDE_DIR}")
        set(Qwt_FOUND TRUE)
    endif()
endif()

if (NOT Qwt_FOUND)
    message(FATAL_ERROR "Qwt not found. Set QWT_ROOT to Qwt install prefix or provide QwtConfig.cmake")
endif()

add_executable(lab6_gui
    src/frontend/main.cpp
    src/frontend/ApiClient.cpp
    src/frontend/MainWindow.cpp
    src/backend/backend.cpp
    src/backend/server_main.cpp
    src/backend/common.cpp
    src/backend/sample.cpp
    src/backend/logging.cpp
    src/backend/simulator.cpp
    src/backend/db.cpp
    src/backend/http_server.cpp
    include/frontend/ApiClient.h
    include/frontend/MainWindow.h
    include/backend/backend.h
    include/backend/common.h
    include/backend/sample.h
    include/backend/logging.h
    include/backend/simulator.h
    include/backend/db.h
    include/backend/http_server.h
)

target_include_directories(lab6_gui PRIVATE
    include/frontend
    include/backend
)

target_link_libraries(lab6_gui
    PRIVATE
        Qt6::Widgets
        Qt6::Network
        Qwt::Qwt
        SQLite::SQLite3
        Threads::Threads
)

if (WIN32)
    target_compile_definitions(lab6_gui PRIVATE _WIN32_WINNT=0x0601)
    target_link_libraries(lab6_gui PRIVATE ws2_32)
endif()
