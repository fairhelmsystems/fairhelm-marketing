# Marketing Claims Register

Last updated: 2026-10-22 (core-platform packaging, multi-campus entitlements,
separately quoted Starter Entra SSO, selected 90-day complimentary launch pilot,
data portability and programme separation). The current commercial source is
`src/content/commercial.ts`; dated earlier decisions below are superseded where
explicitly identified by this alignment pass.

Every security, infrastructure, AI, rollout, customer, and compliance claim that appears
(or previously appeared) on squarecampus.com, with its status. Statuses:

- **VERIFIED** — evidenced by this repository, public third-party fact, or company registration.
- **NEEDS BACKEND EVIDENCE** — plausible design/product statement; must be evidenced from the
  product/infrastructure before it can be strengthened beyond "designed to / posture" wording.
- **NEEDS LEGAL REVIEW** — commitment or legal statement that counsel must sign off.
- **REMOVE** — removed from the site in this change; must not return (enforced by
  `scripts/check-claims.sh`, which runs on every build).

## Customer, ranking, and testimonial claims

| Claim | Where it appeared | Status |
| --- | --- | --- |
| "India's #1 school management system" | /school-management-system metadata, OG/Twitter | **REMOVE** (removed; no ranking evidence) |
| "Trusted by 500+ schools" / "500+ schools trust SquareCampus" | /school-management-system, /why-squarecampus metadata + keywords | **REMOVE** (removed; no customer-count evidence) |
| "India's leading School OS / school management system" | seo.ts ContactPage schema, /faq OG | **REMOVE** (removed) |
| "Best School Management System in India" (title framing) | /school-management-system title | **REMOVE** (retitled descriptively) |
| "What we learned from 50+ school visits" + "six months visiting schools across four states" | blog: why-squarecampus-exists | **REMOVE** (rewritten as general observations; restore only with real field-visit records) |
| "We met a school accountant / principal / transport coordinator…" (specific encounters) | blog: why-squarecampus-exists | **REMOVE** (reframed as hypotheticals; restore only with consented, real accounts) |
| "the schools we serve" / community sessions we host | blog: why-squarecampus-exists | **REMOVE** (reworded to intent; restore with real customers/sessions) |
| numberOfEmployees 10–50, foundingDate 2023, hiring-org schema | /careers JSON-LD | **REMOVE** (removed; page is noindex) |
| Fake LocalBusiness address (Mumbai, 400001), geo coordinates, opening hours, placeholder phone | root layout + seo.ts JSON-LD | **REMOVE** (removed) |
| SearchAction pointing to non-existent /search | root layout JSON-LD | **REMOVE** (removed) |
| "Offer: price 0 INR" implying a free product | root layout + /school-management-system JSON-LD | **REMOVE** (removed) |

## Infrastructure claims

