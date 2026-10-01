---
title: 'PID or a neural network? What I’m learning so far'
date: '2026-09-30'
description: 'Some notes on control, uneven terrain, and why a newer method is not automatically the right one.'
tags: ['Controls', 'Robotics', 'Learning']
draft: false
---

I’ve been learning about PID control and neural networks, and I keep coming back to one question: when would I actually choose one over the other?

Imagine asking a motor to hold a speed while the load keeps changing. The controller has to look at what the motor is doing and decide how to respond. That simple example helps me understand the problem before getting into the equations.

## The PID idea

The way I understand PID is that it uses three parts of the error. The proportional part responds to the error now. The integral part adds up error over time. The derivative part responds to how quickly the error is changing. Those terms need tuning, and real sensors and actuators make the job less tidy than the first diagram suggests. [MathWorks’ PID introduction](https://www.mathworks.com/discovery/pid-control.html) helped me put the three parts together.

Written as an equation, those three parts look like this:

$$
u(t)=K_p e(t)+K_i\int_0^t e(\tau)\,\mathrm{d}\tau+K_d\frac{\mathrm{d}e(t)}{\mathrm{d}t}
$$

Here, e is the difference between the target and the measured value, u is the controller output, and the three gains decide how much each part contributes. This is the ideal continuous-time form. On a real motor, I’d also need to deal with sampling, output limits, and noisy derivative estimates.

I like that I can follow the reason for each part. If the response is slow or keeps overshooting, I have something specific to investigate. I still need to account for things like noisy readings and limits on the motor output.

## Where a neural network could help

A neural network can learn a relationship from data. One use in control is to learn a model of how a system responds, then use that prediction to help choose an action. That is different from assuming the network itself is a complete, reliable controller. [MathWorks’ predictive-control example](https://es.mathworks.com/help/deeplearning/ug/design-neural-network-predictive-controller-in-simulink.html) shows that distinction.

For a learned model, I can write the prediction more generally as:

$$
\hat{x}_{k+1}=f_\phi(x_k,u_k)
$$

The model uses the current state x and input u to predict the next state. The parameters φ are learned from data. That prediction still needs a way to choose an action, and it needs to be checked against what the system actually does.

The interesting question for me is whether learning could help with behaviour that changes across different conditions. A rover on soft ground might respond differently from the same rover on a firm surface.

But then I have more questions. Did the training data include that surface? What happens with a bad sensor reading? Can the prediction and the control calculation finish in time?

## What I’d try first

I’d start with a simple system and a PID baseline. Then I’d change the load or add a disturbance and record what happens. Only after that would I try a learned approach on the same conditions, including some conditions it wasn’t trained on.

I want to compare tracking error, overshoot, response time, and how much work each approach needs. I’d also want a clear way to stop the system if it behaves unexpectedly.

I’m still learning this. Right now, my takeaway is to understand the physical system first. The choice of controller should follow from that.
