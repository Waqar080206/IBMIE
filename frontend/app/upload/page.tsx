import { TopBar } from "@/components/UI";
import UploadDropzone from "@/components/UploadDropzone";

export default function UploadPage() {
  return (
    <div>
      <TopBar title="Upload a document" subtitle="A lab report or prescription, routed through the AI parsing pipeline" />
      <UploadDropzone />
    </div>
  );
}