| Claim | Where | Status |
| --- | --- | --- |
| The platform is hosted on Microsoft Azure in India | /infrastructure, /services, homepage, comparisons, blog, llms.txt, `commercial.ts` | **VERIFIED** (company confirmation, 2026-09-28). Specific regions are named in writing during evaluation, not on the site. |
| Enterprise private deployments on AWS, in a private cloud or on premises | /infrastructure, /services, homepage, comparisons, `commercial.ts` | **VERIFIED** as a commercial offer (company confirmation, 2026-09-28); scoped per engagement |
| Availability, backup and recovery design "documented in writing during security review" | /infrastructure, faq.ts, /data-retention | **VERIFIED** as an offer to document; no specific availability, backup or recovery property is stated publicly |
| Runs on AWS Mumbai (ap-south-1) | /infrastructure, /services, comparisons, blog, llms.txt (old) | **REMOVE** (removed 2026-09-28: the platform is hosted on Microsoft Azure in India; the marketing website itself is separately hosted on AWS). Forbidden by `check-claims.sh`. |
| Multi-AZ architecture / "multi-AZ design" | /infrastructure, /services, blog, llms.txt (old) | **REMOVE** (removed 2026-09-28; replaced by the offer to document availability design). Forbidden by `check-claims.sh`. |
| "99.99% SLA (AWS)" and "99.97% actual measured" uptime | /infrastructure (old) | **REMOVE** (removed; forbidden by check script. Reinstate only with a real, contractual SLA and real measurement) |
| "RTO 4 hours, RPO 15 minutes, tested quarterly" | /infrastructure (old) | **REMOVE** (removed; reinstate only with documented, tested DR objectives) |
| "Backups every 15 minutes / 35-day recovery window / 99.999999999% durability" | /infrastructure (old) | **REMOVE** (replaced with "automated, encrypted backups; cadence documented in review"; reinstate with real backup config) |
| "Only you hold the keys" / "Even we cannot read your raw data" | /infrastructure (old) | **REMOVE** (removed; forbidden. Customer-held keys is not the current design as evidenced anywhere) |
| "Residency verified monthly / monthly public infrastructure reports / CloudTrail logs published" | /infrastructure (old), comparisons | **REMOVE** (removed; no such reports exist. Reinstate if/when reports are actually published) |
| "Technically impossible for data to leave Mumbai" / SCP absolutes | /infrastructure (old) | **REMOVE** (softened to "controls designed to restrict"; evidence for stronger wording: SCP policy export) |
| Fake "live status" panel ("No incidents reported", "All replicas synchronized") | /infrastructure (old) | **REMOVE** (removed; forbidden. Reinstate only as a real status-page integration) |
| ISO 27001 / SOC 2 / PCI DSS presented as our compliance | /infrastructure (old) | **REMOVE** as our claims. AWS facility certifications are AWS's (public fact — VERIFIED as attributed to AWS). Application-level certification claims require actual certification. |
| "₹1–5 Cr upfront… AWS is cheaper" cost comparisons | /infrastructure (old) | **REMOVE** (removed; unverifiable market figures) |
| "In 5+ years of cloud-region operations, no region-wide outage" | /infrastructure (old) | **REMOVE** (removed; not our claim to make and not verified) |
| Encryption in transit and at rest | /security, /infrastructure, FAQ | **NEEDS BACKEND EVIDENCE** (stated as baseline design; evidence: TLS config, storage encryption settings) |
| TLS 1.3 / AES-256 specific ciphers | /school-management-system, faq.ts, llms.txt (old) | **REMOVE** as specifics (generalized to "encryption in transit and at rest"; reinstate with config evidence) |
| DDoS protection, private networking, WAF ("never directly exposed") | /infrastructure | **NEEDS BACKEND EVIDENCE** (softened to "designed to sit behind managed network protections") |

## Security & compliance claims

