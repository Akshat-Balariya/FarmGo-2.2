import { motion } from "framer-motion";
import PageLayout from "@/components/PageLayout";
import { Wallet, CreditCard, Shield, PiggyBank } from "lucide-react";

export default function FinancialSupport() {
  return (
    <PageLayout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Financial Tools</span>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mt-3">Financial Support</h1>
            <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
              Access loans, crop insurance, and financial tools designed for agricultural cashflows.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { icon: CreditCard, title: "Kisan Credit Card", desc: "Get affordable credit for crop production and farm equipment." },
              { icon: Shield, title: "Crop Insurance", desc: "Protect your harvest against natural calamities and price drops." },
              { icon: PiggyBank, title: "Savings Plans", desc: "Agricultural savings schemes with competitive interest rates." },
              { icon: Wallet, title: "Expense Tracking", desc: "Track farm expenses, revenues, and profitability in real-time." },
            ].map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-6 hover-lift">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-secondary" />
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
