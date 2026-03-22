import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Sprout, Leaf, TrendingUp, ShoppingCart, Shield, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  { title: "Smart Crop Monitoring", href: "/crop-monitoring", icon: Sprout },
  { title: "Disease Detection", href: "/disease-detection", icon: Leaf },
  { title: "Yield Prediction", href: "/yield-prediction", icon: TrendingUp },
  { title: "Marketplace", href: "/marketplace", icon: ShoppingCart },
  { title: "Financial Support", href: "/financial-support", icon: Shield },
];

const navLinks = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
  { title: "Schemes", href: "/schemes" },
  { title: "Blog", href: "/blog" },
  { title: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Sprout className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-display font-bold text-foreground">FarmGo</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.title}
            </Link>
          ))}

          {/* Services Dropdown */}
          <div className="relative">
            <button
              onClick={() => setServicesOpen(!servicesOpen)}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              Services <ChevronDown className={`w-4 h-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {servicesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute top-full mt-2 right-0 w-64 glass-card p-2 shadow-xl"
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  {services.map((s) => (
                    <Link
                      key={s.href}
                      to={s.href}
                      onClick={() => setServicesOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <s.icon className="w-4 h-4 text-primary" />
                      {s.title}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/chat">
            <Button size="sm" className="ml-2 gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <MessageCircle className="w-4 h-4" /> AI Assistant
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-background border-b border-border"
          >
            <div className="p-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive(link.href) ? "bg-primary/10 text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.title}
                </Link>
              ))}
              <div className="pt-2 border-t border-border">
                <p className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Services</p>
                {services.map((s) => (
                  <Link
                    key={s.href}
                    to={s.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground"
                  >
                    <s.icon className="w-4 h-4 text-primary" />
                    {s.title}
                  </Link>
                ))}
              </div>
              <Link to="/chat" onClick={() => setMobileOpen(false)}>
                <Button className="w-full mt-2 gap-2 bg-primary text-primary-foreground">
                  <MessageCircle className="w-4 h-4" /> AI Assistant
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
