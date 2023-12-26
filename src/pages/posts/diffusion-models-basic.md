---
layout: "@/partials/BasePost.astro"
title: Diffusion Probabilistic Models
pubDate: 2023-11-28T05:30:00Z
imgSrc: "/img/posts/diffusion-models-basic/celeba.png"
imgAlt: "Generated samples on CelebA-HQ 256 × 256"
---

# Diffusion Probabilistic Models

原论文都有详细内容啦，这里就只是随便写写。 ps: [【论文链接】](https://r2.nkd.red/papers/diffusion-model/2006.11239.pdf)

## Prior Methods

### VAE:

$$
\begin{aligned}
L_{\mathrm{VAE}}(\theta, \phi) & =-\log p_\theta(\mathbf{x})+D_{\mathrm{KL}}\left(q_\phi(\mathbf{z} \mid \mathbf{x}) \| p_\theta(\mathbf{z} \mid \mathbf{x})\right) \\
& =-\mathbb{E}_{\mathbf{z} \sim q_\phi(\mathbf{z} \mid \mathbf{x})} \log p_\theta(\mathbf{x} \mid \mathbf{z})+D_{\mathrm{KL}}\left(q_\phi(\mathbf{z} \mid \mathbf{x}) \| p_\theta(\mathbf{z})\right) \\
\theta^*, \phi^* & =\arg \min _{\theta, \phi} L_{\mathrm{VAE}} \\
-L_{\mathrm{VAE}} & =\log p_\theta(\mathbf{x})-D_{\mathrm{KL}}\left(q_\phi(\mathbf{z} \mid \mathbf{x}) \| p_\theta(\mathbf{z} \mid \mathbf{x})\right) \leq \log p_\theta(\mathbf{x})
\end{aligned}
$$

### GAN:

$$
\begin{gathered}
\min _G \max _D L(D, G)=\mathbb{E}_{x \sim p_r(x)}[\log D(x)]+\mathbb{E}_{z \sim p_z(z)}[\log (1-D(G(z)))] \\
=\mathbb{E}_{x \sim p_r(x)}[\log D(x)]+\mathbb{E}_{x \sim p_g(x)}[\log (1-D(x)] \\
L\left(G, D^*\right)=2 D_{J S}\left(p_r \| p_g\right)-2 \log 2
\end{gathered}
$$

## Abstract

这是论文摘要：（复制粘贴，复制粘贴）

We present high quality image synthesis results using diffusion probabilistic models, a class of latent variable models inspired by considerations from [**nonequilibrium thermodynamics**](https://zh.wikipedia.org/zh-cn/%E9%9D%9E%E5%B9%B3%E8%A1%A1%E6%85%8B%E7%86%B1%E5%8A%9B%E5%AD%B8).

Our best results are obtained by training on a weighted variational bound designed according to a novel connection between diffusion probabilistic models and denoising score matching with Langevin dynamics, and our models naturally admit a progressive lossy decompression scheme that can be interpreted as a generalization of autoregressive decoding.

On the unconditional CIFAR10 dataset, we obtain an Inception score of 9.46 and a state-of-the-art FID score of 3.17. On 256x256 LSUN, we obtain sample quality similar to ProgressiveGAN.

Our implementation is available at [https://github.com/hojonathanho/diffusion](https://github.com/hojonathanho/diffusion).

实话说，这个摘要几乎看不懂，但是感觉无所谓，当然，全篇文章充满了各种概率计算，开始就是 parameterized Markov chain，概率转移分布，之后变分推断（variational inference），然后极大似然，有点哈人。

## Background

Diffusion models are latent variable models of the form $p_\theta\left(\mathbf{x}_0\right):=\int p_\theta\left(\mathbf{x}_{0: T}\right) d \mathbf{x}_{1: T}$, where $\mathbf{x}_1, \ldots, \mathbf{x}_T$ are latents of the same dimensionality as the data $\mathbf{x}_0 \sim q\left(\mathbf{x}_0\right)$.

初始状态 $\mathbf{x}_0$ 是没有噪声的原始数据，而最终状态 $\mathbf{x}_T$ 接近于纯噪声。

### Reverse Process

$p_\theta\left(\mathbf{x}_{0: T}\right)$ 是初始状态 $\mathbf{x}_0$ 到最终状态 $\mathbf{x}_T$ 的联合概率分布。参数 $\theta$ 是模型通过训练学习到的，用于定义从一个状态到另一个状态的转换概率。被称之为 **reverse process**, 从 $T$ 开始，$0$ 结束。

The joint distribution $p_\theta\left(\mathbf{x}_{0: T}\right)$ is called the reverse process, and it is defined as a Markov chain with learned Gaussian transitions starting at $p\left(\mathbf{x}_T\right)=\mathcal{N}\left(\mathbf{x}_T ; \mathbf{0}, \mathbf{I}\right)$ :

$$
\begin{aligned}
&p_\theta\left(\mathbf{x}_{0: T}\right):=p\left(\mathbf{x}_T\right) \prod_{t=1}^T p_\theta\left(\mathbf{x}_{t-1} \mid \mathbf{x}_t\right)
\\
&p_\theta\left(\mathbf{x}_{t-1} \mid \mathbf{x}_t\right):=\mathcal{N}\left(\mathbf{x}_{t-1} ; \boldsymbol{\mu}_\theta\left(\mathbf{x}_t, t\right), \mathbf{\Sigma}_\theta\left(\mathbf{x}_t, t\right)\right)
\end{aligned}
$$

### Forward Process

呵呵，一个马尔科夫链：$q\left(\mathbf{x}_{1: T} \mid \mathbf{x}_0\right)$，这个过程通过一系列的变量 $\beta_1, \ldots, \beta_T$ 来控制噪声的增加。每个 $\beta_t$ 定义了在时间步 $t$ 添加的噪声量。

What distinguishes diffusion models from other types of latent variable models is that the approximate posterior $q\left(\mathbf{x}_{1: T} \mid \mathbf{x}_0\right)$, called the _forward process_ or _diffusion process_, is fixed to a Markov chain that gradually adds Gaussian noise to the data according to a variance schedule $\beta_1, \ldots, \beta_T$ :

$$
\begin{aligned}
&q\left(\mathbf{x}_{1: T} \mid \mathbf{x}_0\right):=\prod_{t=1}^T q\left(\mathbf{x}_t \mid \mathbf{x}_{t-1}\right)
\\
&q\left(\mathbf{x}_t \mid \mathbf{x}_{t-1}\right):=\mathcal{N}\left(\mathbf{x}_t ; \sqrt{1-\beta_t} \mathbf{x}_{t-1}, \beta_t \mathbf{I}\right)
\end{aligned}
$$

### Training

Training is performed by optimizing the usual variational bound on negative log likelihood:

$$
\begin{aligned}
\mathbb{E}\left[-\log p_\theta\left(\mathbf{x}_0\right)\right] & \leq \mathbb{E}_q\left[-\log \frac{p_\theta\left(\mathbf{x}_{0: T}\right)}{q\left(\mathbf{x}_{1: T} \mid \mathbf{x}_0\right)}\right]
\\ & =\mathbb{E}_q\left[-\log p\left(\mathbf{x}_T\right)-\sum_{t \geq 1} \log \frac{p_\theta\left(\mathbf{x}_{t-1} \mid \mathbf{x}_t\right)}{q\left(\mathbf{x}_t \mid \mathbf{x}_{t-1}\right)}\right] \\&=: L
\end{aligned}
$$

> generated by Chatgpt4 (????), verified by shinnku

1. 对数似然的分解:
   首先，我们考虑数据 $\mathbf{x}_0$ 的对数似然 $\log p_\theta\left(\mathbf{x}_0\right)$ 。根据概率的链式法则，这可以写作:

   $$
   \begin{aligned}
   \log p_\theta\left(\mathbf{x}_0\right) &=\log \int p_\theta\left(\mathbf{x}_{0: T}\right) \d \mathbf{x}_{1: T} \\
    &=\log \int \frac{p_\theta\left(\mathbf{x}_{0: T}\right)}{q\left(\mathbf{x}_{1: T} \mid \mathbf{x}_0\right)} q\left(\mathbf{x}_{1: T} \mid \mathbf{x}_0\right) \d \mathbf{x}_{1: T}
   \end{aligned}
   $$

   其中， $p_\theta\left(\mathbf{x}_{0: T}\right)$ 是反向过程。

2. 使用 Jensen 不等式:
   接下来，我们应用 Jensen 不等式。Jensen 不等式用于对数函数是凹函数的情况，可以将对数从积分内部移到外部:
   $$
   \log p_\theta\left(\mathbf{x}_0\right) \geq \int q\left(\mathbf{x}_{1: T} \mid \mathbf{x}_0\right) \log \frac{p_\theta\left(\mathbf{x}_{0: T}\right)}{q\left(\mathbf{x}_{1: T} \mid \mathbf{x}_0\right)} \d \mathbf{x}_{1: T}
   $$
3. 期望形式:
   将上式写成期望的形式:
   $$
   \mathbb{E}_q\left[\,\log p_\theta\left(\mathbf{x}_0\right)\right] \geq \mathbb{E}_q\left[\log \frac{p_\theta\left(\mathbf{x}_{0: T}\right)}{q\left(\mathbf{x}_{1: T} \mid \mathbf{x}_0\right)}\right] = -L
   $$

The forward process variances $\beta_t$ can be learned by reparameterization or held constant as hyperparameters, and expressiveness of the reverse process is ensured in part by the choice of Gaussian conditionals in $p_\theta\left(\mathbf{x}_{t-1} \mid \mathbf{x}_t\right)$, because both processes have the same functional form when $\beta_t$ are small.

1. 负对数似然（Negative Log Likelihood）:
   - 训练扩散模型的目标是最小化负对数似然，通过优化变分下界（Variational Bound）来实现。
2. 变分下界:
   - 变分下界 $L$ 是负对数似然的一个上界。
   - 这玩意是两部分组成：一部分是关于 $p(\mathbf{x}_t)$ 的期望，另一部分是关于 $p_{\theta}(\mathbf{x}_{t-1} \mid \mathbf{x}_{t-1})$ 和 $q(\mathbf{x}_{t-1} \mid \mathbf{x}_{t-1})$ 比率的对数的和的期望。

A notable property of the forward process is that it admits sampling $\mathbf{x}_t$ at an arbitrary timestep $t$ in closed form: using the notation $\alpha_t:=1-\beta_t$ and $\bar{\alpha}_t:=\prod_{s=1}^t \alpha_s$, we have

$$
q\left(\mathbf{x}_t \mid \mathbf{x}_0\right)=\mathcal{N}\left(\mathbf{x}_t ; \sqrt{\bar{\alpha}_t} \mathbf{x}_0,\left(1-\bar{\alpha}_t\right) \mathbf{I}\right)
$$

Efficient training is therefore possible by optimizing random terms of $L$ with stochastic gradient descent. Further improvements come from variance reduction by rewriting $L(3)$ as:

$$
\mathbb{E}_q[\underbrace{D_{\mathrm{KL}}\left(q\left(\mathbf{x}_T \mid \mathbf{x}_0\right) \| p\left(\mathbf{x}_T\right)\right)}_{L_T}+\sum_{t>1} \underbrace{D_{\mathrm{KL}}\left(q\left(\mathbf{x}_{t-1} \mid \mathbf{x}_t, \mathbf{x}_0\right) \| p_\theta\left(\mathbf{x}_{t-1} \mid \mathbf{x}_t\right)\right)}_{L_{t-1}} \underbrace{-\log p_\theta\left(\mathbf{x}_0 \mid \mathbf{x}_1\right)}_{L_0}]
$$

Below is a derivation of above, the reduced variance variational bound for diffusion models. This material is from Sohl-Dickstein et al;

$$
\begin{aligned}
L & =\mathbb{E}_q\left[-\log \frac{p_\theta\left(\mathbf{x}_{0: T}\right)}{q\left(\mathbf{x}_{1: T} \mid \mathbf{x}_0\right)}\right] \\
& =\mathbb{E}_q\left[-\log p\left(\mathbf{x}_T\right)-\sum_{t \geq 1} \log \frac{p_\theta\left(\mathbf{x}_{t-1} \mid \mathbf{x}_t\right)}{q\left(\mathbf{x}_t \mid \mathbf{x}_{t-1}\right)}\right] \\
& =\mathbb{E}_q\left[-\log p\left(\mathbf{x}_T\right)-\sum_{t>1} \log \frac{p_\theta\left(\mathbf{x}_{t-1} \mid \mathbf{x}_t\right)}{q\left(\mathbf{x}_t \mid \mathbf{x}_{t-1}\right)}-\log \frac{p_\theta\left(\mathbf{x}_0 \mid \mathbf{x}_1\right)}{q\left(\mathbf{x}_1 \mid \mathbf{x}_0\right)}\right] \\
& =\mathbb{E}_q\left[-\log p\left(\mathbf{x}_T\right)-\sum_{t>1} \log \frac{p_\theta\left(\mathbf{x}_{t-1} \mid \mathbf{x}_t\right)}{q\left(\mathbf{x}_{t-1} \mid \mathbf{x}_t, \mathbf{x}_0\right)} \cdot \frac{q\left(\mathbf{x}_{t-1} \mid \mathbf{x}_0\right)}{q\left(\mathbf{x}_t \mid \mathbf{x}_0\right)}-\log \frac{p_\theta\left(\mathbf{x}_0 \mid \mathbf{x}_1\right)}{q\left(\mathbf{x}_1 \mid \mathbf{x}_0\right)}\right] \\
& =\mathbb{E}_q\left[-\log \frac{p\left(\mathbf{x}_T\right)}{q\left(\mathbf{x}_T \mid \mathbf{x}_0\right)}-\sum_{t>1} \log \frac{p_\theta\left(\mathbf{x}_{t-1} \mid \mathbf{x}_t\right)}{q\left(\mathbf{x}_{t-1} \mid \mathbf{x}_t, \mathbf{x}_0\right)}-\log p_\theta\left(\mathbf{x}_0 \mid \mathbf{x}_1\right)\right] \\
& =\mathbb{E}_q\left[D_{\mathrm{KL}}\left(q\left(\mathbf{x}_T \mid \mathbf{x}_0\right) \| p\left(\mathbf{x}_T\right)\right)+\sum_{t>1} D_{\mathrm{KL}}\left(q\left(\mathbf{x}_{t-1} \mid \mathbf{x}_t, \mathbf{x}_0\right) \| p_\theta\left(\mathbf{x}_{t-1} \mid \mathbf{x}_t\right)\right)-\log p_\theta\left(\mathbf{x}_0 \mid \mathbf{x}_1\right)\right]
\end{aligned}
$$

The following is an alternate version of $L$. It is not tractable to estimate, but it is useful for our discussion in Section 4.3.

$$
\begin{aligned}
L & =\mathbb{E}_q\left[-\log p\left(\mathbf{x}_T\right)-\sum_{t \geq 1} \log \frac{p_\theta\left(\mathbf{x}_{t-1} \mid \mathbf{x}_t\right)}{q\left(\mathbf{x}_t \mid \mathbf{x}_{t-1}\right)}\right] \\
& =\mathbb{E}_q\left[-\log p\left(\mathbf{x}_T\right)-\sum_{t \geq 1} \log \frac{p_\theta\left(\mathbf{x}_{t-1} \mid \mathbf{x}_t\right)}{q\left(\mathbf{x}_{t-1} \mid \mathbf{x}_t\right)} \cdot \frac{q\left(\mathbf{x}_{t-1}\right)}{q\left(\mathbf{x}_t\right)}\right] \\
& =\mathbb{E}_q\left[-\log \frac{p\left(\mathbf{x}_T\right)}{q\left(\mathbf{x}_T\right)}-\sum_{t \geq 1} \log \frac{p_\theta\left(\mathbf{x}_{t-1} \mid \mathbf{x}_t\right)}{q\left(\mathbf{x}_{t-1} \mid \mathbf{x}_t\right)}-\log q\left(\mathbf{x}_0\right)\right] \\
& =D_{\mathrm{KL}}\left(q\left(\mathbf{x}_T\right) \| p\left(\mathbf{x}_T\right)\right)+\mathbb{E}_q\left[\sum_{t \geq 1} D_{\mathrm{KL}}\left(q\left(\mathbf{x}_{t-1} \mid \mathbf{x}_t\right) \| p_\theta\left(\mathbf{x}_{t-1} \mid \mathbf{x}_t\right)\right)\right]+H\left(\mathbf{x}_0\right)
\end{aligned}
$$

Equation (5) uses KL divergence to directly compare $p_\theta\left(\mathbf{x}_{t-1} \mid \mathbf{x}_t\right)$ against forward process posteriors, which are tractable when conditioned on $\mathbf{x}_0$ :

$$
\begin{aligned}
q\left(\mathbf{x}_{t-1} \mid \mathbf{x}_t, \mathbf{x}_0\right) & =\mathcal{N}\left(\mathbf{x}_{t-1} ; \tilde{\boldsymbol{\mu}}_t\left(\mathbf{x}_t, \mathbf{x}_0\right), \tilde{\beta}_t \mathbf{I}\right) \\
\text { where } \quad \tilde{\boldsymbol{\mu}}_t\left(\mathbf{x}_t, \mathbf{x}_0\right) & :=\frac{\sqrt{\bar{\alpha}_{t-1}} \beta_t}{1-\bar{\alpha}_t} \mathbf{x}_0+\frac{\sqrt{\alpha_t}\left(1-\bar{\alpha}_{t-1}\right)}{1-\bar{\alpha}_t} \mathbf{x}_t \quad \text { and } \quad \tilde{\beta}_t:=\frac{1-\bar{\alpha}_{t-1}}{1-\bar{\alpha}_t} \beta_t
\end{aligned}
$$

Consequently, all KL divergences in Eq. (5) are comparisons between Gaussians, so they can be calculated in a Rao-Blackwellized fashion with closed form expressions instead of high variance Monte Carlo estimates.

## 3. Diffusion models and denoising autoencoders

Diffusion models might appear to be a restricted class of latent variable models, but they allow a large number of degrees of freedom in implementation. One must choose the variances $\beta_t$ of the forward process and the model architecture and Gaussian distribution parameterization of the reverse process. To guide our choices, we establish a new explicit connection between diffusion models and denoising score matching (Section 3.2) that leads to a simplified, weighted variational bound objective for diffusion models (Section 3.4). Ultimately, our model design is justified by simplicity and empirical results (Section 4). Our discussion is categorized by the terms of Eq. (5).

### 3.1 Forward process and $L_T$

We ignore the fact that the forward process variances $\beta_t$ are learnable by reparameterization and instead fix them to constants (see Section 4 for details). Thus, in our implementation, the approximate posterior $q$ has no learnable parameters, so $L_T$ is a constant during training and can be ignored.

### 3.2 Reverse process and $L_{1: T-1}$

Now we discuss our choices in $p_\theta\left(\mathbf{x}_{t-1} \mid \mathbf{x}_t\right)=\mathcal{N}\left(\mathbf{x}_{t-1} ; \boldsymbol{\mu}_\theta\left(\mathbf{x}_t, t\right), \mathbf{\Sigma}_\theta\left(\mathbf{x}_t, t\right)\right)$ for $1<t \leq T$. First, we set $\boldsymbol{\Sigma}_\theta\left(\mathbf{x}_t, t\right)=\sigma_t^2 \mathbf{I}$ to untrained time dependent constants. Experimentally, both $\sigma_t^2=\beta_t$ and $\sigma_t^2=\tilde{\beta}_t=\frac{1-\bar{\alpha}_{t-1}}{1-\bar{\alpha}_t} \beta_t$ had similar results. The first choice is optimal for $\mathbf{x}_0 \sim \mathcal{N}(\mathbf{0}, \mathbf{I})$, and the second is optimal for $\mathrm{x}_0$ deterministically set to one point. These are the two extreme choices corresponding to upper and lower bounds on reverse process entropy for data with coordinatewise unit variance.

Second, to represent the mean $\boldsymbol{\mu}_\theta\left(\mathrm{x}_t, t\right)$, we propose a specific parameterization motivated by the following analysis of $L_t$. With $p_\theta\left(\mathbf{x}_{t-1} \mid \mathbf{x}_t\right)=\mathcal{N}\left(\mathbf{x}_{t-1} ; \boldsymbol{\mu}_\theta\left(\mathbf{x}_t, t\right), \sigma_t^2 \mathbf{I}\right)$, we can write:

$$
L_{t-1}=\mathbb{E}_q\left[\frac{1}{2 \sigma_t^2}\left\|\tilde{\boldsymbol{\mu}}_t\left(\mathbf{x}_t, \mathbf{x}_0\right)-\boldsymbol{\mu}_\theta\left(\mathbf{x}_t, t\right)\right\|^2\right]+C
$$

where $C$ is a constant that does not depend on $\theta$. So, we see that the most straightforward parameterization of $\boldsymbol{\mu}_\theta$ is a model that predicts $\tilde{\boldsymbol{\mu}}_t$, the forward process posterior mean. However, we can expand Eq. (8) further by reparameterizing Eq. (4) as $\mathbf{x}_t\left(\mathbf{x}_0, \boldsymbol{\epsilon}\right)=\sqrt{\bar{\alpha}_t} \mathbf{x}_0+\sqrt{1-\bar{\alpha}_t} \boldsymbol{\epsilon}$ for $\boldsymbol{\epsilon} \sim \mathcal{N}(\mathbf{0}, \mathbf{I})$ and applying the forward process posterior formula $(7)$ :

$$
\begin{aligned}
L_{t-1}-C & =\mathbb{E}_{\mathbf{x}_0, \boldsymbol{\epsilon}}\left[\frac{1}{2 \sigma_t^2}\left\|\tilde{\boldsymbol{\mu}}_t\left(\mathbf{x}_t\left(\mathbf{x}_0, \boldsymbol{\epsilon}\right), \frac{1}{\sqrt{\bar{\alpha}_t}}\left(\mathbf{x}_t\left(\mathbf{x}_0, \boldsymbol{\epsilon}\right)-\sqrt{1-\bar{\alpha}_t} \boldsymbol{\epsilon}\right)\right)-\boldsymbol{\mu}_\theta\left(\mathbf{x}_t\left(\mathbf{x}_0, \boldsymbol{\epsilon}\right), t\right)\right\|^2\right] \\
& =\mathbb{E}_{\mathbf{x}_0, \boldsymbol{\epsilon}}\left[\frac{1}{2 \sigma_t^2}\left\|\frac{1}{\sqrt{\alpha_t}}\left(\mathbf{x}_t\left(\mathbf{x}_0, \boldsymbol{\epsilon}\right)-\frac{\beta_t}{\sqrt{1-\bar{\alpha}_t}} \boldsymbol{\epsilon}\right)-\boldsymbol{\mu}_\theta\left(\mathbf{x}_t\left(\mathbf{x}_0, \boldsymbol{\epsilon}\right), t\right)\right\|^2\right]
\end{aligned}
$$

Equation (10) reveals that $\mu_\theta$ must predict $\frac{1}{\sqrt{\alpha_t}}\left(\mathrm{x}_t-\frac{\beta_t}{\sqrt{1-\bar{\alpha}_t}} \epsilon\right)$ given $\mathrm{x}_t$. Since $\mathrm{x}_t$ is available as input to the model, we may choose the parameterization

$$
\boldsymbol{\mu}_\theta\left(\mathbf{x}_t, t\right)=\tilde{\boldsymbol{\mu}}_t\left(\mathrm{x}_t, \frac{1}{\sqrt{\bar{\alpha}_t}}\left(\mathrm{x}_t-\sqrt{1-\bar{\alpha}_t} \boldsymbol{\epsilon}_\theta\left(\mathrm{x}_t\right)\right)\right)=\frac{1}{\sqrt{\alpha_t}}\left(\mathrm{x}_t-\frac{\beta_t}{\sqrt{1-\bar{\alpha}_t}} \boldsymbol{\epsilon}_\theta\left(\mathrm{x}_t, t\right)\right)
$$

where $\epsilon_\theta$ is a function approximator intended to predict $\boldsymbol{\epsilon}$ from $\mathbf{x}_t$. To sample $\mathbf{x}_{t-1} \sim p_\theta\left(\mathbf{x}_{t-1} \mid \mathbf{x}_t\right)$ is to compute $\mathbf{x}_{t-1}=\frac{1}{\sqrt{\alpha_t}}\left(\mathbf{x}_t-\frac{\beta_t}{\sqrt{1-\bar{\alpha}_t}} \boldsymbol{\epsilon}_\theta\left(\mathbf{x}_t, t\right)\right)+\sigma_t \mathbf{z}$, where $\mathbf{z} \sim \mathcal{N}(\mathbf{0}, \mathbf{I})$. The complete sampling procedure, Algorithm 2, resembles Langevin dynamics with $\epsilon_\theta$ as a learned gradient of the data density. Furthermore, with the parameterization (11), Eq. (10) simplifies to:

$$
\mathbb{E}_{\mathbf{x}_0, \boldsymbol{\epsilon}}\left[\frac{\beta_t^2}{2 \sigma_t^2 \alpha_t\left(1-\bar{\alpha}_t\right)}\left\|\boldsymbol{\epsilon}-\boldsymbol{\epsilon}_\theta\left(\sqrt{\bar{\alpha}_t} \mathbf{x}_0+\sqrt{1-\bar{\alpha}_t} \boldsymbol{\epsilon}, t\right)\right\|^2\right]
$$

which resembles denoising score matching over multiple noise scales indexed by $t$ [55]. As Eq. (12) is equal to (one term of) the variational bound for the Langevin-like reverse process $(11)$, we see that optimizing an objective resembling denoising score matching is equivalent to using variational inference to fit the finite-time marginal of a sampling chain resembling Langevin dynamics.

To summarize, we can train the reverse process mean function approximator $\boldsymbol{\mu}_\theta$ to predict $\tilde{\boldsymbol{\mu}}_t$, or by modifying its parameterization, we can train it to predict $\epsilon$. (There is also the possibility of predicting $\mathbf{x}_0$, but we found this to lead to worse sample quality early in our experiments.) We have shown that the $\epsilon$-prediction parameterization both resembles Langevin dynamics and simplifies the diffusion model's variational bound to an objective that resembles denoising score matching. Nonetheless, it is just another parameterization of $p_\theta\left(\mathrm{x}_{t-1} \mid \mathrm{x}_t\right)$, so we verify its effectiveness in Section 4 in an ablation where we compare predicting $\epsilon$ against predicting $\tilde{\mu}_t$.
