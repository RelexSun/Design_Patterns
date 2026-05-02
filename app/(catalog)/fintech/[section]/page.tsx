import { notFound } from "next/navigation";
import { isFintechTab } from "@/lib/fintech-sections";
import { FintechView } from "@/components/patterns/fintech-view";

type Props = {
  params: Promise<{ section: string }>;
};

export default async function FintechSectionPage({ params }: Props) {
  const { section } = await params;
  if (!isFintechTab(section)) {
    notFound();
  }

  return <FintechView activeSection={section} />;
}
