
"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Case } from "@/types";
import { useState, useRef, useEffect } from "react";

interface CaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseData: Case | null;
}

// Новый компонент для видео с превью из первого кадра
function VideoWithPreview({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [poster, setPoster] = useState<string | undefined>(undefined);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Функция захвата кадра в canvas и генерация dataURL
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
      // Прокручиваем на 0.1 секунды, чтобы гарантированно получить кадр
      video.currentTime = 0.1;
    };

    const onSeeked = () => {
      captureFrame();
      video.currentTime = 0; // Вернуть в начало, чтобы не "подергивалось"
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
  if (!caseData || caseData.type !== 'modal') return null;

  const renderMediaGrid = () => {
    if (!caseData?.media || caseData.media.length === 0) return null;

    const images = caseData.media.filter((item) => item.type === "image");
    const videos = caseData.media.filter((item) => item.type === "video");

    return (
      <div className="mt-6 space-y-3">
        {/* Изображения */}
        {images.length > 0 && (
          <div className="flex flex-col gap-3">
            {images.map((item, index) => (
              <div key={`image-${index}`} className="relative w-full h-auto aspect-auto">
                <Image
                  src={item.url}
                  alt={`${caseData.title} - Image ${index + 1}`}
                  width={1200} // Provide a base width for optimization
                  height={800} // Provide a base height for optimization
                  sizes="(max-width: 768px) 100vw, 80vw"
                  className="w-full h-auto rounded-[10px] object-contain"
                  unoptimized={item.url.endsWith('.gif')} // Keep GIFs unoptimized
                />
              </div>
            ))}
          </div>
        )}
  

        {/* Видео с превью из первого кадра */}
        {videos.length > 0 && (
          <div className="space-y-3">
            {Array.from({ length: Math.ceil(videos.length / 3) }).map(
              (_, rowIndex) => {
                const rowVideos = videos.slice(
                  rowIndex * 3,
                  rowIndex * 3 + 3
                );
                const colClass =
                  rowVideos.length === 1
                    ? "grid-cols-1"
                    : rowVideos.length === 2
                    ? "grid-cols-1 sm:grid-cols-2"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

                return (
                  <div
                    key={rowIndex}
                    className={`grid ${colClass} gap-3`}
                  >
                    {rowVideos.map((item, index) => (
                      <div
                        key={`video-${rowIndex}-${index}`}
                        className="w-full"
                      >
                        <VideoWithPreview src={item.url} />
                      </div>
                    ))}
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95%] md:max-w-[98%] max-h-[96vh] flex flex-col p-0 rounded-lg bg-[#F0EFEE]">
        <ScrollArea className="flex-grow">
          <div className="p-3 md:p-20 md:px-48">
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

            {renderMediaGrid()}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
