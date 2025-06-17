import Image from 'next/image';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';

interface CaseCardProps {
  id: string;
  title: string;
  imageUrls: string[];
  onClick: () => void;
  category: string;
}

export function CaseCard({ title, imageUrls, onClick, category }: CaseCardProps) {
  const displayImage = imageUrls && imageUrls.length > 0 ? imageUrls[0] : 'https://placehold.co/360x220.png';

  return (
    <Card
      className="group overflow-hidden transition-all duration-300 cursor-pointer rounded-lg w-full bg-[#F1F0F0 ] md:bg-background text-card-foreground border-0"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
    >
      <CardContent className="p-3 aspect-[280/220] relative">
        <Image
          src={displayImage}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="rounded-md group-hover:rounded-[50px] transition-all duration-300 ease-in-out"
        />
      </CardContent>
      <CardFooter className="p-0 pt-3">
        <div className="flex items-center -ml-4 group-hover:ml-0 transition-all duration-300">
          <Image
            src="/images/Line 5.png"
            alt="arrow"
            width={15}
            height={15}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mr-1"
          />
          <CardTitle className="text-lg font-inter font-medium tracking-normal text-foreground">
            {title} — {category}
          </CardTitle>
        </div>
      </CardFooter>
    </Card>
  );
}