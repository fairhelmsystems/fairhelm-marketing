---
title: "Batch or events? Choose data movement by recovery, not by trend"
description: "Streaming is not a maturity level and batch is not a compromise. A decision framework for picking how data moves, based on latency the decision actually needs, correctness, recovery and what the team can run at 2 a.m."
date: "2026-08-24"
cover: "/insights/batch-or-events.webp"
category: "Data engineering"
lane: "/services/data-engineering/"
laneLabel: "Data engineering"
readingTimeHint: 8
---

Most architecture arguments about data movement are settled before anyone asks what the data is for. Someone says batch is legacy. Someone else says streaming is over-engineering. Both positions are about fashion, and neither survives contact with the question that actually decides it: what changes if this number is ten minutes late? One hour late? One day late?

Scheduled batch, micro-batch, change data capture and event streams are four ways of moving data, not four rungs on a ladder. Each has a latency profile, a correctness profile, a recovery story, an operational burden and a cost shape. Pick the one whose recovery story you can live with when it breaks at three in the morning, because it will.

## Start with the decision, not the data

Take one specific thing someone does with the data and price its lateness.

- A finance team reconciling fee collections and chasing overdue accounts works in daily cycles. A figure that is four hours old changes nothing. A figure that is wrong changes everything.
- An attendance exception that should trigger a call to a parent is worth very little an hour later. Minutes matter. A small number of duplicate alerts is survivable; a missed one is not.
- A board pack refreshed weekly needs stability far more than freshness. Numbers that move between the draft and the meeting destroy more confidence than numbers that are five days old.

Three different answers, three different patterns, one organisation. The mistake is choosing one movement pattern for the whole estate. The useful unit of decision is the data product and its consumer, not the platform.

Ask the question in a form that forces a real answer. Not "would you like it faster", because everyone would. Ask: name the action that happens sooner if this arrives in ten minutes instead of tomorrow morning, and say who takes it. If nobody can name the action or the person, the latency requirement is a preference, and preferences do not justify on-call rotas.

> Choose the pattern you can recover at 2 a.m., not the one that demonstrates best at 2 p.m.

## The four patterns, compared honestly

| | Scheduled batch | Micro-batch | Change data capture | Event streams |
| --- | --- | --- | --- | --- |
| Typical latency | Hours to a day | Minutes | Seconds to minutes | Sub-second to seconds |
| Correctness and ordering | Strong. Whole-period views, easy totals | Strong within a window, boundary effects at edges | Source ordering preserved per table, transactions can span tables | Ordering only per key or partition, duplicates expected |
| Recovery and replay | Re-run the period. Simple and well understood | Re-run affected windows | Replay from log position if retention allows, otherwise reseed the whole table | Replay from offset if retention allows, and only if consumers are deterministic |
| Operational burden | Low. One schedule, one failure mode | Moderate. More runs, more partial states | High. Log retention, slot and lag monitoring, schema drift at source | High. Partitions, consumer groups, lag, poison messages, on-call |
| Cost profile | Predictable, concentrated in a window | Predictable, higher idle floor | Continuous, tied to change volume | Continuous, plus retention and the cost of people |
| Best fit | Periodic positions, reconciliations, reporting | Operational dashboards that need to feel current | Mirroring a source you do not control | Reacting to something as it happens |

Two rows in that table deserve more weight than the rest. Recovery, because it is the row you will live in during an incident. Operational burden, because it is paid every week by a team that also has other work.

## Where each pattern earns its place

**Scheduled batch** fits anything with a period and a cut-off. Nightly fee collection reconciliation is the clearest case: the position is defined for a day, the sources settle on their own schedules, and the value comes from the totals agreeing rather than from being early. Batch also gives you the cleanest reconciliation story, because a period is a natural unit to compare.

**Micro-batch** fits operational views where users would notice staleness but no automated action depends on the data. An admissions funnel that refreshes every five minutes, a helpdesk queue, a collections view a team works from during the day. It keeps the mental model of batch, which is what makes it recoverable, while shortening the window.

**Change data capture** fits the case where you need a faithful mirror of a database you do not own or should not query directly, for example a transactional PostgreSQL instance behind an application. It gives you deletes, which polling on an updated_at column does not, and it removes read load from the source. It costs you a dependency on log retention and a new class of incident when the source schema changes without notice.

**Event streams** fit when the business genuinely reacts to something happening: an attendance exception that must route to a coordinator within minutes, a payment failure that must pause an enrolment, a safety alert. The distinguishing feature is not speed, it is that a consumer takes an action per event rather than reading a state.

