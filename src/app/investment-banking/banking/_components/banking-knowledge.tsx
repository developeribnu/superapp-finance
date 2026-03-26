"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { glossary, faqs, type GlossaryTerm, type FAQ } from "@/lib/data/banking-data";
import { 
  BookOpen, 
  HelpCircle, 
  Search, 
  Landmark,
  CreditCard,
  Shield,
  Smartphone
} from "lucide-react";

// Glossary Component
function GlossarySection() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["all", "General", "Product", "Regulation", "Technology"];

  const filteredTerms = useMemo(() => {
    return glossary.filter((term) => {
      const matchesSearch = 
        term.term.toLowerCase().includes(search.toLowerCase()) ||
        term.definition.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === "all" || term.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Product": return <CreditCard className="h-4 w-4" />;
      case "Regulation": return <Shield className="h-4 w-4" />;
      case "Technology": return <Smartphone className="h-4 w-4" />;
      default: return <Landmark className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Product": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "Regulation": return "bg-green-500/10 text-green-600 border-green-500/20";
      case "Technology": return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      default: return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari istilah perbankan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {cat === "all" ? "Semua" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredTerms.map((term) => (
          <Card key={term.term} className="group hover:border-primary/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                  {term.term}
                </h4>
                <Badge 
                  variant="outline" 
                  className={`text-xs flex items-center gap-1 ${getCategoryColor(term.category)}`}
                >
                  {getCategoryIcon(term.category)}
                  {term.category}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {term.definition}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTerms.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>Tidak ada istilah yang cocok dengan pencarian</p>
        </div>
      )}
    </div>
  );
}

// FAQ Component
function FAQSection() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["all", "Umum", "Produk", "Keamanan", "Teknologi", "Syariah"];

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesSearch = 
        faq.question.toLowerCase().includes(search.toLowerCase()) ||
        faq.answer.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Umum": return "bg-blue-500/10 text-blue-600";
      case "Produk": return "bg-green-500/10 text-green-600";
      case "Keamanan": return "bg-red-500/10 text-red-600";
      case "Teknologi": return "bg-purple-500/10 text-purple-600";
      case "Syariah": return "bg-emerald-500/10 text-emerald-600";
      default: return "bg-gray-500/10 text-gray-600";
    }
  };

  // Group FAQs by category for accordion
  const groupedFaqs = useMemo(() => {
    const grouped: Record<string, FAQ[]> = {};
    filteredFaqs.forEach((faq) => {
      if (!grouped[faq.category]) grouped[faq.category] = [];
      grouped[faq.category].push(faq);
    });
    return grouped;
  }, [filteredFaqs]);

  return (
    <div className="space-y-4">
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari pertanyaan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {cat === "all" ? "Semua" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Accordion */}
      {selectedCategory === "all" ? (
        <Accordion type="single" collapsible className="space-y-3">
          {filteredFaqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border rounded-lg px-4 data-[state=open]:border-primary/50"
            >
              <AccordionTrigger className="text-left hover:no-underline py-4">
                <div className="flex items-start gap-3 pr-4">
                  <Badge className={`text-xs flex-shrink-0 ${getCategoryColor(faq.category)}`}>
                    {faq.category}
                  </Badge>
                  <span className="text-sm font-medium">{faq.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground pb-4 pl-[4.5rem]">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedFaqs).map(([category, categoryFaqs]) => (
            <Card key={category}>
              <CardHeader className="pb-3">
                <Badge className={`w-fit ${getCategoryColor(category)}`}>
                  {category}
                </Badge>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="space-y-2">
                  {categoryFaqs.map((faq, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`item-${index}`}
                      className="border-b-0 border-t px-0 first:border-t-0"
                    >
                      <AccordionTrigger className="text-left hover:no-underline py-3 text-sm">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredFaqs.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <HelpCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>Tidak ada pertanyaan yang cocok dengan pencarian</p>
        </div>
      )}
    </div>
  );
}

// Quick Tips Component
function QuickTipsSection() {
  const tips = [
    {
      title: "Hindari Biaya Admin",
      content: "Pilih tabungan dengan syarat saldo minimum atau gunakan bank digital seperti Jenius, Blu, atau Line Bank yang bebas biaya admin.",
      icon: "💰"
    },
    {
      title: "Maksimalkan Bunga",
      content: "Bandingkan suku bunga deposito antar bank. Bank syariah dan bank digital biasanya menawarkan bunga lebih tinggi.",
      icon: "📈"
    },
    {
      title: "Gunakan QRIS",
      content: "Transaksi QRIS umumnya gratis atau lebih murah dari transfer antar bank. Gunakan untuk pembayaran sehari-hari.",
      icon: "📱"
    },
    {
      title: "Aktifkan Notifikasi",
      content: "Nyalakan push notification di mobile banking untuk memantau transaksi real-time dan deteksi transaksi mencurigakan.",
      icon: "🔔"
    },
    {
      title: "Bagi Dana ke Beberapa Bank",
      content: "Sebarkan dana ke 2-3 bank untuk memaksimalkan bunga dan tetap dalam batas jaminan LPS (Rp 2 miliar per bank).",
      icon: "🏦"
    },
    {
      title: "Manfaatkan Promo",
      content: "Ikuti promo cashback dan diskon merchant. BCA, Mandiri, dan CIMB sering ada promo menarik.",
      icon: "🎁"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tips.map((tip) => (
        <Card key={tip.title} className="group hover:border-primary/50 transition-all">
          <CardContent className="p-4">
            <div className="text-2xl mb-2">{tip.icon}</div>
            <h4 className="font-medium text-sm mb-1 group-hover:text-primary transition-colors">
              {tip.title}
            </h4>
            <p className="text-xs text-muted-foreground">{tip.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Main Component
export function BankingKnowledge() {
  return (
    <Tabs defaultValue="faq" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="faq" className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4" />
          <span className="hidden sm:inline">FAQ</span>
        </TabsTrigger>
        <TabsTrigger value="glossary" className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          <span className="hidden sm:inline">Glosarium</span>
        </TabsTrigger>
        <TabsTrigger value="tips" className="flex items-center gap-2">
          <span className="text-lg">💡</span>
          <span className="hidden sm:inline">Tips</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="faq" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Pertanyaan yang Sering Diajukan
            </CardTitle>
            <CardDescription>
              Jawaban untuk pertanyaan umum seputar perbankan di Indonesia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FAQSection />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="glossary" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Glosarium Perbankan
            </CardTitle>
            <CardDescription>
              Kumpulan istilah-istilah penting dalam dunia perbankan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GlossarySection />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="tips" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-xl">💡</span>
              Tips & Trik Perbankan
            </CardTitle>
            <CardDescription>
              Tips praktis untuk mengoptimalkan pengalaman banking Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QuickTipsSection />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
