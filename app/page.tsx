import { LandingPage } from "@/components/patterns/landing-page";
import { SiteHeader } from "@/components/patterns/site-header";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col bg-background pt-44 sm:pt-36">
      <SiteHeader />
      <LandingPage />
    </div>
  );
}
