
"use client";

import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Case } from '@/types';

interface CaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseData: Case | null;
}

export function CaseModal({ isOpen, onClose, caseData }: CaseModalProps) {
  if (!caseData) return null;

  const generateImageGrid = () => {
    if (!caseData.imageUrls || caseData.imageUrls.length === 0) {
      return null;
    }

    const images = caseData.imageUrls;
    const gridElements: JSX.Element[] = [];
    let imageIndex = 0;

    while (imageIndex < images.length) {
      // 1. Первая картинка в паттерне 1-2-1 (полная ширина)
      if (imageIndex < images.length) {
        gridElements.push(
          <div key={`img-row-${imageIndex}`} className="grid grid-cols-1 gap-4 mb-4">
            <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden shadow-md">
              <Image
                src={images[imageIndex]}
                alt={`${caseData.title} - Image ${imageIndex + 1}`}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
                data-ai-hint={`${caseData.title.substring(0, 20)} project image`}
              />
            </div>
          </div>
        );
        imageIndex++;
      } else {
        break;
      }

      // 2. Следующие две картинки в паттерне 1-2-1 (две колонки)
      if (imageIndex < images.length) {
        const pairImages: JSX.Element[] = [];

        pairImages.push(
          <div key={`img-pair-${imageIndex}`} className="relative w-full aspect-[16/10] rounded-lg overflow-hidden shadow-md">
            <Image
              src={images[imageIndex]}
              alt={`${caseData.title} - Image ${imageIndex + 1}`}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
              data-ai-hint={`${caseData.title.substring(0, 20)} project image`}
            />
          </div>
        );
        imageIndex++;

        if (imageIndex < images.length) {
          pairImages.push(
            <div key={`img-pair-${imageIndex}`} className="relative w-full aspect-[16/10] rounded-lg overflow-hidden shadow-md">
              <Image
                src={images[imageIndex]}
                alt={`${caseData.title} - Image ${imageIndex + 1}`}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
                data-ai-hint={`${caseData.title.substring(0, 20)} project image`}
              />
            </div>
          );
          imageIndex++;
        }

        gridElements.push(
          <div key={`pair-container-${imageIndex - pairImages.length}`} className={`grid grid-cols-1 ${pairImages.length > 1 ? 'sm:grid-cols-2' : ''} gap-4 mb-4`}>
            {pairImages}
          </div>
        );
      } else {
        break;
      }

      // 3. Последняя картинка в паттерне 1-2-1 (полная ширина)
      if (imageIndex < images.length) {
        gridElements.push(
          <div key={`img-row-${imageIndex}`} className="grid grid-cols-1 gap-4 mb-4">
            <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden shadow-md">
              <Image
                src={images[imageIndex]}
                alt={`${caseData.title} - Image ${imageIndex + 1}`}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
                data-ai-hint={`${caseData.title.substring(0, 20)} project image`}
              />
            </div>
          </div>
        );
        imageIndex++;
      } else {
        break;
      }
    }

    return <div className="mt-6">{gridElements}</div>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95%] max-h-[90vh] flex flex-col p-0 rounded-lg">
        <ScrollArea className="flex-grow overflow-y-auto">
          <div className="p-6 md:p-8">
            <DialogHeader>
              <DialogTitle className="text-[90px] font-mycustom">{caseData.title}</DialogTitle>
            </DialogHeader>
            <p className="text-[20px] font-medium text-center text-foreground mb-4">{caseData.fullDescription}</p>
            {caseData.tags && caseData.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {caseData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-[#5D5D5D] text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {generateImageGrid()}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
