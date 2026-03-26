"use client";

import { useState, useCallback } from "react";

interface Question {
  question: string;
  options: Array<{ label: string; score: number }>;
}

const QUESTIONS: Question[] = [
  {
    question: "Berapa lama horizon investasi Anda?",
    options: [
      { label: "Kurang dari 1 tahun", score: 1 },
      { label: "1-3 tahun", score: 2 },
      { label: "3-5 tahun", score: 3 },
      { label: "5-10 tahun", score: 4 },
      { label: "Lebih dari 10 tahun", score: 5 },
    ],
  },
  {
    question:
      "Jika investasi Anda turun 20% dalam sebulan, apa yang akan Anda lakukan?",
    options: [
      { label: "Jual semua segera", score: 1 },
      { label: "Jual sebagian untuk mengurangi risiko", score: 2 },
      { label: "Tidak melakukan apa-apa, menunggu pemulihan", score: 3 },
      { label: "Tambah investasi sedikit", score: 4 },
      { label: "Tambah investasi secara agresif", score: 5 },
    ],
  },
  {
    question: "Bagaimana stabilitas penghasilan Anda saat ini?",
    options: [
      { label: "Sangat tidak stabil / freelance tanpa kontrak", score: 1 },
      { label: "Tidak stabil / penghasilan berfluktuasi", score: 2 },
      { label: "Cukup stabil dengan sedikit variasi", score: 3 },
      { label: "Stabil dengan penghasilan tetap", score: 4 },
      {
        label: "Sangat stabil dengan multiple income streams",
        score: 5,
      },
    ],
  },
  {
    question: "Seberapa dalam pengetahuan Anda tentang investasi?",
    options: [
      { label: "Tidak tahu sama sekali", score: 1 },
      { label: "Tahu dasar-dasar seperti deposito dan tabungan", score: 2 },
      { label: "Paham reksa dana dan obligasi", score: 3 },
      { label: "Paham saham, analisa fundamental dan teknikal", score: 4 },
      {
        label: "Sangat paham termasuk derivatif dan instrumen kompleks",
        score: 5,
      },
    ],
  },
  {
    question: "Apa tujuan utama investasi Anda?",
    options: [
      { label: "Menjaga nilai uang dari inflasi", score: 1 },
      { label: "Pendapatan pasif yang stabil", score: 2 },
      { label: "Pertumbuhan moderat jangka menengah", score: 3 },
      { label: "Pertumbuhan tinggi jangka panjang", score: 4 },
      { label: "Pertumbuhan maksimal, siap risiko tinggi", score: 5 },
    ],
  },
  {
    question: "Berapa persen penghasilan yang bisa Anda alokasikan untuk investasi?",
    options: [
      { label: "Kurang dari 10%", score: 1 },
      { label: "10-20%", score: 2 },
      { label: "20-30%", score: 3 },
      { label: "30-50%", score: 4 },
      { label: "Lebih dari 50%", score: 5 },
    ],
  },
  {
    question: "Apakah Anda sudah memiliki dana darurat yang memadai?",
    options: [
      { label: "Belum punya dana darurat", score: 1 },
      { label: "Ada, tapi kurang dari 3 bulan pengeluaran", score: 2 },
      { label: "Ada, cukup untuk 3-6 bulan", score: 3 },
      { label: "Ada, cukup untuk 6-12 bulan", score: 4 },
      { label: "Ada, lebih dari 12 bulan pengeluaran", score: 5 },
    ],
  },
  {
    question:
      "Berapa tingkat kerugian maksimal yang bisa Anda terima dalam setahun?",
    options: [
      { label: "0% - tidak mau rugi sama sekali", score: 1 },
      { label: "Sampai 5%", score: 2 },
      { label: "Sampai 15%", score: 3 },
      { label: "Sampai 30%", score: 4 },
      { label: "Lebih dari 30%, saya paham risikonya", score: 5 },
    ],
  },
];

interface ProfileResult {
  totalScore: number;
  profile: string;
  description: string;
  allocation: {
    deposito: number;
    obligasi: number;
    reksaDanaCampuran: number;
    saham: number;
    asetAlternatif: number;
  };
}

function getProfile(score: number): ProfileResult {
  let profile: string;
  let description: string;
  let allocation: ProfileResult["allocation"];

  if (score <= 16) {
    profile = "Konservatif";
    description =
      "Anda lebih mengutamakan keamanan modal. Investasi yang cocok adalah instrumen berisiko rendah seperti deposito dan obligasi pemerintah.";
    allocation = {
      deposito: 50,
      obligasi: 30,
      reksaDanaCampuran: 15,
      saham: 5,
      asetAlternatif: 0,
    };
  } else if (score <= 22) {
    profile = "Moderat-Konservatif";
    description =
      "Anda bersedia menerima sedikit risiko untuk return yang lebih baik, tapi tetap mengutamakan stabilitas.";
    allocation = {
      deposito: 30,
      obligasi: 35,
      reksaDanaCampuran: 20,
      saham: 10,
      asetAlternatif: 5,
    };
  } else if (score <= 28) {
    profile = "Moderat";
    description =
      "Anda memiliki keseimbangan antara pertumbuhan dan keamanan. Portofolio campuran sangat cocok untuk Anda.";
    allocation = {
      deposito: 15,
      obligasi: 25,
      reksaDanaCampuran: 25,
      saham: 25,
      asetAlternatif: 10,
    };
  } else if (score <= 34) {
    profile = "Moderat-Agresif";
    description =
      "Anda siap menghadapi fluktuasi pasar untuk mengejar return yang lebih tinggi dalam jangka panjang.";
    allocation = {
      deposito: 5,
      obligasi: 15,
      reksaDanaCampuran: 20,
      saham: 45,
      asetAlternatif: 15,
    };
  } else {
    profile = "Agresif";
    description =
      "Anda sangat berani mengambil risiko dan fokus pada pertumbuhan maksimal. Cocok untuk investor berpengalaman dengan horizon panjang.";
    allocation = {
      deposito: 0,
      obligasi: 5,
      reksaDanaCampuran: 10,
      saham: 60,
      asetAlternatif: 25,
    };
  }

  return { totalScore: score, profile, description, allocation };
}

