---
layout: math_post
title: Solve You a Google Codejam Problem with Haskell for Great Good*
tags: []
type: post
---
Every year Google runs a [CodeJam competition](http://code.google.com/codejam/ "Google CodeJam") for programmers with a competitive streak. There are several rounds, with the problems in each round usually being based on classic computer science problems, such as graph traversal or combinatorial optimization, with just enough variation thrown in to force you to think for yourself ( and presumably to make it tricky to use a prepackaged library function that can do it in one line of code ). Since on my list of things to do this year was to learn Haskell, I decided to use [one of the previous contests](http://code.google.com/codejam/contest/32016/dashboard#s=p0 "Google CodeJame 2008, Round 1") to make use of the language and to explore some algorithms.

This seemingly dodgy grammar is in reference to the Haskell Tutorial <a href="http://learnyouahaskell.com/" target="_blank">"Learn You a Haskell for Great Good</a>", possibly the greatest programming language tutorial ever written, and the basis of much of the work I've done here. It's available online for free, but I recommend buying a copy if only because the author deserves it.

I've chosen to tackle the first and third problems ( mainly because I didn't find the second very interesting ). The third problem, 'Numbers' will be detailed in a follow up post. It was going to be part of this one but then it exploded somewhat as I went off on exploratory algorithmic tangents.

Scalar Product
==============
>You are given two vectors {% m v_1=(x_1,x_2,\dotsb,x_n) %} and {% m v_2=(y_1,y_2,\dotsb,y_n) %}...Suppose you are allowed to permute the coordinates of each vector as you wish. Choose two permutations such that the scalar product of your two new vectors is the smallest possible, and output that minimum scalar product.
This is classic combinatorial optimization, and can be restated in terms of the Linear Assignment problem,
>Given a component {% m x_i %} in the vector {% m v_1 %}, assign to it a component {% m y_i %} in the vector {% m v_2 %} such that the total cost {% m \sum^n x_i y_i %} is minimized.

The Hungarian Algorithm
=======================
The most obvious solution is simple brute force, trying each pairwise component in turn until we find the minimum. It should be equally obvious that we can rule this out out for all but the smallest vectors as it has {% m O(n!) %} complexity ( There are {% m n! %} ways of permuting a vector with {% m n %} elements). Fortunately there exists a much more efficient solution for this problem known as the <a title="Hungarian Algorithm from Wikipedia" href="http://en.wikipedia.org/wiki/Hungarian_algorithm" target="_blank">Hungarian Method</a>. As an example, take the vectors {% m \mathbf{x}=(1,-5,3) %} and {% m \mathbf{y}=(-2,1,4) %}. Then write the product of each pair of components as a cost matrix,

{% math %}
\mathbf{x}\cdot\mathbf{y}^T =
\begin{pmatrix}
-2 & 10 & -6 \\
1 & -5 & 3 \\
4 & -20 & 12
\end{pmatrix}
{% endmath %}

The key to the Hungarian Algorithm is the observation that adding ( or subtracting ) a constant value from any row or column does not change the nature of the solution. If we can do this in such a way so that there is a zero in the matrix for each assignment, then we have a solution.

In Haskell, we can create the cost matrix using the <a title="hmatrix 0.14" href="http://hackage.haskell.org/package/hmatrix-0.14.1.0" target="_blank">hmatrix</a> library, as follows,

{% highlight haskell %}
import Numeric.LinearAlgebra

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

The first thing to determine is if the problem is actually solved, as it's possible that the components of the vectors could already be arranged such that the scalar product is minimized. Imagine drawing a line over one column or row of the matrix, covering its zeroes. When it requires exactly N lines where N is the size of the vector, then the problem is solved. As it happens, determining if we have a solution constitutes the bulk of the algorithm - which I've decided to implement as a backtracking search. This kind of recursive approach is easy to implement using functional programming.

First we define a few utility functions

This function gets a 2 dimensional index for the next zero in the matrix
{% highlight haskell %}
nextZeroIndex :: Matrix Double -> Maybe (Int,Int)
nextZeroIndex mx = i >>= \k -> return (k `div` n, k `mod` n)
  where i = elemIndex 0.0 $ toList $ flatten mx
        n = rows mx
{% endhighlight %}

A Slice is a simple type that represents a matrix row or column
{% highlight haskell %}
data Slice = Row | Column
{% endhighlight %}

Create a new matrix by dropping a row or column
{% highlight haskell %}
dropSlice :: Matrix Double -> Slice -> Int -> Matrix Double
dropSlice mx Row i
	| i == 0 = dropRows 0 mx
	| i == (rows mx) - 1 = takeRows (i-1) mx
	| otherwise = fromBlocks [[takeRows i mx],[ dropRows i+1 mx] ]
dropSlice mx Column i
	| i == 0 = dropColumns 0 mx
	| i == (cols mx) - 1 = takeColumns (i-1) mx
	| otherwise = fromBlocks [[takeColumns i mx, dropColumns i+1 mx] ]
{% endhighlight %}

