---
layout: "@/partials/BasePost.astro"
title: Diffusion Probabilistic Models
pubDate: 2023-11-28T05:30:00Z
imgSrc: "/img/posts/diffusion-models-basic/celeba.png"
imgAlt: "Generated samples on CelebA-HQ 256 × 256"
---

# Diffusion Probabilistic Models

原论文都有详细内容啦，这里就只是随便写写。 ps: [【论文链接】](https://r2.nkd.red/papers/diffusion-model/2006.11239.pdf)

## Abstract

这是论文摘要：（复制粘贴，复制粘贴）

We present high quality image synthesis results using diffusion probabilistic models, a class of latent variable models inspired by considerations from **nonequilibrium thermodynamics**.

Our best results are obtained by training on a weighted variational bound designed according to a novel connection between diffusion probabilistic models and denoising score matching with Langevin dynamics, and our models naturally admit a progressive lossy decompression scheme that can be interpreted as a generalization of autoregressive decoding.

On the unconditional CIFAR10 dataset, we obtain an Inception score of 9.46 and a state-of-the-art FID score of 3.17. On 256x256 LSUN, we obtain sample quality similar to ProgressiveGAN.

Our implementation is available at [https://github.com/hojonathanho/diffusion](https://github.com/hojonathanho/diffusion).

实话说，这个摘要几乎看不懂，但是感觉无所谓，当然，全篇文章充满了各种概率计算，开始就是 parameterized Markov chain，概率转移分布，之后变分推断（variational inference），然后极大似然，有点哈人。

Diffusion models [53] are latent variable models of the form $p_\theta\left(\mathbf{x}_0\right):=\int p_\theta\left(\mathbf{x}_{0: T}\right) d \mathbf{x}_{1: T}$, where $\mathrm{x}_1, \ldots, \mathbf{x}_T$ are latents of the same dimensionality as the data $\mathbf{x}_0 \sim q\left(\mathbf{x}_0\right)$. The joint distribution $p_\theta\left(\mathbf{x}_{0: T}\right)$ is called the reverse process, and it is defined as a Markov chain with learned Gaussian transitions starting at $p\left(\mathbf{x}_T\right)=\mathcal{N}\left(\mathbf{x}_T ; \mathbf{0}, \mathbf{I}\right)$ :

$$
p_\theta\left(\mathbf{x}_{0: T}\right):=p\left(\mathbf{x}_T\right) \prod_{t=1}^T p_\theta\left(\mathbf{x}_{t-1} \mid \mathbf{x}_t\right), \quad p_\theta\left(\mathbf{x}_{t-1} \mid \mathbf{x}_t\right):=\mathcal{N}\left(\mathbf{x}_{t-1} ; \boldsymbol{\mu}_\theta\left(\mathbf{x}_t, t\right), \mathbf{\Sigma}_\theta\left(\mathbf{x}_t, t\right)\right)
$$

What distinguishes diffusion models from other types of latent variable models is that the approximate posterior $q\left(\mathbf{x}_{1: T} \mid \mathbf{x}_0\right)$, called the forward process or diffusion process, is fixed to a Markov chain that gradually adds Gaussian noise to the data according to a variance schedule $\beta_1, \ldots, \beta_T$ :

$$
q\left(\mathbf{x}_{1: T} \mid \mathbf{x}_0\right):=\prod_{t=1}^T q\left(\mathbf{x}_t \mid \mathbf{x}_{t-1}\right), \quad q\left(\mathbf{x}_t \mid \mathbf{x}_{t-1}\right):=\mathcal{N}\left(\mathbf{x}_t ; \sqrt{1-\beta_t} \mathbf{x}_{t-1}, \beta_t \mathbf{I}\right)
$$

Training is performed by optimizing the usual variational bound on negative log likelihood:

$$
\mathbb{E}\left[-\log p_\theta\left(\mathbf{x}_0\right)\right] \leq \mathbb{E}_q\left[-\log \frac{p_\theta\left(\mathbf{x}_{0: T}\right)}{q\left(\mathbf{x}_{1: T} \mid \mathbf{x}_0\right)}\right]=\mathbb{E}_q\left[-\log p\left(\mathbf{x}_T\right)-\sum_{t \geq 1} \log \frac{p_\theta\left(\mathbf{x}_{t-1} \mid \mathbf{x}_t\right)}{q\left(\mathbf{x}_t \mid \mathbf{x}_{t-1}\right)}\right]=: L
$$

The forward process variances $\beta_t$ can be learned by reparameterization [33] or held constant as hyperparameters, and expressiveness of the reverse process is ensured in part by the choice of Gaussian conditionals in $p_\theta\left(\mathbf{x}_{t-1} \mid \mathbf{x}_t\right)$, because both processes have the same functional form when $\beta_t$ are small [53]. A notable property of the forward process is that it admits sampling $\mathbf{x}_t$ at an arbitrary timestep $t$ in closed form: using the notation $\alpha_t:=1-\beta_t$ and $\bar{\alpha}_t:=\prod_{s=1}^t \alpha_s$, we have

$$
q\left(\mathbf{x}_t \mid \mathbf{x}_0\right)=\mathcal{N}\left(\mathbf{x}_t ; \sqrt{\bar{\alpha}_t} \mathbf{x}_0,\left(1-\bar{\alpha}_t\right) \mathbf{I}\right)
$$
