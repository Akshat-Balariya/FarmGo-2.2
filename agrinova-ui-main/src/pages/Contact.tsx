import { motion } from "framer-motion";
import PageLayout from "@/components/PageLayout";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Contact() {
  return (
    <PageLayout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Get in Touch</span>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mt-3">Contact Us</h1>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-2xl font-display font-semibold text-foreground mb-6">Send a Message</h2>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="First Name" className="bg-card border-border" />
                  <Input placeholder="Last Name" className="bg-card border-border" />
                </div>
                <Input placeholder="Email" type="email" className="bg-card border-border" />
                <Input placeholder="Subject" className="bg-card border-border" />
                <Textarea placeholder="Your message..." rows={5} className="bg-card border-border" />
                <Button className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Send className="w-4 h-4" /> Send Message
                </Button>
              </form>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <h2 className="text-2xl font-display font-semibold text-foreground mb-6">Contact Info</h2>
              {[
                { icon: Mail, label: "Email", value: "support@agritech.in" },
                { icon: Phone, label: "Phone", value: "+91 800 123 4567" },
                { icon: MapPin, label: "Address", value: "FarmGo HQ, New Delhi, India" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="text-foreground font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
