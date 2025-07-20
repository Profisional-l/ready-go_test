
export interface MediaItem {
  type: 'image' | 'video';
  url: string;
}

export interface Case {
  id: string;
  title: string;
  category: string;
  coverUrl: string; 
  hoverImageUrl?: string; 
  media: MediaItem[]; 
  type: 'modal' | 'link';

  // Fields for 'modal' type
  description?: string;
  fullDescription?: string;
  tags?: string[];

  // Fields for 'link' type
  externalUrl?: string;
}
