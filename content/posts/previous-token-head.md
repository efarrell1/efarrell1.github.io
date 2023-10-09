---
title: "The previous token head and the \"look-back-two\" head "
date: 2023-10-02
weight: 1
math: true
Summary: A few plots on previous tokens heads, how they work and a comparison to a similar type of attention head -- a "look-back-two" head.
---

**A few plots on previous tokens heads, how they work and comparison to a similar type of attention head, a "look-back-two" head.**

The two-layer attention-only transformer model from `transformer_lens` contains a previous token head at L0H3.  Figure 1 shows the attetion pattern of the previous token head, averaged over 500 batches of random tokens. 

{{< load-plotly >}}
{{< plotly json="/attn_pattern_prev_token_head.json" height="500px" >}}

{{< center >}} *Figure 1: Attention pattern of the previous token head averaged over sequences of random tokens.* {{< /center >}}       <br>

[Note: Adam Yedidia has discussed positional embeddings and previous token heads in GPT2-small at length here](https://www.lesswrong.com/posts/zRA8B2FJLtTYRgie6/the-positional-embedding-matrix-and-previous-token-heads-how)

### Independent impact of position and token embeddings

The attention patterns are computed from the attention scores which are themselves the result of the dot products of a query and key vectors between each position. First let's look at the attention scores for the previous token head. One interesting way to investigate the previous token heads is to run a forward pass of the model including only the positional embeddings, with no token embeddings, and a separate pass including only the token embeddings and not including the positional embeddings.



{{< plotly json="/attn_scores_prev_token_head.json" height="500px" >}}

{{< center >}} *Figure 2: Attention scores in the previous token head for sequences of random tokens with only the positional embeddings (red), only the token embeddings (green) and both positional and token embeddings (blue).* {{< /center >}}       <br>

As the tokens are averaged over random sequences, the attention scores for the token-only input is approximately constant for all token positions except for the special position \<BOS> token at the beginning of the string. The \<BOS> token obtains a higher attention score due to the token embedding. The position-only attention scores are interesting. The largest value is at position 7, one position before the current token. The next two largest values are the current token and two tokens back, which have approximately equal scores. The other tokens in the sequence have much lower attention scores. The total line contains both the token and positional embeddings. The very strong peak at position 7 caused by the positional embeddings is moderated by the impact of the token embeddings that smooth it out to give a relatively weaker peak. In addition, the peak at the \<BOS> token due to the token embeddings is moderated by the positional embeddings.

{{< plotly json="/attn_pattern_prev_token_head_lastpos.json" height="500px" >}}

{{< center >}} *Figure 3: Attention patterns in the previous token head for sequences of random tokens with only the positional embeddings (red), only the token embeddings (green) and both positional and token embeddings (blue).* {{< /center >}}       <br>

Converting the attention scores in Figure 2 to attention patterns with a softmax, we get the lines shown in Figure 3. The token-only embeddings contain all of the attention at position 0. The position-only embeddings contain all the attention at position 7, one before the current token. However, while the combined positional and token embeddings split the attention primarily between positions 0 and 7, positions 6 and 8 also receive attention pattern values of around 0.07 due to the effect seen in Figure 2.



### Interesting exception for position 0 in the previous token head

{{< plotly json="/attn_pattern_prev_token_head_posn_only.json" height="500px" >}}

{{< center >}} *Figure 4: Attention pattern of the previous token head using only the positional embeddings.* {{< /center >}}       <br>

Interestingly, because of the [special nature of postion 0](pos-embeddings-2layer) (probably due to how the model is trained), the previous token head cannot look back from position 1 to position 0 based on the positional embeddings (Figure 4). Of course, once the averaging effect of the token embeddings is included, the attention pattern looks like Figure 1 again, and one might expect that it behaves normally. However, strangely, a quick test shows that the usual induction circuit is not formed if the token at position 0 is repeated (i.e. not a \<BOS> token). Compared to a simple average probability of 0.055 for token [B] to follow token [A] next given that the sequence \[A]\[B] already appeared at positions 1 and 2 in the context, if the first [A] token is placed at position 0, the induction head is entirely unable to predict [B] to appear next, assigning a probability of $7.2 \times 10^{-6}$. The attention patterns in the induction head plotted below in Figure 5 reflect these probability differences.

{{< plotly json="/attn_pattern_prev_token_head_bug.json" height="500px" >}}

{{< center >}} *Figure 5: Attention pattern of the induction head with sequences beginning with \[A] at position 1 (\<BOS> \[A] \[B] .... \[A]) and beginning with \[A] at position 0 (\[A]\[B] .... \[A]).* {{< /center >}}       <br>

This is not necessarily a consequence of Figure 4, but does demonstrate something about either the value vector of the previous token head or the key/query vectors of the induction head. Utimately, it seems likely that this is due to the choice to use a \<BOS> token in the training set and so the model is not necessarily expected to perform properly without it. Nevertheless, it seems like an interesting point.



### Look-back-two attention head

{{< plotly json="/attn_pattern_lbt_head.json" height="500px" >}}

{{< center >}} *Figure 6: Attention pattern of the look-back-two token head averaged over sequences of random tokens.* {{< /center >}}       <br>

Another head in Layer 0 of the two-layer attention-only transformer is the look-back-two attention head which pays most attention two tokens back, but has a smoother distribution than the sharp peak exhibited by the previous token head above. Similar to the discussion of the previous token head, we can plot the attention scores for the look-back-two head based on using only the positional embeddings, only the token embeddings and using both.

{{< plotly json="/attn_scores_lbt_head_lastpos.json" height="500px" >}}

{{< center >}} *Figure 7: Attention scores in the look-back-two head for sequences of random tokens with only the positional embeddings (red), only the token embeddings (green) and both positional and token embeddings (blue).* {{< /center >}}       <br>

Again, because we are using random tokens, the token scores are constant except for the \<BOS> token. The position-only scores peak at position 6, but still contain a significant contribution from positions 5 and 7. The combination of the embeddings smooths out the peak even further, so that it appears something like a weighted average over the last 5 tokens of tht context.



{{< plotly json="/attn_pattern_lbt_head_lastpos.json" height="500px" >}}

{{< center >}} *Figure 8: Attention patterns in the look-back-two head for sequences of random tokens with only the positional embeddings (red), only the token embeddings (green) and both positional and token embeddings (blue).* {{< /center >}}       <br>

Converting the scores to the attention patterns, we can see that with only the positional embeddings, the head would give an attention pattern value of ~0.59 two tokens back, 0.28 to the previous token, ~0.10 to three tokens back and a very small amount to all other tokens. The averaging effect from the token embeddings, smooths out the peak so that there is a non-negligble value assigned now also to the current token, 4 tokens back and even 5 tokens back. I discuss the capabilites of this attention head in the post on [Extensions of induction head behaviour.](../generalised-induction)

