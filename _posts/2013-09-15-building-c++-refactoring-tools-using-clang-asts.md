---
layout: post
title: Building C++ Refactoring Tools Using Clang Abstract Syntax Trees
tags: [Coding]
published: true
---
Those with an interest in such things can't help but have noticed that C++ is experiencing something of a renaissance of late. This has been precipitated by the release of a new standard, C++11 (recently superceded by the impressive sounding but relatively minor C++14), with its introduction of features such as lambda functions and implicit typing (via the `auto` keyword) - features that have finally made the STL useable. One thing C++ still lacks is an abundance of refactoring tools - and this is where Clang comes in.

Clang
-----

Clang is an open source C++ compiler built on top of the compiler framework LLVM, which has received considerable attention from the likes of Google and Nvidia - the latter having adopted it as the basis for their CUDA compiler. My main focus here though is not the compiler itself, but rather the tooling library built on top of Clang that allows parsing and manipulation of Abstract Syntax Trees produced by the compiler.

Abstract Syntax Trees
---------------------

Abstract Syntax Trees, or ASTs, are an alternative representation of source code produced by the compiler of the programming language in question - in this case C++. So what do these trees look like? The syntax tree of even the most basic program can be huge, but here's a simple function:

{% highlight c++ linenos %}
int add( int a, int b ) {
	int z = a + b;
	return z;
}
{% endhighlight %}

And here's its AST:

{% highlight cpp %}
-FunctionDecl 0x2c0de40 <test.cpp:1:1, line:4:1> add 'int (int, int)'
  |-ParmVarDecl 0x2c0dd00 <line:1:11, col:15> a 'int'
  |-ParmVarDecl 0x2c0dd70 <col:18, col:22> b 'int'
  `-CompoundStmt 0x2c393c0 <col:26, line:4:1>
    |-DeclStmt 0x2c0e000 <line:2:2, col:15>
    | `-VarDecl 0x2c0df00 <col:2, col:14> z 'int'
    |   `-BinaryOperator 0x2c0dfd8 <col:10, col:14> 'int' '+'
    |     |-ImplicitCastExpr 0x2c0dfa8 <col:10> 'int' <LValueToRValue>
    |     | `-DeclRefExpr 0x2c0df58 <col:10> 'int' lvalue ParmVar 0x2c0dd00 'a' 'int'
    |     `-ImplicitCastExpr 0x2c0dfc0 <col:14> 'int' <LValueToRValue>
    |       `-DeclRefExpr 0x2c0df80 <col:14> 'int' lvalue ParmVar 0x2c0dd70 'b' 'int'
    `-ReturnStmt 0x2c393a0 <line:3:2, col:9>
      `-ImplicitCastExpr 0x2c0e040 <col:9> 'int' <LValueToRValue>
        `-DeclRefExpr 0x2c0e018 <col:9> 'int' lvalue Var 0x2c0df00 'z' 'int'
{% endhighlight %}

It's certainly possible to write refactoring tools using just regular expression based parsing of the original source code, however because Clang understands C++, tools written to process the tree representation of the source code rather than the original text can make use of the much richer semantic information available to the compiler. From the tree above, you can see that each 