| Claim | Where | Status |
| --- | --- | --- |
| Role-based access control, scoped permissions | many pages | **NEEDS BACKEND EVIDENCE** (product design statement; evidence: product RBAC implementation) |
| "5-tier RBAC (Organization/School/Campus/Department/Staff)" | faq.ts | **NEEDS BACKEND EVIDENCE** (specific product structure) |
| Audit trails on every record/action | many pages | **NEEDS BACKEND EVIDENCE** |
| "Immutable audit trails" | /school-management-system (old) | **REMOVE** as "immutable" (softened; "immutable" is a strong technical guarantee needing evidence) |
| "Regular penetration testing" / "OWASP guidelines" | faq.ts (old) | **REMOVE** (removed; reinstate with pentest reports) |
| "SSO-ready" | /school-management-system FAQ (old) | **REMOVE** (replaced by the identity model below; the phrase is forbidden by `check-claims.sh`) |
| MFA for administrative access, remote device wipe | /security JSON-LD (old) | **REMOVE** (removed; reinstate with internal IT policy evidence) |
| India data residency / "hosted in India by default, no cross-border transfers" | /security (old), faq.ts (old), blog | **NEEDS BACKEND EVIDENCE** — softened everywhere to "designed with an India-first hosting/residency posture". Hard residency guarantees also **NEEDS LEGAL REVIEW** before contractual use. |
| "Designed to support DPDP Act / IT Act 2000 obligations" | faq.ts, /school-management-system | **NEEDS LEGAL REVIEW** (kept in softened "designed to support" form) |
| "GDPR aligned", "SOC 2 practices" | /security metadata (old) | **REMOVE** (removed; no certification/assessment evidence) |
| "Bank-grade security" | /security, /infrastructure (old) | **REMOVE** (removed; forbidden phrase) |
| Data export within 30 days of exit, CSV/JSON, deletion of all data after transition | faq.ts (old) | **REMOVE** (removed 2026-09-28; no deadline, format or complete-deletion commitment is evidenced, and the DPA is narrower. Forbidden by `check-claims.sh`. See "Data retention and exit" below) |
| "The platform includes consent management, data retention controls, and export capabilities" | faq.ts (old) | **REMOVE** (removed 2026-09-28; designed and partly built in the platform's data layer but not available for institutional data) |
| "Ensuring GDPR … compliance" | /data-processing-addendum metadata (old) | **REMOVE** (metadata now describes the document; no GDPR assessment exists) |
| Security questionnaire support / documentation on request | /security, /infrastructure | **VERIFIED** as an offer (it is a commitment to respond, not a certification) |

## AI (AEGIS) claims

| Claim | Where | Status |
| --- | --- | --- |
| AEGIS answers within the same RBAC scopes as the platform | /aegis, home, comparisons | **NEEDS BACKEND EVIDENCE** (product design statement) |
| Every AEGIS query lands on the audit trail | /aegis, comparisons | **NEEDS BACKEND EVIDENCE** |
| Tenant boundaries respected; data not pooled into external models | /aegis | **NEEDS BACKEND EVIDENCE** + **NEEDS LEGAL REVIEW** (interacts with /ai-policy commitments) |
| "We do not use customer data to train general-purpose AI models without explicit consent" | /ai-policy | **NEEDS LEGAL REVIEW** (policy commitment; left untouched as legal language) |
| Exception detection across attendance/fees/academics | /aegis, home | **NEEDS BACKEND EVIDENCE** (capability claim) |

## Rollout & support claims

| Claim | Where | Status |
| --- | --- | --- |
| "Most schools launch in days" / "2–4 weeks implementation" / Day 0–14 timeline | /school-management-system, faq.ts, llms.txt (old) | **REMOVE** as fixed timelines (softened to guided sequence agreed during scoping; reinstate with real rollout data) |
| Guided rollout: migration, role-based training, parallel run, named counterparts | many pages | **NEEDS BACKEND EVIDENCE** (service-model commitment; keep only while the team actually staffs it) |
| "Zero data loss" migration | seo.ts contact FAQ (old), faq.ts (old) | **REMOVE** (softened to parallel-run validation) |
| Reply within one business day | demo form, contact copy | **NEEDS BACKEND EVIDENCE** (operational commitment; keep only while honored) |
| "40–60% reduction in admin tasks", "ROI within the first academic year" | faq.ts (old) | **REMOVE** (removed; reinstate with measured customer data) |
| "Zero-downtime releases", "public changelog" | faq.ts (old) | **REMOVE** (softened; reinstate with release-process evidence / an actual public changelog) |
| Mobile apps for parents/students (iOS + Android) included | faq.ts, comparisons | **NEEDS BACKEND EVIDENCE** (product capability; verify app-store presence before strengthening) |
| Pre-built integrations (payment gateways, government portals), REST APIs, webhooks | faq.ts, /services | **NEEDS BACKEND EVIDENCE** |
| "Headcount-based" / "student + staff" pricing, "implementation and training included" | /school-management-system, comparisons, intent pages, blog (old) | **REMOVE** (contradicted /pricing/: the licence is on active enrolled students in volume bands and implementation is scoped separately; both phrases are forbidden by `check-claims.sh`) |
| "No prices are published" / "no figures are published" | llms.txt, plan matrix, sitemap comment (old) | **REMOVE** as wording (replaced by `pricingAvailability.short` in `content/commercial.ts`: the model is published, figures follow a written proposal after discovery). **Public rate cards are intentionally out of scope** (decision 2026-09-10): this is deliberate enterprise positioning, not an incomplete page. No surface may imply that public numeric pricing is expected or missing, and no figure may be added. |
| Included vs separately scoped (licence covers plan capability, standard apps, self-serve reporting, implementation and support in every plan, a monthly usage allowance; data migration from Pro. Quoted: Starter migration, custom integrations/engineering, fixed-format documents made for one institution, private/on-prem deployment, a custom SLA, usage beyond the allowance) | /pricing, /faq, /school-management-system, llms.txt | **NEEDS LEGAL REVIEW** (commercial policy; must match the proposal and order form). Inclusions **confirmed by the owner on 2026-09-30** (`commercialScope` in `content/commercial.ts`), including: no premium or paid implementation tier, the same rollout for everyone (no paid fast track), designed to need little or no training |
| Data migration included in Pro and Enterprise, best effort: gaps in the old system's data are flagged before go-live, never guaranteed complete | /pricing, /faq, /rollout, intent pages, comparisons | **VERIFIED** as owner policy (2026-09-30); **NEEDS LEGAL REVIEW** so the order form states the same limit. `check-claims.sh` blocks "nothing is lost" / "zero data loss" |
| Monthly allowance for SMS, WhatsApp, storage (and AEGIS where included); usage beyond it prepaid, "never a bill after the fact"; "the proposal you sign is the bill you get" | /pricing, /faq | **VERIFIED** as owner policy (2026-09-30); **NEEDS LEGAL REVIEW** (the order form must carry prepaid top-ups and no post-paid usage). Allowance sizes and rates are never published |
| Payments run through the institution's own gateway account; SquareCampus never handles the money; gateway fees are between the institution and the gateway | /pricing, /integrations, fee intent page | **VERIFIED** as owner statement (2026-09-30: the institution's own gateway API keys are used) |
| "SquareCampus will look expensive to an institution that needs only attendance, fees and report cards" (fit qualification) | /pricing, /faq, llms.txt | **VERIFIED** as positioning (a statement of intent, not a market claim) |

