import { motion } from "framer-motion";
import { Sprout, ShoppingCart, Tractor, Store, Stethoscope, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Sprout,
    title: "Farmers",
    description: "Real-time crop monitoring, weather alerts, and direct-market access for fair prices.",
    href: "/crop-monitoring",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: ShoppingCart,
    title: "Buyers & Retailers",
    description: "Source verified produce directly, schedule deliveries, and manage bulk orders.",
    href: "/marketplace",
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    icon: Tractor,
    title: "Equipment Suppliers",
    description: "List equipment, offer rentals, and connect with nearby farmers for modern machinery.",
    href: "/marketplace",
    color: "text-earth",
    bg: "bg-earth/10",
  },
  {
    icon: Store,
    title: "Grocery Sellers",
    description: "Integrate reliable suppliers into your supply chain with consistent quality produce.",
    href: "/marketplace",
    color: "text-leaf",
    bg: "bg-leaf/10",
  },
  {
    icon: Stethoscope,
    title: "Agronomists & Advisors",
    description: "Share expertise, provide remote diagnostics, and recommend data-driven treatments.",
    href: "/chat",
    color: "text-sky",
    bg: "bg-sky/10",
  },
  {
    icon: Wallet,
    title: "Finance & Insurance",
    description: "Access loan options, crop insurance, and financial tools for seasonal cashflows.",
    href: "/financial-support",
    color: "text-accent",
    bg: "bg-accent/10",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Platform Benefits</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mt-3">
            Built for Every Stakeholder
          </h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            Tailored tools and services for every participant in the agricultural value chain.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((f) => (
            <motion.div key={f.title} variants={item}>
              <Link
                to={f.href}
                className="group block glass-card p-6 hover-lift h-full"
              >
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="text-xl font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {f.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
