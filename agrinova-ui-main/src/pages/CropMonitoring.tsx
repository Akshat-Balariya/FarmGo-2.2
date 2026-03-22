import { motion } from "framer-motion";
import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Sprout, CloudSun, Bug, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requestJson } from "@/lib/api";

const features = [
  { icon: Sprout, title: "Crop Recommendation", desc: "AI suggests optimal crops based on soil type, climate, and market demand." },
  { icon: CloudSun, title: "Weather Integration", desc: "Real-time weather data and forecasts tailored to your specific location." },
  { icon: Bug, title: "Pest Alerts", desc: "Early warning system for pest outbreaks based on regional data patterns." },
  { icon: Droplets, title: "Irrigation Planning", desc: "Smart water management recommendations to optimize resource usage." },
];

export default function CropMonitoring() {
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weather, setWeather] = useState<{
    location: string;
    temperature: number | null;
    humidity: number | null;
    rainfall: number | null;
    wind_speed: number | null;
    weather_condition: string | null;
  } | null>(null);

  const fetchWeather = async () => {
    if (!location.trim() || loading) return;
    setLoading(true);
    setError(null);

    try {
      const response = await requestJson<{
        status: string;
        data: {
          location: string;
          temperature: number | null;
          humidity: number | null;
          rainfall: number | null;
          wind_speed: number | null;
          weather_condition: string | null;
        };
      }>(`/api/v1/current?location=${encodeURIComponent(location.trim())}`);
      setWeather(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch weather data");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Smart Farming</span>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mt-3">Crop Monitoring</h1>
            <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
              AI-powered monitoring to track, predict, and optimize your crop cycle from seed to harvest.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-6 hover-lift">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-display font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto mt-10 glass-card p-6">
            <h3 className="text-xl font-display font-semibold text-foreground mb-4">Live Weather Lookup</h3>
            <div className="flex gap-3">
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter city or district (e.g. Coimbatore)"
                className="bg-card border-border"
              />
              <Button onClick={fetchWeather} disabled={loading}>
                {loading ? "Checking..." : "Check Weather"}
              </Button>
            </div>

            {error && <p className="text-sm text-accent mt-3">{error}</p>}
            {weather && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-5 text-sm">
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-muted-foreground">Location</p>
                  <p className="font-medium text-foreground">{weather.location}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-muted-foreground">Temperature</p>
                  <p className="font-medium text-foreground">{weather.temperature ?? "--"} C</p>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-muted-foreground">Humidity</p>
                  <p className="font-medium text-foreground">{weather.humidity ?? "--"}%</p>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-muted-foreground">Rainfall</p>
                  <p className="font-medium text-foreground">{weather.rainfall ?? "--"} mm</p>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-muted-foreground">Wind</p>
                  <p className="font-medium text-foreground">{weather.wind_speed ?? "--"} m/s</p>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-muted-foreground">Condition</p>
                  <p className="font-medium text-foreground">{weather.weather_condition || "--"}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
