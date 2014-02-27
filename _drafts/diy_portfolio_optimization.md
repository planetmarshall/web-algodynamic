---
layout: post
title: DIY Portfolio Optimization with Exchange Traded Funds
tags: []
status: draft
type: post
published: false
meta:
  _edit_last: '2'
---

Portfolio optimization
----------------------

It's immediately obvious from the charts for these two funds that they are highly correlated, and hence a poor choice for a diversified portfolio. Intuitively - because the assets are correlated - we can't use one to reduce the risk of the other

Practical implementation
------------------------

Although there is nothing to stop the individual investor from building a portfolio of individual stocks, when it comes to implementing such a strategy it can be expensive (Barclays Stockbrokers starts at around £7 per trade). 

Additional constraints
----------------------

Other than our desired risk/return profile, there are other constraints facing the individual investor. We have to consider annual management charges - though these can simply be subtracted from the annual return. 

Using publically available data
-------------------------------

While websites like Trustnet provide basic metrics such as yearly averages and volatility, to perform mean-variance optimization we need historical data. One of the disadvantages of using funds as assets rather than individual stocks is that historical price data is, generally, not publically available. There are subscription services that provide it, but are generally aimed at the professional and make little financial sense for individuals unless you estimate that having access to that data can make a difference on the order of several thousand pounds a year. So we'll need to make do with what information is available publically. Here are a few options, in no particular order.

* The Financial Times website provides about 6 months worth of daily prices
* Use tracker funds, and use historical data from the index being tracked, which is generally available from sites like Yahoo Finance. This presupposes that the tracker fund is accurate.
* Most funds list their largest 10 components, which are usually stocks. We can get historical data from the individual components and use it as a measure of the whole fund.
* Use web scraping tools. Some sites such as MorningStar have charting tools that show historical data, which can be extracted from network traffic.

