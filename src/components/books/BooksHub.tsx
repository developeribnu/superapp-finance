"use client";

import { useMemo, useRef, useState } from "react";
import {
  ArrowUpDown,
  BookOpenText,
  ChevronRight,
  Copy,
  Download,
  Eye,
  FileStack,
  Github,
  LayoutGrid,
  List,
  Search,
  SlidersHorizontal,
  Sparkles,
  Tags,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import booksLibrary from "@/data/books-library.json";
import { generateSummary } from "@/lib/books/summarize";

type ImportedBookRecord = {
  id?: string;
  title: string;
  fileName: string;
  category?: string;
  tags?: string[];
  pageCount?: number;
  fileSize?: number;
  createdAt?: string;
  excerpt?: string;
  summary: string;
  keyPoints?: string[];
  topTerms?: string[];
  wordCount?: number;
  pdfUrl: string;
};

type LibraryBook = {
  id: string;
  title: string;
  fileName: string;
  category: string;
  tags: string[];
  pageCount: number;
  fileSize: number;
  createdAt: string;
  excerpt: string;
  summary: string;
  keyPoints: string[];
  topTerms: string[];
  wordCount: number;
  pdfUrl?: string;
  pdfBlob?: Blob;
  source: "repo" | "session";
};

type SortMode =
  | "title-asc"
  | "title-desc"
  | "newest"
  | "pages-desc"
  | "words-desc";

type ViewMode = "grid" | "list";
type SourceFilter = "all" | "repo" | "session";
type FormatFilter = "all" | "pdf" | "epub";

type CoverTheme = {
  surface: string;
  glow: string;
  ink: string;
  line: string;
  badge: string;
};

const coverThemes: CoverTheme[] = [
  {
    surface: "from-[#FFD35A] via-[#F7B733] to-[#A86300]",
    glow: "from-white/70 to-[#FFF2B2]/10",
    ink: "text-[#1D1602]",
    line: "border-[#f4c95d]/45",
    badge: "bg-white/88 text-[#6B4B00]",
  },
  {
    surface: "from-[#132A13] via-[#2D6A4F] to-[#5F8B4C]",
    glow: "from-[#D8F3DC]/45 to-transparent",
    ink: "text-white",
    line: "border-[#2D6A4F]/35",
    badge: "bg-white/15 text-white",
  },
  {
    surface: "from-[#411530] via-[#8E2C5F] to-[#D1518B]",
    glow: "from-[#FFD6E8]/40 to-transparent",
    ink: "text-white",
    line: "border-[#C5497A]/35",
    badge: "bg-white/14 text-white",
  },
  {
    surface: "from-[#D9F0FF] via-[#94D2FF] to-[#1E6FB8]",
    glow: "from-white/70 to-transparent",
    ink: "text-[#09233B]",
    line: "border-[#90CAF9]/40",
    badge: "bg-white/82 text-[#0B4D82]",
  },
  {
    surface: "from-[#FFF4D6] via-[#E6CCB2] to-[#B08968]",
    glow: "from-white/70 to-transparent",
    ink: "text-[#38220F]",
    line: "border-[#D6B38C]/40",
    badge: "bg-white/84 text-[#6E4A28]",
  },
  {
    surface: "from-[#121F3D] via-[#243B68] to-[#6A89CC]",
    glow: "from-[#DBEAFE]/35 to-transparent",
    ink: "text-white",
    line: "border-[#4F6FA8]/35",
    badge: "bg-white/14 text-white",
  },
];

let workerConfigured = false;

const normalizeCategory = (value: string): string =>
  value.trim() ? value.trim() : "General";

const uniqueTags = (value: string): string[] =>
  Array.from(
    new Set(
      value
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean)
    )
  );

const shorten = (value: string, max: number): string => {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trimEnd()}…`;
};

const formatBytes = (value: number): string => {
  if (value <= 0) return "-";
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(2)} MB`;
};

