import { Link } from "react-router-dom";
import { Sprout, Mail, Phone, MapPin } from "lucide-react";

const links = {
  Platform: [
    { title: "Crop Monitoring", href: "/crop-monitoring" },
    { title: "Disease Detection", href: "/disease-detection" },
    { title: "Yield Prediction", href: "/yield-prediction" },
    { title: "Marketplace", href: "/marketplace" },
  ],
  Company: [
    { title: "About", href: "/about" },
    { title: "Blog", href: "/blog" },
    { title: "Schemes", href: "/schemes" },
    { title: "Contact", href: "/contact" },
  ],
  Support: [
    { title: "FAQ", href: "/faq" },
    { title: "AI Assistant", href: "/chat" },
    { title: "Financial Support", href: "/financial-support" },
    { title: "Terms of Service", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <Sprout className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold">FarmGo</span>
            </Link>
            <p className="text-primary-foreground/60 text-sm leading-relaxed max-w-xs mb-6">
              AI-powered platform connecting farmers, buyers, and suppliers to revolutionize India's agriculture.
            </p>
            <div className="space-y-2 text-sm text-primary-foreground/60">
              <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> support@agritech.in</div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> +91 800 123 4567</div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> New Delhi, India</div>
            </div>
          </div>

          {/* Link Groups */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-primary-foreground/80">{group}</h4>
              <ul className="space-y-2.5">
                {items.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center text-sm text-primary-foreground/40">
          © {new Date().getFullYear()} FarmGo. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
