import Image from 'next/image';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const galleryImages = [
  { id: '1', src: 'https://placehold.co/160x240.png', alt: 'YANA Figure', aiHint: "toy packaging female" },
  { id: '2', src: 'https://placehold.co/160x240.png', alt: 'Team Member Outdoor', aiHint: "person fashion outdoor" },
  { id: '3', src: 'https://placehold.co/160x240.png', alt: 'Team Group Photo', aiHint: "team photo group" },
  { id: '4', src: 'https://placehold.co/160x240.png', alt: 'MAX Figure', aiHint: "toy packaging male" },
  { id: '5', src: 'https://placehold.co/160x240.png', alt: 'Office Life Fun', aiHint: "office life fun" },
];

export function PhotoGallery() {
  return (
    <section className="py-16 md:py-24">
      <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-8 md:mb-12 text-center">НАША ЖИЗНЬ</h2>
      <ScrollArea className="w-full whitespace-nowrap rounded-md">
        <div className="flex w-max space-x-4 p-4">
          {galleryImages.map((image) => (
            <div key={image.id} className="overflow-hidden rounded-xl shadow-md shrink-0">
              <Image
                src={image.src}
                alt={image.alt}
                width={160}
                height={240}
                className="object-cover w-[160px] h-[240px]"
                data-ai-hint={image.aiHint}
              />
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}
