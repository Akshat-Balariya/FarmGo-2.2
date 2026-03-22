import { motion } from "framer-motion";
import { useRef, useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Camera, Upload, Search, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requestJson } from "@/lib/api";
import FormattedAiText from "@/components/FormattedAiText";

const steps = [
  { icon: Camera, title: "Capture", desc: "Take a photo of your affected plant leaf or fruit." },
  { icon: Upload, title: "Upload", desc: "Upload the image to our AI-powered analysis engine." },
  { icon: Search, title: "Detect", desc: "Our model identifies the disease with high accuracy." },
  { icon: FileCheck, title: "Treat", desc: "Get instant treatment recommendations and preventive measures." },
];

export default function DiseaseDetection() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileToBase64 = async (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = String(reader.result ?? "");
        const base64 = result.includes(",") ? result.split(",")[1] : "";
        resolve(base64);
      };
      reader.onerror = () => reject(new Error("Failed to read image file."));
      reader.readAsDataURL(file);
    });

  const analyzeDisease = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);

    try {
      const image = await fileToBase64(selectedFile);
      const response = await requestJson<{ reply: string }>(
        "/api/chat",
        {
          method: "POST",
          body: JSON.stringify({
            message:
              "Diagnose this plant leaf image. Give complete disease analysis and treatment guidance.",
            image,
            imageMimeType: selectedFile.type || "image/jpeg",
          }),
        },
        "chat",
      );
      const analysisText =
        typeof response?.reply === "string" && response.reply.trim().length > 0
          ? response.reply
          : "No analysis returned.";
      setAnalysis(analysisText);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to run disease analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">AI Vision</span>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mt-3">Disease Detection</h1>
            <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
              Upload a photo of your plant and get instant AI-powered disease diagnosis and treatment advice.
            </p>
          </motion.div>

          {/* Upload Area */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="max-w-lg mx-auto mb-16">
            <div className="glass-card p-8 text-center border-2 border-dashed border-primary/30 rounded-2xl">
              <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-display font-semibold text-foreground mb-2">Upload Plant Image</h3>
              <p className="text-sm text-muted-foreground mb-4">Drag & drop or click to upload a photo of the affected plant</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
              />
              <div className="flex items-center justify-center gap-3">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => fileInputRef.current?.click()}>
                  Choose File
                </Button>
                <Button variant="outline" onClick={analyzeDisease} disabled={!selectedFile || loading}>
                  {loading ? "Analyzing..." : "Analyze"}
                </Button>
              </div>
              {selectedFile && (
                <p className="text-xs text-muted-foreground mt-3">Selected: {selectedFile.name}</p>
              )}
              {error && <p className="text-sm text-accent mt-3">{error}</p>}
            </div>
          </motion.div>

          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-5xl mx-auto glass-card p-6 md:p-8 mb-12 border border-border/60 bg-card/95 shadow-sm"
            >
              <h3 className="text-2xl font-display font-semibold text-foreground mb-4">AI Analysis</h3>
              <FormattedAiText text={analysis} />
            </motion.div>
          )}

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {steps.map((s, i) => (
              <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }} className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <s.icon className="w-6 h-6 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground mb-1">Step {i + 1}</p>
                <h4 className="font-display font-semibold text-foreground">{s.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
