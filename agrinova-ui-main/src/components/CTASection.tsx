import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-foreground/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-6">
            Ready to Transform Your Farming?
          </h2>
          <p className="text-lg text-primary-foreground/70 mb-8 max-w-lg mx-auto">
            Join thousands of farmers, buyers, and suppliers already using FarmGo to grow smarter.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/crop-monitoring">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2 text-base px-8">
                Start Now <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/chat">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-base px-8">
                Talk to AI Assistant
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