A practical note on source systems. Some sources decide for you. An accounting package with a file export, a spreadsheet maintained by a person, a partner that drops a daily settlement file: these are batch, whatever your architecture diagram says. A gateway with webhooks is event-shaped at the edge even if you land it in batches. Design for the source you have, not the one you wish you had.

## Streaming's costs are real and they arrive later

- **Exactly-once is a property of the whole path, not of a product.** A broker can offer strong delivery guarantees and you will still write the same record twice if your sink is not idempotent. The practical target is at-least-once delivery into an idempotent write, keyed on a business key.
- **Ordering is narrower than people assume.** You get ordering per partition or per key, not across a topic. If two related facts are keyed differently, they can and will arrive out of order.
- **Reprocessing is a design decision, not a button.** Replaying a month means retention long enough to hold it, consumers that produce the same result on the second pass, and downstream systems that tolerate a second copy of every side effect.
- **Backfills need a second path.** Historical data almost never arrives through the stream. You end up with two code paths computing the same thing and a new obligation to prove they agree.
- **Schema evolution has no cut-off.** In batch, a producer changing a field breaks tomorrow's run and you fix it. In a stream, it breaks mid-flight, for some messages, while other messages are fine.
- **On-call is the real line item.** Consumer lag, poison messages, rebalancing and partition skew are alerts that fire at night. A team of three that cannot sustain a rota should not be operating something that needs one.

## Batch's costs are real too

- **Cut-off ambiguity.** Every batch has a boundary, and the boundary is where the arguments happen. A payment at 23:58 against a 23:45 extract belongs to one day in the source and another in the warehouse unless someone has written the rule down.
- **Long recovery windows.** When the 06:00 run fails, the data is not late by minutes, it is late by however long it takes a person to notice, diagnose and re-run. The gap between failure and detection is usually larger than the gap between detection and fix.
- **Stale data that looks confident.** A dashboard with no freshness indicator will be read as current. If publication is blocked by a failed check, the page must say so in words the reader understands.
- **Schedule creep.** Hourly becomes fifteen minutes becomes five, and at some point you are running an unmanaged micro-batch with none of the tooling and all of the overlap problems. Decide deliberately or you will arrive there by accident.

## Idempotency and replay are what actually matter

The pattern debate distracts from the property that determines how bad an incident is. Can you run the same movement twice and get the same result?

Make it true in all four patterns:

- Write on a business key with an upsert or a merge, never a blind insert, so a retry is harmless.
- Make transformations deterministic. No current timestamp inside a calculation, no dependence on the order rows happen to arrive in, no sequence-generated key used as a join key across systems.
- Use event time with an explicit lateness allowance, not arrival time, to decide which period a record belongs to.
- Make the unit of reprocessing explicit: a day, an hour, an offset range. Re-running that unit should fully replace its output rather than adding to it.
- Give side effects their own idempotency key. Sending the same notification twice because a consumer restarted is the failure people remember.

A batch pipeline with these properties recovers in one command. An event pipeline without them recovers through archaeology.

## A decision checklist

1. Name the decision or action the data feeds, and the person who takes it.
2. State what breaks at ten minutes, one hour and one day of lateness. If nothing breaks at one day, stop considering streaming.
3. Ask whether the consumer reads a state or reacts to an occurrence. States favour batch and micro-batch, occurrences favour events.
4. Check what the source can actually emit: files, an API with a change marker, a database log, webhooks.
5. Decide whether correctness beats freshness for this consumer. For anything that gets reconciled or signed off, it does.
6. Write the recovery procedure before choosing. If you cannot describe the 2 a.m. fix in a paragraph, pick the simpler pattern.
7. Count the people who will carry the pager, and be honest about what they can sustain alongside their other work.
8. Cost it as continuous spend plus retention plus on-call, not as compute in a window.
9. Verify that re-running the chosen unit produces an identical result.
10. Choose the simplest pattern that satisfies the first two answers, and revisit only when a named decision genuinely changes.

Most operational estates end up mixed, and that is the right outcome: nightly batch for positions that get reconciled and signed, micro-batch for the views people work from during the day, a narrow event path for the few things that must route within minutes. The discipline is keeping the event path narrow.

This is how movement patterns get chosen in Fairhelm's [data engineering](/services/data-engineering/) work: from the decision the data serves and the recovery the team can run, then the pattern, in that order.
