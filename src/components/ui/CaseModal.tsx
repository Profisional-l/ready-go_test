"use client";

import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Case } from '@/types';

interface CaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseData: Case | null;
}

export function CaseModal({ isOpen, onClose, caseData }: CaseModalProps) {
  if (!caseData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] p-0 rounded-2xl">
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-video md:aspect-auto h-64 md:h-auto md:min-h-[600px]">
            <Image
              src={caseData.imgSrc}
              alt={caseData.title}
              layout="fill"
              objectFit="cover"
              className="rounded-l-2xl md:rounded-bl-2xl md:rounded-tr-none rounded-t-2xl"
              data-ai-hint={`${caseData.title} project image`}
            />
          </div>
          <div className="p-6 md:p-8 flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-2xl md:text-3xl font-bold mb-2">{caseData.title}</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mb-4">
                {caseData.category}
              </DialogDescription>
            </DialogHeader>
            <p className="flex-grow text-base text-foreground mb-6">{caseData.fullDescription}</p>
            <DialogFooter>
              <Button onClick={onClose} variant="outline" className="w-full md:w-auto">Закрыть</Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
