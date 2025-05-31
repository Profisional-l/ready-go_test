
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-7xl max-h-[90vh] flex flex-col p-0 rounded-lg">
        <ScrollArea className="flex-grow overflow-y-auto">
          <div className="p-6 md:p-8">
            <DialogHeader>
              <DialogTitle className="text-3xl md:text-4xl font-bold mb-2">{caseData.title}</DialogTitle>
            </DialogHeader>
            <p className="text-base text-foreground mb-4">{caseData.fullDescription}</p>
            {caseData.tags && caseData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {caseData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            
            {caseData.imageUrls && caseData.imageUrls.length > 0 && (
              <div className="mt-6 grid grid-cols-1 gap-4">
                {caseData.imageUrls.map((url, index) => (
                  <div key={index} className="relative w-full aspect-[16/10] rounded-lg overflow-hidden shadow-md">
                    <Image
                      src={url}
                      alt={`${caseData.title} - Image ${index + 1}`}
                      layout="fill"
                      objectFit="cover" 
                      className="rounded-lg"
                      data-ai-hint={`${caseData.title} project image ${index + 1}`} 
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
        {/* Close button is part of DialogContent by default (X icon) */}
      </DialogContent>
    </Dialog>
  );
}
