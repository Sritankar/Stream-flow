export interface Video {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number; // seconds
  thumbnail: string;
  videoUrl: string;
  creator: string;
  views: string;
  uploadedAt: string;
}

export const categories = ["All", "Nature", "Technology", "Music", "Travel", "Education"] as const;

let nextId = 13;

export const videos: Video[] = [
  {
    id: "1",
    title: "Big Buck Bunny",
    description: "A large and lovable bunny deals with three tiny bullies.",
    category: "Nature",
    duration: 596,
    thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/800px-Big_buck_bunny_poster_big.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    creator: "Blender Foundation",
    views: "12M",
    uploadedAt: "3 years ago",
  },
  {
    id: "2",
    title: "Elephant Dream",
    description: "The world's first open movie made entirely with open-source tools.",
    category: "Technology",
    duration: 653,
    thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Elephants_Dream_s5_both.jpg/800px-Elephants_Dream_s5_both.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    creator: "Blender Foundation",
    views: "8.5M",
    uploadedAt: "5 years ago",
  },
  {
    id: "3",
    title: "For Bigger Blazes",
    description: "Experience the thrill of extreme fire effects.",
    category: "Technology",
    duration: 15,
    thumbnail: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    creator: "Google",
    views: "2.1M",
    uploadedAt: "1 year ago",
  },
  {
    id: "4",
    title: "For Bigger Escapes",
    description: "An adventure beyond imagination awaits.",
    category: "Travel",
    duration: 15,
    thumbnail: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    creator: "Google",
    views: "1.8M",
    uploadedAt: "2 years ago",
  },
  {
    id: "5",
    title: "For Bigger Fun",
    description: "A journey through fun and laughter.",
    category: "Music",
    duration: 60,
    thumbnail: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    creator: "Google",
    views: "3.4M",
    uploadedAt: "1 year ago",
  },
  {
    id: "6",
    title: "For Bigger Joyrides",
    description: "Take a ride into the world of excitement.",
    category: "Travel",
    duration: 15,
    thumbnail: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerJoyrides.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    creator: "Google",
    views: "900K",
    uploadedAt: "6 months ago",
  },
  {
    id: "7",
    title: "For Bigger Meltdowns",
    description: "When things get intense, stay cool.",
    category: "Education",
    duration: 15,
    thumbnail: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerMeltdowns.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    creator: "Google",
    views: "1.2M",
    uploadedAt: "8 months ago",
  },
  {
    id: "8",
    title: "Sintel",
    description: "A lonely young woman searches for her dragon companion.",
    category: "Nature",
    duration: 888,
    thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Sintel_poster.jpg/440px-Sintel_poster.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    creator: "Blender Foundation",
    views: "15M",
    uploadedAt: "4 years ago",
  },
  {
    id: "9",
    title: "Subaru Outback",
    description: "On the road with the all-new Subaru Outback.",
    category: "Travel",
    duration: 30,
    thumbnail: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/SubaruOutbackOnStreetAndDirt.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    creator: "Subaru",
    views: "500K",
    uploadedAt: "2 years ago",
  },
  {
    id: "10",
    title: "Tears of Steel",
    description: "In an apocalyptic future, a group of warriors fight to save humanity.",
    category: "Technology",
    duration: 734,
    thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Tears_of_Steel_Poster.jpg/440px-Tears_of_Steel_Poster.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    creator: "Blender Foundation",
    views: "6.7M",
    uploadedAt: "3 years ago",
  },
  {
    id: "11",
    title: "Volkswagen GTI Review",
    description: "A detailed look at the Volkswagen GTI performance.",
    category: "Education",
    duration: 26,
    thumbnail: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/VolkswagenGTIReview.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
    creator: "Auto Review",
    views: "780K",
    uploadedAt: "1 year ago",
  },
  {
    id: "12",
    title: "We Are Going On Bullrun",
    description: "The ultimate road trip adventure across America.",
    category: "Music",
    duration: 25,
    thumbnail: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/WeAreGoingOnBullrun.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    creator: "Bullrun",
    views: "1.5M",
    uploadedAt: "4 years ago",
  },
];

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function getVideosByCategory(category: string): Video[] {
  if (category === "All") return videos;
  return videos.filter((v) => v.category === category);
}

export function getRelatedVideos(video: Video): Video[] {
  return videos.filter((v) => v.category === video.category && v.id !== video.id);
}
