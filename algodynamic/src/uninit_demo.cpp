#include <emscripten/bind.h>

namespace em = emscripten;

unsigned long dodgy_cast() {
    return static_cast<unsigned long>(-1);
}

EMSCRIPTEN_BINDINGS(uninit) {
    em::function("dodgy_cast", &dodgy_cast);
}
