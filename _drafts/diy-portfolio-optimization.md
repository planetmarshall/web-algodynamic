---
layout: post
title: DIY Portfolio Optimization
tags: []
status: draft
type: post
published: false
---
The principle of portfolio diversification is basically the financial equivalent of the common saying "don't put all your eggs in one basket".

Practicalities facing the individual investor
---------------------------------------------

While the mathematical exposition above is instructive, it unfortunately has little to do with the reality of dealing in assets if you are an individual investor. If we, say, sign up to an account with Barclays Stockbrokers and want to apply some of the methodology above, straightaway we face some additional problems.

Access to data.

Free services like Yahoo Finance provide historical price data on a vast number of exchange traded assets, however there is no guarantee of its quality - something you may wish to consider if you choose to invest with real money. More reliable services cost money.

Investing is not free.

Dealing costs money. Each trade incurs charges to be borne by you, which is another variable to be factored into your analysis. Another variable to be considered is minimum investment amounts.

Short selling, etc.

An example
----------

Lets say I have £10,000 to invest in an Investment ISA (the full allowance at the time of writing is £11,520, so this is a realistic example). To avoid incurring trading costs I'm going to stick to the funds available for this type of investment. Barclays lists all the funds available on its website, having logged in the following Python code gets each fund's name and code. 
