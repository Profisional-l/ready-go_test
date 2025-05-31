
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';

interface CaseCardProps {
  id: string;
  title: string;
  imageUrls: string[]; // Changed from imgSrc
  onClick: () => void;
  category: string;
}

export function CaseCard({ title, imageUrls, onClick, category }: CaseCardProps) {
  const displayImage = imageUrls && imageUrls.length > 0 ? imageUrls[0] : 'https://placehold.co/360x220.png';
  
  return (
    <Card
      className="group overflow-hidden transition-all duration-300 cursor-pointer rounded-lg w-full bg-card text-card-foreground border-0"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
    >
      <CardContent className="p-3 aspect-[360/220] relative">
        <Image
          src={displayImage}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="rounded-md group-hover:rounded-3xl transition-all duration-300 ease-in-out"
          // data-ai-hint can be added if a specific hint is needed for the card's primary image
        />
      </CardContent>
      <CardFooter className="p-4 pt-3 flex flex-col items-start">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">{category}</p>
        <CardTitle className="text-lg font-semibold text-foreground mt-1">{title}</CardTitle>
      </CardFooter>
    </Card>
  );
}
