---
title: "Positional Embeddings in a 2-layer attention-only transformer model"
date: 2023-10-01
weight: 1
summary: Some small visualisations and discussion of the positional embeddings
---

**The position embeddings in a 2-layer attention-only transformer model arrange themselves into a helical structure. This presumably allows the model to generate QK matrices to move a few positions in relative terms with a similar transformation for all positions. The positional embeddings at positions 0 and 1023 have special properties.**



Position is clearly important to how attention works, so I wanted to do a series of tests on the 2-layer attention-only transformer model from TransformerLens to help myself understand exactly how the attention heads deal with position and perhaps find some interesting direction to pursue. These are just notes and probably nothing new.





### Dot Products

{{< load-plotly >}}

{{< plotly json="/pos_embeddings_1024.json" height="500px" >}}

{{< center >}} *Figure 1: Dot products of the positional embeddings with all other positional embeddings.* {{< /center >}} 

​      <br>

### 

Plotted above is the dot product of the positional embeddings with all other positional embeddings. Blue is positive, red is negative. Unsurprisingly, there's clear structure there. 

The dot product of the positional embedding at position 0 with nearby positional embeddings is of smaller magnitude than all other combinations and negative as opposed to positive. There is obviously something special about the first position. This might be some kind of special direction. Whether this is due to the model being trained with a special BOS token, or something that would occur without that is unclear. Clearly including the \<BOS\> token could easily have a big impact on the embedding of position 0. On the other hand, position 0 also has the unique characteristic that it does not attend back to any other position. It does seem plausible that this also has an impact.

The dot product between a given position and the other nearby positions initially decreases as you move further away, and then begins to oscillate. This seems to make sense. My intuition is that there's some kind of rotation from one position to the next such that the key and query matrices can figure out how to move positions. At some point it needs to oscillate as there's some baseline due to being a positional embedding and the embedding needs to maintain approximately constant relative differences between nearby positions.



### PCA of positional embedding



{{< plotly json="/pca_pos_embeddings.json" height="500px" >}}

{{< center >}} *Figure 2: Principal Components 1 and 2 of the positional embeddings.* {{< /center >}} 

​      <br>

### 

The positional embeddings look like a helix [(this has been found by Adam Yedidia already for GPT-2)](https://www.lesswrong.com/posts/qvWP3aBDBaqXvPNhS/gpt-2-s-positional-embedding-matrix-is-a-helix). This makes sense; it allows the model to move around in relative positions somewhat easily. The value at (~0, ~0) is at position 1023 - the last position in the context (max length 1024). It never needs to attend to a future token so perhaps it doesn't matter what its embedding is in the same way as other tokens? This also suggests that it's the key being rotated forward, rather than the query being rotated back? Not sure if that makes sense.

Finally, looking at this plot, I wonder whether we could provide such a model with a more intelligent positional embedding rather than allowing it to be learned. And then we would also know how it works.

### Dot products of positional embeddings

Here’s the positional embeddings at positions 1, 2, 3, 4 dotted with all other positional embeddings plotting as a function of the relative position difference (e.g. the 4th positional embedding is offset to the left by 4)



{{< plotly json="/pos_embed_01234_dp.json" height="500px" >}}



And here's a plot for position 100



{{< plotly json="/pos_embed_100_dp.json" height="500px" >}}



### Magnitude of positional embeddings



Below is the magnitude of the positional embeddings. Again we see that position 0 is special compared to positions 1, 2, 3 etc. the magnitudes initially decrease and then remain relatively constant in size. I'm not sure why the earlier positions are substantially larger in magnitude than the later positions. Where is the asymmetry? Is this possibly a result of the training procedure? Because earlier positions are trained repeatedly on each chunk of data? I can't see a reason why these values should intrinsically behave like this. 

{{< plotly json="/pos_embed_magnitudes.json" height="500px" >}}

