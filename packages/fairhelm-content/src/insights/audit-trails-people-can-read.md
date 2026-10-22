---
title: "Designing audit trails people can actually read"
description: "Most systems log everything and explain nothing. An audit trail is for a principal, a finance head or an auditor, not for a database. How to design one that answers who, what, when, why and under whose authority, in plain language."
date: "2026-08-18"
cover: "/insights/audit-trails-people-can-read.webp"
category: "Governance"
lane: "/security/"
laneLabel: "Security and governance"
readingTimeHint: 8
---

Most systems record a great deal and explain very little. Somewhere in a table there is a row showing that a field changed, which account changed it and at what time. That row is raw material. It is not an audit trail. An audit trail is the finished artefact: a record that a principal, a finance head, a trustee or an external auditor can read alone, understand without help, and act on. The test is blunt. If answering "who approved this, and why" needs a database query and someone who knows the schema, the audit trail does not exist yet.

This matters most where authority is distributed and consequences are personal. A fee concession, a mark revised after publication, an attendance correction after the register has closed, a permission granted to an office account. Each is a decision taken by a named person, in a named role, for a reason. The job of the system is to keep that decision legible long after everyone involved has forgotten it.

## Logs, event streams and audit trails are three different things

They are often built as one thing, which is why so few institutions can answer a governance question from their own software.

**Logs** serve engineers. They are verbose, mostly free text, retained for days or weeks, and they exist to explain why a process behaved oddly at three in the morning.

**Event streams** serve other systems. They are structured messages, shaped for consumers and for replay, ordered by machine concerns rather than institutional meaning.

**Audit trails** serve people who hold authority. They are selective, permanent, written in the language of the institution, and read months later by someone who was not present and is accountable to a board, a parent or a regulator.

All three can be derived from the same events. The mistake is to publish one of them under all three names. A log in a nicer font is still a log.

## Every entry must answer five questions

An audit entry that cannot answer these five is decoration.

| Question | What the entry must carry | Frequent failure |
| --- | --- | --- |
| Who | The person, named as the institution names them | An opaque account identifier |
| In which role | The role or scope they were acting under at that moment | Omitted entirely |
| Did what, to which record | The action and the record, both named in business terms | "Record updated" |
| When | Timestamp with time zone, plus the effective date when it differs | Server time, no zone, no effective date |
| Under whose authority, and why | The approver, delegation or policy that permitted it, and the stated reason where one was required | An empty optional field |

The acting role is the field most often missing and the one auditors ask about first. The same person may be a class teacher in the morning and an examinations coordinator in the afternoon. An entry that records the person but not the role under which they acted cannot establish whether the action was permitted. Roles also change: the entry must record the role as it stood at the time, not as it stands today.

> An audit trail is not a record of what the system did. It is a record of what a person decided, in which role, and under whose authority.

## Entries should read as sentences, not as rows

Store the entry as structured fields, because filters and exports need structure. Render it as a sentence, because the reader is a busy person, not a query engine.

A rendered entry should read close to this: on 14 August, the finance officer, acting as Finance Officer, changed the concession on invoice INV-2291 for a named student from zero to 25 percent, citing the sibling concession policy, approved by the principal.

Rules that make that possible:

- Name the person and the acting role, not just an identifier.
- Name the record the way its owner names it: the invoice number, the student, the class, the term.
- Show the value before and the value after for every material field, and keep both permanently.
- Capture the display value as it stood at the time. Fee heads get renamed, grading scales get revised, classes get restructured. An entry that resolves names at read time will quietly rewrite history.
- Keep units, currency and precision inside the entry. A bare number is an argument waiting to happen.

Before and after values are not optional for money, marks, attendance, dates, statuses and permissions. Without them the trail says something changed, which is the one thing the reader already knew.

## Material actions belong in the trail, and nothing else does

A trail that records everything becomes unreadable, then ignored, then distrusted. Selection is a design decision, written down and reviewed rather than left to whoever wrote the last feature.

Material, in an institutional setting, usually means:

- Approvals, rejections and escalations.
- Overrides of a rule, limit or validation.
- Edits to money: fees, concessions, fines, refunds, adjustments, receipts and reversals.
- Edits to marks or results after publication, and to attendance after the register closes.
- Permission, role and delegation changes.
- Exports, bulk downloads and report generation over personal data.
- Deletions, deactivations and merges.
- Configuration that changes what other people may do: approval thresholds, fee heads, grading scales, cut-off dates.

Noise, by contrast, is page views, routine reads, autosaves, successful sign-ins under normal conditions and background jobs that decided nothing. Failed sign-ins and access anomalies matter, but they belong to security monitoring, not to the governance trail. The dividing line is simple: if an entry cannot be read as a decision, it is not audit, it is telemetry.