## Identity and access (by plan)

Stated once in `src/content/commercial.ts` (`identity`) and rendered on /pricing,
/security, /faq, /school-management-system and llms.txt. Checked against the
platform's authentication implementation on 2026-09-09. Nothing is described as
available unless the platform implements it.

| Claim | Where | Status |
| --- | --- | --- |
| Secure authentication and role-based authorisation are baseline requirements across plans; managed sign-in is in the baseline commercial scope | pricing, security, faq | **COMMERCIAL POLICY CONFIRMED 2026-10-22; DEPLOYMENT READINESS UNVERIFIED.** The earlier credential-login gap is not treated as resolved. Public copy now requires supported sign-in methods and deployment readiness to be confirmed before activation, rather than claiming a live credential-login feature. |
| Privileged roles "designed to carry additional sign-in verification" | pricing, security, faq | **NEEDS BACKEND EVIDENCE** (design wording only) |
| Starter, Pro and Enterprise may request separately quoted Microsoft Entra ID SSO, subject to technical onboarding | pricing, security, faq, blog | **COMMERCIAL POLICY CONFIRMED 2026-10-22** in this mission. Entra validation is implementation evidence, not proof of production onboarding for every institution; activation remains conditional on technical validation. Supersedes the earlier Pro threshold. |
| Enterprise: identity governance (multi-directory, group-to-role mappings, SSO enforcement policy, lifecycle controls, identity migration, identity audit) "scoped as Enterprise requirements during technical discovery" | pricing, security, faq | **NEEDS BACKEND EVIDENCE** — worded as scoped requirements, never as shipped features. None of these is implemented today. |
| Google Workspace SSO | — | **ABSENT.** Not implemented anywhere; must not be advertised until it is. `check-claims`/tests forbid "Google Workspace SSO". |
| SAML / SCIM by name | pricing scoped list (old) | **REMOVE** as named capabilities (not implemented; replaced by the generic "identity governance requirements" wording) |
| "Enterprise includes Entra ID SSO for one approved institutional tenant" | pricing, security, faq (old) | **REMOVE** (SSO may be quoted across plans; the tenant cap is not the Enterprise differentiator; forbidden by `check-claims.sh`) |
| Break-glass access | — | **ABSENT.** No such mechanism exists; do not describe one. |
| Authorisation stays in SquareCampus; never derived from email/domain alone | security, pricing, faq | **VERIFIED** as design (backend: Entra `tid` is directory metadata only; authority resolved server-side from memberships) |

## Data retention and exit

Public wording lives in `src/content/retention.ts` and renders on `/data-retention/`,
the pricing plan bands, the FAQ and `/llms.txt`. The reviewed retention schedule is
rendered only from rules that pass `publicationBlocker()` (qualified review of the
exact version, recorded by reference); no rule has passed, so the page shows the
empty-schedule notice. Legal research, proposed periods and review records are kept
outside this repository. Approval of website wording is not legal review.

