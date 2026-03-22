import { useState } from "react";
import { motion } from "framer-motion";
import PageLayout from "@/components/PageLayout";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requestJson } from "@/lib/api";
import FormattedAiText from "@/components/FormattedAiText";

type Message = { role: "user" | "bot"; text: string };

const initialMessages: Message[] = [
  { role: "bot", text: "Hello! I'm your FarmGo AI Assistant. Ask me about crop recommendations, disease identification, weather forecasts, or farming best practices. How can I help you today?" },
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    const userMsg: Message = { role: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);

    try {
      const data = await requestJson<{ reply: string }>(
        "/api/chat",
        {
          method: "POST",
          body: JSON.stringify({ message: userMsg.text }),
        },
        "chat",
      );
      const botReply =
        typeof data?.reply === "string" && data.reply.trim().length > 0
          ? data.reply
          : "I could not generate a response right now.";
      setMessages((prev) => [...prev, { role: "bot", text: botReply }]);
    } catch (err) {
      const fallback =
        err instanceof Error
          ? err.message
          : "AI service is currently unavailable. Please try again after a moment.";
      setMessages((prev) => [...prev, { role: "bot", text: fallback }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <PageLayout>
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold text-foreground">AI Assistant</h1>
            <p className="text-muted-foreground mt-2">Ask anything about farming, crops, diseases, or weather.</p>
          </motion.div>

          <div className="glass-card p-4 min-h-[400px] flex flex-col">
            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto mb-4 max-h-[500px] p-2">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === "bot" ? "bg-primary/10" : "bg-secondary/10"
                  }`}>
                    {msg.role === "bot" ? <Bot className="w-4 h-4 text-primary" /> : <User className="w-4 h-4 text-secondary" />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                    msg.role === "bot"
                      ? "bg-muted text-foreground"
                      : "bg-primary text-primary-foreground"
                  }`}>
                    {msg.role === "bot" ? (
                      <FormattedAiText text={msg.text} compact />
                    ) : (
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2 pt-2 border-t border-border">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your question..."
                className="bg-background border-border"
                disabled={sending}
              />
              <Button onClick={handleSend} disabled={sending} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
