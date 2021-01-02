Title: Uninitialized Variables and Dodgy Casts
Date: 2020-12-30
Category: C++
Source: algodynamic.js

Soon after starting my current contract with a medical imaging company based in Oxford,
a member of the research team came to me to see if I could investigate an intermittent 
crash in their software. After examining the diagnostic logs, I traced the problem down
to the following bit of code - I've removed some details for clarity.

    :::c++
    vector<int> find_largest(const vector<vector<int>> & shapes) {
        int largest_idx, max_vertices = -1;
        for (int i = 0; i < shapes.size(); ++i ) {
            if (shape[i].size() > max_vertices) {
                largest_idx = i;
            }
        }
        return shapes[largest_idx];
    }

The purpose of this code is to find the shape with the largest
number of vertices. This is something for which we already have an [STL Algorithm](https://en.cppreference.com/w/cpp/algorithm/max_element),
so we should probably just rewrite it to use the STL and be done with it. However, it's worth 
looking at exactly why this code is causing the application to crash, because it might not be immediately
obvious.

### Integer Conversions

Leaving aside the uninitialized `largest_idx`, take a look at the conditional statement:

    :::c++
    if (shape[i].size() > max_vertices) { ... }

On the left side we have a 64bit unsigned integer, and on the right side we have a 32bit signed integer. So one of these
variables is going to be cast, but I had to go to the [C++ Standard](https://github.com/cplusplus/draft)
 to find out which. The section of interest goes by the unassuming name of the *Usual arithmetic conversions*,
 and goes something like this:
 
 1. If both integers are signed or unsigned, the smaller one gets promoted.
 2. **If the unsigned integer is "bigger", the signed one gets converted.**
 3. If the signed integer can represent all the values of the unsigned integer, the unsigned one gets converted.
 4. Otherwise, both get converted to the unsigned type of the same size as the signed type.
 

Since in Standardese, a 64 bit unsigned integer is "bigger" than a 32 bit "unsigned" integer, Rule 2 applies here, so `max_vertices` gets converted to the type of `shape[i].size()`, which is a `uint64_t`. If we
write this out explicitly, the conditional expression becomes:

    :::c++
    uint64_t num_vertices = shape[i].size();
    uint64_t max_vertices = static_cast<uint64_t>(-1);
    
!!demo:dodgy_cast()!!
    :::c++
    // Javascript doesn't support 64 bit integers, 
    // so we cast to a 32 bit unsigned type instead
    std::cout << static_cast<uint32_t>(-1);
!!demo!!
    
    
We can't represent `-1` with an unsigned integer, so C++ converts it to the signed integer with the same bit pattern,
 which in the case of `-1` is 2^64-1 or 1.844x10^19. In other words, 
  `max_vertices` is now the *largest possible value* that an unsigned 64bit integer can take, so the conditional
is never going to be true, and `largest_idx` is never going to be initialized. So we may as well rewrite the function as:

    :::c++
    vector<int> find_largest(const vector<vector<int>> & shapes) {
        int largest_idx, max_vertices = -1;
        return shapes[largest_idx];
    }
    
### Uninitialized Variables

So why does it crash? Well, sometimes it does, sometimes it doesn't. It depends what happens to be on the stack frame
when `largest_idx` is declared, which depends entirely on what the program was doing immediately before the function
 was called. In many cases it will be `zero`, in which case the function will benignly return the first value
in the `shapes` array (which may or may not be the maximum). On the other hand, it could be some value way outside the
bounds of the array which will cause the program to crash.

!!demo:uninitialized_int()!!
    :::c++
    int uninitialized_int() {
        int val;
        return val;
    }
!!demo!!

### Compiler Warnings

One advantage of a statically compiled language like C++ is that the compiler can tell you all of these things before
code like this ever goes into production, but it may not do so by default. If you are using [Clang](https://clang.llvm.org/),
then compiling with `-Wconversion -Wconditional-uninitialized` will flag all of the above issues (note that `-Wall` alone in Clang
will not flag any of these issues, although it will in GCC). I have these warnings enabled by default in my build system.
You can play with diagnostic flags in various compilers with the excellent [Compiler Explorer](https://godbolt.org/z/bKhqe8)

### The Solution

While we could fix the code using the compiler warnings as a guide, a more sensible approach is just to use the STL.

    :::c++
    vector<int> find_largest(const vector<vector<int>> & shapes) {
      if (shapes.empty()) {
        return {};
      }
      auto max_iter = std::max_element(
        shapes.begin(),
        shapes.end(),
        [] (const vector<int> & a, const vector<int> & b) { return a.size() < b.size(); }
      );  
    return *max_iter;
    }
   
However, if you are using C++20 (Or a Ranges support library such as the excellent
 [range-v3](https://github.com/ericniebler/range-v3)), then we can go one better and remove the redundant `begin/end`
 iterators.
 
    :::c++
    vector<int> find_largest(const vector<vector<int>> & shapes) {
      if (shapes.empty()) {
        return {};
      }
      return ranges::max_element(shapes, {}, [] (const auto & v) { return v.size(); });
    }
 
!!demo:find_largest()!!
    :::c++
    vector<int> find_largest(const vector<vector<int>> & shapes) {
      if (shapes.empty()) {
        return {};
      }
      return ranges::max_element(shapes, {}, [] (const auto & v) { return v.size(); });
    }
    vector<vector<int>> shapes{
      {1, 2, 3, 4, 5},
      {4, 5, 6},
      {},
      {2, 5, 7, 3, 7, 4},
      {0}
    }
    std::cout << find_largest(shapes) << std::endl;  
!!demo!!

### TL;DR

1. Turn on your compiler warnings and don't ignore them.
2. Familiarize yourself with the STL and use it.
