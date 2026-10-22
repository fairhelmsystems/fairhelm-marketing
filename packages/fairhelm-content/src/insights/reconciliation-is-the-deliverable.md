---
title: "Reconciliation is the deliverable: control totals, exceptions and sign-off in ETL/ELT"
description: "A pipeline is not finished when data lands. It is finished when the people accountable for the numbers can prove they match the source. How to make reconciliation the definition of done."
date: "2026-08-30"
cover: "/insights/reconciliation-is-the-deliverable.webp"
category: "Data engineering"
lane: "/services/data-engineering/"
laneLabel: "Data engineering"
readingTimeHint: 9
---

A pipeline run finishes. The orchestrator turns green, the row count in the target table goes up, and the alert that would have fired stays quiet. None of that tells the finance lead whether the collections figure on the dashboard matches what the bank actually received. Until someone can answer that question, and is prepared to put their name against the answer, the work is not finished.

In operational data work, anything with a real source of truth behind it, fee collections, admissions, payables, stock, payroll, the deliverable is not rows. It is a reconciled position that an accountable person has agreed is correct. This is what we collected. This is what is outstanding. Here is the evidence that it matches the system it came from, and here is the list of everything that did not match. Make that the definition of done and most of the pipeline design follows from it.

## "Data landed" is a statement about the pipeline, not about the numbers

"Loaded successfully" means the job ran. "Matches the source" means the numbers can be used. Only the second claim helps the person who has to chase an overdue account, release a purchase order or answer a question from the board.

A load can succeed while:

- Half a day's records are missing, because the source API paginated and the second page timed out.
- The same payment appears twice, because a retry inserted it again under a fresh surrogate key.
- A refund lands as a positive amount, because the sign convention differs between two source systems.
- The totals are right but sit against the wrong campus, month or fee head.

Every one of those gives you a green run. Several of them give you a dashboard that looks entirely reasonable. Plausible and wrong is worse than visibly broken, because nobody goes looking.

> If the pipeline cannot prove the number, the pipeline has not delivered the number.

## Reconciliation has three levels and you need all three

Teams usually build one of these, call it reconciliation, and are surprised when a discrepancy slips through. The three levels catch different classes of error and cost different amounts to run.

| Level | The question it answers | What it catches | What it still misses |
| --- | --- | --- | --- |
| Control totals | Do the aggregates agree for this period and grain? | Missing batches, duplicated loads, truncated files | Offsetting errors, misattribution inside a correct total |
| Record-level comparison | Does each source record exist exactly once in the target, unchanged? | Duplicates, dropped rows, silently altered values | Records copied faithfully but wrong at source |
| Business-rule reconciliation | Does the resulting position obey the rules of the business? | Sign errors, orphaned allocations, receipts with no matching invoice | Rules nobody has written down |

### Control totals

Count, sum, minimum and maximum event timestamp, and distinct business keys, computed on both sides for the same period and the same grain. Cheap, fast, and the only check that belongs on every single run. The grain matters more than the metric: a group total that agrees while two campuses are out by equal and opposite amounts is a total that lies. Reconcile per campus, per day, per fee head, then roll up.

### Record-level source-to-target comparison

Join source to target on the business key and compare the fields that matter. This is heavier, so run it on a window rather than on all history: the current period, plus a trailing window long enough to cover the lateness you actually observe. It is the only level that finds a duplicate hiding inside a correct-looking sum.

### Business-rule reconciliation

The numbers agree with the source and the source itself is inconsistent. A receipt allocated to a closed fee head. A credit note with no parent invoice. A student marked present at two campuses in the same session. These are not pipeline defects and you cannot fix them in the pipeline. You can detect them, attribute them and put them in front of the person who can.

## Exceptions are records, not log lines

The most common mistake is treating a mismatch as an error message. An error message is written once, read by an engineer, and lost. An exception is a row in a table with a life of its own, and it needs to carry enough to be worked without a conversation.

- **Identity**: a stable exception key, so the same unresolved mismatch on Tuesday is recognised as the one from Monday rather than counted again.
- **Source and target values**: what each side said, verbatim, not a formatted difference.
- **Rule**: which check produced it, by name and version, so a change in the rule is distinguishable from a change in the data.
- **Delta**: the signed difference in amount, count or both, so exceptions can be summed and ranked.
- **Owner**: a named role that can actually resolve it, the campus accountant or the admissions officer, not "data team".
- **Age**: first seen and last seen timestamps. Age is the number that drives behaviour.
- **Status**: open, acknowledged, resolved at source, accepted with reason, or superseded. Accepted needs a reason and a person.
- **Run reference**: the pipeline run that produced it, so the evidence can be reconstructed later.

Two properties follow. The exceptions table is append-only, because the history of a discrepancy is part of the audit trail. And the count of open exceptions, weighted by value and age, is a better health metric for the pipeline than uptime.

## Sign-off is a person, not a status column

