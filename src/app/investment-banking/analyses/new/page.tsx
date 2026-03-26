"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CompanyOption {
  id: string;
  name: string;
  ticker: string | null;
  marketCap: number | null;
}

export default function NewAnalysisPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [targetId, setTargetId] = useState("");
  const [selectedComps, setSelectedComps] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetch("/api/companies/search?q=&limit=100")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setCompanies(json.data);
      });
  }, []);

  const toggleComp = (id: string) => {
    setSelectedComps((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!targetId) {
      toast.error("Select a target company");
      return;
    }
    if (selectedComps.length < 3) {
      toast.error("Select at least 3 comparable companies");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("/api/analyses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || `Analysis - ${companies.find((c) => c.id === targetId)?.name}`,
          description,
          targetCompanyId: targetId,
          comparableIds: selectedComps,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Analysis created");
        router.push(`/analyses/${json.data.id}`);
      } else {
        toast.error(json.error || "Failed to create analysis");
      }
    } catch {
      toast.error("Failed to create analysis");
    } finally {
      setLoading(false);
    }
  }

  const availableComps = companies.filter((c) => c.id !== targetId);

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">New Analysis</h1>
        <p className="text-muted-foreground text-sm">
          Create a comparable company valuation analysis
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Analysis Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Analysis Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., CRM SaaS Comps Analysis"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional notes"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Target Company
            </CardTitle>
          </CardHeader>
          <CardContent>
            {companies.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No companies in database. Add companies first.
              </p>
            ) : (
              <div className="grid gap-2 max-h-60 overflow-y-auto">
                {companies.map((company) => (
                  <label
                    key={company.id}
                    className={`flex items-center gap-3 p-2 rounded-md border cursor-pointer transition-colors ${
                      targetId === company.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:bg-accent"
                    }`}
                  >
                    <input
                      type="radio"
                      name="target"
                      value={company.id}
                      checked={targetId === company.id}
                      onChange={() => {
                        setTargetId(company.id);
                        setSelectedComps((prev) =>
                          prev.filter((c) => c !== company.id)
                        );
                      }}
                      className="accent-primary"
                    />
                    <span className="text-sm font-medium">{company.name}</span>
                    {company.ticker && (
                      <span className="text-xs text-muted-foreground">
                        {company.ticker}
                      </span>
                    )}
                  </label>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Comparable Companies ({selectedComps.length} selected)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {availableComps.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Select a target company first.
              </p>
            ) : (
              <div className="grid gap-2 max-h-80 overflow-y-auto">
                {availableComps.map((company) => (
                  <label
                    key={company.id}
                    className={`flex items-center gap-3 p-2 rounded-md border cursor-pointer transition-colors ${
                      selectedComps.includes(company.id)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:bg-accent"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedComps.includes(company.id)}
                      onChange={() => toggleComp(company.id)}
                      className="accent-primary"
                    />
                    <span className="text-sm font-medium">{company.name}</span>
                    {company.ticker && (
                      <span className="text-xs text-muted-foreground">
                        {company.ticker}
                      </span>
                    )}
                  </label>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Analysis"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
