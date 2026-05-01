import { SiteHeader } from "@/components/patterns/site-header";
import { DesignPatternsApp } from "@/components/patterns/design-patterns-app";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col bg-background pt-44 sm:pt-36">
      <SiteHeader />
      <DesignPatternsApp />
    </div>
  );
}
