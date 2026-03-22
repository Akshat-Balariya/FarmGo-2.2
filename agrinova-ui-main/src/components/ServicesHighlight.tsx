import { motion } from "framer-motion";
import { ArrowRight, Leaf, BarChart3, Camera } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Leaf,
    title: "Smart Crop Recommendation",
    description: "AI analyzes soil, climate, and market data to suggest the best crops for your land, maximizing yield and profitability.",
    href: "/crop-monitoring",
  },
  {
    icon: BarChart3,
    title: "Yield Prediction",
    description: "Machine learning models predict your crop yield with 95% accuracy based on historical data and current conditions.",
    href: "/yield-prediction",
  },
  {
    icon: Camera,
    title: "Disease Detection",
    description: "Upload a photo of your plant and our AI instantly identifies diseases and recommends treatments.",
    href: "/disease-detection",
  },
];

export default function ServicesHighlight() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">AI-Powered Services</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mt-3">
            Technology That Grows With You
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group relative overflow-hidden rounded-2xl bg-primary/5 border border-primary/10 p-8 hover-lift"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <s.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-display font-semibold text-foreground mb-3">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">{s.description}</p>
              <Link to={s.href}>
                <Button variant="ghost" className="gap-2 p-0 text-primary hover:text-primary/80 hover:bg-transparent">
                  Explore <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
