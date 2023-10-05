---
title: "Extensions of induction head behaviour"
date: 2023-10-03
weight: 1
summary: Here I show that in a 2-layer attention-only transformer model, an induction head combines with an "averaging" head that stores some kind of average over the previous ~4-5 tokens.
---

****

Induction heads allow models to look at the sequence ... \[A][B] .... [A] and increase the probablity of [B], or a token similar to [B], to appear next.

 

One way to consider if/how this behaviour generalises is to consider sequences of length 3 instead of 2. For instance, in the sequence

 ... \[A]\[X]\[B] ... [C]\[X]\[D] ... \[A]\[X]

will a model predict [B] or [D] to appear next, or split the probability between them? Does it depend on the order in which they appear in the context?

The simplest picture of an induction head circuit usually consists of a "previous token head" that copies information about the previous token to the current position, followed by an "induction head" in a subsequent layer. Such a circuit would likely have a difficult time distinguishing between whether [B] or [D] should appear next in the example above. On the other hand, if something more sophisticated is going on, the model may, on average, assign [B] a higher probability than [D].

### Attention patterns for the triplet sequences

![Triplet sequence attention pattern](/triplet_sequence_attn_pattern.png)

{{< center >}} *Figure 1: Attention Patterns in layer 1 for the sequence  ... \[A]\[X]\[B] ... [C]\[X]\[D] ... \[A]\[X] discussed above.* {{< /center >}}       <br>

Using the 2-layer attention-only transformer model from `transformer_lens`, Figure 1 below shows the attention patterns for layer 1 given the above sequence  ... \[A]\[X]\[B] ... [C]\[X]\[D] ... \[A]\[X]. The attention patterns are averaged over 4000 batches. We can (just about) see from the above figure that the model appears to attend to [B] more than [C]. More quantitatively, the averaged attention pattern at the position of the final [X] token looks like this:



{{< load-plotly >}}

{{< plotly json="/triplet_attn_pattern_line.json" height="500px" >}}



Note that we get something similar if we effectively reverse the order  ... \[A]\[X]\[B] ... [C]\[X]\[D] ... \[C]\[X], except that the attention values at [B] and [D] are swapped.

