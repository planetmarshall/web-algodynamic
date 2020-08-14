cmake_minimum_required(VERSION 3.10)

project(algodynamic CXX)

set(SOURCES "uninit_demo.cpp")
set(CMAKE_CXX_FLAGS "--bind")

add_executable(algodynamic ${SOURCES})

install(
    TARGETS algodynamic
    RUNTIME DESTINATION js
)

install(
    FILES "$<TARGET_FILE_DIR:algodynamic>/$<TARGET_FILE_BASE_NAME:algodynamic>.wasm"
    DESTINATION js
)
