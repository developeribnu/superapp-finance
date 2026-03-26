import { Metadata } from "next";
import LibraryPage from "@/components/LibraryPage";

export const metadata: Metadata = {
  title: "Referensi - EkonomiKu",
  description: "Koleksi lengkap referensi dan sumber belajar ekonomi dari berbagai penulis dan institusi terpercaya.",
  keywords: ["referensi", "sumber belajar", "buku", "artikel ekonomi"],
  openGraph: {
    title: "Referensi - EkonomiKu",
    description: "Koleksi lengkap referensi dan sumber belajar ekonomi.",
    type: "website",
  },
};

export default function ReferensiPage() {
  return <LibraryPage />;
}
