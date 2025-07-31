
"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { Case, MediaItem } from "@/types";
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
  const posterGenerated = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || posterGenerated.current) return;

    // Reset state for new src
    posterGenerated.current = false;
    setPoster(undefined);

    const captureFrame = () => {
      if (!video.videoWidth || !video.videoHeight || video.readyState < 2 || posterGenerated.current) return;

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      try {
        const dataUrl = canvas.toDataURL("image/png");
        setPoster(dataUrl);
        posterGenerated.current = true; // Mark as generated
      } catch (e) {
        console.error("Error generating poster:", e);
      }
    };

    const onSeeked = () => {
      captureFrame();
      // We MUST remove the listener to prevent it from firing again on user interaction
      video.removeEventListener("seeked", onSeeked);
    };

    const onLoadedData = () => {
      // Seek to a specific time to capture a frame. 0.1s is usually safe.
      if (video.duration > 0.1) {
        video.currentTime = 0.1;
      } else {
        captureFrame(); // For very short videos
      }
    };

    video.addEventListener("loadeddata", onLoadedData);
    video.addEventListener("seeked", onSeeked);

    return () => {
      video.removeEventListener("loadeddata", onLoadedData);
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
      muted // Mute for autoplay possibility and to prevent audio conflicts
      className="w-full h-auto rounded-[10px] object-contain bg-black/10"
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
    // Only close if the click is on the backdrop itself, not on its children
    if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
      onClose();
    }
  }

  const renderVideoRows = (items: MediaItem[]) => {
    if (!items || items.length === 0) return null;

    const chunkSize = 3;
    const rows = [];
    for (let i = 0; i < items.length; i += chunkSize) {
      rows.push(items.slice(i, i + chunkSize));
    }

    return rows.map((rowItems, rowIndex) => (
      <div key={rowIndex} className="flex flex-col md:flex-row md:space-x-3 space-y-3 md:space-y-0">
        {rowItems.map((item, itemIndex) => {
          const rowItemCount = rowItems.length;
          const itemWidthClass = rowItemCount === 1 ? 'md:w-full' :
            rowItemCount === 2 ? 'md:w-1/2' : 'md:w-1/3';

          return (
            <div key={`${item.type}-${rowIndex}-${itemIndex}`} className={`relative w-full ${itemWidthClass}`}>
              <VideoWithPreview src={item.url} />
            </div>
          );
        })}
      </div>
    ));
  };

  const renderImageRows = (items: MediaItem[]) => {
    if (!items || items.length === 0) return null;

    return items.map((item, index) => (
      <div key={`image-row-${index}`} className="relative w-full">
        <Image
          src={item.url}
          alt={`${caseData?.title} - Media ${index + 1}`}
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-auto rounded-[10px]"
          unoptimized={item.url.endsWith('.gif')}
        />
      </div>
    ));
  }


  const renderMediaGrid = () => {
    if (!caseData?.media || caseData.media.length === 0) return null;

    const videos = caseData.media.filter(item => item.type === 'video');
    const images = caseData.media.filter(item => item.type === 'image');

    return (
      <div className="mt-6 space-y-3 px-3 md:px-48 pb-10">
        {renderVideoRows(videos)}
        {videos.length > 0 && images.length > 0 && <div className="py-2"></div>}
        {renderImageRows(images)}
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
          className="fixed inset-0 z-[1001] bg-black/80 flex items-start justify-center"
          onClick={handleBackdropClick}
        >
          <div
            ref={contentRef}
            className="relative w-full h-full bg-[#F0EFEE] overflow-y-auto sm:rounded-[35px] sm:my-[14px] sm:w-[calc(100%-24px)] sm:h-[calc(100%-24px)] "
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <button
                onClick={onClose}
                className="sticky right-3 sm:right-8 top-3 sm:top-8 flex h-10 w-10 items-center justify-center rounded-full bg-[#E9E9E9] transition-all duration-300 hover:opacity-100 focus:outline-none shadow-xl hover:shadow-gray-400 z-50 float-right mr-3 mt-3"
                aria-label="Close"
              >
                <Image
                  src="/images/close_Vector.png"
                  alt="close"
                  width={16}
                  height={16}
                />
              </button>

              <div className="p-3 pt-16 md:pt-20 md:px-48 clear-both">
                <h2 className="text-[60px] md:text-[90px] font-mycustom text-left md:text-center uppercase tracking-normal md:-mt-10">
                  {caseData.category}
                </h2>

                {caseData.fullDescription && (
                  <p className="text-[20px] font-medium  text-left md:text-center text-foreground max-w-[550px] mx-auto ">
                    {caseData.fullDescription}
                  </p>
                )}

                {caseData.externalUrl && (
                  <div className="md:text-center mt-4 md:mb-7">
                    <Link href={caseData.externalUrl} target="_blank" rel="noopener noreferrer" className="group relative inline-flex items-center text-[20px] font-medium text-foreground">
                      <span>Перейти на&nbsp;</span>
                      <div className="inline-flex items-center cases-underline-link">
                        <span className="text-accent">сайт</span>
                        <ArrowUpRight className="ml-1 h-5 w-5 text-accent" />
                      </div>
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
