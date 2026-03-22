import { motion } from "framer-motion";
import PageLayout from "@/components/PageLayout";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const posts = [
  { title: "How AI is Transforming Crop Disease Detection", date: "Feb 10, 2026", readTime: "5 min", category: "AI & ML" },
  { title: "Top 5 Government Schemes Every Farmer Should Know", date: "Feb 8, 2026", readTime: "4 min", category: "Schemes" },
  { title: "Maximizing Yield with Smart Irrigation Techniques", date: "Feb 5, 2026", readTime: "6 min", category: "Farming" },
  { title: "Understanding Market Prices: A Farmer's Guide", date: "Feb 3, 2026", readTime: "3 min", category: "Market" },
  { title: "Organic Farming: Myths vs Reality", date: "Jan 28, 2026", readTime: "7 min", category: "Sustainability" },
  { title: "The Future of Precision Agriculture in India", date: "Jan 25, 2026", readTime: "5 min", category: "Technology" },
];

export default function Blog() {
  return (
    <PageLayout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Blog</span>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mt-3">Ag News & Insights</h1>
            <p className="text-lg text-muted-foreground mt-4">Latest articles on agriculture, technology, and sustainability.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {posts.map((post, i) => (
              <motion.article
                key={post.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-card overflow-hidden hover-lift group cursor-pointer"
              >
                <div className="h-40 bg-gradient-to-br from-primary/20 to-leaf/20 flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">{post.category}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-display font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-4 text-sm text-primary font-medium">
                    Read More <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
