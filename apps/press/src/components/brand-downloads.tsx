import { ResourceCard } from "@fairhelm/ui/components/resource-card";
import { Download, ImageIcon } from "lucide-react";
import Image from "next/image";
export function BrandDownloads() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {[
        {
          name: "Fairhelm Systems",
          path: "/brand/fairhelm-logo.svg",
          type: "SVG · vector mark",
          width: 562,
          height: 892,
        },
        {
          name: "SquareCampus",
          path: "/brand/squarecampus.png",
          type: "PNG · product mark",
          width: 512,
          height: 512,
        },
      ].map((asset) => (
        <ResourceCard key={asset.path} icon={<ImageIcon className="size-5" />} title={asset.name}>
          <div className="mt-6 flex h-44 items-center justify-center rounded-2xl border border-(--line) bg-[#f4f6fa] p-8">
            <Image
              src={asset.path}
              alt={`${asset.name} mark`}
              width={asset.width}
              height={asset.height}
              className="h-full w-auto max-w-full object-contain"
            />
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <p className="font-mono text-xs text-muted-foreground">{asset.type}</p>
            <a
              href={asset.path}
              download
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-(--line) px-4 text-sm text-foreground transition-colors hover:bg-(--surface-muted)"
            >
              <Download aria-hidden className="size-4" />
              Download logo
            </a>
          </div>
        </ResourceCard>
      ))}
    </div>
  );
}
