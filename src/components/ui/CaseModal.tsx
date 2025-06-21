
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

  const renderMediaGrid = () => {
    if (!caseData.media || caseData.media.length === 0) {
      return null;
    }

    return (
      <div className="mt-6">
        <div className="flex flex-wrap justify-center gap-2">
          {caseData.media.map((item, index) => (
            <div key={`media-${index}`} className="flex justify-center">
              {item.type === 'image' ? (
                <Image
                  src={item.url}
                  alt={`${caseData.title} - Media ${index + 1}`}
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: 'auto', height: 'auto', maxWidth: '100%' }}
                  className="rounded-[30px]"
                  data-ai-hint={`${caseData.title.substring(0, 20)} project media`}
                  unoptimized
                />
              ) : (
                <video
                  controls
                  preload="metadata"
                  className="w-full max-w-4xl mx-auto rounded-lg shadow-lg"
                  style={{ maxWidth: '100%', height: 'auto' }}
                >
                  <source src={item.url} type={`video/${item.url.split('.').pop()}`} />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95%] md:max-w-[98%] max-h-[96vh] flex flex-col p-0 rounded-lg bg-[#F0EFEE]">
        <ScrollArea className="flex-grow overflow-y-auto scrollArea">
          <div className="p-6 md:p-20 md:px-48">
            <DialogHeader>
              <DialogTitle className="text-[60px] md:text-[90px] font-mycustom uppercase tracking-normal -mt-10">
                {caseData.title}
              </DialogTitle>
            </DialogHeader>
            <p className="text-[20px] font-medium text-center text-foreground mb-10 max-w-[600px] mx-auto ">
              {caseData.fullDescription}
            </p>
            {caseData.tags && caseData.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-14">
                {caseData.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-[#5D5D5D] text-sm bg-[#e9e9e9]"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            
            {renderMediaGrid()}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
