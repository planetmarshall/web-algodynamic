---
layout: post
title: Building C++ Refactoring Tools Using Clang Abstract Syntax Trees
tags: [Coding]
published: true
---
Those with an interest in such things can't help but have noticed that C++ is experiencing something of a renaissance of late. This has been precipitated by the release of a new standard, C++11 (recently superceded by the impressive sounding but relatively minor C++14), with its introduction of features such as lambda functions and implicit typing (via the `auto` keyword) - features that have finally made the STL useable. One thing C++ still lacks is an abundance of refactoring tools - and this is where Clang comes in.

Clang
-----

Clang is an open source compiler framework built on top of LLVM, and has received considerable attention from the likes of Google and Nvidia - the latter having adopted it as the basis for their CUDA compiler.

