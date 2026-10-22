---
title: "The KPI contract: definition, grain, owner, target, guardrail"
description: "Most dashboard disputes are not about the chart. They are about an undefined metric. Five fields that turn a KPI into a contract people can act on, and how to write them before anyone opens a charting tool."
date: "2026-09-10"
cover: "/insights/the-kpi-contract.webp"
category: "Decision systems"
lane: "/services/dashboards/"
laneLabel: "Operational dashboards"
readingTimeHint: 9
---

Most arguments about a dashboard are not arguments about the dashboard. Two people look at the same tile, read the same word, and mean different things by it. The meeting then spends forty minutes reconciling arithmetic and no minutes deciding anything. The chart is usually fine. The metric was never defined.

A performance indicator becomes usable at the point where somebody writes down five things about it: what it means, what it is measured at, who owns it, what good looks like, and what has to happen when it goes wrong. Call that a KPI contract. It is short, dull to write, and removes most of the friction organisations blame on their reporting tools.

## One word can hide three metrics

Suppose an institution runs a termly fee cycle and everyone agrees that collection rate matters. Take an illustrative meeting with three people in it.

- Finance computes cash receipted during the term divided by the amount invoiced for that term.
- The fees team computes the number of families with a zero balance divided by the number of families billed.
- Leadership computes the outstanding balance today against the revenue expected for the year.

All three are defensible. All three are called collection rate. None of them will agree, and the gap between them is widest exactly when the cycle is under stress, which is when people look at the number.

The pattern is not specific to education. Take an illustrative distributor reporting on-time delivery. One definition counts consignments dispatched by the promised date. A second counts consignments received by the customer by that date. A third counts receipt against the date promised when the order was placed, rather than the date promised after the last revision. A supplier and a customer can both report on-time delivery honestly and disagree widely, because only the third holds the supplier to its original word.

> A number that two careful people can compute differently from the same words is not defined. It has only been named.

## The five fields of a KPI contract

**Definition** is the rule, written so that someone who has never opened the dashboard could compute the number by hand from source records. That is the easy half. The hard half is inclusions and exclusions. Which records count. Which are removed, and on what basis. What happens to reversals, credit notes, cancellations, duplicates, test records and records created in error and corrected later. Most disagreement lives in the exclusions, not the formula, which is why the formula alone is never a definition.

**Grain** is two things: the unit the number describes and the period over which it is measured. One campus, one term. One route, one week. State whether the number is a snapshot taken at a moment or a flow accumulated over an interval, and state how partial periods are handled. Grain also settles aggregation. A rate that is safe to read for one campus is usually wrong when averaged across campuses, because the denominators differ. If a metric must never be averaged, put that in the contract rather than in an analyst's memory.

**Owner** is a named role, with the person currently holding it recorded beside it. The owner is accountable for two separate things: the integrity of the number and the action when it moves. An owner accountable for accuracy but without authority over the underlying process is a reporter, not an owner, and the metric will drift.

**Target** is what good looks like and by when. A target without a date is a preference. Record who set it and when it will be reviewed. A target inherited from a year nobody remembers is worse than none: it is quietly ignored, and that habit spreads.

**Guardrail** is the condition that triggers escalation or blocks a decision. Two kinds are worth separating. Business guardrails describe a state that must not persist, and breaching one raises work for a named owner. Data guardrails describe a state under which the number must not be trusted. If the feed behind a tile last ran two days ago, the tile should say so and withhold the number rather than present a stale one with confidence.

### Write the exclusions before you write the formula

The quickest way to find the exclusions is to ask the people who handle the awkward records: a refund raised in the wrong period, a duplicate booking, an order cancelled after dispatch. Every answer becomes a line in the contract. If nobody can answer, the metric is not ready to be reported, and a chart only hides the gap behind a trend line.

## The template is one page

A KPI contract fits on a single page. Five fields carry the meaning; a few more carry the provenance that makes the contract maintainable.

| Field | Question it answers | Illustrative entry |
| --- | --- | --- |
| Name | What do we call this, and what do we not call it? | Term collection rate. Not fee recovery, which is the separate debt escalation measure. |
| Definition | How is it computed from source records? | Value receipted against invoices raised for the current term, divided by the total invoiced for that term. |
| Inclusions | What counts? | Tuition and compulsory charges. Receipts cleared by the bank. |
| Exclusions | What is removed, and why? | Cancelled invoices, credit notes raised in the same term, uncleared instruments, deposits held against the next term. |
| Grain | Which unit, which period? | One campus, one term, as at the close of each working day. Not averaged across campuses. |
| Owner | Which role is accountable, and who holds it now? | Head of fee operations, current holder recorded in the role register. |
| Target | What does good look like, and by when? | Ninety five per cent by day thirty of the term. Set at the start of the year, reviewed each term. |
| Guardrail | What triggers escalation or blocks a decision? | Any campus below eighty per cent at day thirty raises an exception. No waiver is approved while the receipting feed is more than one day stale. |
| Source | Where do the records come from? | Billing ledger and bank reconciliation, joined on receipt reference. |
| History | When did this last change, and why? | Version and reason recorded in the repository history. |

