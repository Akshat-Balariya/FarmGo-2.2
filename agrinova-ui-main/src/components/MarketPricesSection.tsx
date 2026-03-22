import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
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

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === "up") return <TrendingUp className="w-4 h-4 text-primary" />;
  if (trend === "down") return <TrendingDown className="w-4 h-4 text-accent" />;
  return <Minus className="w-4 h-4 text-muted-foreground" />;
};

const fallbackCrops = [
  { crop_name: "Wheat", modal_price: 2300, min_price: 2100, max_price: 2500, district: "Pune", state: "MH", unit: "Quintal" },
  { crop_name: "Rice", modal_price: 3100, min_price: 2900, max_price: 3350, district: "Raipur", state: "CG", unit: "Quintal" },
  { crop_name: "Maize", modal_price: 1850, min_price: 1700, max_price: 1980, district: "Nashik", state: "MH", unit: "Quintal" },
  { crop_name: "Cotton", modal_price: 6400, min_price: 6100, max_price: 6800, district: "Nagpur", state: "MH", unit: "Quintal" },
  { crop_name: "Soybean", modal_price: 4200, min_price: 3900, max_price: 4500, district: "Indore", state: "MP", unit: "Quintal" },
  { crop_name: "Sugarcane", modal_price: 350, min_price: 320, max_price: 380, district: "Belagavi", state: "KA", unit: "Quintal" },
];

const formatINR = (value: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

export default function MarketPricesSection() {
  const [prices, setPrices] = useState<MarketPrice[]>([]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const result = await requestJson<MarketPriceResponse>("/api/v1/market/prices");
        setPrices(result.data ?? []);
      } catch {
        setPrices([]);
      }
    };

    void fetchPrices();
  }, []);

  const items = (prices.length ? prices : fallbackCrops).slice(0, 6);

  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Live Market</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mt-3">
            Crop Price Trends
          </h2>
          <p className="text-muted-foreground mt-4">Real-time prices per quintal from major mandis across India.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {items.map((crop, i) => {
            const range = Math.max(crop.max_price - crop.min_price, 0);
            const relativePosition = range > 0 ? (crop.modal_price - crop.min_price) / range : 0.5;
            const trend = relativePosition > 0.66 ? "up" : relativePosition < 0.33 ? "down" : "neutral";

            return (
            <motion.div
              key={`${crop.crop_name}-${crop.district}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-5 text-center hover-lift"
            >
              <p className="text-sm font-medium text-muted-foreground mb-1">{crop.crop_name}</p>
              <p className="text-2xl font-bold text-foreground">{formatINR(crop.modal_price)}</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <TrendIcon trend={trend} />
                <span className={`text-sm font-medium ${
                  trend === "up" ? "text-primary" : trend === "down" ? "text-accent" : "text-muted-foreground"
                }`}>
                  {formatINR(crop.min_price)}-{formatINR(crop.max_price)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{crop.district}, {crop.state}</p>
            </motion.div>
          )})}
        </motion.div>
      </div>
    </section>
  );
}
