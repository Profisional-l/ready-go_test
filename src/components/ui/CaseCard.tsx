import Image from 'next/image';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';

interface CaseCardProps {
  id: string;
  title: string;
  imgSrc: string;
  onClick: () => void;
  category: string;
}

export function CaseCard({ title, imgSrc, onClick, category }: CaseCardProps) {
  return (
    <Card
      className="overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer rounded-lg w-full"
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
        />
      </CardContent>
      <CardFooter className="p-3 pt-2 flex flex-col items-start">
        <p className="text-xs text-muted-foreground">{category}</p>
        <CardTitle className="text-md font-semibold text-foreground">{title}</CardTitle>
      </CardFooter>
    </Card>
  );
}
