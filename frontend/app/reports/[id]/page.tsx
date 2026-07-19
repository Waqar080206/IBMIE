import { notFound } from "next/navigation";
import { getMedicalDocument } from "@/lib/api";
import ReportDetail from "@/components/ReportDetail";

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const doc = await getMedicalDocument(id);
  if (!doc) notFound();
  return <ReportDetail doc={doc} />;
}
