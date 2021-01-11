set(SOURCES "uninit_demo.cpp")

add_executable(algodynamic ${SOURCES})
target_compile_features(algodynamic PRIVATE cxx_std_17)
target_link_libraries(algodynamic PRIVATE range-v3::range-v3)
target_compile_options(algodynamic PRIVATE "--bind")
target_link_options(algodynamic PRIVATE "--bind")

install(
    TARGETS algodynamic
    RUNTIME DESTINATION js
)

install(
    FILES "$<TARGET_FILE_DIR:algodynamic>/$<TARGET_FILE_BASE_NAME:algodynamic>.wasm"
    DESTINATION js
)
