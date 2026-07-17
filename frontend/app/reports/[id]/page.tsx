import { notFound } from "next/navigation";
import { DOCS } from "@/lib/mock-data";
import ReportDetail from "@/components/ReportDetail";

export default function ReportPage({ params }: { params: { id: string } }) {
  const doc = DOCS.find((d) => d.id === params.id);
  if (!doc) notFound();
  return <ReportDetail doc={doc} />;
}

export function generateStaticParams() {
  return DOCS.map((d) => ({ id: d.id }));
}
