export interface MediaItem {
  type: 'image' | 'video';
  url: string;
}

export interface Case {
  id: string;
  title: string;
  category: string;
  media: MediaItem[]; // Replaces imageUrls and videoUrl
  description: string; // Short description for card
  fullDescription: string; // Detailed description for modal
  tags: string[];
}
