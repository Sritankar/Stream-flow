import { useState } from "react";
import { categories, type Video } from "@/data/videos";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

const editableCategories = categories.filter((c) => c !== "All");

interface AddVideoDialogProps {
  onAdd: (video: Video) => void;
}

export default function AddVideoDialog({ onAdd }: AddVideoDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [creator, setCreator] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>(editableCategories[0]);
  const [duration, setDuration] = useState("");
  const [error, setError] = useState("");

  const reset = () => {
    setTitle(""); setVideoUrl(""); setThumbnail(""); setCreator("");
    setDescription(""); setCategory(editableCategories[0]); setDuration(""); setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !videoUrl.trim()) {
      setError("Title and Video URL are required.");
      return;
    }
    const newVideo: Video = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim() || title.trim(),
      category,
      duration: parseInt(duration) || 0,
      thumbnail: thumbnail.trim() || "/placeholder.svg",
      videoUrl: videoUrl.trim(),
      creator: creator.trim() || "Unknown",
      views: "0",
      uploadedAt: "Just now",
    };
    onAdd(newVideo);
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>
        <Button size="sm" className="rounded-full gap-1.5">
          <Plus size={16} /> Add Video
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Video</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Title *</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Video title" maxLength={120} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Video URL *</label>
            <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://example.com/video.mp4" maxLength={500} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Thumbnail URL</label>
            <Input value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} placeholder="https://example.com/thumb.jpg" maxLength={500} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Creator</label>
            <Input value={creator} onChange={(e) => setCreator(e.target.value)} placeholder="Creator name" maxLength={80} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" maxLength={200} />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                {editableCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="w-28">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Duration (sec)</label>
              <Input type="number" min={0} value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="0" />
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full">Add Video</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
