export interface Case {
  id: string;
  title: string;
  category: string;
  imageUrls: string[]; // Changed from imgSrc, removed aiHint
  description: string; // Short description for card
  fullDescription: string; // Detailed description for modal
  tags: string[]; // Added for modal
}
