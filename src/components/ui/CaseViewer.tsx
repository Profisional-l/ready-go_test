
"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { Case } from "@/types";
import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from "lucide-react";

interface CaseViewerProps {
  caseData: Case | null;
  onClose: () => void;
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
      className="w-full h-full rounded-[10px] object-cover"
    >
      <source src={src} type={`video/${src.split(".").pop()}`} />
      Your browser does not support the video tag.
    </video>
  );
}


export function CaseViewer({ caseData, onClose }: CaseViewerProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (caseData) {
      document.documentElement.classList.add('modal-open');
    } else {
      document.documentElement.classList.remove('modal-open');
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.documentElement.classList.remove('modal-open');
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, [caseData, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  const renderMediaGrid = () => {
    if (!caseData?.media || caseData.media.length === 0) return null;

    const mediaItems = caseData.media;
    const chunkSize = 3;
    const mediaRows = [];
    for (let i = 0; i < mediaItems.length; i += chunkSize) {
        mediaRows.push(mediaItems.slice(i, i + chunkSize));
    }

    return (
      <div className="mt-6 space-y-3 px-3 md:px-48 pb-10">
        {mediaRows.map((rowItems, rowIndex) => (
            <div key={rowIndex} className="flex flex-col md:flex-row md:space-x-3 space-y-3 md:space-y-0">
                {rowItems.map((item, itemIndex) => {
                    const rowItemCount = rowItems.length;
                    const itemWidthClass = rowItemCount === 1 ? 'md:w-full' :
                                           rowItemCount === 2 ? 'md:w-1/2' : 'md:w-1/3';

                    return (
                        <div key={`${item.type}-${rowIndex}-${itemIndex}`} className={`relative w-full aspect-[4/3] ${itemWidthClass}`}>
                            {item.type === 'image' ? (
                                <Image
                                    src={item.url}
                                    alt={`${caseData.title} - Media ${itemIndex + 1}`}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="w-full h-full rounded-[10px] object-cover"
                                    unoptimized={item.url.endsWith('.gif')}
                                />
                            ) : (
                                <VideoWithPreview src={item.url} />
                            )}
                        </div>
                    );
                })}
            </div>
        ))}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {caseData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[1001] bg-black/80 flex items-center justify-center sm:py-[14px] sm:px-[12px]"
          onClick={handleBackdropClick}
        >
          <div
            ref={contentRef}
            className="relative w-full h-full bg-[#F0EFEE] overflow-y-auto sm:rounded-[35px]"
          >
             <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
            >
              <button
                onClick={onClose}
                className="fixed right-3 sm:right-8 top-9 sm:top-8 flex h-10 w-10 items-center justify-center rounded-full bg-[#E9E9E9] transition-all duration-300 hover:opacity-100 focus:outline-none shadow-xl hover:shadow-gray-400 z-50"
                aria-label="Close"
              >
                <Image
                  src="/images/close_Vector.png"
                  alt="close"
                  width={16}
                  height={16}
                />
              </button>

              <div className="p-3 md:pt-20 md:px-48">
                <h2 className="text-[60px] md:text-[90px] font-mycustom text-left md:text-center uppercase tracking-normal md:-mt-10">
                  {caseData.category}
                </h2>

                {caseData.fullDescription && (
                  <p className="text-[20px] font-medium  text-left md:text-center text-foreground max-w-[550px] mx-auto ">
                    {caseData.fullDescription}
                  </p>
                )}

                {caseData.externalUrl && (
                  <div className="md:text-center md:mb-7">
                  <Link href={caseData.externalUrl} target="_blank" rel="noopener noreferrer" className="group relative inline-flex items-center text-[20px] font-medium text-foreground">
                    <span>Перейти на&nbsp;</span>
                    <div className="inline-flex items-center">
                      <span className="text-accent">сайт</span>
                      <Image
                        src="/images/link-arrow.svg"
                        alt="arrow"
                        width={12}
                        height={12}
                        className="ml-1"
                      />
                    </div>
                    <span className="absolute bottom-[-2px] left-0 h-[2px] w-full origin-left scale-x-0 transform bg-gradient-to-r from-foreground from-65% to-accent to-65% transition-transform duration-300 ease-out group-hover:scale-x-100 rounded-lg"></span>
                  </Link>
                </div>
                )}

                {caseData.tags && caseData.tags.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mb-6 mt-8">
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
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