| Claim | Where | Status |
| --- | --- | --- |
| "Your plan does not determine your legal retention obligations. Storage and archive arrangements are specified in your proposal and order form." | /pricing (every plan band and the comparison), llms.txt | **NEEDS LEGAL REVIEW** as commercial policy (must match the proposal and order form); the principle itself is approved website wording (2026-09-28) |
| Institution is the Data Fiduciary for its records; SquareCampus processes them as Data Processor under the DPA | /data-retention | **VERIFIED** as a restatement of the published DPA and Privacy Policy |
| Contract end: delete/anonymise or return where export is agreed; retention for law, disputes, backups | /data-retention, faq.ts | **VERIFIED** as a restatement of DPA §11. Substantive terms unchanged; any change needs counsel |
| Export scope, formats, timing, responsibilities and charges agreed in the order form; no published format or turnaround; no self-service institution-wide export | /data-retention, faq.ts, homepage, /launch-partners FAQ, blog `school-erp-data-exit` | **VERIFIED** as the approved position (2026-09-28). No institution-wide export capability is evidenced in the platform |
| Retention deadlines, preservation holds and consent withdrawal "being built into the platform's data layer", not available for institutional data | /data-retention | **NEEDS BACKEND EVIDENCE** before any stronger wording: design and synthetic-only implementation exist; nothing runs on institutional data |
| Website enquiries: stored with IP address and browser details, passed to the CRM, notified by email; anti-abuse records set to expire automatically | /data-retention | **VERIFIED** against the intake handler (now in the private infrastructure repository) and the live table configuration (2026-09-28). Submission records carry no expiry |
| No retention period yet for website enquiries or their CRM, email and log copies | /data-retention | **VERIFIED** as a statement of the current gap. Setting a period is an operational decision, not a website change |
| Backup retention periods for production not stated | /data-retention | **VERIFIED** as a statement of the gap. Backup cadence and retention remain **NEEDS BACKEND EVIDENCE** (see Infrastructure claims) |
| Preservation and data requests made in writing and assessed individually; no self-service preservation control | /data-retention | **VERIFIED** as the approved handling arrangement (2026-09-28). No automated or tested fulfilment is claimed |
| Official source references (DPDP Act 2023, DPDP Rules 2025, CBSE Affiliation Bye-Laws Ch. 14) | /data-retention | **VERIFIED** as references only (official URLs read 2026-09-28). No period, interpretation or applicability is drawn from them on the site |
| "Retention schedule is under legal review" | — | **ABSENT.** No qualified legal review is established; forbidden by `check-claims.sh` |
| Statutory penalty figures and consequences | — | **ABSENT** by decision (2026-09-28): not published in this change |
| "Complete exports in standard formats" / "within 30 days of request" | homepage, /launch-partners FAQ, blog "Our own posture", faq.ts (old) | **REMOVE** (removed; forbidden by `check-claims.sh`) |

Closed 2026-09-29: the blog posts `founding-institutional-partner-pilot`,
`eighteen-thousand-rupee-school-erp-true-cost` and the DPDP checklist post no longer
describe exports "in standard formats" as SquareCampus practice; buyer-checklist
questions that ask *any* vendor about standard formats remain.

## Capability, availability and integrations (site audit, 2026-09-29)

Stated once in `src/content/commercial.ts` (`availability`, `deploymentOptions`,
`deploymentSummary`, `integrationScope`) and rendered by `AvailabilityNote`
beside capability lists (Home, Platform, AEGIS, category pages, the School
Management System page), on /services and in llms.txt. Capability copy
describes the product design; which modules, apps, languages and integrations
an institution receives, and when, is confirmed in its proposal.

| Claim | Where | Status |
| --- | --- | --- |
| "Capabilities on this site describe how SquareCampus is designed to work… confirmed in writing in your proposal" | capability surfaces, llms.txt | **VERIFIED** as the availability qualifier (a statement about how the site should be read) |
| SquareCampus is school management software built as a connected School OS (`product.categoryRelationship`) | About, Why, category pages, ERP FAQ, llms.txt | **VERIFIED** as positioning; replaces "This is not school management software" |
| "Ten Indian languages" across apps, circulars and notifications | homepage, category pages, FAQ, llms.txt, blog | **REMOVE** (no language count is published; languages are confirmed per institution in the proposal). Forbidden by `check-claims.sh` |
| Parent and student apps "iOS and Android" | FAQ | **REMOVE** as a store-availability statement; the licence-inclusion of the standard apps (commercial policy) stays |
| BYOC "coming soon" / "early-access list" | homepage, services, ecosystem, comparisons | **REMOVE**. BYOC is listed as "Not offered today" in `deploymentOptions`; no early-access list exists |
| Enterprise private deployment on AWS, private cloud or on premises | services, homepage, comparisons, llms.txt | **VERIFIED** as a scoped Enterprise service (status "Scoped service") |
| Pre-built integrations, "webhooks for real-time sync", "API & WebSocket connectors", tools that "talk to each other — automatically" | FAQ, services, ecosystem, School Management System FAQ | **REMOVE**. Integrations are scoped work with stated prerequisites (`integrationScope`); no connector catalogue is published |
| Named third-party tools (Tally, WhatsApp, biometric devices) as connected systems | services visual, AEGIS visual, ecosystem metadata | **REMOVE** as connection claims; named only as tools an institution may ask to scope |
| "In seconds", "instantly", "in real time", "live sync" | AEGIS, About, Platform, services, category pages | **REMOVE** as speed/freshness assurances; replaced by "current records" |
| "How each module behaves in production" / "as they run in production" | category pages | **REMOVE** (implies production usage that is not evidenced) |
| "Without drama, outages, or surprises" | About | **REMOVE** (reliability promise); availability and recovery design documented during security review |
| "Automated backups, redundant systems" | blog `why-squarecampus-exists` | **REMOVE** (see Infrastructure claims: backup and redundancy properties are not stated publicly) |
| "For a 300-student school or a 30,000-student group" | homepage, AEGIS | **REMOVE** (scale claim without evidence) |
| "Exports in standard formats" as SquareCampus practice | three blog posts | **REMOVE** (export scope, format and timing are agreed in the order form; closes the item left open on 2026-09-28) |

