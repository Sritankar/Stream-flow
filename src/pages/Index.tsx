import { useState, useMemo, useCallback } from "react";
import { categories, getVideosByCategory, videos as defaultVideos, type Video } from "@/data/videos";
import VideoCard from "@/components/VideoCard";
import AddVideoDialog from "@/components/AddVideoDialog";
import { Search, X } from "lucide-react";

export default function Index() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [extraVideos, setExtraVideos] = useState<Video[]>([]);

  const handleAddVideo = useCallback((video: Video) => {
    setExtraVideos((prev) => [video, ...prev]);
  }, []);

  const filtered = useMemo(() => {
    const allVideos = [...extraVideos, ...getVideosByCategory(activeCategory)];
    const byCategory = activeCategory === "All" ? allVideos : allVideos.filter((v) => v.category === activeCategory);
    if (!query.trim()) return byCategory;
    const q = query.toLowerCase();
    return byCategory.filter(
      (v) => v.title.toLowerCase().includes(q) || v.creator.toLowerCase().includes(q)
    );
  }, [activeCategory, query, extraVideos]);

  const grouped = activeCategory === "All"
    ? categories.filter((c) => c !== "All").map((cat) => ({
        category: cat,
        videos: filtered.filter((v) => v.category === cat),
      })).filter((g) => g.videos.length > 0)
    : [{ category: activeCategory, videos: filtered }];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            <span className="text-primary">▶</span> VidFlow
          </h1>
          <AddVideoDialog onAdd={handleAddVideo} />
        </div>

        {/* Search bar */}
        <div className="px-4 pb-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search videos or creators…"
              className="w-full h-9 pl-9 pr-8 rounded-full bg-secondary text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition-shadow"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Video feed */}
      <main className="max-w-2xl mx-auto">
        {grouped.map((group) => (
          <section key={group.category} className="px-4 pt-5">
            {activeCategory === "All" && (
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {group.category}
              </h2>
            )}
            <div className="grid gap-5">
              {group.videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
