import { motion } from "framer-motion";
import PageLayout from "@/components/PageLayout";
import { BarChart3, TrendingUp, MapPin, Calendar } from "lucide-react";

export default function YieldPrediction() {
  return (
    <PageLayout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Analytics</span>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mt-3">Yield Prediction</h1>
            <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
              Machine learning models predict crop yield with 95% accuracy based on historical data and real-time conditions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { icon: BarChart3, title: "Historical Analysis", desc: "Analyze 10+ years of yield data for pattern recognition." },
              { icon: TrendingUp, title: "Predictive Models", desc: "Multiple ML models trained on regional crop performance data." },
              { icon: MapPin, title: "Location-Aware", desc: "Predictions adjusted for local soil, climate, and water conditions." },
              { icon: Calendar, title: "Seasonal Forecasts", desc: "Plan ahead with season-wise yield projections and market timing." },
            ].map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-6 hover-lift">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-display font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
