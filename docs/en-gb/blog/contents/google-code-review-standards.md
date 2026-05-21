---
title: Google Code Review Standards
tags:
  - code-review
  - best-practice
  - engineering
  - google
author:
  name: Zihlu Wang
  email: real@zihluwang.me
---

Code review is a step in the development process where one or more developers review code written by another developer (
the author) to ensure that:

- The code is free of errors, bugs, and issues;
- The code conforms to quality and style guide requirements and standards;
- The code fulfils all intended functionality;
- Once merged, the codebase continues to function properly and is left in a better state.

This is why code review is a vital part of software development. Code reviewers act as gatekeepers, responsible for
deciding whether the code is ready to become part of the codebase and enter production.

## The Code Should Improve the Overall Health of the System

Every code change (pull request) should improve the overall health of the system. The key point is that even small
improvements, once merged, enhance the health of the software or codebase.

## Review Code Quickly and Provide Active Responses and Feedback

First and foremost, do not delay the merging of code. There is no such thing as perfect code. If the code improves the
overall health of the system, it should be delivered promptly.

> The key insight is that there is no perfect code — only better code. — Google Engineering Practices Documentation

If there are no urgent tasks at hand, review code as soon as it is submitted. The maximum response time for a pull
request should not exceed one working day. Multiple rounds of partial or complete code review should be completed for a
single pull request within a day.

## Educate and Inspire During Code Review

During code review, provide guidance by sharing knowledge and experience wherever possible.

## Review Code Against Standards

Always remember that style guides, coding standards, and relevant documentation should serve as the absolute authority
in code review. For example, when consistency of tabs versus spaces is in question, cite the coding conventions.

> If you use Java, the following article may be helpful — it summarises Java coding best practices from major tech
> companies: [A Short Summary of Java Coding Best Practices](https://rhamedy.medium.com/a-short-summary-of-java-coding-best-practices-31283d0167d3)

## Resolving Code Review Conflicts

When resolving conflicts during code review, follow the agreed best practices in the style guide and coding standards,
and seek advice from others with more domain knowledge and experience.

If your comment is optional or relatively unimportant, indicate so in the comment and let the author decide whether to
address or skip it.

As a reviewer, when there is no style guide or coding standard to reference, you can at minimum suggest that the code
change remain consistent with the rest of the codebase.

## UI Change Demonstrations Are Part of Code Review

If a code change involves user interface modifications, a demonstration is required in addition to the code review to
ensure the UI meets expectations and aligns with the interface design.

For frontend code changes, you must provide a demonstration or ensure that the code change includes the necessary UI
automation tests to verify the added or updated functionality.

## Ensure All Tests Are Included in the Code Review

Unless in an emergency, pull requests should include all necessary tests, such as unit tests, integration tests, and
end-to-end tests.

An emergency here means a bug or security vulnerability that needs fixing as soon as possible, and tests can be added
later. In such cases, ensure that appropriate tickets/issues are created and someone is responsible for completing the
tests immediately after the hotfix or deployment.

Skipping tests must never be accepted. If time is short and certain goals risk not being met, the solution is not to
skip tests but to scope down the deliverables.

## Don't Interrupt Your Own Work for Code Review

If you are deeply focused on your work, don't interrupt yourself — it takes a long time to get back into the flow. In
other words, the cost of interrupting a developer in flow far exceeds the cost of making them wait for a code review. Do
your code reviews after a break (lunch, coffee, etc.).

Most of the time, an entire code review and merge cannot be completed in a single day. What matters is giving the author
prompt feedback. For example, even if you cannot complete a full review, you can quickly point out a few areas worth
discussing. This significantly reduces frustration during the review process.

## Review All Code — Make No Assumptions

Review every line of code that is submitted. Do not make assumptions about manually written classes and methods, and
make sure you understand what the code is doing.

Make sure you understand the code you are reviewing. If you don't, ask the author for clarification or a code
walkthrough and explanation. If you are not qualified to review part of the code, ask another qualified developer to
review it in your place.

## Keep the Big Picture in Mind During Code Review

It helps to look at code changes from a broader perspective. For example, a file is modified and four new lines of code
are added. Don't just look at those four lines — consider reviewing the entire file and examining what was added. Do the
additions degrade the quality of existing code? Do they make existing functionality a candidate for refactoring?

Reviewing added code outside the context of the function/method or class will, over time, lead to classes that are
unmaintainable, tangled, difficult to test, and hard to extend or refactor.

Remember that just as trivial improvements can compound into a better product over time, even minor code degradation or
technical debt can accumulate to the point where the product becomes difficult to maintain and extend.

## Recognise and Encourage Great Work During Code Review

If you see an excellent code change, don't forget to acknowledge and encourage the author generously. The purpose of
code review is not only to find errors but also to encourage and guide developers towards great work.

## Be Considerate, Respectful, Kind, and Clear During Code Review

It is critical to remain kind, clear, polite, and respectful during code review, while also providing the author with
clear feedback and positive assistance. When reviewing code, comment on the code — not the developer.

## Explain Code Review Comments Thoroughly, with a Sense of Proportion

Whenever a code review comment proposes an alternative or points out a problem, it's important to explain the reasoning
and provide examples based on your knowledge and experience to help the developer understand why your suggestion
improves the code quality.

When suggesting modifications or changes, find the right balance in how you guide the author. For example, I prefer
guidance, explanation, hints, or suggestions over providing the entire solution.
