export interface MediaItem {
  type: 'image' | 'video';
  url: string;
}

export interface Case {
  id: string;
  title: string;
  category: string;
  media: MediaItem[];
  type: 'modal' | 'link';

  // Optional fields
  description?: string;
  fullDescription?: string;
  tags?: string[];
  externalUrl?: string;
}
