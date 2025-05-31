
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';

interface CaseCardProps {
  id: string;
  title: string;
  imgSrc: string;
  aiHint?: string;
  onClick: () => void;
  category: string;
}

export function CaseCard({ title, imgSrc, aiHint, onClick, category }: CaseCardProps) {
  return (
    <Card
      className="overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer rounded-lg w-full bg-card text-card-foreground border border-border"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
    >
      <CardContent className="p-3 aspect-[360/220] relative">
        <Image
          src={imgSrc}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="rounded-md"
          data-ai-hint={aiHint}
        />
      </CardContent>
      <CardFooter className="p-4 pt-3 flex flex-col items-start">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">{category}</p>
        <CardTitle className="text-lg font-semibold text-foreground mt-1">{title}</CardTitle>
      </CardFooter>
    </Card>
  );
}
