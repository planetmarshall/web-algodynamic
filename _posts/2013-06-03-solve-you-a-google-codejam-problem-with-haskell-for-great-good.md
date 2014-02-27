---
layout: post
title: Solve You a Google Codejam Problem with Haskell for Great Good*
tags: [Coding, Maths]
published: false
---
Every year Google runs a [CodeJam competition](http://code.google.com/codejam/ "Google CodeJam") for programmers with a competitive streak. There are several rounds, with the problems in each round usually being based on classic computer science problems, such as graph traversal or combinatorial optimization, with just enough variation thrown in to force you to think for yourself ( and presumably to make it tricky to use a prepackaged library function that can do it in one line of code ). Since on my list of things to do this year was to learn Haskell, I decided to use [one of the previous contests](http://code.google.com/codejam/contest/32016/dashboard#s=p0 "Google CodeJame 2008, Round 1") to make use of the language and to explore some algorithms.

This seemingly dodgy grammar is in reference to the Haskell Tutorial <a href="http://learnyouahaskell.com/" target="_blank">"Learn You a Haskell for Great Good</a>", possibly the greatest programming language tutorial ever written, and the basis of much of the work I've done here. It's available online for free, but I recommend buying a copy if only because the author deserves it.

I've chosen to tackle the first and third problems ( mainly because I didn't find the second very interesting ). The third problem, 'Numbers' will be detailed in a follow up post. It was going to be part of this one but then it exploded somewhat as I went off on exploratory algorithmic tangents.

Scalar Product
---------------

>You are given two vectors {% m v_1=(x_1,x_2,\dotsb,x_n) %} and {% m v_2=(y_1,y_2,\dotsb,y_n) %}...Suppose you are allowed to permute the coordinates of each vector as you wish. Choose two permutations such that the scalar product of your two new vectors is the smallest possible, and output that minimum scalar product.

This is classic combinatorial optimization, and can be restated in terms of the Linear Assignment problem: Given a component {% m x_i %} in the vector {% m v_1 %}, assign to it a component {% m y_i %} in the vector {% m v_2 %} such that the total cost {% m \sum^n x_i y_i %} is minimized.

The Hungarian Algorithm
-----------------------