### Illustrations

| Claim | Where | Status |
| --- | --- | --- |
| "LIVE · 09:52" badge with a pulsing dot; "Live" chips on illustrations | homepage hero screen, hero AEGIS panel, AEGIS visual | **REMOVE** (an illustration must not look like live telemetry). Replaced by "Sample data" / "Illustrative" labels; forbidden by `check-claims.sh` |
| "Records copied out: 0", "Questions audited: 100%", partial governance-check bars (94%, 90%) | AEGIS visual | **REMOVE** (numeric assurances shown as if measured) |
| Synthetic-data label placement | homepage hero, AEGIS console | **VERIFIED**: the label now sits beside the illustration it qualifies (`SyntheticDataNote`) |

### AEGIS action boundary

AEGIS is read-only (`aegisBoundaries` in `src/content/what-is-squarecampus.ts`,
rendered on /aegis and /what-is-squarecampus). Illustrations show *suggested
follow-ups for a person to act on*; no surface may show AEGIS queuing, sending or
changing anything. "Every question, answer, and suggested action lands on the
audit trail" was reworded so suggestions are not presented as executed actions.
AEGIS capability statements remain **NEEDS BACKEND EVIDENCE** (see AI claims).

### Journeys, workflows and examples (site audit P1, 2026-09-29)

| Claim | Where | Status |
| --- | --- | --- |
| Six workflow cards (admission → enrolment, attendance → follow-up, fees → reconciliation, exams → results, notice → acknowledgement, campus → leadership view) | homepage, /platform (`content/workflows.ts`) | **NEEDS BACKEND EVIDENCE** as capability; published as design beside `AvailabilityNote`. The wording restates the solution pages |
| AEGIS example questions with answer scope, sources, as-of time and limits | /aegis | **NEEDS BACKEND EVIDENCE**; labelled "how AEGIS is designed to answer", not a transcript |
| Rollout stages: school input, SquareCampus deliverable, completion criteria | /rollout | **NEEDS BACKEND EVIDENCE** (service model; keep only while staffed). No durations or deadlines are published |
| Worked examples and "configured, scoped or quoted separately" limits | /school-erp-software, /fee-management-software-for-schools | Examples **NEEDS BACKEND EVIDENCE** (design); limits **VERIFIED** as restatements of `pricingAvailability` and `integrationScope` |
| Per-plan "Scoped separately" lists; Pro AEGIS "when the proposal includes it"; Enterprise AEGIS "within an agreed monthly allowance" | /pricing | **NEEDS LEGAL REVIEW** as commercial policy (must match the proposal and order form); the Pro AEGIS wording was confirmed by the owner on 2026-09-29, and the lists were revised to the owner's inclusions on 2026-09-30. Enterprise identity governance is part of the Enterprise licence (owner, 2026-09-30) |
| Self-serve reports in every plan: filter, group, total, chart, saved views, Excel/CSV/PDF export; fixed-format documents for one institution quoted; formats many schools need become standard at no charge | /pricing | **NEEDS BACKEND EVIDENCE**: the data table exists in the frontend UI library (`packages/ui` data-table: filters, facets, grouping, aggregates, charts, export) but is used only in the admin app, and the saved-views endpoint (`/api/v1/saved-views`) is not in the backend yet. Described as design under `availability.short`. Reporting policy **confirmed by the owner on 2026-09-30** |
| Proposal enquiries from /pricing | /pricing | **CURRENT:** proposal and pilot CTAs open `/contact/`. The former inline proposal form was removed on 2026-10-22 at the owner's request; the dedicated demo and founding-partner forms remain. |
| Evaluation criteria on /why-squarecampus (concession approvals, cross-campus permissions, exception ownership, migration validation, exports) | /why-squarecampus | **NEEDS BACKEND EVIDENCE** for the SquareCampus column; no competitor is characterised |
| Company facts on /about (legal name, CIN, registered-office locality, founder) | /about | **VERIFIED** (company record, `content/company.ts`) |

