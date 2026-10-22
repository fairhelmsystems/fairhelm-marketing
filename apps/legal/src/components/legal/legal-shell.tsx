import { company } from "@fairhelm/squarecampus-content/company";
import type { ReactNode } from "react";
import { Hero } from "@/components/site/hero";
import { LegalNavBand } from "@/components/site/legal-navigation";
import {
  LegalReadingLayout,
  type DocumentContentsLink,
} from "@/components/site/legal-reading-layout";

/**
 * The entity paragraph that opens every legal document: who is actually
 * bound, with the statutory particulars a reader needs to identify and reach
 * the company. `documentNoun` is how the page refers to itself ("this
 * Policy", "these Terms", "this DPA"), so the sentence reads naturally.
 */
export function EntityIdentity({ documentNoun }: { documentNoun: string }) {
  return (
    <>
      <p>
        {company.trademarkNotice} All services are provided by {company.legalNameDisplay}, unless
        otherwise stated in a written agreement or order form.
      </p>
      <p>
        References to "SquareCampus" in {documentNoun} mean {company.legalNameDisplay}.
      </p>
      <address className="not-italic rounded-[1.2rem] border border-(--line) bg-(--surface) p-4 text-sm leading-6">
        <span className="block font-medium text-foreground">{company.legalName}</span>
        <span className="mt-1 block">Registered office: {company.address.full}</span>
        <span className="mt-1 block">
          CIN: <span className="font-mono text-[0.8rem]">{company.cin}</span> ·{" "}
          {company.incorporationStatus}
        </span>
        <span className="mt-1 block">
          GSTIN: <span className="font-mono text-[0.8rem]">{company.gstin}</span> · Registered under
          the Goods and Services Tax, Karnataka
        </span>
        <span className="mt-1 block">
          Email:{" "}
          <a href={`mailto:${company.email.general}`} className="hover:text-foreground">
            {company.email.general}
          </a>
          {company.phone ? (
            <>
              {" · "}
              Telephone:{" "}
              <a
                href={`tel:${company.phone.replace(/[^+\d]/g, "")}`}
                className="hover:text-foreground"
              >
                {company.phone}
              </a>
            </>
          ) : null}
        </span>
      </address>
    </>
  );
}

type LegalShellProps = {
  title: string;
  current: string;
  description?: string;
  contents: readonly DocumentContentsLink[];
  children: ReactNode;
};

export function LegalShell({ title, current, description, contents, children }: LegalShellProps) {
  return (
    <main tabIndex={-1} id="main-content">
      <Hero eyebrow="Legal center" title={title} description={description ?? ""} compact />
      <LegalNavBand scope="squarecampus" current={current} />
      <LegalReadingLayout contents={contents}>
        <div className="flex flex-col gap-8">{children}</div>
      </LegalReadingLayout>
    </main>
  );
}

type LegalSectionProps = {
  title: string;
  id?: string;
  children: ReactNode;
};

export function LegalSection({ title, id, children }: LegalSectionProps) {
  return (
    <section className="scroll-mt-28 border-b border-border pb-10 last:border-0" id={id}>
      <h2 className="display-3 sm:text-[1.6rem] text-foreground">{title}</h2>
      <div className="mt-4 flex flex-col gap-4">{children}</div>
    </section>
  );
}
