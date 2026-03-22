import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import PageLayout from "@/components/PageLayout";
import { BadgeIndianRupee, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requestJson } from "@/lib/api";

type SchemeItem = {
  name?: string;
  title?: string;
  scheme_name?: string;
  desc?: string;
  description?: string;
  details?: string;
  link?: string;
  url?: string;
  category?: string;
};

type SchemeResponse = {
  status: string;
  count: number;
  data: SchemeItem[];
};

const fallbackSchemes: SchemeItem[] = [
  { name: "PM-KISAN", desc: "Direct income support of ₹6,000/year for farmer families.", link: "#" },
  { name: "Fasal Bima Yojana", desc: "Comprehensive crop insurance against natural calamities.", link: "#" },
  { name: "Soil Health Card", desc: "Free soil testing and nutrient recommendations for every farmer.", link: "#" },
  { name: "Kisan Credit Card", desc: "Affordable credit for crop production and allied activities.", link: "#" },
  { name: "eNAM", desc: "Online trading of agricultural commodities across India.", link: "#" },
  { name: "RKVY", desc: "Rashtriya Krishi Vikas Yojana for holistic agriculture development.", link: "#" },
];

export default function Schemes() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [schemes, setSchemes] = useState<SchemeItem[]>([]);

  useEffect(() => {
    const loadSchemes = async () => {
      try {
        const response = await requestJson<SchemeResponse>("/api/v1/schemes");
        setSchemes(response.data ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch schemes");
      } finally {
        setLoading(false);
      }
    };

    void loadSchemes();
  }, []);

  const visibleSchemes = useMemo(
    () => (schemes.length ? schemes : fallbackSchemes).slice(0, 12),
    [schemes],
  );

  return (
    <PageLayout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Government Support</span>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mt-3">Farmer Schemes</h1>
            <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
              Discover government schemes designed to support and empower Indian farmers.
            </p>
          </motion.div>

          {loading && <p className="text-center text-muted-foreground mb-6">Loading live schemes...</p>}
          {error && <p className="text-center text-accent mb-6">{error}. Showing curated schemes.</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {visibleSchemes.map((s, i) => {
              const name = s.name || s.title || s.scheme_name || "Agriculture Scheme";
              const description = s.desc || s.description || s.details || "Explore this scheme for agriculture support.";
              const link = s.link || s.url || "#";
              return (
              <motion.div
                key={`${name}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-6 hover-lift"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <BadgeIndianRupee className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="text-lg font-display font-semibold text-foreground mb-2">{name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{description}</p>
                <a href={link} target={link !== "#" ? "_blank" : undefined} rel="noreferrer">
                  <Button variant="ghost" size="sm" className="gap-2 p-0 text-primary hover:bg-transparent">
                    <FileText className="w-4 h-4" /> Learn More <ExternalLink className="w-3 h-3" />
                  </Button>
                </a>
              </motion.div>
            )})}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
