
import Image from 'next/image';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  aiHint: string;
  width: number;
  height: number;
}

const galleryImagesData: GalleryImage[] = [
  { id: '1', src: 'https://placehold.co/300x240.png', alt: 'YANA Figure', aiHint: "toy packaging female", width: 300, height: 240 },
  { id: '2', src: 'https://placehold.co/500x240.png', alt: 'Team Member Outdoor', aiHint: "person fashion outdoor", width: 500, height: 240 },
  { id: '3', src: 'https://placehold.co/300x240.png', alt: 'Team Group Photo', aiHint: "team photo group", width: 300, height: 240 },
  { id: '4', src: 'https://placehold.co/500x240.png', alt: 'MAX Figure', aiHint: "toy packaging male", width: 500, height: 240 },
  { id: '5', src: 'https://placehold.co/300x240.png', alt: 'Office Life Fun', aiHint: "office life fun", width: 300, height: 240 },
  { id: '6', src: 'https://placehold.co/500x240.png', alt: 'Another Event', aiHint: "event concert light", width: 500, height: 240 },
];

const duplicatedGalleryImages = [...galleryImagesData, ...galleryImagesData];

const GalleryImageItem = ({ image }: { image: GalleryImage }) => (
  <div
    className="shrink-0 overflow-hidden rounded-xl shadow-md mr-4"
    style={{ width: `${image.width}px`, height: `${image.height}px` }}
  >
    <Image
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      className="object-cover w-full h-full"
      data-ai-hint={image.aiHint}
    />
  </div>
);

export function PhotoGallery() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-[1440px] mx-auto px-8">
        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-8 md:mb-12 text-center">
          НАША ЖИЗНЬ
        </h2>
      </div>
      <div className="relative flex flex-nowrap overflow-x-hidden">
        <div className="animate-marquee-images flex-shrink-0 flex items-center">
          {duplicatedGalleryImages.map((image, index) => (
            <GalleryImageItem key={`track1-${image.id}-${index}`} image={image} />
          ))}
        </div>
        <div className="absolute top-0 left-0 animate-marquee2-images flex-shrink-0 flex items-center">
          {duplicatedGalleryImages.map((image, index) => (
            <GalleryImageItem key={`track2-${image.id}-${index}`} image={image} />
          ))}
        </div>
      </div>
    </section>
  );
}
