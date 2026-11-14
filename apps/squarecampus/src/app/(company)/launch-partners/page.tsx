import type { Metadata } from "next";
import { ButtonLink } from "@fairhelm/ui/components/button-link";
import { SectionShell } from "@fairhelm/ui/components/section-shell";
import { ContactForm } from "@/components/site/contact-form";
import { PageSchema } from "@/components/site/page-schema";
import { foundingProgramme } from "@/content/commercial";
import { createPageMetadata } from "@/lib/seo";

const description = "₹50,000 + GST for an agreed founding pilot scope through 31 March 2027. Standard annual subscription is optional.";
export const metadata: Metadata = createPageMetadata({ title: "Founding Institutional Pilot 2026–27", description, path: "/launch-partners" });

const questions = [
  ["When does access start and end?", "Access starts on the agreed activation date after the order form is signed and payment is confirmed. The normal end is 31 March 2027 at 23:59 IST. Later activation means less evaluation time; requests with fewer than 60 days remaining require commercial approval. Different academic calendars require written agreement."],
  ["What is included?", "Managed cloud service, standard tenant and campus configuration, scoped onboarding and administrator orientation, standard support and updates, security safeguards, agreed evaluation and supported data exports. The order form defines campus, student, user, support and resource limits."],
  ["Which workflows can we use?", "The proposal identifies production-ready, generally available modules for your scope. Planned areas include attendance, admissions, fees, hostel, timetable, employee and leave management, and library subject to readiness. Availability is confirmed before contracting. The initial mobile scope is attendance and leave by role, when available; other available workflows remain on the web."],
  ["What happens when new modules are released?", "New generally available standard modules within the agreed scope carry no extra module licence charge. Administrators will be informed about releases and any configuration or activation steps. Unreleased modules have no guaranteed release date."],
  ["Are other services or usage included?", "Bespoke integrations, custom development, extensive migration or data cleaning, premium services, chargeable Entra integration, white-label branding, external Data & Events API add-ons, communication overages, AI credits and extraordinary resources are separately scoped. Rates and authorization or spend controls must be agreed before chargeable consumption."],
  ["What happens after the pilot?", "You may accept a written quote for Starter, Growth or Enterprise at ordinary annual pricing, or leave without a compulsory subscription or penalty solely for declining. We will provide a renewal quote at least 30 days before the standard end date. There is no automatic renewal, conversion credit or special discount. An extension requires a separate written agreement."],
  ["What about our data and refunds?", "Institutional data remains subject to the agreement and data protection terms. Export scope and offboarding, retention and deletion are agreed under the order form and applicable policies. Cancellation, remedies and refunds follow the executed agreement and Cancellation and Refund Policy."],
  ["Is this the complimentary launch pilot?", "No. The selected complimentary 90-day Institutional Launch Pilot is a separate invitation and approval-only arrangement, with its own agreed scope."],
];

export default function LaunchPartnersPage() {
  return <main id="main-content" tabIndex={-1}>
    <PageSchema name={foundingProgramme.name} description={description} path="/launch-partners" />
    <SectionShell className="pt-12 sm:pt-16">
      <h1 className="type-display max-w-4xl">Start with SquareCampus this academic year.</h1>
      <p className="type-body measure mt-6">Join the Founding Institutional Pilot for ₹50,000 + GST. Use the agreed, production-ready platform through 31 March 2027, receive new generally available standard features, and choose whether to subscribe for the next academic year.</p>
      <div className="mt-8 flex flex-wrap gap-4"><ButtonLink href="#request-diagnosis" label="Apply for the Founding Pilot" variant="cta" /><ButtonLink href="/pricing/" label="Explore Standard Pricing" variant="secondary" /></div>
    </SectionShell>
    <SectionShell title="A defined pilot for your institution">
      <div className="grid gap-5 md:grid-cols-2"><p>{foundingProgramme.pilot.paidNote}</p><p>{foundingProgramme.positionsStatement} Access ends 31 March 2027 at 23:59 IST, from the agreed activation date.</p><p>New generally available standard capabilities are included within scope as released. No compulsory annual subscription.</p><p>For illustration, 18% GST is ₹9,000 and the estimated total is ₹59,000. The actual invoice uses the applicable tax classification, rate and place of supply.</p></div>
    </SectionShell>
    <SectionShell title="Focus on the work that matters">
      <p className="measure">Agree a scope around attendance and reconciliation, admissions, fee visibility, employees and leave, timetables, residential operations or library circulation where available. Multi-campus governance and reports can be evaluated against your agreed institutional record. Availability and deployment readiness are confirmed in the proposal.</p>
    </SectionShell>
    <SectionShell title="How participation works">
      <ol className="list-decimal space-y-3 pl-6"><li>Make an institutional enquiry.</li><li>Review scope and technical readiness.</li><li>Agree a written proposal and pilot order form.</li><li>Receive the invoice and pay upfront.</li><li>Configure and activate the agreed deployment.</li><li>Evaluate use and receive product updates.</li><li>Choose a standard subscription or exit.</li></ol>
    </SectionShell>
    <SectionShell title="Pilot terms and questions">
      <div className="space-y-5">{questions.map(([q, a]) => <details key={q} className="surface-panel rounded-[var(--radius-panel-lg)] p-5"><summary className="font-semibold">{q}</summary><p className="mt-3">{a}</p></details>)}</div>
    </SectionShell>
    <SectionShell id="request-diagnosis" title="Evaluate SquareCampus before your next academic cycle.">
      <p className="mb-6">Tell us about your institution, location, approximate students and campuses, workflows, preferred activation timing and the problem you want to solve. Do not include student personal data. Applying does not grant admission or activate service.</p>
      <ContactForm intent="founding-partner" />
    </SectionShell>
  </main>;
}