The entries are illustrative. The shape is the point, not the values.

## Three different things get called a KPI

Confusing these three is how a dashboard grows to forty tiles that nobody reads.

- A **KPI** carries a decision. Somebody has committed in advance to act when it leaves its band. There should be very few. A page with thirty KPIs has none.
- A **diagnostic metric** explains movement in a KPI. It needs a definition and a grain, but it does not need a target of its own, and it is read when the KPI moves rather than every week. Days to first receipt, the share of families on instalment plans, and the count of invoices raised after the cycle opened all explain a collection rate without being one.
- A **vanity metric** goes up and changes nothing. It is often the most attractive tile on the page.

There is a simple test. If this number moved by a fifth overnight, name the person who would do something different tomorrow, and name what they would do. If either half of the answer is missing, it is not a KPI. It may still be worth measuring, as a diagnostic, one level down.

## Targets and guardrails do different work from thresholds

A threshold is a rule for colouring a chart. It is a presentation decision. Targets and guardrails are commitments, and the difference matters when something goes wrong.

- A **target** is an intention. It has a value, a date, an author and a review point. It can be missed without anything breaking, and missing it is what performance conversations are for.
- A **guardrail** is a condition with an action attached. When it is breached, something happens: an exception is opened with an owner, an approval is withheld, a decision is deferred. A guardrail that only changes a colour is a threshold wearing a better name.

Two consequences follow. Guardrails belong in the same contract as the metric, because a guardrail written against an undefined number cannot be enforced. And every guardrail needs a stated tolerance, because the tolerance is what turns a moving line into work that somebody owns.

## The contract lives in version control, not inside a chart

The common failure is that definitions end up in the place where they were first needed: a chart's calculated field, a saved query, a spreadsheet on a shared drive, a slide from two years ago. The definition then exists in several slightly different copies and no one of them is authoritative.

Put metric definitions in a modelling or semantic layer whose files sit in version control, and have the dashboard reference them rather than restate them. Whatever layer you use, the properties that matter are the same.

- One definition serves every surface: the dashboard, the export, the board pack, the API.
- Change is reviewable. A definition change arrives as a diff with an author, a date and a reason, and somebody approves it.
- The metric survives the tool. Reporting tools get replaced more often than metrics do.
- People can read it without a licence for the reporting tool.
- Automated checks can test it, so a broken join or a renamed column fails loudly rather than quietly changing a number.

The dashboard should also make the contract reachable from the tile itself. A reader who is about to challenge a number should be one click from the definition, the grain, the owner and the date the definition last changed. Most challenges end there.

## Two working sessions are enough to agree a set

Agreeing contracts across finance, operations and leadership is usually treated as a governance programme. It does not need to be. Two sessions, with drafting in between, is a workable rhythm.

1. Beforehand, collect every number currently reported anywhere, with the name used and the person who produces it. Group the duplicates. The list is usually longer than expected, and the duplicates are the agenda.
2. In the first session, choose the shortlist. Ask what decisions the group actually makes on a cycle, then keep only the numbers that feed those decisions. Everything else becomes a diagnostic or is retired.
3. Still in the first session, ask each function to state its definition of each shortlisted metric out loud, separately, before any discussion. The disagreements surface in minutes rather than months.
4. Between sessions, draft the contracts. Write definitions, inclusions, exclusions and grain. Leave owner, target and guardrail blank.
5. Still between sessions, compute each metric against real records. Exclusions nobody mentioned appear here, as the rows that make the number look wrong.
6. In the second session, assign owners first. The person who will act on the number should be in the room and should accept the role out loud.
7. Then set targets and guardrails, in that order, with dates and review points.
8. Sign off, commit the contracts, and set the review cadence. Anything unresolved goes on a short list with a name against it and a date, rather than holding up the rest.

Two rules keep the sessions short. No tool discussion, because the choice of reporting tool changes nothing about what a metric means. And nobody leaves with a metric they own but did not agree to own.

## Before you build the chart

Run the list. It takes a few minutes and it saves rebuilds.

- Every number on the page traces to a written contract.
- Every contract has all five fields filled, with the exclusions written out and the aggregation rule stated.
- Every owner is a role with a current holder, and that person knows they own it.
- Every target has a date and a review point.
- Every guardrail has a tolerance and a defined consequence, not just a colour.
- Data guardrails exist for freshness and completeness, and the surface can withhold a number it does not trust.
- Contracts sit in version control and are reachable from the tile.
- Somebody can answer, for each KPI, who acts and what they do when it moves.

Only then does layout become an interesting question, and by then it is usually easy: the contracts have already said what the page is for.

Fairhelm starts every dashboard engagement from these contracts rather than from a layout, on the view that a chart built on an undefined metric is a faster way to have the same argument. More on how we approach [operational dashboards](/services/dashboards/).
