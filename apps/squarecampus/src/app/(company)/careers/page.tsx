import { Compass, HeartHandshake, Wrench } from "lucide-react";
import { ButtonLink } from "@fairhelm/ui/components/button-link";
import { Reveal } from "@fairhelm/ui/components/reveal";
import { SectionShell } from "@fairhelm/ui/components/section-shell";

type Job = {
  id: string;
  title: string;
  location: string;
  type: string;
  description: string;
};

// Add objects here when roles open.
const jobs: Job[] = [];

const workingPrinciples = [
  {
    title: "Product-first culture",
    icon: Wrench,
    body: "We optimise for quality of product and long-term stability over quick wins that don't hold in production.",
  },
  {
    title: "Thoughtful pace",
    icon: Compass,
    body: "We move quickly, but not chaotically. Clear scopes, clear ownership, and minimal unnecessary meetings.",
  },
  {
    title: "Impact on real campuses",
    icon: HeartHandshake,
    body: "Work that directly improves how schools and colleges operate every single day.",
  },
] as const;

export default function CareersPage() {
  const hasJobs = jobs.length > 0;

  return (
    <main tabIndex={-1} id="main-content">
      <SectionShell className="pt-12 sm:pt-16">
        <Reveal className="max-w-3xl space-y-6">
          <p className="section-kicker">Careers</p>
          <h1 className="font-display text-4xl leading-none tracking-[-0.06em] sm:text-5xl lg:text-6xl">
            Build the backbone of modern institutions.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-muted-foreground">
            SquareCampus is building long-term infrastructure for schools and colleges. That means
            thoughtful engineering, calm execution, and a team that cares about reliability as much
            as speed.
          </p>
        </Reveal>
      </SectionShell>

      <SectionShell eyebrow="Working here" title="How the team operates" className="pt-0">
        <Reveal staggerChildren className="grid gap-4 md:grid-cols-3">
          {workingPrinciples.map((item) => (
            <article
              key={item.title}
              data-reveal-item
              className="surface-panel rounded-[1.6rem] p-6"
            >
              <item.icon className="size-5 text-(--brand)" />
              <h2 className="mt-5 font-display text-2xl tracking-[-0.04em]">{item.title}</h2>
              <p className="mt-3 text-base leading-7 text-muted-foreground">{item.body}</p>
            </article>
          ))}
        </Reveal>
      </SectionShell>

      <SectionShell eyebrow="Open roles" title="Positions" className="pb-22 pt-0">
        <Reveal>
          {hasJobs ? (
            <div className="grid gap-4">
              {jobs.map((job) => (
                <article
                  key={job.id}
                  className="surface-panel flex flex-col gap-4 rounded-[1.6rem] p-6 md:flex-row md:items-start md:justify-between"
                >
                  <div>
                    <h2 className="font-display text-2xl tracking-[-0.04em]">{job.title}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {job.location} · {job.type}
                    </p>
                    <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
                      {job.description}
                    </p>
                  </div>
                  <ButtonLink
                    href={`mailto:careers@squarecampus.com?subject=${encodeURIComponent(`Application: ${job.title}`)}`}
                    label="Apply"
                  />
                </article>
              ))}
            </div>
          ) : (
            <div className="surface-panel-strong rounded-[2rem] p-8 lg:p-10">
              <p className="section-kicker">No open positions right now</p>
              <h2 className="mt-4 max-w-2xl font-display text-3xl tracking-[-0.05em]">
                We publish roles here as the team expands.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                If you strongly believe you can help shape SquareCampus, reach out with a short note
                and your profile — thoughtful, unsolicited applications get read.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink
                  href="mailto:careers@squarecampus.com?subject=General%20application%20for%20SquareCampus"
                  label="Send a general application"
                />
                <ButtonLink
                  href="https://www.linkedin.com/company/square-campus"
                  label="Follow on LinkedIn"
                  external
                  variant="secondary"
                />
              </div>
            </div>
          )}
        </Reveal>
      </SectionShell>
    </main>
  );
}
