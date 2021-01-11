cmake_minimum_required(VERSION 3.10)

project(algodynamic CXX)

list(APPEND CMAKE_MODULE_PATH ${CMAKE_BINARY_DIR})
add_compile_options(-Wall -Wconversion -Wextra -pedantic -Wconditional-uninitialized)
find_package(range-v3 REQUIRED)

add_subdirectory(src)

