A Modern Cross Platform C++ Project from Scratch
################################################

:date: 2022-10-25
:category: C++

**TL;DR**: `Fork <https://github.com/planetmarshall/cpp_sample_project>`_ the project on Github.

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
* Static analysis with clang-tidy
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

In addition, raise the warning levels to their highest level. I have the following warning levels set in the code:

GCC and Clang::

    -Wall -Wextra -Wpedantic -Wconversion -Wconditional-uninitialized

MSVC::

    /W4 /permissive-

You may also wish to have all warnings flagged as errors in your code. Compiler level checks are one of the strengths of C++ and ignoring them can lead to subtle, and not so
subtle, bugs in your code. See my `other post <uninitialized-variables-and-dodgy-casts.html>`_ for an example.


CMake
-----

To a large degree the existence of CMake is what makes modern cross platform C++ development possible. Its syntax can
ba a bit obscure, but by its sheer ubiquity it is the defacto standard build system for C++. While strictly speaking
it is a "meta" build system, this detail has become less important in recent years with CMake getting native support
in IDEs like MSVC and CLion.

**Alternatives**

* `Meson <https://mesonbuild.com/>`_ is widely used especially by GNU projects.
* `Bazel <https://bazel.build/>`_ is used by Google projects such as Tensorflow and Google Test

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

Because Conan generates a toolchain file for use with CMake, there's some crossover in responsibility as you can use
Conan to setup your project in much the same way as you would use CMake Presets. That's not the approach I've gone for
here, and instead I use CMake Presets and just use Conan for dependency management.


Static Analysis
---------------

As a statically typed language, your compiler already does static analysis for you (which is why it makes sense
to build with multiple configurations). However tools such as `clang-tidy <https://clang.llvm.org/extra/clang-tidy/>`_
can pick up other issues such as readability and security issues. It's also worth mentioning that some clang-tidy checks
are project specific and others mutually exclusive, so check which ones are appropriate for your project.

Note when running clang tidy on Ubuntu I ran into this `bug <https://github.com/llvm/llvm-project/issues/46804>`_. See
the project github workflow files for a workaround.

Unit Tests
----------

Whilst the compiler can do some of the work for you, it can't verify your program for correct behaviour, so
some automated testing is necessary. I have used `Catch2 <https://github.com/catchorg/Catch2>`_ but this is
mostly just personal preference. If you have a free hand then pixk something that has good integration with your
IDE of choice.

**Alternatives**

* `Google Test <https://github.com/google/googletest>`_
* `Boost Test <https://www.boost.org/doc/libs/1_80_0/libs/test/doc/html/index.html>`_


Documentation
-------------

I haven't yet settled on a tool for automatic C++ API documentation. `Doxygen <https://doxygen.nl/>`_ is widely
used and is something of a defacto standard, but the style is somewhat dated and the default parsing engine is
an adhoc design rather than using the Clang parser
(although recent versions support using Clang, it isn't something I've tried).

For general documentation I use `Sphinx <https://www.sphinx-doc.org/en/master/index.html>`_ and my ideal solution
would be something like `clang-doc <https://clang.llvm.org/extra/clang-doc.html>`_ that would integrate with
Sphinx in the same way Doxygen does using `Breathe <https://breathe.readthedocs.io/en/latest/>`_


Continuous Integration
----------------------

Continuous Integration (CI) pulls all of these things together, and performs the crucial task of ensuring that your
code always compiles whenever changes are made. In addition you can also run tests and other automated tasks. The example
project performs the following tasks automatically:

* Runs ``clang-tidy`` against any changed files and fails on warnings
* Builds the project across the following compilers and platforms in both Debug and Release modes, in Shared and
  Static configurations

  =======     ===================
  Linux       GCC
  Linux       Clang, libstdc++
  Linux       Clang, LLVM libc++
  Windows     Visual Studio
  Windows     Visual Studio with Clang
  MacOS       Apple Clang (ARM64)
  =======     ===================

* Runs unit tests for each configuration
* Generates documentation with Sphinx and publishes to
  `Github Pages <https://planetmarshall.github.io/cpp_sample_project/>`_


**Alternatives**

* `Jenkins <https://www.jenkins.io/>`_
* `Travis <https://www.travis-ci.com/>`_
* `Appveyor <https://www.appveyor.com/>`_

Future Work
-----------

This project is pretty much open ended so I had to stop somewhere or it would go on for ever. There are a few
things I'd like to add which will hopefully be coming soon. These include but are not limited to:

* Support for CUDA and other GPU execution libraries
* Python bindings
* Support for sanitizers such as Clang's thread and `address sanitizers <https://clang.llvm.org/docs/AddressSanitizer.html>`_
* runtime analysis such as unit test coverage and memory consumption