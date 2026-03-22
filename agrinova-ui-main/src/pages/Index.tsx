import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import ServicesHighlight from "@/components/ServicesHighlight";
import MarketPricesSection from "@/components/MarketPricesSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <ServicesHighlight />
        <MarketPricesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
