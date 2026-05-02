import { SiteHeader } from "@/components/patterns/site-header";
import { CatalogShell } from "@/components/patterns/catalog-shell";

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col bg-background pt-44 sm:pt-36">
      <SiteHeader />
      <div className="flex min-h-0 flex-1 flex-col">
        <CatalogShell>{children}</CatalogShell>
      </div>
    </div>
  );
}
