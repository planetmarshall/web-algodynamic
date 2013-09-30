---
layout: post
title: Predicting the outcome of a reality show
tags: []
status: draft
type: post
published: false
---
In November 2012, A friend of mine and Cambridge Alumnus, Chris Taylor, correctly predicted 50/51 of the electoral college votes in the US election, using a far simpler model than the one that has been much publicized by Nate Silver in the Washington Post (see Chris's [code](https://github.com/chris-taylor/USElection) on github). I had enough confidence in Chris' model to put my money where his mouth was and bought some shares on InTrade's prediction market, thus making a small profit at the expense of some poor deluded souls who actually thought Mitt Romney stood a chance.

This led me to wonder just what other popularity contests might lend themselves to a mathematical analysis. Enter the BBC's [Strictly Come Dancing](http://www.bbc.co.uk/programmes/b006m8dq), 2013.

Bayesian Analysis of Strictly Come Dancing
------------------------------------------

Strictly plays out as follows: Each couple performs a dance which is then scored by four judges. These scores are public and are available to the audience. At the end of each episode, the scores are totalled which provides a ranking for each couple. The viewers are then given the chance to vote for their favourite couple. The specific voting results are not made public, but its effect on the leaderboard is revealed the following day during the results show. The way in which the votes and the judges scores are combined is helpfully detailed on the BBC's [website](http://www.bbc.co.uk/programmes/b006m8dq/features/about). The goal, then, is to predict how this final ranking will go, given the information we have before it is revealed.


