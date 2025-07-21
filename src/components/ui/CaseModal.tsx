
"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { Case } from "@/types";
import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLenis } from "@studio-freight/react-lenis";


interface CaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseData: Case | null;
}

function VideoWithPreview({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [poster, setPoster] = useState<string | undefined>(undefined);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const captureFrame = () => {
      if (!video.videoWidth || !video.videoHeight) return;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/png");
      setPoster(dataUrl);
    };

    const onLoadedMetadata = () => {
      video.currentTime = 0.1;
    };

    const onSeeked = () => {
      captureFrame();
      video.currentTime = 0;
      video.removeEventListener("seeked", onSeeked);
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("seeked", onSeeked);

    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("seeked", onSeeked);
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      controls
      playsInline
      preload="metadata"
      poster={poster}
      className="w-full h-auto rounded-[10px] object-contain"
    >
      <source src={src} type={`video/${src.split(".").pop()}`} />
      Your browser does not support the video tag.
    </video>
  );
}

export function CaseModal({ isOpen, onClose, caseData }: CaseModalProps) {
  const lenis = useLenis();

  useEffect(() => {
    if (isOpen) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
    
    // Cleanup on component unmount
    return () => {
        lenis?.start();
    }
  }, [isOpen, lenis]);


  if (!caseData || caseData.type !== 'modal') return null;

  const renderMediaGrid = () => {
    if (!caseData?.media || caseData.media.length === 0) return null;
  
    return (
      <div className="mt-6 space-y-3 px-3 md:px-48 pb-10">
        {caseData.media.map((item, index) => (
          <div key={`${item.type}-${index}`} className="relative w-full h-auto">
            {item.type === 'image' ? (
              <Image
                src={item.url}
                alt={`${caseData.title} - Media ${index + 1}`}
                width={1200}
                height={800}
                sizes="(max-width: 768px) 100vw, 80vw"
                className="w-full h-auto rounded-[10px] object-contain"
                unoptimized={item.url.endsWith('.gif')}
              />
            ) : (
              <VideoWithPreview src={item.url} />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogOverlay />
        <DialogContent>
            <ScrollArea className="w-full h-full">
                <div className="p-3 md:pt-20 md:px-48">
                    <DialogHeader>
                    <DialogTitle className="text-[60px] md:text-[90px] font-mycustom text-left md:text-center uppercase tracking-normal md:-mt-10">
                        {caseData.category}
                    </DialogTitle>
                    </DialogHeader>
                    {caseData.fullDescription && (
                    <p className="text-[18px] font-medium  text-left md:text-center text-foreground md:mb-10 max-w-[600px] mx-auto ">
                        {caseData.fullDescription}
                    </p>
                    )}
                    {caseData.tags && caseData.tags.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2 mb-14">
                        {caseData.tags.map((tag, index) => (
                        <Badge
                            key={index}
                            variant="secondary"
                            className="text-[#5D5D5D] text-sm bg-[#e9e9e9] hidden md:block"
                        >
                            {tag}
                        </Badge>
                        ))}
                    </div>
                    )}
                </div>
                {renderMediaGrid()}
            </ScrollArea>
        </DialogContent>
    </Dialog>
  );
}
