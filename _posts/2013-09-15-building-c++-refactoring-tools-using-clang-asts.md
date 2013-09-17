---
layout: post
title: Building C++ Refactoring Tools Using Clang Abstract Syntax Trees
tags: [Coding]
published: true
---
Those with an interest in such things can't help but have noticed that C++ is experiencing something of a renaissance of late. This has been precipitated by the release of a new standard, C++11 (recently superceded by the impressive sounding but relatively minor C++14), with its introduction of features such as lambda functions and implicit typing (via the `auto` keyword) - features that have finally made the STL useable. One thing C++ still lacks is an abundance of refactoring tools - and this is where Clang comes in.

Clang
-----

Clang is an open source compiler framework built on top of the compiler framework LLVM, which has received considerable attention from the likes of Google and Nvidia - the latter having adopted it as the basis for their CUDA compiler. My main focus here though is not the use of the compiler, but rather the tooling library built on top of Clang that allows parsing and manipulation of Abstract Syntax Trees produced by the compiler.

Abstract Syntax Trees
---------------------

Abstract Syntax Trees, or ASTs, are an alternative representation of source code produced by the compiler of the programming language in question - in this case C++. So what do these trees look like? The syntax tree of even the most basic program can be huge....


It's certainly possible to write refactoring tools using just regular expression based parsing of the original source code, however because Clang understands C++, tools written to process the tree representation of the source code rather than the original text can make use of the much richer semantic information available to the compiler. 



