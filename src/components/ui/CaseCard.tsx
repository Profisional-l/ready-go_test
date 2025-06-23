'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import type { MediaItem } from '@/types';
import { Film } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface CaseCardProps {
  id: string;
  title: string;
  media: MediaItem[];
  onClick: () => void;
  category: string;
  type: 'modal' | 'link';
  externalUrl?: string;
}

export function CaseCard({
  title,
  media,
  onClick,
  category,
  type,
  externalUrl,
}: CaseCardProps) {
  const cover = media.length > 0 ? media[0] : null;
  const second = media.length > 1 ? media[1] : null;

  const [isHovered, setIsHovered] = useState(false);

  // Определяем, можно ли менять изображение при hover
  const isHoverSwitchable =
    cover?.type === 'image' && second?.type === 'image';

  const cardInnerContent = (
    <>
<CardContent
  className="p-0 aspect-square md:aspect-[280/220] relative md:mt-8"
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
>
  {cover ? (
    cover.type === 'image' ? (
      // 👇 Обертываем картинки в анимируемый контейнер
      <div
        className={cn(
          'relative w-full h-full overflow-hidden transition-all duration-500 ease-in-out',
          isHovered ? 'rounded-[50px]' : 'rounded-md'
        )}
      >
        <Image
          src={cover.url}
          alt={title}
          fill
          className={cn(
            'absolute object-cover transition-opacity duration-500 ease-in-out',
            isHovered && isHoverSwitchable ? 'opacity-0' : 'opacity-100'
          )}
        />
        {isHoverSwitchable && (
          <Image
            src={second!.url}
            alt={`${title} (hover)`}
            fill
            className={cn(
              'absolute object-cover transition-opacity duration-500 ease-in-out',
              isHovered ? 'opacity-100' : 'opacity-0'
            )}
          />
        )}
      </div>
    ) : (
      // если видео
      <div className="w-full h-full flex items-center justify-center bg-muted transition-all duration-300 ease-in-out rounded-md group-hover:rounded-[50px]">
        <Film className="h-12 w-12 text-muted-foreground" />
      </div>
    )
  ) : (
    <div className="w-full h-full bg-muted transition-all duration-300 ease-in-out rounded-md group-hover:rounded-[50px]" />
  )}
</CardContent>


      <CardFooter className="p-0 pt-3">
        <div
          className={cn(
            'flex items-center -ml-4 transition-all duration-300',
            type === 'link' && 'group-hover:ml-0'
          )}
        >
          <Image
            src="/images/Line 5.png"
            alt="arrow"
            width={15}
            height={15}
            className={cn(
              'opacity-0 transition-opacity duration-300 mr-1',
              type === 'link' && 'group-hover:opacity-100'
            )}
          />
          <CardTitle className="text-[18px] md:text-[24px] tight-spacing-2 font-inter font-medium tracking-normal text-foreground">
            {title} — {category}
          </CardTitle>
        </div>
      </CardFooter>
    </>
  );

  if (type === 'link' && externalUrl) {
    return (
      <Link
        href={externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="no-underline group caseCard block"
      >
        <Card className="overflow-hidden transition-all duration-300 rounded-lg w-full bg-[#F1F0F0] md:bg-background text-card-foreground border-0 h-full">
          {cardInnerContent}
        </Card>
      </Link>
    );
  }

  return (
    <Card
      className="group overflow-hidden transition-all duration-300 cursor-pointer rounded-lg w-full bg-[#F1F0F0] md:bg-background text-card-foreground border-0 caseCard h-full"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
    >
      {cardInnerContent}
    </Card>
  );
}
