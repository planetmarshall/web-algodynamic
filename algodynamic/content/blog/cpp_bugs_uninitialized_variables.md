Title: Uninitialized Variables and Dodgy Casts
Date: 2020-02-05
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

It's immediately clear that the purpose of this code is to find the shape with the largest
number of vertices. This is something for which we already have an [STL Algorithm](https://en.cppreference.com/w/cpp/algorithm/max_element),
so we should probably just rewrite it to use the STL and be done with it. However, it's worth 
looking at exactly why this code is causing the application to crash, because it isn't immediately
obvious.

### Integer Conversions

Leaving aside the unitialized `largest_idx`, take a look at the conditional statement:

    :::c++
    if (shape[i].size() > max_vertices) { ... }

On the left side we have a 64bit unsigned integer, and on the right side we have a 32bit signed integer. So one of these
variables is going to be cast, but I had to go to the [C++ Standard](https://github.com/cplusplus/draft)
 to find out which. The section of interest goes by the unassuming name of the *Usual arithmetic conversions*,
 and goes something like this:
 
 1. If both integers are signed or unsigned, the smaller one gets promoted.
 2. **If the unsigned integer is bigger, the signed one gets converted.**
 3. If the signed integer can represent all the values of the unsigned integer, the unsigned one gets converted.
 4. Otherwise, both get converted to the unsigned type of the same size as the signed type.
 

Written out explicitly, our conditional expression becomes 

    :::c++
    uint64_t left = shape[i].size();
    uint64_t right = static_cast<uint64_t>(max_vertices); // max_vertices = -1
    
<button type="button" class="btn btn-run btn-sm" onclick="console.log(Module.dodgy_cast());">Run</button>

We can't represent `-1` with an unsigned integer, so C++ converts it to the signed integer with the same bit pattern,
 which in the case of `-1` is 2^64-1 or 1.844x10^19. In other words, 
  `right` is now the *largest possible value* that an unsigned 64bit integer can take, so the conditional
is never going to be true, and `largest_idx` is never going to be initialized. So we may as well rewrite the function as:

    :::c++
    vector<int> find_largest(const vector<vector<int>> & shapes) {
        int largest_idx, max_vertices = -1;
        return shapes[largest_idx];
    }
    
### Unitialized Variables

So why does it crash? Well, sometimes it does, sometimes it doesn't. It depends what happens to be on the stack frame
when `largest_idx` is declared. It might be `zero`, in which case the function will benignly return the first value
in the `shapes` array (which may or may not be the maximum). On the other hand, it may not be zero in which case

### Lessons

1. Listen to your Compiler. It knows things.
2. Use the STL.