const formatDate = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const normalizeTitle = (fileName: string): string =>
  fileName
    .replace(/\.(pdf|epub)$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const normalizeLookupValue = (value: string): string =>
  value
    .toLowerCase()
    .replace(/\.(pdf|epub)$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

const getDuplicateKeySet = (items: LibraryBook[]): Set<string> => {
  const keys = new Set<string>();

  for (const item of items) {
    keys.add(`file:${normalizeLookupValue(item.fileName)}`);
    keys.add(`title:${normalizeLookupValue(item.title)}`);
  }

  return keys;
};

const getFileFormat = (fileName: string): FormatFilter =>
  fileName.toLowerCase().endsWith(".epub") ? "epub" : "pdf";

const toMarkdown = (book: LibraryBook): string => {
  const tags = book.tags.length > 0 ? book.tags.map((tag) => `\`${tag}\``).join(", ") : "-";
  const topTerms =
    book.topTerms.length > 0
      ? book.topTerms.map((term) => `\`${term}\``).join(", ")
      : "-";

  return [
    `# ${book.title}`,
    "",
    `- Kategori: ${book.category}`,
    `- Tanggal Upload: ${formatDate(book.createdAt)}`,
    `- Halaman: ${book.pageCount || "-"}`,
    `- Ukuran File: ${formatBytes(book.fileSize)}`,
    `- Total Kata Terekstrak: ${book.wordCount.toLocaleString("id-ID")}`,
    `- Tag: ${tags}`,
    `- Top Terms: ${topTerms}`,
    `- Sumber: ${book.source === "repo" ? "GitHub repository" : "Session upload"}`,
    "",
    "## Ringkasan",
    "",
    book.summary,
    "",
    "## Poin Penting",
    "",
    ...book.keyPoints.map((point) => `- ${point}`),
    "",
  ].join("\n");
};

const downloadBlob = (blob: Blob, fileName: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const normalizeImportedBooks = (): LibraryBook[] => {
  const imported = booksLibrary as ImportedBookRecord[];

  return imported
    .map((item, index) => {
      const keyPoints = item.keyPoints ?? [];
      const fallbackSummary = item.summary ?? "Ringkasan belum tersedia.";

      return {
        id: item.id ?? `repo-${index}-${item.fileName}`,
        title: item.title,
        fileName: item.fileName,
        category: normalizeCategory(item.category ?? "Knowledge"),
        tags: item.tags ?? [],
        pageCount: item.pageCount ?? 0,
        fileSize: item.fileSize ?? 0,
        createdAt: item.createdAt ?? new Date().toISOString(),
        excerpt: item.excerpt ?? shorten(fallbackSummary, 240),
        summary: fallbackSummary,
        keyPoints,
        topTerms: item.topTerms ?? [],
        wordCount:
          item.wordCount ??
          fallbackSummary
            .split(/\s+/)
            .map((part) => part.trim())
            .filter(Boolean).length,
        pdfUrl: item.pdfUrl,
        source: "repo" as const,
      };
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

const extractPdfText = async (
  arrayBuffer: ArrayBuffer
): Promise<{ text: string; pageCount: number }> => {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");

  if (!workerConfigured) {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;
    workerConfigured = true;
  }

  const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const chunks: string[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item ? (item as { str: string }).str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    if (pageText) chunks.push(pageText);
  }

  return { text: chunks.join("\n\n"), pageCount: pdf.numPages };
};

const hashString = (value: string): number => {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
};

const getCoverTheme = (value: string): CoverTheme =>
  coverThemes[hashString(value) % coverThemes.length];

const getCoverWord = (book: LibraryBook): string => {
  const candidates = [book.category, ...book.tags, ...book.title.split(/\s+/)];
  const pick = candidates.find((entry) => entry.replace(/[^a-zA-Z]/g, "").length >= 4);
  return (pick ?? "Nexus").replace(/[^a-zA-Z]/g, "").slice(0, 10).toUpperCase();
};

const getSortLabel = (mode: SortMode): string => {
  switch (mode) {
    case "title-asc":
      return "Title (A → Z)";
    case "title-desc":
      return "Title (Z → A)";
    case "newest":
      return "Terbaru";
    case "pages-desc":
      return "Halaman terbanyak";
    case "words-desc":
      return "Kata terbanyak";
    default:
      return "Urutkan";
  }
};

function BookCover({
  book,
  compact = false,
}: {
  book: LibraryBook;
  compact?: boolean;
}): React.ReactElement {
  const theme = getCoverTheme(`${book.category}-${book.title}`);
  const coverWord = getCoverWord(book);

  return (
    <div
      className={`relative overflow-hidden rounded-[1.45rem] border ${theme.line} bg-gradient-to-br ${theme.surface} ${
        compact ? "min-h-[148px]" : "min-h-[230px]"
      }`}
    >
      <div
        className={`absolute -top-10 right-0 h-28 w-28 rounded-full bg-gradient-to-br ${theme.glow} blur-3xl`}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0)_45%,rgba(0,0,0,0.28)_100%)]" />
      <div className="absolute left-4 top-4 max-w-[74%]">
        <p className={`text-[10px] uppercase tracking-[0.28em] ${theme.ink} opacity-70`}>
          {book.source === "repo" ? "Curated library" : "Session upload"}
        </p>
      </div>
      <div
        className={`absolute right-4 top-4 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${theme.badge}`}
      >
        {book.category}
      </div>
      <div className="absolute inset-x-4 bottom-4">
        <p
          className={`line-clamp-3 text-2xl font-black leading-[0.96] tracking-[-0.04em] ${theme.ink} drop-shadow-[0_8px_18px_rgba(0,0,0,0.18)]`}
        >
          {book.title}
        </p>
      </div>
      <p className="pointer-events-none absolute -bottom-5 left-3 text-[72px] font-black tracking-[-0.08em] text-black/10 select-none">
        {coverWord}
      </p>
    </div>
  );
}

function StatChip({
  label,
  value,
}: {
  label: string;
  value: string;
}): React.ReactElement {
  return (
    <div className="rounded-full border border-[#1B4332]/10 bg-white/80 px-4 py-2 text-sm text-[#1B4332]/72 shadow-[0_8px_24px_-18px_rgba(27,67,50,0.35)]">
      <span className="font-semibold text-[#1B4332]">{value}</span>
      <span className="mx-2 text-[#1B4332]/20">|</span>
      <span>{label}</span>
    </div>
  );
}

function BookGridCard({
  book,
  onInspect,
  onOpen,
  onRemove,
}: {
  book: LibraryBook;
  onInspect: (book: LibraryBook) => void;
  onOpen: (book: LibraryBook) => void;
  onRemove: (book: LibraryBook) => void;
}): React.ReactElement {
  const actionLabel =
    book.pdfBlob || book.pdfUrl ? "Buka dokumen" : "Baca ringkasan";

  return (
    <article className="group rounded-[1.65rem] border border-[#1B4332]/10 bg-white p-3 shadow-[0_10px_30px_-20px_rgba(27,67,50,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-28px_rgba(27,67,50,0.45)]">
      <BookCover book={book} />

      <div className="px-1 pt-4 pb-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#1B4332]/42">
              {formatDate(book.createdAt)}
            </p>
            <h3 className="mt-2 line-clamp-2 text-lg font-bold leading-tight text-[#1B4332]">
              {book.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onInspect(book)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#1B4332]/10 text-[#1B4332]/60 transition-colors hover:border-[#1B4332]/25 hover:text-[#1B4332]"
            aria-label={`Lihat detail ${book.title}`}
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[#1B4332]/74">
          {book.excerpt}
        </p>

        <div className="mt-3 flex min-h-6 flex-wrap gap-2">
          {book.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-[#F4F7F5] px-2.5 py-1 text-[11px] font-medium text-[#1B4332]/65"
            >
              <Tags className="h-3 w-3" />
              {tag}
            </span>
          ))}
          {book.tags.length > 3 && (
            <span className="inline-flex items-center rounded-full bg-[#EEF3F0] px-2.5 py-1 text-[11px] font-semibold text-[#1B4332]/55">
              +{book.tags.length - 3}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-[#1B4332]/52">
          <span>{book.pageCount || "-"} halaman</span>
          <span>{book.wordCount.toLocaleString("id-ID")} kata</span>
          <span>{book.source === "repo" ? "Repo" : "Session"}</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onOpen(book)}
            className="rounded-xl border border-[#1B4332]/15 px-3 py-2.5 text-sm font-semibold text-[#1B4332] transition-colors hover:bg-[#F4F8F6]"
          >
            {actionLabel}
          </button>
          <button
            type="button"
            onClick={() => onInspect(book)}
            className="rounded-xl bg-[#1B4332] px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#133526]"
          >
            Detail
          </button>
        </div>

        {book.source === "session" && (
          <button
            type="button"
            onClick={() => onRemove(book)}
            className="mt-2 inline-flex items-center gap-1.5 rounded-xl px-2 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Hapus item sesi
          </button>
        )}
      </div>
    </article>
  );
}

function BookListCard({
  book,
  onInspect,
  onOpen,
  onRemove,
}: {
  book: LibraryBook;
  onInspect: (book: LibraryBook) => void;
  onOpen: (book: LibraryBook) => void;
  onRemove: (book: LibraryBook) => void;
}): React.ReactElement {
  const actionLabel =
    book.pdfBlob || book.pdfUrl ? "Buka dokumen" : "Baca ringkasan";

  return (
    <article className="rounded-[1.65rem] border border-[#1B4332]/10 bg-white p-3 shadow-[0_10px_30px_-20px_rgba(27,67,50,0.35)]">
      <div className="grid gap-4 md:grid-cols-[220px_1fr] xl:grid-cols-[220px_1fr_240px]">
        <BookCover book={book} compact />

        <div className="min-w-0 py-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#1B4332]/42">
                {book.category} · {formatDate(book.createdAt)}
              </p>
              <h3 className="mt-2 text-xl font-bold leading-tight text-[#1B4332]">
                {book.title}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onInspect(book)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#1B4332]/10 text-[#1B4332]/60 transition-colors hover:border-[#1B4332]/25 hover:text-[#1B4332] xl:hidden"
              aria-label={`Lihat detail ${book.title}`}
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-[#1B4332]/74">
            {book.summary}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {book.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-[#F4F7F5] px-2.5 py-1 text-[11px] font-medium text-[#1B4332]/65"
              >
                <Tags className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-xs font-medium text-[#1B4332]/55">
            <span>{book.pageCount || "-"} halaman</span>
            <span>{book.wordCount.toLocaleString("id-ID")} kata</span>
            <span>{formatBytes(book.fileSize)}</span>
            <span>{book.source === "repo" ? "Kurasi repo" : "Upload sesi"}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 xl:justify-between">
          <div className="hidden xl:flex xl:justify-end">
            <button
              type="button"
              onClick={() => onInspect(book)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1B4332]/10 text-[#1B4332]/60 transition-colors hover:border-[#1B4332]/25 hover:text-[#1B4332]"
              aria-label={`Lihat detail ${book.title}`}
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-2">
            <button
              type="button"
              onClick={() => onOpen(book)}
              className="rounded-xl border border-[#1B4332]/15 px-3 py-2.5 text-sm font-semibold text-[#1B4332] transition-colors hover:bg-[#F4F8F6]"
            >
              {actionLabel}
            </button>
            <button
              type="button"
              onClick={() => onInspect(book)}
              className="rounded-xl bg-[#1B4332] px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#133526]"
            >
              Detail & Tools
            </button>
            {book.source === "session" && (
              <button
                type="button"
                onClick={() => onRemove(book)}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-200 px-3 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                Hapus sesi
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export function BooksHub(): React.ReactElement {
  const inputRef = useRef<HTMLInputElement>(null);
  const [books, setBooks] = useState<LibraryBook[]>(() => normalizeImportedBooks());
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
  const [formatFilter, setFormatFilter] = useState<FormatFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("title-asc");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [uploadCategory, setUploadCategory] = useState("Knowledge");
  const [uploadTags, setUploadTags] = useState("ringkasan,pdf");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [errorText, setErrorText] = useState("");
  const [selectedBook, setSelectedBook] = useState<LibraryBook | null>(null);

  const categories = useMemo(
    () =>
      Array.from(new Set(books.map((book) => book.category))).sort((a, b) =>
        a.localeCompare(b, "id-ID")
      ),
    [books]
  );

  const categoryCounts = useMemo(
    () =>
      books.reduce<Record<string, number>>((acc, book) => {
        acc[book.category] = (acc[book.category] ?? 0) + 1;
        return acc;
      }, {}),
    [books]
  );

  const topTags = useMemo(() => {
    const counts = books.reduce<Map<string, number>>((acc, book) => {
      for (const tag of book.tags) {
        acc.set(tag, (acc.get(tag) ?? 0) + 1);
      }
      return acc;
    }, new Map<string, number>());

    return Array.from(counts.entries())
      .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0], "id-ID"))
      .slice(0, 18);
  }, [books]);

  const filteredBooks = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return books.filter((book) => {
      const inCategory = selectedCategory === "all" || book.category === selectedCategory;
      if (!inCategory) return false;
      const inTag = selectedTag === "all" || book.tags.includes(selectedTag);
      if (!inTag) return false;
      const inSource = sourceFilter === "all" || book.source === sourceFilter;
      if (!inSource) return false;
      const fileFormat = getFileFormat(book.fileName);
      const inFormat = formatFilter === "all" || fileFormat === formatFilter;
      if (!inFormat) return false;
      if (!keyword) return true;

      return (
        book.title.toLowerCase().includes(keyword) ||
        book.summary.toLowerCase().includes(keyword) ||
        book.excerpt.toLowerCase().includes(keyword) ||
        book.fileName.toLowerCase().includes(keyword) ||
        book.category.toLowerCase().includes(keyword) ||
        book.tags.some((tag) => tag.includes(keyword)) ||
        book.topTerms.some((term) => term.includes(keyword))
      );
    });
  }, [books, formatFilter, query, selectedCategory, selectedTag, sourceFilter]);

  const sortedBooks = useMemo(() => {
    const next = [...filteredBooks];

    next.sort((left, right) => {
      switch (sortMode) {
        case "title-asc":
          return left.title.localeCompare(right.title, "id-ID");
        case "title-desc":
          return right.title.localeCompare(left.title, "id-ID");
        case "newest":
          return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
        case "pages-desc":
          return right.pageCount - left.pageCount;
        case "words-desc":
          return right.wordCount - left.wordCount;
        default:
          return 0;
      }
    });

    return next;
  }, [filteredBooks, sortMode]);

  const stats = useMemo(() => {
    const totalPages = books.reduce((sum, book) => sum + (book.pageCount || 0), 0);
    const totalBytes = books.reduce((sum, book) => sum + (book.fileSize || 0), 0);
    const totalWords = books.reduce((sum, book) => sum + (book.wordCount || 0), 0);
    const sessionCount = books.filter((book) => book.source === "session").length;
    const summaryCount = books.filter((book) => book.summary.trim().length > 0).length;

    return {
      count: books.length,
      pages: totalPages,
      bytes: totalBytes,
      words: totalWords,
      repoCount: books.filter((book) => book.source === "repo").length,
      sessionCount,
      summaryCount,
    };
  }, [books]);

  const featuredBook = useMemo(() => {
    if (sortedBooks.length === 0) return null;

    const ranked = [...sortedBooks].sort((left, right) => {
      const leftScore =
        left.pageCount * 4 +
        left.wordCount / 40 +
        left.tags.length * 20 +
        (left.source === "repo" ? 50 : 10);
      const rightScore =
        right.pageCount * 4 +
        right.wordCount / 40 +
        right.tags.length * 20 +
        (right.source === "repo" ? 50 : 10);

      return rightScore - leftScore;
    });

    return ranked[0];
  }, [sortedBooks]);

  const resetFilters = (): void => {
    setQuery("");
    setSelectedCategory("all");
    setSelectedTag("all");
    setSourceFilter("all");
    setFormatFilter("all");
  };

  const handleFiles = async (files: File[]): Promise<void> => {
    const pdfFiles = files.filter((file) => file.type === "application/pdf");
    if (pdfFiles.length === 0) {
      setErrorText("File harus berformat PDF.");
      return;
    }

    setIsUploading(true);
    setErrorText("");
    setFiltersOpen(true);

    try {
      const nextBooks: LibraryBook[] = [];
      const duplicateKeys = getDuplicateKeySet(books);
      const skippedDuplicates: string[] = [];

      for (const file of pdfFiles) {
        const normalizedFileName = normalizeLookupValue(file.name);
        const normalizedTitle = normalizeLookupValue(normalizeTitle(file.name));
        const fileKey = `file:${normalizedFileName}`;
        const titleKey = `title:${normalizedTitle}`;

        if (duplicateKeys.has(fileKey) || duplicateKeys.has(titleKey)) {
          skippedDuplicates.push(file.name);
          continue;
        }

        setStatusText(`Menganalisis ${file.name} ...`);
        const arrayBuffer = await file.arrayBuffer();
        const { text, pageCount } = await extractPdfText(arrayBuffer);
        const summary = generateSummary(text);

        const id =
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

        nextBooks.push({
          id,
          title: normalizeTitle(file.name),
          fileName: file.name,
          category: normalizeCategory(uploadCategory),
          tags: uniqueTags(uploadTags),
          pageCount,
          fileSize: file.size,
          createdAt: new Date().toISOString(),
          excerpt: summary.excerpt,
          summary: summary.summary,
          keyPoints: summary.keyPoints,
          topTerms: summary.topTerms,
          wordCount: summary.wordCount,
          pdfBlob: new Blob([arrayBuffer], { type: "application/pdf" }),
          source: "session",
        });

        duplicateKeys.add(fileKey);
        duplicateKeys.add(titleKey);
      }

      if (nextBooks.length > 0) {
        setBooks((prev) => [...nextBooks, ...prev]);
        setSelectedBook(nextBooks[0] ?? null);
      }

      if (skippedDuplicates.length > 0 && nextBooks.length === 0) {
        setStatusText(
          `Semua file diskip karena sudah ada di library: ${skippedDuplicates.join(", ")}.`
        );
      } else if (skippedDuplicates.length > 0) {
        setStatusText(
          `${nextBooks.length} PDF masuk, ${skippedDuplicates.length} diskip duplikat: ${skippedDuplicates.join(", ")}.`
        );
      } else {
        setStatusText(
          `${nextBooks.length} PDF selesai diproses. Gunakan Export JSON/Markdown dari detail buku untuk commit ke GitHub.`
        );
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal memproses PDF. Silakan coba dokumen lain.";
      setErrorText(message);
    } finally {
      setIsUploading(false);
      setTimeout(() => setStatusText(""), 2800);
    }
  };

  const onInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (files.length > 0) await handleFiles(files);
    if (inputRef.current) inputRef.current.value = "";
  };

  const onDrop = async (event: React.DragEvent<HTMLDivElement>): Promise<void> => {
    event.preventDefault();
    setIsDragging(false);
    if (isUploading) return;

    const files = Array.from(event.dataTransfer.files ?? []);
    if (files.length > 0) await handleFiles(files);
  };

  const openPdf = (book: LibraryBook): void => {
    if (book.pdfBlob) {
      const url = URL.createObjectURL(book.pdfBlob);
      window.open(url, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
      return;
    }

    if (book.pdfUrl) {
      window.open(book.pdfUrl, "_blank", "noopener,noreferrer");
      return;
    }

    setErrorText("PDF tidak tersedia untuk dokumen ini.");
  };

  const copySummary = async (book: LibraryBook): Promise<void> => {
    const payload = [book.summary, "", ...book.keyPoints.map((point) => `- ${point}`)].join(
      "\n"
    );

    try {
      await navigator.clipboard.writeText(payload);
      setStatusText(`Ringkasan "${book.title}" tersalin.`);
      setTimeout(() => setStatusText(""), 1800);
    } catch {
      setErrorText("Clipboard tidak tersedia di browser ini.");
    }
  };

  const exportMarkdown = (book: LibraryBook): void => {
    const blob = new Blob([toMarkdown(book)], { type: "text/markdown;charset=utf-8" });
    downloadBlob(blob, `${book.title.toLowerCase().replace(/\s+/g, "-")}-summary.md`);
  };

  const exportMetadata = (book: LibraryBook): void => {
    const payload = {
      id: book.id,
      title: book.title,
      fileName: book.fileName,
      category: book.category,
      tags: book.tags,
      pageCount: book.pageCount,
      fileSize: book.fileSize,
      createdAt: book.createdAt,
      excerpt: book.excerpt,
      summary: book.summary,
      keyPoints: book.keyPoints,
      topTerms: book.topTerms,
      wordCount: book.wordCount,
      pdfUrl: book.pdfUrl ?? `/books/${book.fileName}`,
    };

    const blob = new Blob([`${JSON.stringify(payload, null, 2)}\n`], {
      type: "application/json;charset=utf-8",
    });

    downloadBlob(blob, `${book.title.toLowerCase().replace(/\s+/g, "-")}.book.json`);
    setStatusText(`Metadata JSON untuk "${book.title}" berhasil diexport.`);
    setTimeout(() => setStatusText(""), 1800);
  };

  const remove = (book: LibraryBook): void => {
    const confirmed = window.confirm(
      `Hapus "${book.title}" dari tampilan library saat ini?`
    );
    if (!confirmed) return;

    setBooks((prev) => prev.filter((item) => item.id !== book.id));
    if (selectedBook?.id === book.id) setSelectedBook(null);
  };

  return (
    <div className="pb-16">
      <section className="border-b border-[#1B4332]/8 bg-[#FCFBF6]">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 text-sm text-[#1B4332]/50">
            <span>Home</span>
            <ChevronRight className="h-4 w-4" />
            <span>Books Hub</span>
            <ChevronRight className="h-4 w-4" />
            <span className="font-semibold text-[#1B4332]">Collections</span>
          </div>
        </div>
      </section>

      <section className="bg-[#FCFBF6]">
        <div className="mx-auto max-w-7xl px-4 pt-4 pb-6 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2rem] border border-[#1B4332]/8 bg-[linear-gradient(120deg,#eef7ff_0%,#f7fbf6_55%,#fff8ea_100%)] px-6 py-10 shadow-[0_18px_48px_-32px_rgba(27,67,50,0.35)] sm:px-8 sm:py-12">
            <div className="max-w-4xl">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#2D6A4F]">
                Library Collection
              </p>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-[#1B4332] sm:text-5xl">
                Library Buku Finansial
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#1B4332]/72 sm:text-lg">
                Kurasi eBook, ringkasan, dan PDF referensi untuk budgeting,
                investasi, perbankan, pajak, dan topik finansial lain. Layout-nya
                mengikuti pola library modern dengan pencarian cepat, featured
                strip, dan tampilan rak buku.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <StatChip label="total koleksi" value={`${stats.count} buku`} />
                <StatChip
                  label="punya ringkasan"
                  value={`${stats.summaryCount} summary`}
                />
                <StatChip label="kurasi repo" value={`${stats.repoCount} seed`} />
                <StatChip
                  label="upload sesi"
                  value={`${stats.sessionCount} file`}
                />
              </div>
            </div>
          </div>

          {featuredBook && (
            <div className="mt-6 rounded-[1.75rem] border border-[#9ABCF9]/40 bg-[linear-gradient(120deg,#eff5ff_0%,#f8fbff_100%)] p-4 shadow-[0_14px_40px_-28px_rgba(42,94,180,0.45)] sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-full max-w-[108px] sm:w-[108px]">
                    <BookCover book={featuredBook} compact />
                  </div>
                  <div className="min-w-0">
                    <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#2A5EB4]">
                      <Sparkles className="h-3.5 w-3.5" />
                      Pilihan editor
                    </p>
                    <h2 className="mt-2 text-xl font-bold leading-tight text-[#1B4332] sm:text-2xl">
                      {featuredBook.title}
                    </h2>
                    <p className="mt-1 text-sm text-[#1B4332]/65">
                      {featuredBook.category} · {featuredBook.pageCount || "-"} halaman ·{" "}
                      {featuredBook.wordCount.toLocaleString("id-ID")} kata
                    </p>
                    <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-relaxed text-[#1B4332]/72">
                      {featuredBook.summary}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
                  <button
                    type="button"
                    onClick={() => openPdf(featuredBook)}
                    className="rounded-xl border border-[#2A5EB4]/15 bg-white px-4 py-2.5 text-sm font-semibold text-[#2A5EB4] transition-colors hover:bg-[#F3F7FF]"
                  >
                    Buka dokumen
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedBook(featuredBook)}
                    className="rounded-xl bg-[#1B4332] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#133526]"
                  >
                    Lihat detail
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="rounded-[1.55rem] border border-[#1B4332]/10 bg-white p-3 shadow-[0_12px_36px_-28px_rgba(27,67,50,0.35)] sm:p-4">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1.5fr)_180px_140px_112px]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1B4332]/35" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari buku berdasarkan judul, kategori, atau deskripsi..."
                className="w-full rounded-2xl border border-[#1B4332]/10 bg-[#FCFCFA] py-3 pr-4 pl-11 text-sm text-[#1B4332] outline-none transition-shadow placeholder:text-[#1B4332]/40 focus:border-[#2D6A4F]/25 focus:ring-4 focus:ring-[#2D6A4F]/8"
              />
            </div>

            <label className="relative">
              <ArrowUpDown className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1B4332]/35" />
              <select
                value={sortMode}
                onChange={(event) => setSortMode(event.target.value as SortMode)}
                className="w-full appearance-none rounded-2xl border border-[#1B4332]/10 bg-[#FCFCFA] py-3 pr-10 pl-11 text-sm font-medium text-[#1B4332] outline-none transition-shadow focus:border-[#2D6A4F]/25 focus:ring-4 focus:ring-[#2D6A4F]/8"
              >
                <option value="title-asc">Title (A → Z)</option>
                <option value="title-desc">Title (Z → A)</option>
                <option value="newest">Terbaru</option>
                <option value="pages-desc">Halaman terbanyak</option>
                <option value="words-desc">Kata terbanyak</option>
              </select>
            </label>

            <button
              type="button"
              onClick={() => setFiltersOpen((prev) => !prev)}
              className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors ${
                filtersOpen
                  ? "border-[#1B4332] bg-[#1B4332] text-white"
                  : "border-[#1B4332]/10 bg-[#FCFCFA] text-[#1B4332] hover:bg-[#F4F8F6]"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>

            <div className="inline-flex items-center rounded-2xl border border-[#1B4332]/10 bg-[#FCFCFA] p-1">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`flex h-11 w-12 items-center justify-center rounded-[0.9rem] transition-colors ${
                  viewMode === "grid"
                    ? "bg-[#1657C0] text-white shadow-sm"
                    : "text-[#1B4332]/55 hover:bg-white"
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`flex h-11 w-12 items-center justify-center rounded-[0.9rem] transition-colors ${
                  viewMode === "list"
                    ? "bg-[#1657C0] text-white shadow-sm"
                    : "text-[#1B4332]/55 hover:bg-white"
                }`}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {filtersOpen && (
            <div className="mt-4 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-4">
                <div className="rounded-[1.45rem] border border-[#1B4332]/10 bg-[#FCFCFA] p-4 sm:p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2D6A4F]">
                    Filter kategori
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedCategory("all")}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                        selectedCategory === "all"
                          ? "bg-[#1B4332] text-white"
                          : "bg-white text-[#1B4332]/72 hover:bg-[#F1F5F2]"
                      }`}
                    >
                      Semua kategori
                      <span className="ml-2 text-xs opacity-70">{stats.count}</span>
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setSelectedCategory(category)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                          selectedCategory === category
                            ? "bg-[#1B4332] text-white"
                            : "bg-white text-[#1B4332]/72 hover:bg-[#F1F5F2]"
                        }`}
                      >
                        {category}
                        <span className="ml-2 text-xs opacity-70">
                          {categoryCounts[category] ?? 0}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1B4332]/45">
                        Filter sumber
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {[
                          ["all", "Semua"],
                          ["repo", "Repo"],
                          ["session", "Sesi"],
                        ].map(([value, label]) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setSourceFilter(value as SourceFilter)}
                            className={`rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
                              sourceFilter === value
                                ? "bg-[#1657C0] text-white"
                                : "bg-white text-[#1B4332]/72 hover:bg-[#F1F5F2]"
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1B4332]/45">
                        Format dokumen
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {[
                          ["all", "Semua"],
                          ["pdf", "PDF"],
                          ["epub", "EPUB"],
                        ].map(([value, label]) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setFormatFilter(value as FormatFilter)}
                            className={`rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
                              formatFilter === value
                                ? "bg-[#1657C0] text-white"
                                : "bg-white text-[#1B4332]/72 hover:bg-[#F1F5F2]"
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-[#1B4332]/8 pt-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1B4332]/45">
                        Tag populer
                      </p>
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="text-xs font-semibold text-[#1657C0] transition-colors hover:text-[#0F47A5]"
                      >
                        Reset semua filter
                      </button>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedTag("all")}
                        className={`rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
                          selectedTag === "all"
                            ? "bg-[#1B4332] text-white"
                            : "bg-white text-[#1B4332]/72 hover:bg-[#F1F5F2]"
                        }`}
                      >
                        Semua tag
                      </button>
                      {topTags.map(([tag, count]) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setSelectedTag(tag)}
                          className={`rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
                            selectedTag === tag
                              ? "bg-[#1B4332] text-white"
                              : "bg-white text-[#1B4332]/72 hover:bg-[#F1F5F2]"
                          }`}
                        >
                          {tag}
                          <span className="ml-2 text-xs opacity-70">{count}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-[#1B4332]/65">
                    Mode aktif:{" "}
                    <span className="font-semibold text-[#1B4332]">{getSortLabel(sortMode)}</span>
                    {" · "}
                    <span className="font-semibold text-[#1B4332]">
                      {selectedCategory === "all" ? "Semua kategori" : selectedCategory}
                    </span>
                    {" · "}
                    <span className="font-semibold text-[#1B4332]">
                      {selectedTag === "all" ? "Semua tag" : `#${selectedTag}`}
                    </span>
                  </p>
                </div>

                <div className="rounded-[1.45rem] border border-[#1B4332]/10 bg-[#F7FAF8] p-4 sm:p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2D6A4F]">
                    Workflow GitHub
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[#1B4332]/68">
                    Untuk menjadikan koleksi permanen, upload PDF ke folder{" "}
                    <code>public/books/</code>, lalu tambahkan metadata ke{" "}
                    <code>src/data/books-library.json</code> dan deploy ulang di Vercel.
                  </p>

                  {(statusText || errorText) && (
                    <div
                      className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
                        errorText
                          ? "border-red-200 bg-red-50 text-red-700"
                          : "border-emerald-200 bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {errorText || statusText}
                    </div>
                  )}
                </div>
              </div>

              <div
                className={`rounded-[1.45rem] border-2 border-dashed p-4 transition-colors sm:p-5 ${
                  isDragging
                    ? "border-[#2D6A4F] bg-[#EAF4EF]"
                    : "border-[#1B4332]/12 bg-white"
                }`}
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="application/pdf"
                  multiple
                  className="hidden"
                  onChange={onInputChange}
                />

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1B4332]/8 text-[#1B4332]">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-[#1B4332]">Upload PDF</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#1B4332]/68">
                  Drag & drop PDF untuk membuat ringkasan otomatis. File upload
                  hanya disimpan di sesi browser saat ini.
                </p>

                <div className="mt-5 space-y-3">
                  <label className="block">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1B4332]/45">
                      Kategori
                    </span>
                    <input
                      value={uploadCategory}
                      onChange={(event) => setUploadCategory(event.target.value)}
                      placeholder="Contoh: Perbankan"
                      className="mt-1.5 w-full rounded-xl border border-[#1B4332]/10 bg-[#FCFCFA] px-3 py-2.5 text-sm text-[#1B4332] outline-none focus:border-[#2D6A4F]/25 focus:ring-4 focus:ring-[#2D6A4F]/8"
                    />
                  </label>

                  <label className="block">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1B4332]/45">
                      Tag
                    </span>
                    <input
                      value={uploadTags}
                      onChange={(event) => setUploadTags(event.target.value)}
                      placeholder="contoh: deposito,pdf,summary"
                      className="mt-1.5 w-full rounded-xl border border-[#1B4332]/10 bg-[#FCFCFA] px-3 py-2.5 text-sm text-[#1B4332] outline-none focus:border-[#2D6A4F]/25 focus:ring-4 focus:ring-[#2D6A4F]/8"
                    />
                  </label>
                </div>

                <button
                  type="button"
                  className="mt-5 w-full rounded-2xl bg-[#1B4332] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#133526] disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={() => inputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? "Memproses PDF..." : "Pilih PDF"}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-[#1B4332]/62">
          <p>
            Menampilkan <span className="font-semibold text-[#1B4332]">{sortedBooks.length}</span>{" "}
            dari <span className="font-semibold text-[#1B4332]">{stats.count}</span> buku
          </p>
          <p className="inline-flex items-center gap-2">
            <BookOpenText className="h-4 w-4" />
            {viewMode === "grid" ? "Tampilan grid cover" : "Tampilan list detail"}
          </p>
        </div>

        {(query || selectedCategory !== "all" || selectedTag !== "all" || sourceFilter !== "all" || formatFilter !== "all") && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {query && (
              <span className="rounded-full bg-[#EAF4EF] px-3 py-1.5 text-xs font-semibold text-[#1B4332]">
                Query: {query}
              </span>
            )}
            {selectedCategory !== "all" && (
              <span className="rounded-full bg-[#EAF4EF] px-3 py-1.5 text-xs font-semibold text-[#1B4332]">
                Kategori: {selectedCategory}
              </span>
            )}
            {selectedTag !== "all" && (
              <span className="rounded-full bg-[#EAF4EF] px-3 py-1.5 text-xs font-semibold text-[#1B4332]">
                Tag: {selectedTag}
              </span>
            )}
            {sourceFilter !== "all" && (
              <span className="rounded-full bg-[#EAF4EF] px-3 py-1.5 text-xs font-semibold text-[#1B4332]">
                Sumber: {sourceFilter === "repo" ? "Repo" : "Sesi"}
              </span>
            )}
            {formatFilter !== "all" && (
              <span className="rounded-full bg-[#EAF4EF] px-3 py-1.5 text-xs font-semibold text-[#1B4332]">
                Format: {formatFilter.toUpperCase()}
              </span>
            )}
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-full border border-[#1B4332]/15 px-3 py-1.5 text-xs font-semibold text-[#1B4332] transition-colors hover:bg-[#F4F8F6]"
            >
              Reset filter
            </button>
          </div>
        )}

        {sortedBooks.length === 0 ? (
          <div className="mt-6 rounded-[1.8rem] border border-dashed border-[#1B4332]/18 bg-white px-6 py-16 text-center shadow-[0_12px_36px_-28px_rgba(27,67,50,0.35)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#1B4332]/8 text-[#1B4332]">
              <FileStack className="h-8 w-8" />
            </div>
            <h3 className="mt-5 text-2xl font-bold text-[#1B4332]">
              Koleksi tidak ditemukan
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#1B4332]/65">
              Ubah kata kunci, reset kategori, atau upload PDF baru dari panel
              filter untuk menambah item di library ini.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  resetFilters();
                }}
                className="rounded-2xl border border-[#1B4332]/15 px-4 py-2.5 text-sm font-semibold text-[#1B4332] transition-colors hover:bg-[#F4F8F6]"
              >
                Reset pencarian
              </button>
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="rounded-2xl bg-[#1B4332] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#133526]"
              >
                Buka filters
              </button>
            </div>
          </div>
        ) : viewMode === "grid" ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {sortedBooks.map((book) => (
              <BookGridCard
                key={book.id}
                book={book}
                onInspect={setSelectedBook}
                onOpen={openPdf}
                onRemove={remove}
              />
            ))}
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {sortedBooks.map((book) => (
              <BookListCard
                key={book.id}
                book={book}
                onInspect={setSelectedBook}
                onOpen={openPdf}
                onRemove={remove}
              />
            ))}
          </div>
        )}
      </section>

      {selectedBook && (
        <div
          className="fixed inset-0 z-[70] overflow-y-auto bg-black/48 p-4 backdrop-blur-sm sm:p-6"
          onClick={() => setSelectedBook(null)}
        >
          <div
            className="mx-auto max-w-5xl rounded-[2rem] border border-[#1B4332]/10 bg-white shadow-[0_30px_80px_-38px_rgba(10,20,14,0.65)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="grid gap-0 lg:grid-cols-[340px_1fr]">
              <div className="border-b border-[#1B4332]/8 p-5 lg:border-r lg:border-b-0 lg:p-6">
                <BookCover book={selectedBook} />

                <div className="mt-5 space-y-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#2D6A4F]">
                      Detail ringkasan
                    </p>
                    <h3 className="mt-2 text-2xl font-bold leading-tight text-[#1B4332]">
                      {selectedBook.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#1B4332]/62">
                      {selectedBook.category} · {formatDate(selectedBook.createdAt)} ·{" "}
                      {selectedBook.source === "repo" ? "Kurasi repo" : "Upload sesi"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-2xl bg-[#F6F9F7] px-4 py-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-[#1B4332]/42">
                        Halaman
                      </p>
                      <p className="mt-1 text-lg font-bold text-[#1B4332]">
                        {selectedBook.pageCount || "-"}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-[#F6F9F7] px-4 py-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-[#1B4332]/42">
                        Kata
                      </p>
                      <p className="mt-1 text-lg font-bold text-[#1B4332]">
                        {selectedBook.wordCount.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-[#F6F9F7] px-4 py-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-[#1B4332]/42">
                        Ukuran
                      </p>
                      <p className="mt-1 text-lg font-bold text-[#1B4332]">
                        {formatBytes(selectedBook.fileSize)}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-[#F6F9F7] px-4 py-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-[#1B4332]/42">
                        Tag
                      </p>
                      <p className="mt-1 text-lg font-bold text-[#1B4332]">
                        {selectedBook.tags.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#2D6A4F]">
                      Summary toolkit
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-[#1B4332]/65">
                      Gunakan action di bawah untuk membuka dokumen, menyalin
                      ringkasan, atau mengekspor metadata ke workflow repo.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedBook(null)}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#1B4332]/10 text-[#1B4332]/60 transition-colors hover:bg-[#F6F9F7] hover:text-[#1B4332]"
                    aria-label="Tutup"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                  <button
                    type="button"
                    onClick={() => openPdf(selectedBook)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#1B4332]/15 px-4 py-3 text-sm font-semibold text-[#1B4332] transition-colors hover:bg-[#F4F8F6]"
                  >
                    <BookOpenText className="h-4 w-4" />
                    Buka dokumen
                  </button>
                  <button
                    type="button"
                    onClick={() => void copySummary(selectedBook)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#1B4332]/15 px-4 py-3 text-sm font-semibold text-[#1B4332] transition-colors hover:bg-[#F4F8F6]"
                  >
                    <Copy className="h-4 w-4" />
                    Copy summary
                  </button>
                  <button
                    type="button"
                    onClick={() => exportMarkdown(selectedBook)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#1B4332]/15 px-4 py-3 text-sm font-semibold text-[#1B4332] transition-colors hover:bg-[#F4F8F6]"
                  >
                    <Download className="h-4 w-4" />
                    Export MD
                  </button>
                  <button
                    type="button"
                    onClick={() => exportMetadata(selectedBook)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1B4332] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#133526]"
                  >
                    <Github className="h-4 w-4" />
                    Export JSON
                  </button>
                </div>

                {selectedBook.source === "session" && (
                  <button
                    type="button"
                    onClick={() => remove(selectedBook)}
                    className="mt-3 inline-flex items-center gap-2 rounded-2xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Hapus upload sesi
                  </button>
                )}

                <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                  <div className="space-y-6">
                    <section>
                      <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2D6A4F]">
                        Ringkasan
                      </h4>
                      <p className="mt-3 text-sm leading-7 text-[#1B4332]/78">
                        {selectedBook.summary}
                      </p>
                    </section>

                    <section>
                      <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2D6A4F]">
                        Poin penting
                      </h4>
                      <ul className="mt-3 space-y-3 text-sm leading-relaxed text-[#1B4332]/76">
                        {selectedBook.keyPoints.map((point) => (
                          <li
                            key={point}
                            className="rounded-2xl border border-[#1B4332]/8 bg-[#F8FAF9] px-4 py-3"
                          >
                            {point}
                          </li>
                        ))}
                      </ul>
                    </section>
                  </div>

                  <div className="space-y-6">
                    <section className="rounded-[1.45rem] border border-[#1B4332]/8 bg-[#F8FAF9] p-4">
                      <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2D6A4F]">
                        Metadata
                      </h4>
                      <dl className="mt-4 space-y-3 text-sm text-[#1B4332]/72">
                        <div className="flex items-start justify-between gap-4">
                          <dt>File</dt>
                          <dd className="text-right font-medium text-[#1B4332]">
                            {selectedBook.fileName}
                          </dd>
                        </div>
                        <div className="flex items-start justify-between gap-4">
                          <dt>Kategori</dt>
                          <dd className="text-right font-medium text-[#1B4332]">
                            {selectedBook.category}
                          </dd>
                        </div>
                        <div className="flex items-start justify-between gap-4">
                          <dt>Tanggal</dt>
                          <dd className="text-right font-medium text-[#1B4332]">
                            {formatDate(selectedBook.createdAt)}
                          </dd>
                        </div>
                        <div className="flex items-start justify-between gap-4">
                          <dt>Sumber</dt>
                          <dd className="text-right font-medium text-[#1B4332]">
                            {selectedBook.source === "repo" ? "GitHub repository" : "Session browser"}
                          </dd>
                        </div>
                      </dl>
                    </section>

                    {selectedBook.tags.length > 0 && (
                      <section>
                        <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2D6A4F]">
                          Tags
                        </h4>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {selectedBook.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 rounded-full bg-[#F4F7F5] px-3 py-1.5 text-xs font-semibold text-[#1B4332]/68"
                            >
                              <Tags className="h-3.5 w-3.5" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      </section>
                    )}

                    {selectedBook.topTerms.length > 0 && (
                      <section>
                        <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2D6A4F]">
                          Top terms
                        </h4>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {selectedBook.topTerms.map((term) => (
                            <span
                              key={term}
                              className="rounded-full border border-[#1B4332]/10 bg-white px-3 py-1.5 text-xs font-semibold text-[#1B4332]/68"
                            >
                              {term}
                            </span>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
