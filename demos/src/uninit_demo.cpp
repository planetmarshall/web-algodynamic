#include <emscripten/bind.h>

#include <range/v3/algorithm.hpp>
#include <range/v3/action.hpp>
#include <range/v3/view.hpp>

#include <vector>
#include <algorithm>
#include <string>
#include <sstream>
#include <optional>
#include <chrono>
#include <iostream>


using std::vector;
namespace em = emscripten;

namespace bug {
vector<int> find_largest(const vector<vector<int>> &shapes) {
  int largest_idx, max_vertices = -1;
  for (int i = 0; i < shapes.size(); ++i) {
    if (shapes[i].size() > max_vertices) {
      largest_idx = i;
    }
  }
  return shapes[largest_idx];
}
}

namespace stl {
vector<int> find_largest(const vector<vector<int>> &shapes) {
  auto max_iter = std::max_element(
      shapes.begin(),
      shapes.end(),
      [] (const vector<int> & a, const vector<int> & b) { return a.size() < b.size(); }
  );
  if (max_iter == shapes.end()) {
    return {};
  }
  return *max_iter;
}
}

namespace cpp20 {
vector<int> find_largest(const vector<vector<int>> &shapes) {
  if (shapes.empty()) {
    return {};
  }
  return *ranges::max_element( shapes, {}, [](const auto &element) { return element.size(); });
}
}

namespace algo {
std::string to_string(const std::vector<int> &elements) {
  std::ostringstream oss;
  oss << "[ ";
  for (int v : elements ) {
    oss << v << ",";
  }
  oss << "]";
  return oss.str();
}
}

namespace demo {
  std::string stl_find_largest() {
    std::vector<std::vector<int>> shapes{
        {1, 2, 3, 4, 5},
        {4, 5, 6},
        {2, 5, 7, 3, 7, 4},
        {},
        {0}
    };
    auto shape = stl::find_largest(shapes);
    return algo::to_string(shape);
  }

  std::string ranges_find_largest() {
  std::vector<std::vector<int>> shapes{
      {1, 2, 3, 4, 5},
      {4, 5, 6},
      {},
      {2, 5, 7, 3, 7, 4},
      {0}
  };
  auto shape= cpp20::find_largest(shapes);
  return algo::to_string(shape);
}
}

unsigned long dodgy_cast() {
    return static_cast<uint32_t>(-1);
}

template<typename T>
void dummy(T x) {
  std::cout << x;
}

int uninitialized_int() {
  int val;
  return val;
}

EMSCRIPTEN_BINDINGS(uninit) {
  em::function("uninitialized_int", &uninitialized_int);
  em::function("find_largest", &demo::ranges_find_largest);
  em::function("dodgy_cast", &dodgy_cast);
}