## Company & legal facts

| Claim | Where | Status |
| --- | --- | --- |
| SquareCampus is a product of Fairhelm Systems OPC | footer, press, about, competitor-notice | **VERIFIED** (company record; ™ used, not ® — registration pending) |
| SquareCampus™ (trademark pending, not registered) | footer, llms.txt | **VERIFIED** (keep ™; never ® until registration completes) |
| Founder-led; Mohit Gupta, Founder & CTO | about, press | **VERIFIED** (company fact) |
| "Built systems processing 100M+ records daily" (founder bio) | about | **VERIFIED** as the founder's own account of prior work (confirmed by the founder, 2026-09-29) |
| Location: Bangalore, India (footer) | footer | **VERIFIED** (company fact; note: old Mumbai JSON-LD address removed as fabricated) |

## Founding Institutional Partner programme

Programme facts live in `src/content/commercial.ts` (`foundingProgramme`); the copy
in `src/content/founding-partners.ts` derives from them, so the homepage section,
`/launch-partners/`, the higher-education lane, the FAQ and llms.txt cannot
describe different programmes. `tests/commercial.test.ts` fails if the position
count is not exactly two or the discount is not 40%.

| Claim | Where | Status |
| --- | --- | --- |
| Exactly two positions, ever: one school or eligible school institution, one university; the programme closes permanently once both are allocated | all programme surfaces | **VERIFIED** as commercial policy (product decision 2026-09-09; not a scarcity device — no countdown, no "seats remaining") |
| "A strategic capital commitment under a separately executed agreement", material participation in product validation, structured roadmap input | all programme surfaces | **NEEDS LEGAL REVIEW** (the executed agreement, not the website, carries the terms) |
| Protected 40% discount on Enterprise commercial terms | all programme surfaces | **NEEDS LEGAL REVIEW** (must match the executed agreement). No duration is stated or inferred, and "lifetime" is forbidden. |
| White-labelled mobile apps without the standard white-label charge | programme surfaces, /pricing, /faq | **NEEDS LEGAL REVIEW** (entitlement under the agreement) |
| Defined roadmap influence — explicitly not a veto, roadmap ownership, product/architectural control, IP ownership or unlimited custom development; SquareCampus retains final product, architecture, security and engineering authority | programme surfaces | **VERIFIED** as boundary wording |
| Founder-led rollout with a named implementation counterpart | homepage section, /launch-partners | **NEEDS BACKEND EVIDENCE** (service commitment; keep only while the team actually staffs it — same standing as the guided-rollout claim above) |
| Early access to selected capabilities, written consideration of major workflow proposals | /launch-partners | **NEEDS LEGAL REVIEW** (bounded entitlement; never describe as unlimited) |
| "Small cohort", "first cohort", "price protection for the agreed initial term", "pre-agreed expansion bands" | old copy | **REMOVE** (superseded by the two-position model; the cohort and initial-term phrases are forbidden by `check-claims.sh`) |
| Priority escalation and capacity planning around peak cycles | homepage section, /launch-partners | **NEEDS BACKEND EVIDENCE** (operational commitment) |
| Managed digital campus: websites, microsites, hosting, SSL, CDN, backups | /launch-partners | **SCOPED — NOT INCLUDED BY DEFAULT.** The page states site count, migration, traffic, storage and change allowances are defined in the proposal, and that this is not an unlimited creative-services retainer. Do not weaken that note. |
| Paid, scoped 60–90 day founding engagement, written baseline, convert/extend/stop | founding-partner surfaces | **RETAINED FOR FOUNDING ONLY.** Distinct from the selected 90-day complimentary launch pilot. |

Deliberately **absent**, and must stay absent from public copy:

- Securities, investment or ownership language of any kind.
- Guaranteed lifetime pricing or a perpetual discount.
- Unlimited development, support, hosting, storage or AI usage.
- Exclusivity, territory rights, or a veto over other customers or sectors.
- Any ownership of SquareCampus source code or intellectual property.
- Named launch partners, customer logos, testimonials or outcome numbers.
- "Limited seats remaining", countdowns, or any invented scarcity number.
  "Two positions, ever" is the programme's actual structure, stated plainly;
  it is never dressed up as urgency.
