export interface Case {
  id: string;
  title: string;
  category: string;
  imgSrc: string;
  description: string; // Short description for card (not used in current card design)
  fullDescription: string; // Detailed description for modal
  aiHint?: string;
}
