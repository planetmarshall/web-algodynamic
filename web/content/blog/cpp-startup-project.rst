A Modern Cross Platform C++ Project from Scratch
################################################

:date: 2021-08-08
:category: C++

In the working life of a Software Engineer, it's actually pretty rare that you get to start
a project from scratch - at least in my experience. It's more likely that you'll be working within the constraints of
an existing project that could be decades old, in which case a lot of choices will have been made for you. Since there's
no real standardized way to set up a C++ project, every project you work on could look radically different.

Occasionally though, you get the chance to make a fresh start, or at least work on a project that is in the
early stages of development. This is my take on the "Hello World" program for
Modern C++, and is the basis for any new C++ projects that I create, and for smaller projects I work on where I am lucky
enough to have "carte blanche" to manage the project. Very few of these things conform to any kind of
"standard", most are just personal choices, but I have tried to give some
reasoning behind them. For every choice that I've made, there are probably several alternatives which are just as good.

TL;DR: `Fork <https://github.com/planetmarshall/cpp_sample_project>`_ the project on Github.

In summary, the components of the skeleton project are:

* C++20 Standard
* Compilation with GCC, Clang and MSVC on multiple platforms
* Additional C++ Libraries: `range-v3 <https://github.com/ericniebler/range-v3>`_,
  `fmt <https://github.com/fmtlib/fmt>`_, `boost <https://www.boost.org/>`_
* Source Control with Git
* Build system using `CMake <https://cmake.org/>`_ and `Ninja <https://ninja-build.org/>`_
* Dependency and package management with `Conan <https://docs.conan.io/en/latest/>`_
* Continuous Integration with Github Workflows
* Unit testing with Catch2
* System testing with Python
* Static analysis with clang-tidy
* Runtime analysis with clang coverage
* Documentation with Sphinx

Many of the ideas have come from the following references:

* `An Introduction to Modern CMake <https://cliutils.gitlab.io/modern-cmake/chapters/basics/structure.html>`_
* Jason Turner's `C++ Best Practices <https://leanpub.com/cppbestpractices>`_ book (Jason also has a
  `C++ starter project <https://github.com/cpp-best-practices/gui_starter_template>`_
  you may wish to check out).

Project structure
-----------------

As mentioned above, there are a lot of ways of setting up a C++ project, and to some degree this
may have been dictated by your choice of build system. If you have soley used Microsoft Visual Studio, for example,
it's likely your project will be set up in a certain way. As a starting point I've used the project layout from
`An Introduction to Modern CMake <https://cliutils.gitlab.io/modern-cmake/chapters/basics/structure.html>`_

One of the things I like about this layout is the physical separation of interface (in public include files) from
implementation. While you may have no intention of making your code publicly available in some kind of library, and
are only making a single application - there's definitely something to be said for coding *as if* you were going to
make your code public.


Compilers
---------

My starting assumption is that you are developing a project that can be run on multiple platforms, otherwise much of
this will not be applicable. Assuming you are, then I recommend from the outset your project can be successfully
compiled with the three major compilers:

* GCC
* Clang
* MSVC

In addition, raise the warning levels to their highest level. You may also wish to have all warnings flagged as errors
in your code. Compiler level checks are one of the strengths of C++ and ignoring them can lead to subtle, and not so
subtle, bugs in your code.


CMake
-----

To a large degree the existence of CMake is what makes modern cross platform C++ development possible. It certainly
has its detractors, but by its sheer ubiquity it is the defacto standard build system for C++. While strictly speaking
it is a "meta" build system, this detail has become less important in recent years with CMake getting native support
in IDEs like MSVC and CLion.

Alternatives

* Meson
* Bazel

Conan
-----

`Conan <https://docs.conan.io/en/latest/>`_ fills a gap that has existed for a remarkably long time in C++ development,
that of package and dependency
management. Think of pip or npm for C++. It's come a long way in the past few years, and while it may not yet
be a defacto standard, it's heading in that direction.
The `Conan Centre Index (CCI) <https://github.com/conan-io/conan-center-index>`_ contains packages for
many of the most widely used C++ libraries, such as Boost, Eigen and OpenCV.

Conan and CMake
~~~~~~~~~~~~~~~

Conan works tightly together with CMake and one of its major advantages is its ability to generate CMake module files
for all of your dependencies, regardless of what build system the dependency originally used.

Because Conan generates a toolcahin file for use with CMake, there's some crossover in responsibility as you can use
Conan to setup your project in much the same way as you would use CMake Presets. That's not the approcah I've gone for
here, and instead I use CMake Presets and just use Conan for dependency management.


Static Analysis
---------------

As a statically typed language, your compiler already does static analysis for you (which is why it makes sense
to build with multiple configurations). However

Note when running clang tidy on Ubuntu I ran into this bug - https://github.com/llvm/llvm-project/issues/46804


Documentation
-------------

I have yet to find a satisfactory solution for documentation of C++ source. Doxygen is widely used
and the format is a defacto standard, but the source is dated and
has fallen behind in support for some of the latest C++ features -

References


Continuous Integration
----------------------

As I'm using Github, I've opted to use Github Workflows (other options are available). As I'm also using Conan

The particular configurations you choose to use will depend on your project, but as I'm mostly interested in using
the latest C++ features (ie C++20), I'll only be using the latest compilers. I use a github workflow matrix build
to build for the following configurations

=======     ===================
Linux       GCC 11
Linux       Clang 11, libstdc++
Linux       Clang 11, libc++
Windows     Visual Studio 2019
MacOS       Apple Clang 12
=======     ===================

As mentioned above, you can use Conan to
`build <https://docs.conan.io/en/latest/mastering/conanfile_py.html#conan-build>`_ the project in CI, this has the
advantage that Conan will manage most of your CMake settings for you, some of which can be quite intricate
( such as
`Position Independent Code <https://cmake.org/cmake/help/latest/prop_tgt/POSITION_INDEPENDENT_CODE.html>`_
and `RPATH <https://gitlab.kitware.com/cmake/community/-/wikis/doc/cmake/RPATH-handling>`_ settings ).



Runtime Analysis
----------------