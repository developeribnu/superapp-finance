"use client";
import { useState } from "react";
import { quizQuestions } from "@/data/ekonomi";

export default function QuizPage() {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null));
  const [quizDone, setQuizDone] = useState(false);

  const question = quizQuestions[currentQ];

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
    const newAnswers = [...answers];
    newAnswers[currentQ] = index;
    setAnswers(newAnswers);
    if (index === question.jawabanBenar) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQ < quizQuestions.length - 1) {
      setCurrentQ(c => c + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizDone(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQ(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers(new Array(quizQuestions.length).fill(null));
    setQuizDone(false);
  };

  if (quizDone) {
    const percentage = (score / quizQuestions.length) * 100;
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="card text-center py-12">
          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-3xl font-bold text-white ${percentage >= 70 ? "bg-emerald-500" : percentage >= 40 ? "bg-amber-500" : "bg-red-500"}`}>
            {Math.round(percentage)}%
          </div>
          <h1 className="text-2xl font-bold mt-6" style={{ color: "var(--color-text)" }}>Quiz Selesai!</h1>
          <p className="text-lg mt-2" style={{ color: "var(--color-text-secondary)" }}>
            Skor Anda: <strong>{score}</strong> dari <strong>{quizQuestions.length}</strong> pertanyaan benar
          </p>
          <p className="mt-2" style={{ color: "var(--color-text-muted)" }}>
            {percentage >= 80 ? "Luar biasa! Pemahaman ekonomi Anda sangat baik!" :
             percentage >= 60 ? "Bagus! Terus belajar untuk meningkatkan pemahaman." :
             percentage >= 40 ? "Cukup baik. Masih ada ruang untuk perbaikan." :
             "Jangan menyerah! Review materi dan coba lagi."}
          </p>
          <button onClick={resetQuiz} className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Coba Lagi
          </button>
        </div>

        {/* Review Answers */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold" style={{ color: "var(--color-text)" }}>Review Jawaban</h2>
          {quizQuestions.map((q, i) => {
            const isCorrect = answers[i] === q.jawabanBenar;
            return (
              <div key={q.id} className="card">
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5 ${isCorrect ? "bg-emerald-500" : "bg-red-500"}`}>
                    {isCorrect ? "✓" : "✗"}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>{q.pertanyaan}</p>
                    <p className="text-xs mt-1" style={{ color: isCorrect ? "var(--color-success)" : "var(--color-danger)" }}>
                      {isCorrect ? "Benar" : `Salah. Jawaban Anda: ${q.opsi[answers[i]!]} | Jawaban benar: ${q.opsi[q.jawabanBenar]}`}
                    </p>
                    <p className="text-xs mt-1 italic" style={{ color: "var(--color-text-muted)" }}>{q.penjelasan}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>Quiz Ekonomi</h1>
        <p className="mt-1" style={{ color: "var(--color-text-secondary)" }}>Uji pemahaman ekonomi Anda dengan {quizQuestions.length} pertanyaan</p>
      </div>

      {/* Progress Bar */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>Pertanyaan {currentQ + 1} dari {quizQuestions.length}</span>
          <span className="text-sm font-medium" style={{ color: "var(--color-primary)" }}>Skor: {score}</span>
        </div>
        <div className="w-full h-2 rounded-full" style={{ backgroundColor: "var(--color-bg-secondary)" }}>
          <div className="h-2 rounded-full bg-blue-600 transition-all duration-500" style={{ width: `${((currentQ + 1) / quizQuestions.length) * 100}%` }} />
        </div>
      </div>

      {/* Question */}
      <div className="card">
        <span className="badge mb-3 inline-block" style={{ backgroundColor: "var(--color-primary-light)", color: "var(--color-primary)" }}>
          {question.kategori}
        </span>
        <h2 className="text-lg font-bold" style={{ color: "var(--color-text)" }}>{question.pertanyaan}</h2>

        <div className="space-y-3 mt-6">
          {question.opsi.map((opsi, i) => {
            let bgColor = "var(--color-bg-secondary)";
            let borderColor = "transparent";
            let textColor = "var(--color-text)";

            if (showResult) {
              if (i === question.jawabanBenar) {
                bgColor = "var(--color-success-light)";
                borderColor = "var(--color-success)";
                textColor = "var(--color-success)";
              } else if (i === selectedAnswer && i !== question.jawabanBenar) {
                bgColor = "var(--color-danger-light)";
                borderColor = "var(--color-danger)";
                textColor = "var(--color-danger)";
              }
            } else if (i === selectedAnswer) {
              borderColor = "var(--color-primary)";
            }

            return (
              <button key={i} onClick={() => handleAnswer(i)} disabled={showResult}
                className="w-full text-left p-4 rounded-lg transition-all flex items-center gap-3 border-2"
                style={{ backgroundColor: bgColor, borderColor, color: textColor }}
              >
                <span className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ borderColor: textColor }}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-sm font-medium">{opsi}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showResult && (
          <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: "var(--color-bg-secondary)" }}>
            <p className="text-sm font-semibold" style={{ color: selectedAnswer === question.jawabanBenar ? "var(--color-success)" : "var(--color-danger)" }}>
              {selectedAnswer === question.jawabanBenar ? "Benar!" : "Kurang tepat."}
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>{question.penjelasan}</p>
          </div>
        )}

        {showResult && (
          <button onClick={nextQuestion}
            className="mt-4 w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            {currentQ < quizQuestions.length - 1 ? "Pertanyaan Selanjutnya" : "Lihat Hasil"}
          </button>
        )}
      </div>
    </div>
  );
}
