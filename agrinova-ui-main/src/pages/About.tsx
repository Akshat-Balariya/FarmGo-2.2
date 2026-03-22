import { motion } from "framer-motion";
import PageLayout from "@/components/PageLayout";
import { Target, Users, Lightbulb, Globe } from "lucide-react";

const values = [
  { icon: Target, title: "Mission-Driven", desc: "Empowering 140M+ Indian farmers with accessible, AI-driven tools for smarter agriculture." },
  { icon: Users, title: "Community First", desc: "Building bridges between farmers, buyers, suppliers, and agronomists across India." },
  { icon: Lightbulb, title: "Innovation", desc: "Leveraging machine learning, computer vision, and IoT to solve real farming challenges." },
  { icon: Globe, title: "Sustainability", desc: "Promoting sustainable practices that protect soil health and reduce environmental impact." },
];

export default function About() {
  return (
    <PageLayout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">About Us</span>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mt-3">Revolutionizing Agriculture</h1>
            <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
              FarmGo is an AI-powered platform that connects every stakeholder in India's agricultural value chain, from seed to shelf.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <v.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-display font-semibold text-foreground mb-2">{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
