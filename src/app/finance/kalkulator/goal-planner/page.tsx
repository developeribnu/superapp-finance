import { GoalPlannerCalc } from "@/components/interactive/GoalPlannerCalc";

export default function GoalPlannerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#1B4332] mb-2">
        Goal Planner
      </h1>
      <p className="text-gray-600 mb-8">
        Rencanakan target keuanganmu. Masukkan tujuan dan lihat berapa yang perlu
        ditabung setiap bulan.
      </p>
      <GoalPlannerCalc />
    </div>
  );
}
