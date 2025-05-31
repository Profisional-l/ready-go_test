import Image from 'next/image';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const galleryImages = [
  { id: '1', src: 'https://placehold.co/160x240.png?bg=FFC0CB&text=Team1', alt: 'Team Photo 1', aiHint: "team working office" },
  { id: '2', src: 'https://placehold.co/160x240.png?bg=ADD8E6&text=Event1', alt: 'Event Photo 1', aiHint: "corporate event presentation" },
  { id: '3', src: 'https://placehold.co/160x240.png?bg=90EE90&text=Office1', alt: 'Office Photo 1', aiHint: "modern office interior" },
  { id: '4', src: 'https://placehold.co/160x240.png?bg=FFFFE0&text=Team2', alt: 'Team Photo 2', aiHint: "creative brainstorming session" },
  { id: '5', src: 'https://placehold.co/160x240.png?bg=DDA0DD&text=Fun1', alt: 'Fun Activity 1', aiHint: "team building activity" },
];

export function PhotoGallery() {
  return (
    <section className="py-16 md:py-24">
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 md:mb-12 text-center">НАША ЖИЗНЬ</h2>
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
