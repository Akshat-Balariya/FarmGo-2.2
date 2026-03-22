import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import PageLayout from "@/components/PageLayout";
import { ShoppingCart, Truck, Filter, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requestJson } from "@/lib/api";

type MarketPrice = {
  id: number;
  crop_name: string;
  district: string;
  state: string;
  modal_price: number;
  min_price: number;
  max_price: number;
  unit: string;
};

type MarketPriceResponse = {
  status: string;
  data: MarketPrice[];
};

const fallbackProducts: MarketPrice[] = [
  { id: 1, crop_name: "Organic Wheat", district: "Pune", state: "Maharashtra", modal_price: 2300, min_price: 2100, max_price: 2500, unit: "Quintal" },
  { id: 2, crop_name: "Basmati Rice", district: "Karnal", state: "Haryana", modal_price: 5200, min_price: 5000, max_price: 5600, unit: "Quintal" },
  { id: 3, crop_name: "Fresh Tomatoes", district: "Nashik", state: "Maharashtra", modal_price: 4000, min_price: 3500, max_price: 4600, unit: "Quintal" },
  { id: 4, crop_name: "Cotton", district: "Nagpur", state: "Maharashtra", modal_price: 6400, min_price: 6100, max_price: 7000, unit: "Quintal" },
  { id: 5, crop_name: "Soybean", district: "Indore", state: "Madhya Pradesh", modal_price: 4200, min_price: 3800, max_price: 4600, unit: "Quintal" },
  { id: 6, crop_name: "Sugarcane", district: "Belagavi", state: "Karnataka", modal_price: 350, min_price: 310, max_price: 410, unit: "Quintal" },
];

const formatINR = (value: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

export default function Marketplace() {
  const [search, setSearch] = useState("");
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const result = await requestJson<MarketPriceResponse>("/api/v1/market/prices");
        setPrices(result.data ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load market prices");
      } finally {
        setLoading(false);
      }
    };

    void fetchPrices();
  }, []);

  const products = useMemo(() => {
    const source = prices.length ? prices : fallbackProducts;
    if (!search.trim()) return source.slice(0, 24);
    const term = search.toLowerCase();
    return source.filter(
      (product) =>
        product.crop_name.toLowerCase().includes(term) ||
        product.district.toLowerCase().includes(term) ||
        product.state.toLowerCase().includes(term),
    );
  }, [prices, search]);

  return (
    <PageLayout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Trade</span>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mt-3">Marketplace</h1>
            <p className="text-lg text-muted-foreground mt-4">Buy and sell agricultural products directly.</p>
          </motion.div>

          {/* Search */}
          <div className="flex gap-3 max-w-xl mx-auto mb-12">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search crop or district..."
              className="bg-card border-border"
            />
            <Button disabled className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Filter className="w-4 h-4" /> Filter
            </Button>
          </div>

          {loading && <p className="text-center text-muted-foreground mb-4">Loading live market prices...</p>}
          {error && <p className="text-center text-accent mb-4">{error}. Showing fallback data.</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {products.map((p, i) => (
              <motion.div key={`${p.id}-${p.crop_name}-${i}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card overflow-hidden hover-lift">
                <div className="h-32 bg-gradient-to-br from-leaf/20 to-primary/20 flex items-center justify-center">
                  <ShoppingCart className="w-8 h-8 text-primary/40" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-display font-semibold text-foreground">{p.crop_name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {p.district}, {p.state}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-lg font-bold text-foreground">{formatINR(p.modal_price)}/{p.unit}</span>
                    <span className="text-sm text-muted-foreground">
                      {formatINR(p.min_price)}-{formatINR(p.max_price)}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                      Buy Now
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1">
                      <Truck className="w-3.5 h-3.5" /> Track
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
