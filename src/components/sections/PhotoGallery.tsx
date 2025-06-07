
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
  { id: '1', src: '/images/slide-1.png', alt: 'YANA Figure', aiHint: "toy packaging female", width: 530, height: 353 },
  { id: '2', src: '/images/slide-2.png', alt: 'Team Member Outdoor', aiHint: "person fashion outdoor", width: 306, height: 460 },
  { id: '3', src: '/images/slide-25.png', alt: 'Team Group Photo', aiHint: "team photo group", width: 306, height: 460 },
  { id: '4', src: '/images/slide-3.png', alt: 'MAX Figure', aiHint: "toy packaging male", width: 350, height: 525 },
  { id: '5', src: '/images/slide-4.png', alt: 'Office Life Fun', aiHint: "office life fun", width: 307, height: 460 },
  { id: '6', src: '/images/slide-5.png', alt: 'Another Event', aiHint: "event concert light", width: 307, height: 460 },
  { id: '7', src: '/images/slide-6.png', alt: 'YANA Figure', aiHint: "toy packaging female", width: 300, height: 240 },
  { id: '8', src: '/images/slide-7.png', alt: 'Team Member Outdoor', aiHint: "person fashion outdoor", width: 307, height: 460 },
  { id: '9', src: '/images/slide-8.png', alt: 'Team Group Photo', aiHint: "team photo group", width: 307, height: 460 },
  { id: '10', src: '/images/slide-9.png', alt: 'MAX Figure', aiHint: "toy packaging male", width: 512, height: 400 },
  { id: '11', src: '/images/slide-10.png', alt: 'Office Life Fun', aiHint: "office life fun", width: 307, height: 460 },
  { id: '12', src: '/images/slide-11.png', alt: 'Another Event', aiHint: "event concert light", width: 307, height: 460 },
  { id: '13', src: '/images/slide-12.png', alt: 'Team Group Photo', aiHint: "team photo group", width: 374, height: 528 },
  { id: '14', src: '/images/slide-13.png', alt: 'MAX Figure', aiHint: "toy packaging male", width: 307, height: 460 },
  { id: '15', src: '/images/slide-14.png', alt: 'Office Life Fun', aiHint: "office life fun", width: 307, height: 460 },
  { id: '16', src: '/images/slide-15.png', alt: 'Another Event', aiHint: "event concert light", width: 576, height: 384 },
];

const duplicatedGalleryImages = [...galleryImagesData, ...galleryImagesData];

const GalleryImageItem = ({ image }: { image: GalleryImage }) => (
  <div
    className="shrink-0 overflow-hidden rounded-xl shadow-md mr-4 w-48 md:w-auto"
    style={{ height: 'auto' }} // Let height adjust based on aspect ratio and width
  >
    <Image
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      className="object-cover w-full h-full"
      data-ai-hint={image.aiHint} // Consider adjusting width for smaller screens
    />
  </div>
);

export function PhotoGallery() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        {/* The heading is commented out, but if uncommented, this is where mobile responsiveness should be applied */}
        {/* <h2 className="text-2xl md:text-4xl font-extrabold text-foreground mb-8 md:mb-12 text-center">
          НАША ЖИЗНЬ 
        </h2> */}
      </div>
      <div className="relative flex flex-nowrap overflow-x-hidden">
        <div className="animate-marquee-images flex-shrink-0 flex items-center" style={{ gap: '1rem' }}> {/* Added gap for spacing */}
          {duplicatedGalleryImages.map((image, index) => (
            <GalleryImageItem key={`track1-${image.id}-${index}`} image={image} />
          ))}
        </div>
      </div>
    </section>
  );
}
