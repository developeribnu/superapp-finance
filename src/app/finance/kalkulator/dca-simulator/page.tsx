import { DCASimulator } from "@/components/interactive/DCASimulator";

export default function DCAPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#1B4332] mb-2">
        Simulator DCA (Dollar Cost Averaging)
      </h1>
      <p className="text-gray-600 mb-8">
        Simulasikan strategi investasi berkala dan lihat potensi pertumbuhannya.
      </p>
      <DCASimulator />
    </div>
  );
}