Someone must say the position is correct, and that someone is not the data engineer. The engineer owns the claim that reconciliation ran, that the totals match, and that the exception list is complete and accurate. The business owner owns the judgement about what remains open. Splitting it any other way puts an engineer in the position of approving a financial figure they have no standing to approve.

A sign-off record should hold the period, the grain, the named person, the timestamp, the control totals as they stood at that moment, the pipeline run reference, and every exception accepted with its reason. Store it. The value of sign-off appears months later, when someone asks why the September figure in the board pack differs from the September figure in the system today, and the honest answer is that late records arrived and the position was restated. Restatement is normal. Silent restatement is not.

## Put reconciliation in the pipeline, not in a runbook

A reconciliation that depends on someone remembering to run it is a reconciliation that stops the first busy week. Encode it.

- **Load to staging, publish on pass.** The target that reports read from should only ever be updated after the checks pass. A pointer swap or a partition swap is enough. If a check fails, yesterday's published data stays visible, clearly stale, rather than today's data being visibly wrong.
- **Hard gates and soft gates.** A hard gate blocks publication: control totals must match to the paisa, no duplicate business keys, row count within an agreed band. A soft gate raises an exception and lets publication proceed. Which is which is a business decision. Agree the thresholds with the owner and write them down, rather than inventing them in a pull request.
- **One exceptions table per domain.** Not per pipeline. The people resolving exceptions think in terms of fees or admissions, not in terms of your job names.
- **A daily reconciliation report that goes out even when everything matches.** A report that only appears on failure trains people to ignore it, and gives you no way to tell a healthy silence from a dead scheduler. Include the totals on both sides, the delta, open exceptions by age and owner, and the freshness of each source.
- **Keep the evidence.** Store per-run control totals permanently. They are small, and they turn a forensic exercise into a query.

## A worked example, with invented figures

Suppose a school group collecting fees across four campuses. Three sources feed one position: a payment gateway settlement report, the bank statement, and the fee ledger in the school system. All figures below are illustrative and made up for the example.

For one day, the gateway reports 412 payments totalling 1,946,000. The warehouse, after loading, holds 409 payments totalling 1,933,500. Control totals disagree by three payments and 12,500. The gate blocks publication.

Record-level comparison resolves it into three distinct facts. Two payments, timestamped 23:51 and 23:58, exist at the gateway and not in the warehouse: the extract cut-off is 23:45, so they are late by design and will arrive on the next run. One payment exists in the warehouse and not at the gateway: it is a cash receipt keyed by a campus office, correctly absent from a gateway report. The rule was wrong, not the data, and the fix is to scope the gateway reconciliation to gateway-originated receipts.

Business-rule reconciliation then finds three receipts allocated to a fee head closed at the end of the previous term. Those are not pipeline defects. They become exceptions owned by the campus accountant, and the day's position is signed with them open and noted.

The difference between this and the usual outcome is not the effort. It is that the 12,500 was explained rather than investigated, and the explanation is on the record.

## The failure modes worth designing against

- **Silent partial loads.** Pagination that stops early, a source that returns an empty page instead of an error, a file that was still being written when you read it. Control totals catch these. Nothing else reliably does.
- **Duplicate keys.** Retries, re-runs and at-least-once delivery all produce them. Deduplicate on the business key, not on the row hash, because a duplicate with a refreshed updated_at will not hash the same.
- **Timezone and cut-off ambiguity.** A day boundary in the source system, a day boundary in the warehouse and a day boundary in the finance calendar can be three different instants. Fix the definition once, in writing, and make every check use it.
- **Late-arriving records.** Decide the lateness window from observed behaviour, reconcile the trailing window on every run, and restate openly when a signed period changes.
- **Currency and rounding.** Reconcile in minor units as integers. Apply rounding once, at the last step, and store the rounding difference rather than letting it float.
- **Reversals and sign conventions.** A refund, a chargeback and a write-off are three different things. If your model treats them as one negative amount, your reconciliation will balance and your revenue will not.

## What to ask before you accept a pipeline

1. What exactly does this pipeline claim, and against which source of truth is that claim checked?
2. At what grain do control totals run, and are they stored per run?
3. Which checks block publication and which only raise an exception? Who agreed that split?
4. Where do exceptions live, what does a row carry, and who is the named owner for each rule?
5. How old is the oldest open exception, and what is the total value at stake?
6. Who signs the period off, and what is recorded at the moment they sign?
7. What is the lateness window, and what happens to a period that has already been signed when late data arrives?
8. If the run fails at 03:00, what do users see at 09:00, and how do they know it is stale?
9. Can the pipeline be re-run for a past day and produce exactly the same result?
10. Show me last week's reconciliation report. Not the design for it, the report.

The last question is the one that separates a pipeline that reconciles from a pipeline that intends to.

This is the standard applied to Fairhelm's own [data engineering](/services/data-engineering/) work. A pipeline is accepted when the reconciliation runs on schedule, the exceptions have owners and ages, and a named person can sign the position, not when the first load completes without an error.