## An audit trail that can be quietly edited is not evidence

Three properties carry the weight here.

**Append-only.** Entries are never updated in place and never deleted. A correction is a new entry that references the earlier one and explains the correction. A system that can silently rewrite its own history has no history.

**Retention tied to the record, not to the trail.** The trail must outlive the thing it explains. Financial entries outlast an academic year, results entries outlast a student's enrolment, and personal data deletion has to be reconciled with statutory retention rather than performed by reflex. Where the record itself is deleted, the trail should survive in a form that proves the deletion happened, who ordered it and under what policy.

**Survival through migration.** Migration is the most common cause of death for an audit trail. Systems are replaced, tables restructured, a vendor changes, and the history is left in an old database nobody can reach. Carry the trail across, or make the cut-over explicit with a readable, preserved archive and a documented boundary. A gap nobody can explain is worse than no trail at all, because it invites the worst interpretation.

Visibility of the trail must itself be governed. The trail contains personal data and organisational decisions, so access follows role and scope: a class teacher sees the records they are responsible for, a finance head sees financial actions, a principal sees across the institution, an external auditor receives a defined scope for a defined period. Reading a trail over sensitive records is itself a material action and should leave an entry.

## A trail nobody can query is not a trail

Most audit features fail at the point of use rather than capture. The data is there; nothing can be found. Four access patterns cover almost every real question:

- **Per-record timeline.** Everything that happened to this invoice, this student, this result sheet, in order, in plain language.
- **Per-person view,** restricted to roles entitled to use it. This is a supervision surface as well as a governance one, so its own access should be narrow and recorded.
- **Filters that match the question:** action type, date range, record type, amount threshold, role, campus, policy cited.
- **Export for auditors** in a format they can open, carrying the filter that produced it and the time it was generated, so the extract can be reproduced and challenged.

### How trails fail in practice

- Identifiers instead of names, so every entry needs a translator.
- No acting role, so permission cannot be established after the fact.
- Reason fields that are optional and therefore empty.
- Before values never stored, so the change cannot be reconstructed.
- Entries attributed to a shared service account, which is the same as no attribution.
- Timestamps without a time zone, which makes cut-off dates arguable.
- A trail reachable only by engineers, which turns every audit question into a support ticket.

## Overrides are allowed, and always leave a reason and an approver

Institutions run on exceptions. A concession outside policy, a late admission, a mark corrected after the board meeting. Refusing every exception produces shadow spreadsheets, which is worse than a governed override. So make the override a first-class action rather than a back door: it names the rule it set aside, the value the rule would have produced, the reason from a controlled list with free text where needed, and an approver distinct from the person acting once the action crosses a threshold.

### A hypothetical example: one concession, three readers

The following is hypothetical and illustrative. Assume one entry: a fee concession on a single invoice raised from zero to 25 percent by a finance officer, citing a sibling concession policy, approved by the principal.

- **The principal, the same week.** Opens the student's timeline before a meeting with the family. Reads one sentence, sees the policy cited and their own approval recorded, and needs nothing further.
- **The finance head, at month end.** Filters every concession granted in the month, checks each has a policy reference and an approver, sums the before and after values and reconciles the total against the ledger. The entry is a line in a reconciliation, not a story.
- **An auditor, eleven months later.** Takes an export for the financial year, tests concessions above a threshold, confirms the approver held that authority on that date, and follows this entry through to the invoice and the receipt.

The same entry answers a pastoral question, a control question and an evidentiary one. An entry designed only for the first reader fails the third, and the third reader is the one who arrives with consequences.

## A design checklist

1. Decide and document which actions are material, and review that list when the product changes.
2. Capture person, acting role, action, record, timestamp with zone, effective date, authority and reason on every entry.
3. Store before and after values for every material field, with units and currency.
4. Freeze display names at write time so history does not get rewritten by later renames.
5. Render entries as sentences, and keep the structure underneath for filters and exports.
6. Make the store append-only, with corrections as new referencing entries.
7. Set retention from the underlying record, and prove deletions rather than hiding them.
8. Scope visibility of the trail by role, and record access to sensitive trails.
9. Ship the per-record timeline, the filters and the auditor export with the feature, not later.
10. Plan trail continuity into every migration before the migration starts.

SquareCampus, the School Operating System we build and operate, is designed around this posture, and AEGIS, its governed intelligence layer, is intended to stay read-only first, role-aware and audit-backed, with no autonomous writes in its first version.

If this is the standard you hold your own systems to, our [security and governance posture](/security/) sets out how we think about access, authority and auditability more broadly. It is a statement of direction and design, not a list of badges, and we would rather be judged on the design.
