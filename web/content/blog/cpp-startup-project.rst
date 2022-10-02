A Modern C++ Project from Scratch
#################################

:date: 2021-08-08
:category: C++

In the working life of a Software Engineer, it's actually pretty rare that you get to start
a project from scratch - at least in my experience. It's more likely that you'll be working within the constraints of
an existing project that could be decades old, with everything that entails.

Occasionally though, you get the chance to make a fresh start. This is my take on the "Hello World" program for
Modern C++, and is the basis for any new C++ projects that I create. I have included the following features

* C++ Standard from C++20+
* Source Control with Git
* Build system using CMake and Ninja
* Dependency and package management with Conan
* Continuous Integration with Github Workflows
* Unit testing with Catch2
* Static analysis with clang-tidy
* Runtime analysis with clang coverage
* Python integration

Many of the ideas have come from the following references:

* `An Introduction to Modern CMake <https://cliutils.gitlab.io/modern-cmake/chapters/basics/structure.html>`_
* Jason Turner's book

Project structure
-----------------

As a starting point I've used the project layout from
`An Introduction to Modern CMake <https://cliutils.gitlab.io/modern-cmake/chapters/basics/structure.html>`_


Git
---


CMake
-----

Love it or hate it (actually I don't know anyone that really "loves" CMake, and there are plenty who profess to
hate it) CMake is ubiquitous in the C++ community and is a de-facto standard way to build your project.

Conan
-----

`Conan <https://docs.conan.io/en/latest/>`_ fills a gap that has existed for a remarkably long time in C++ development,
that of package and dependency
management. Think of pip or npm for C++. It's come a long way in the past few years, and while it may not yet
be a defacto standard, it's heading in that direction.
The `Conan Centre Index (CCI) <https://github.com/conan-io/conan-center-index>`_ contains packages for
many of the most widely used C++ libraries, such as Boost and OpenCV.

There are a few different ways of using Conan. One way is just to manage the dependencies of your project, which
is typically done with a ``conanfile.txt`` file. Generally you install your dependencies with Conan and let CMake or
your build system of choice take care of the rest.

Another approach, and the one I've taken here, is to create a more comprehensive ``conanfile.py`` file.
The advantage of this approach is that you can have more powerful dependency management, for example based on target
platform or configuration options, in addition to leveraging Conan's tight integration with CMake to handle the
build configuration process. This is particularly useful when building multiple configurations on CI.

Python
------

This may not be applicable to your project, but increasingly I find myself writing C++ as a backend for software where
the user facing component is primarily Python. `Tensorflow <https://www.tensorflow.org/>`_, for example,
fits into this category. For python integration I use `pybind <https://github.com/pybind/pybind11>`_

Documentation
-------------

I have yet to find a satisfactory solution for documentation of C++ source. Doxygen is widely used
and the format is a defacto standard, but the source is dated and
has fallen behind in support for some of the latest C++ features - to this end I've decided to write my own
(more on that in another post...).

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


Static Analysis
---------------

As a statically typed language, your compiler already does static analysis for you (which is why it makes sense
to build with multiple configurations). However

Runtime Analysis
----------------