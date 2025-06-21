export interface Case {
  id: string;
  title: string;
  category: string;
  imageUrls: string[]; // Ordered list. imageUrls[0] is the cover.
  videoUrl?: string; // Optional video URL
  description: string; // Short description for card
  fullDescription: string; // Detailed description for modal
  tags: string[]; // Added for modal
}
