import { Metadata } from "next";
import LibraryPage from "@/components/LibraryPage";

export const metadata: Metadata = {
  title: "Library Referensi - EkonomiKu",
  description: "Koleksi lengkap referensi dan sumber belajar ekonomi dari berbagai penulis dan institusi terpercaya.",
  keywords: ["library", "referensi", "buku ekonomi", "sumber belajar"],
  openGraph: {
    title: "Library Referensi - EkonomiKu",
    description: "Koleksi lengkap referensi dan sumber belajar ekonomi.",
    type: "website",
  },
};

export default function LibraryRoutePage() {
  return <LibraryPage />;
}