- Any duration for the 40% protection, and the word "lifetime".

## Machine-readable surfaces

- `/llms.txt` is generated at build time (`src/app/llms.txt/route.ts` from
  `src/content/llms.ts` and `src/content/commercial.ts`). It contains facts and
  links only — no instructions to assistants. `tests/llms.test.ts` checks its
  structure, that every link is an indexable sitemap route, and that no stale
  claim survives.
- Markdown alternates (`/<route>/index.md`) are generated after `next build`
  by `scripts/markdown-alternates.ts` from the rendered HTML of the routes in
  `src/content/markdown-alternates.ts`, and advertised with
  `<link rel="alternate" type="text/markdown">`. `scripts/check-build.ts`
  verifies each one exists, keeps its H1 and carries no stale claim.
- `/llms-full.txt` preserves the main-page text of every indexable HTML page.
  Its existing published Terms are checked against the rendered-document SHA-256
  baseline in `scripts/legal-copy-baselines.ts`; changed wording fails the build
  and requires legal review before an explicit baseline update. The build never
  regenerates that baseline automatically or rewrites legal wording. All other
  full-context documents retain the marketing-claims scan, and the private
  publication denylist remains unchanged.
- JSON-LD uses stable ids (`/#org`, `/#website`, `/#software`, `<page>#webpage`)
  and the one canonical short description (`product.shortDescription`). No
  AggregateRating, Review, priced Offer, award or customer-count node may be
  added; `check-build` fails the build if one appears.

## Motion assets

The rendered compositions in `public/motion/` are marketing surfaces and are
held to the same standard. They contain **no** customer names, telemetry, fee
collection rates, test scores, uptime figures or certifications. Labels such as
"Campus A" and "Fee ledger" are illustrative structure, not data. The founding
partner composition shows Convert, Extend and Stop with equal visual weight
precisely so it cannot be read as promising conversion.

## Legal documents

Substantive legal language is changed only with legal sign-off; each file
carries a `LEGAL` marker comment saying so:

- `/terms-of-service`
- `/privacy-policy`
- `/acceptable-use`
- `/data-processing-addendum`
- `/ai-policy`
- `/competitor-notice` (also set to noindex,nofollow and kept out of customer-facing navigation)

## Enforcement

`bun run build` runs `scripts/check-claims.sh`, which fails the build if any
forbidden pattern ("500+", "India's #1", "only you hold the keys", "bank-grade",
uptime figures, fabricated live-status strings, RTO/RPO numbers, etc.) reappears
in `src/` or in the OG card generator (`scripts/og-cards/generate.mjs`, whose copy is
baked into `public/og/*.png`; the Infrastructure card still said "AWS Mumbai" and
"Multi-AZ" until 2026-09-29).

## Commercial reconciliation — 2026-10-22

The owner's saved packaging and selected launch-pilot changes have been reconciled
with the newer published implementation, support, reporting, migration and prepaid
usage policy. These are marketing/commercial policy statements; they do not establish
that an unreleased product capability is available.

- Every plan includes the complete generally available core platform and multi-campus
  operations. Advanced central governance remains distinct from campus count.
- Secure authentication, role-based authorisation and institution-owned data are
  baseline requirements. Available sign-in methods and export scope are confirmed
  before activation; no new export format, deadline or compliance guarantee is made.
- Starter, Pro and Enterprise may request separately quoted Microsoft Entra ID SSO,
  subject to technical onboarding. This supersedes the earlier Pro threshold.
- The selected 90-day complimentary launch pilot requires approval, an agreed scope,
  consumption boundaries, pricing before activation and a review before expiry.
  Initial outreach focuses on Kotdwara and surrounding areas without creating a
  geographic eligibility restriction.
- Standard subscriptions, selected complimentary pilots and the two-position Founding
  Institutional Partner programme are separate. Founding pilots remain paid and scoped.
- Implementation and support remain included in every plan; reporting stays self-serve,
  Pro/Enterprise migration stays included on a best-effort basis, and usage beyond the
  monthly allowance remains prepaid. There is no new paid implementation tier.
- Dedicated demo and founding-partner forms remain separate. Pricing has no enquiry
  forms; the selected pilot, proposal and Enterprise CTAs use the dedicated `/contact/`
  page. Old launch-intent demo links redirect to that page without combining hidden
  headings or trusting arbitrary input.
- Existing legal retention wording and publication gates remain unchanged. Historical
  deployment receipts from the saved patch were excluded because this integration
  cannot establish that they describe the current live deployment.
