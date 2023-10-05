---
title: "Extensions of induction head behaviour 2"
date: 2023-10-03
weight: 1
---

**There are several possible extensions of induction head behaviour to consider.**

Induction heads allow models to look at the sequence ... \[A][B] .... [A] &rarr; ? and increase the probablity of [B] or a token similar to [B] to appear next.

 

correctly predict [B] when followed by [A] if the sequence \[A][B] has occurred in the context before. One way to consider if/how this behaviour generalises is to consider sequences of length 3 instead of 2. 





[X][A][B] ... [Y][A][C] ... [X][A] -> 
