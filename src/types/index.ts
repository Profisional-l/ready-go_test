export interface MediaItem {
  type: 'image' | 'video';
  url: string;
}

export interface Case {
  id: string;
  title: string;
  category: string;
  coverUrl: string; // Обложка кейса
  hoverImageUrl?: string; // Изображение для ховера
  media: MediaItem[]; // Медиа для модального окна
  type: 'modal' | 'link';

  // Optional fields
  description?: string;
  fullDescription?: string;
  tags?: string[];
  externalUrl?: string;
}
