import { RiskProfileQuiz } from "@/components/interactive/RiskProfileQuiz";

export default function RiskProfilePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#1B4332] mb-2">
        Quiz Profil Risiko Investasi
      </h1>
      <p className="text-gray-600 mb-8">
        Kenali profil risikomu dan dapatkan rekomendasi alokasi portfolio yang
        sesuai.
      </p>
      <RiskProfileQuiz />
    </div>
  );
}