const ALLOCATION_LABELS: Record<string, string> = {
  deposito: "Deposito",
  obligasi: "Obligasi",
  reksaDanaCampuran: "Reksa Dana Campuran",
  saham: "Saham",
  asetAlternatif: "Aset Alternatif",
};

const ALLOCATION_COLORS: Record<string, string> = {
  deposito: "bg-blue-400",
  obligasi: "bg-green-400",
  reksaDanaCampuran: "bg-yellow-400",
  saham: "bg-red-400",
  asetAlternatif: "bg-purple-400",
};

export function RiskProfileQuiz() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [result, setResult] = useState<ProfileResult | null>(null);

  const handleAnswer = (questionIndex: number, score: number) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: score }));
    if (questionIndex < QUESTIONS.length - 1) {
      setCurrentQuestion(questionIndex + 1);
    }
  };

  const calculateResult = useCallback(() => {
    const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
    setResult(getProfile(totalScore));
  }, [answers]);

  const reset = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setResult(null);
  };

  const allAnswered = Object.keys(answers).length === QUESTIONS.length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-2xl font-bold text-[#1B4332] mb-6">
        Kuis Profil Risiko Investasi
      </h2>

      {!result ? (
        <>
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>
                Pertanyaan {currentQuestion + 1} dari {QUESTIONS.length}
              </span>
              <span>
                {Object.keys(answers).length}/{QUESTIONS.length} dijawab
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#1B4332] h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(Object.keys(answers).length / QUESTIONS.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Question Navigation */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {QUESTIONS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQuestion(i)}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                  i === currentQuestion
                    ? "bg-[#1B4332] text-white"
                    : answers[i] !== undefined
                      ? "bg-[#1B4332]/20 text-[#1B4332]"
                      : "bg-gray-100 text-gray-400"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {/* Current Question */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {QUESTIONS[currentQuestion].question}
            </h3>
            <div className="space-y-2">
              {QUESTIONS[currentQuestion].options.map((option, i) => (
                <button
                  key={i}
                  onClick={() =>
                    handleAnswer(currentQuestion, option.score)
                  }
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all cursor-pointer ${
                    answers[currentQuestion] === option.score
                      ? "border-[#1B4332] bg-[#1B4332]/5 text-[#1B4332]"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          {allAnswered && (
            <button
              onClick={calculateResult}
              className="w-full bg-[#1B4332] text-white font-semibold py-3 rounded-lg hover:bg-[#1B4332]/90 transition-colors cursor-pointer"
            >
              Lihat Hasil Profil Risiko
            </button>
          )}
        </>
      ) : (
        <div className="space-y-6">
          {/* Profile Result */}
          <div className="text-center bg-[#1B4332]/5 rounded-xl p-6">
            <p className="text-sm text-gray-500 mb-1">Profil Risiko Anda</p>
            <h3 className="text-3xl font-bold text-[#1B4332] mb-2">
              {result.profile}
            </h3>
            <p className="text-sm text-gray-500">
              Skor: {result.totalScore} dari 40
            </p>
            <p className="text-gray-600 mt-3">{result.description}</p>
          </div>

          {/* Portfolio Allocation */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">
              Rekomendasi Alokasi Portofolio
            </h3>

            {/* Bar visualization */}
            <div className="flex rounded-xl overflow-hidden h-8 mb-4">
              {Object.entries(result.allocation).map(
                ([key, value]) =>
                  value > 0 && (
                    <div
                      key={key}
                      className={`${ALLOCATION_COLORS[key]} flex items-center justify-center text-xs font-medium text-white`}
                      style={{ width: `${value}%` }}
                    >
                      {value >= 10 ? `${value}%` : ""}
                    </div>
                  )
              )}
            </div>

            {/* Legend */}
            <div className="space-y-2">
              {Object.entries(result.allocation).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${ALLOCATION_COLORS[key]}`}
                    />
                    <span className="text-sm text-gray-700">
                      {ALLOCATION_LABELS[key]}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {value}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={reset}
            className="w-full border-2 border-[#1B4332] text-[#1B4332] font-semibold py-3 rounded-lg hover:bg-[#1B4332]/5 transition-colors cursor-pointer"
          >
            Ulangi Kuis
          </button>
        </div>
      )}

      <p className="mt-4 text-xs text-gray-400">
        Hasil perhitungan bersifat estimasi.
      </p>
    </div>
  );
}