The most obvious solution is simple brute force, trying each pairwise component in turn until we find the minimum. It should be equally obvious that we can rule this out out for all but the smallest vectors as it has {% m O(n!) %} complexity ( There are {% m n! %} ways of permuting a vector with {% m n %} elements). Fortunately there exists a much more efficient solution for this problem known as the [Hungarian Method](http://en.wikipedia.org/wiki/Hungarian_algorithm), which has {% m O(n^3) %} complexity. [This series of slides](http://www.math.harvard.edu/archive/20_spring_05/handouts/assignment_overheads.pdf) from Harvard explain it better and is the basis of the Haskell implementation. As an example, take the vectors {% m \mathbf{x}=(1,-5,3) %} and {% m \mathbf{y}=(-2,1,4) %}. Then write the product of each pair of components as a cost matrix,

{% math %}
\mathbf{x}\cdot\mathbf{y}^T =
\begin{pmatrix}
-2 & 10 & -6 \\
1 & -5 & 3 \\
4 & -20 & 12
\end{pmatrix}
{% endmath %}

The key to the Hungarian Algorithm is the observation that adding ( or subtracting ) a constant value from any row or column does not change the nature of the solution. If we can do this in such a way so that there is a zero in the matrix for each assignment, then we have a solution.

In Haskell, we can create the cost matrix using the [hmatrix](http://hackage.haskell.org/package/hmatrix-0.14.1.0) library, as follows,

{% highlight haskell %}
costMatrix :: ([Double],[Double]) -> Matrix Double
costMatrix (u,v) = (mx u) * (trans $ mx u)
    where mx w = fromLists [w]
{% endhighlight %}


{% highlight haskell %}
ghci > costMatrix([1,-5,3],[-2,1,4])
3><3
[ -2.0, 10.0, -6.0
,  1.0, -5.0, 3.0
, 4.0, -20.0, 12.0 ]
{% endhighlight %}

The first step is to find the minimum value of each row in the cost matrix and then subtract that value from each row. This leaves the matrix with a zero in each row, indicating the lowest cost assignment. This new matrix may not be a solution, however, as those zeros could all lie in the same column - that is, the solution does not constitute a 'perfect matching'. It so happens that determining if we have a valid solution or not constitutes the bulk of the algorithm.

Imagine drawing a line over one column or row of the matrix, covering its zeroes. When it requires exactly N lines where N is the size of the vector, then the problem is solved. While it's easy to do this by eye for a small, say 3x3, cost matrix, we require a more systematic method - something that will scale to matrices with perhaps thousands of elements. I've opted for a classic divide-and-conquer pattern, something that is easily implemented in a functional programming language with recursion 

Having defined a few utility functions (see the full implementation for details on these), the recursive function which crosses out the zeros in the matrix looks like this:

{% highlight haskell %}
zeroSlices :: Maybe (Matrix Double) -> [(Slice,Int)]
zeroSlices Nothing = []
zeroSlices mx 
	| nextZero == Nothing = []
	| otherwise = minimumBy (compare `on` length) [(Row, j):rowsDropped, (Column, i):columnsDropped]
	where	nextZero = nextZeroIndex $ fromJust mx
		rowsDropped = zeroSlices $ dropSlice mx Row j
		columnsDropped = zeroSlices $ dropSlice mx Column i
		j = fst index
		i = snd index
		index = fromJust nextZero
{% endhighlight %}

The zeroSlices procedure returns a list of the least number of slices required to cross all the zeros out of the matrix. If the matrix argument is empty, or contains no zeroes, it returns an empty list. Otherwise, it finds the next zero in the matrix, creates two submatrices with the zero removed (one by removing the column and one by removing the row), and calls itself for each submatrix. The diagram below illustrates the first few calls.

{% highlight haskell %}
ghci> let cost = costMatrix([1,-5,3],[-2,1,4])
ghci> zeroSlices $ Just $ subtractMinRow cost
[]
{% endhighlight %}

Although the recursive approach is convenient, the position of each zero in the returned list is relative, as each recursive invocation 'sees' a different matrix. We need a further routine to modify the list so that we can use it.

Adjusting the indices in this way is an {% m O(n^2) %} operation, an obvious 'code smell' indicative of a poor choice of data structure for this particular method. What we really want is a numpy-style 'masked array', which would allow us to operate on a reduced matrix without affecting the indices. At the time of writing no such data structure exists for Haskell, which would certainly be something worth revisiting at a later stage.

Clearly we need to do more work before we can solve this matrix, so now we move onto the algorithm proper. The first step subtract from each row, the minimum value of that row. That leaves us with a zero in each row.

{% math %}
 \begin{pmatrix}
 -2 & 10 & -6 \\
 1 & -5 & 3 \\
 4 & -20 & 12
 \end{pmatrix}
 \longrightarrow
 \begin{pmatrix}
 4 & 16 & 0 \\
 6 & 0 & 8 \\
 24 & 0 & 32
 \end{pmatrix}
{% endmath %}

{% highlight haskell %}
ghci> let a = costMatrix([1,-5,3],[-2,1,4])
ghci> subtractMinRow a 
3><3
[ 4.0,  16.0,  0.0,
 6.0, 0.0, 8.0,
  24.0,  0.0, 32.0]
{% endhighlight %}

The function `subtractMinRow` looks like this:

{% highlight haskell %}
subtractMinRow m = fromRows [v - min | v <- (toRows m), let min = minVec v ]
    where minVec v = scalar . minimum $ toList v
{% endhighlight %}

We then check this new matrix for a solution

{% highlight haskell %}
ghci> let b = subtractMinRow a
ghci> zeroSlices $ Just b
[(Row,0),(Column,1)]
{% endhighlight %}

The result tells us we can eliminate all the zeroes in the matrix with two slices. This is not sufficient for a solution, so the next step is to repeat the above steps with the columns of the matrix.

{% math %}
\begin{pmatrix}
 4 & 16 & 0 \\
 6 & 0 & 8 \\
 24 & 0 & 32
\end{pmatrix}
\longrightarrow
\begin{pmatrix}
 0 & 16 & 0 \\
 2 & 0 & 8 \\
 20 & 0 & 32
\end{pmatrix}
{% endmath %}

{% highlight haskell %}
ghci> let c = trans $ subtractMinRow $ trans b 
ghci> zeroSlices $ Just b
[(Row,0),(Column,1)]
{% endhighlight %}

Again, two slices are sufficient, but we need three for a valid solution.

The next step is to find the minimum value that is not covered by a slice. We can do this quite neatly with our list of slices and the fold function. `dropSlice` removes a slice from a matrix and has the following signature

{% highlight haskell %}
dropSlice :: Maybe (Matrix Double) -> (Slice, Int) -> Maybe (Matrix Double)
{% endhighlight %}

So the following `foldl` call will reduce the matrix to just the elements not covered by a slice

{% highlight haskell %}
ghci> foldl dropSlice (Just c) [(Row,0),(Column,1)]
Just (2><2)
 [  2.0,  8.0
 , 20.0, 32.0 ]
{% endhighlight %}

The minimum uncovered value here is 2. We then add this value to the rows of the matrix not covered by a slice. To do this we construct a new matrix with the appropriate elements and perform a matrix addition