We can now evaluate a cost matrix as follows

Determine if a cost matrix is solved
{% highlight haskell %}
zeroSlices :: Matrix Double 
zeroSlices mx = 
  | nextZero == Nothing = []
  | otherwise = minimumBy (compare `on` length) [rowIndex:rowDropped,columnIndex:columnDropped]
  where nextZero = nextZeroIndex mx
        rowDropped = zeroSlices (dropSlice mx rowIndex )
        columnDropped = zeroSlices (dropSlice mx columnIndex)
        rowIndex = Row $ fst nextZero
        columnIndex = Column $ snd nextZero
{% endhighlight %}

The zeroSlices procedure returns a list of the least number of slices required to cross all the zeros out of the matrix. Recursive functions can be tricky to describe, the diagram below illustrates how it works.

To establish this, I've decided to use a backtracking search, as such things are usually quite neat to write in functional languages. Wikipedia describes another approach. I'll write this search as a recursive function, so some termination criteria are needed.
<ol>
	<li>We cover all zeros using exactly N lines</li>
	<li>We cover all zeros using the smallest possible number of lines</li>
	<li>We exhaust all possibilities</li>
</ol>
The first step in the algorithm is to subtract from each row, the minimum value of that row. That leaves us with a zero in each row, but in this case the matrix is not solved as the zeroes in rows 1 and 3 lie in the same column.

{% math %}
 \begin{pmatrix}
 1 & 2 & 4 \\
 -5 & -10 & -20 \\
 3 & 6 & 12
 \end{pmatrix}
 \longrightarrow
 \begin{pmatrix}
 0 & 1 & 3 \\
 15 & 10 & 0 \\
 0 & 3 & 9
 \end{pmatrix}
{% endmath %}

{% highlight haskell %}
subtractMin m = fromRows [v - min | v <- (toRows m), let min = minVec v ]
    where minVec v = scalar . minimum $ toList v
{% endhighlight %}

{% highlight haskell %}
ghci> subtractMin mx
3><3
[ 0.0,  1.0,  3.0,
 15.0, 10.0, 0.0,
  0.0,  3.0, 9.0]
ghci> isSolved ( subtractMin mx )
False
{% endhighlight %}

We then repeat the step but on the columns of the matrix.

{% math %}
\begin{pmatrix}
0 & 1 & 3 \\
15 & 10 & 0 \\
0 & 3 & 9
\end{pmatrix}
\longrightarrow
\begin{pmatrix}
0 & 0 & 3 \\
15 & 9 & 0 \\
0 & 2 & 9
\end{pmatrix}
{% endmath %}

In haskell this is done by simply performing the same step on the transposed matrix ( and transposing the result )

{% highlight haskell %}
ghci> trans . subtractMin . trans mx
3><3
[ 0.0,  0.0,  3.0,
 15.0, 9.0, 0.0,
  0.0,  2.0, 9.0]
ghci> isSolved ( trans . subtractMin $ trans mx )
False
{% endhighlight %}

In actual fact, the first step in implementing this algorithm is determining when it is solved. Looking at the graph, we need a minimum cost 'perfect matching'. Such an outcome is illustrated below. In terms of the matrix, we need a zero in each row such that none share the same column ( or, equivalently, a zero in each column so that none share the same row ). Easy to say, not so easy to actually do. While it's immediately obvious from the 3x3 matrix above that it is solved, it's not so obvious how to scale this up to, say, a matrix with 10,000 elements.

I've opted to do this using a backtracking search. At each step we find the zeros in the current row, and then eliminate the columns containing those zeros from the rest of the matrix and continue with the next row. The problem is solved if we can reach the end of the matrix without stopping. This kind of recursive algorithm is easy to express in a functional programming language like Haskell.

{% highlight haskell %}
solution :: Matrix Double -> [Int]
solution mx
  | length sol == rows mx = sol
  | otherwise = []
  where sol = findZeros $ toLists mx

findZeros :: ([[Double]],Int) -> [Int]
findZeros  (_,-2) = []
findZeros ((firstRow:rows),i) = i : maximumBy (compare `on` length) nextZeros
  where nextZeros = map findZeros $ zip nextRows zeroIndices
        nextRows = map row2col reducedColumns
        reducedColumns = map (reduceColumn (zip (trans rows) [0..n])) zeroIndices
        reduceColumn columns z = map fst $ filter (\(_,k)-> k /= z) columns
        n = length rows
        zeroIndices = zeroElements firstRow
{% endhighlight %}
<h2>An Image Analysis Application</h2>
Real world applications of the linear assignment problem are not hard to find, but here's one from image analysis. Say we're presented with a labeled diagram, as below. The diagram has already been segmented into its component parts ( there are various ways of doing this, but in the example below a simple unsupervised classifier such as k-means, based on colour information, would work well ). Next the goal is to associate each component with its label.
