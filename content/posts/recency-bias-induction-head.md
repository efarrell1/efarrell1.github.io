---
title: "'Recency bias' in an induction head"
date: 2023-10-04
weight: 1
summary: The induction head in a 2-layer attention-only transformer pays attention to the most recent 3-4 tokens more than earlier in the sequence, displaying a kind of 'recency bias'.
---

**The induction head in a 2-layer attention-only transformer model has a slight recency bias towards the previous ~3-4 tokens compared to earlier in the sequence. It has some notion of positional embeddings that it pays attention to, in addition to tokens that followed the current token earlier in the context.**

---

Induction heads allow models to look at the sequence ... \[A][B] .... [A] and increase the probablity of [B], or a token similar to [B], to appear next ([e.g. Olsson et al., Anthropic](https://transformer-circuits.pub/2022/in-context-learning-and-induction-heads/index.html)).

A natural follow-up question to the behaviour of induction heads is 'what happens if [A] has already appeared twice in the context, but followed by a different token each time?' For example, would a sequence   ... \[A][B] ...\[A][C] ... [A] &rarr; ? predict [B] or [C] as the next token, or some probability split between [B] and [C]? Does the answer on the positions of  \[A][B] or  \[A][C] within the context?

 To do some tests in the direction of answering these questions, I put random sequences of the following structure through a 2-layer attention-only transformer model from the `transformer_lens` library:

| 0      | 1    | 2    | 3    | 4    | 5    | 6    | 7    | 8    | 9    | 10   | 11   | 12   |
| ------ | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| \<BOS> | R    | [A]  | [B]  | [A]    | [C]  | R | R | R    | R    | R    | R    | [A]  |
| \<BOS> | R    | [A]  | [B]  | R    | [A]  | [C]  | R    | R    | R    | R    | R    | [A]  |
| \<BOS> | R    | [A]  | [B]  | R    | R    | [A]  | [C]  | R    | R    | R    | R    | [A]  |
| \<BOS> | R    | [A]  | [B]  | R    | R    | R    | [A]  | [C]  | R    | R    | R    | [A]  |
| \<BOS> | R    | [A]  | [B]  | R    | R    | R    | R    | [A]  | [C]  | R    | R    | [A]  |
| \<BOS> | R    | [A]  | [B]  | R    | R    | R    | R    | R    | [A]  | [C]  | R    | [A]  |
| \<BOS> | R    | [A]  | [B]  | R    | R    | R    | R    | R    | R  | [A]  | [C]    | [A]  |

R indicates a random token (every R is different), and each [A] token is the same within each row. This allows us to test the impact of whether [B] or [C] is predicted at position 12 to appear next, and whether it depends on the position of the second [A] token. The results for each sequence are averaged over 2000 random samples.

### Dependence on position

{{< load-plotly >}}

{{< plotly json="/position_of_second_a_token.json" height="500px" >}}

{{< center >}} *Figure 1: Probability of [B] and [C] tokens as a function of the position of the second [A] token, equivalent to each row in the table above.* {{< /center >}} 

​      <br>



Figure 1 shows the probability of [B] or [C] occuring next as a function of the position of the second [A] token. The probabilities of [B] and [C] are roughly equivalent when they are both far away from the current token (positions 4 - 7). When the second [A] token is within 4 tokens of the current token (positions 8 and later), the probability of [C] appearing next increases significantly, while the probability of [B] appearing next remains approximately the same.



![Induction head example](/induction-head-abac-example.png)

{{< center >}} *Figure 2: Attention Patterns in layer 1 for the final row of the table above.* {{< /center >}}       <br>

Figure 2 above shows the layer 1 attention patterns for the final row of the table when the second [A] token is at position 10. As you can see, L1H6 is the induction head. The final [A] token attends slightly more strongly to the [C] token than the [B] token. This is consistent with the output in Figure 1 above where [C] has a higher probability than [B] when the second [A] token is at position 10. 



### Explanation for dependence

We can extend the information in Figure 2 by plotting the attention patterns in the induction head for the final position in the sequence as a function of the position of the second [A] token -- Figure 3 below. 

{{< plotly json="/position_of_second_a_token_attention.json" height="500px" >}}

{{< center >}} *Figure 3: Attention Patterns in the induction head for the final position in the sequence (the third [A] token) as a function of the position of the second [A] token.* {{< /center >}} 

​      <br>

We can see clearly that the third [A] attends to [B] for all positions of the 2nd [A] token. This makes sense. It also attends to the position of [C] (one ahead of the position fo the 2nd [A] indicated in the caption). Interestingly, it has a stronger attention to [C] for positions closer to the third [A] token. This increased attention translates to a higher probability for the [C] token.

### Positional Embeddings Only

Figure 3 hints at an intrinsic positional dependence of the induction head attention patterns. One way to test this is to put only input the positional embeddings and completely remove the token embeddings. If we do this, we get the following:



![Induction head positional depedence](/induction-head-pos-dependence.png)

{{< center >}} *Figure 4: Attention Patterns in Layer 1, including the induction head (H6), for when only the positional embeddings are used, i.e. without the token embeddings meaning the input string is irrelevant.* {{< /center >}} 

The induction head tends to (noisily) pay more attention to recent tokens and less attention to earlier tokens. This explains the result in Figure 1. I think it makes sense that what happened more recently in the context is somewhat more likely to be more relevant to future sentences. Larger models likely have a more sophisticated version of this. The recency bias appears to not matter for the first 5 tokens. I imagine recency is not so important when your entire context is only 5 or 6 tokens long.

One could investigate this behaviour in larger models to see if different induction heads behave differently.







