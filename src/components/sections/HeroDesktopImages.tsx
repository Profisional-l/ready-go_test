
"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const imageGroupsData = [
  [
    {
      src: "/images/ForHeroSection/back-1.webp",
      alt: "СТРАТЕГИЯМИ",
      width: 305,
      height: 352,
    },
    {
      src: "/images/ForHeroSection/back-2.webp",
      alt: "СТРАТЕГИЯМИ",
      width: 308,
      height: 388,
    },
  ],
  [
    {
      src: "/images/ForHeroSection/back-3.webp",
      alt: "SMM",
      width: 288,
      height: 360,
    },
    {
      src: "/images/ForHeroSection/back-4.webp",
      alt: "SMM",
      width: 302,
      height: 353,
    },
  ],
  [
    {
      src: "/images/ForHeroSection/back-5.webp",
      alt: "СТРАТЕГИЯМИ",
      width: 254,
      height: 351,
    },
    {
      src: "/images/ForHeroSection/back-6.png",
      alt: "СТРАТЕГИЯМИ",
      width: 396,
      height: 308,
    },
  ],
  [
    {
      src: "/images/ForHeroSection/back-7.webp",
      alt: "СТРАТЕГИЯМИ",
      width: 290,
      height: 364,
    },
    {
      src: "/images/ForHeroSection/back-8.png",
      alt: "СТРАТЕГИЯМИ",
      width: 338,
      height: 338,
    },
  ],
  [
    {
      src: "/images/ForHeroSection/back-9.png",
      alt: "СТРАТЕГИЯМИ",
      width: 387,
      height: 259,
    },
    {
      src: "/images/ForHeroSection/back-10.png",
      alt: "СТРАТЕГИЯМИ",
      width: 311,
      height: 311,
    },
  ],
  [
    {
      src: "/images/ForHeroSection/back-11.webp",
      alt: "СТРАТЕГИЯМИ",
      width: 290,
      height: 371,
    },
    {
      src: "/images/ForHeroSection/Comp-12.gif",
      alt: "СТРАТЕГИЯМИ",
      width: 272,
      height: 338,
    },
  ],
  [
    {
      src: "/images/ForHeroSection/back-13.png",
      alt: "СТРАТЕГИЯМИ",
      width: 339,
      height: 339,
    },
    {
      src: "/images/ForHeroSection/back-14.webp",
      alt: "СТРАТЕГИЯМИ",
      width: 285,
      height: 359,
    },
  ],
];

interface HeroDesktopImagesProps {
    currentIndex: number;
    isAnimating: boolean;
}

export default function HeroDesktopImages({ currentIndex, isAnimating }: HeroDesktopImagesProps) {
    const [leftImageStyle, setLeftImageStyle] = useState<React.CSSProperties>({});
    const [rightImageStyle, setRightImageStyle] = useState<React.CSSProperties>({});
    const [isMid, setIsMid] = useState(false);
    const mouse = useRef({ x: 0, y: 0 });
    const animFrame = useRef<number | null>(null);

    const imgSizeIndex = 1.2;

    useEffect(() => {
        const checkMid = () => {
        setIsMid(window.innerWidth < 1400);
        };
        checkMid();
        window.addEventListener("resize", checkMid);
        return () => window.removeEventListener("resize", checkMid);
    }, []);

    // Плавное движение изображений
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouse.current = { x: e.clientX, y: e.clientY };
        };

        const update = () => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const { x, y } = mouse.current;
            
            const moveX1 = (x - centerX) * 0.01;
            const moveY1 = (y - centerY) * 0.01;
            const moveX2 = (centerX - x) * 0.015;
            const moveY2 = (centerY - y) * 0.015;

            setLeftImageStyle({
            transform: `translate(${moveX1}px, ${moveY1}px)`,
            transition: "transform 0.2s ease-out",
            });

            setRightImageStyle({
            transform: `translate(${moveX2}px, ${moveY2}px)`,
            transition: "transform 0.2s ease-out",
            });
            
            animFrame.current = requestAnimationFrame(update);
        };

        window.addEventListener("mousemove", handleMouseMove);
        animFrame.current = requestAnimationFrame(update);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            if (animFrame.current) cancelAnimationFrame(animFrame.current);
        };
    }, []);

    const imageOpacity = isAnimating ? 0 : 1;

    return (
        <>
            {/* Левая картинка с анимацией */}
            {imageGroupsData.map((group, groupIndex) => {
                const leftImagePositionArray = [true, false, true, false, false, false, true]; 
                const isBottomPosition = leftImagePositionArray[groupIndex]; 

                return (
                <div
                    key={`left-image-${groupIndex}`}
                    className={cn(
                    "absolute left-9 lg:left-10 z-100 transition-all duration-700 HeroLeftImg",
                    isBottomPosition ? "top-[53%] HeroImgAdapt" : "top-24"
                    )}
                    style={{
                    ...leftImageStyle,
                    opacity: currentIndex === groupIndex ? imageOpacity : 0,
                    pointerEvents: currentIndex === groupIndex ? "auto" : "none",
                    transition: "opacity 0.7s cubic-bezier(0.77,0,0.175,1), transform 0.2s ease-out",
                    }}
                >
                    <div
                    className="relative overflow-hidden"
                    style={{
                        width: `${isMid ? group[0].width / imgSizeIndex : group[0].width}px`,
                        height: `${isMid ? group[0].height / imgSizeIndex : group[0].height}px`,
                    }}
                    >
                    <div className="w-full h-full rounded-[12px] overflow-hidden">
                        <Image
                        src={group[0].src}
                        alt={group[0].alt}
                        priority
                        width={group[0].width}
                        height={group[0].height}
                        sizes="30vw"
                        className="w-full h-full object-cover"
                        />
                    </div>
                    </div>
                </div>
                );
            })}

            {/* Правая картинка с анимацией */}
            {imageGroupsData.map((group, groupIndex) => {
                const imagePositionArray = [true, false, true, false, false, false, true]; 
                const isTopPosition = imagePositionArray[groupIndex]; 
                const image = group[1];
                
                return (
                <div
                    key={`right-image-${groupIndex}`}
                    className={cn(
                    "absolute md:right-7 lg:right-12 z-100 transition-all duration-500 HeroRightImg",
                    isTopPosition ? "top-24  RightHeroImgAdapt" : "top-[53%] HeroImgAdapt"
                    )}
                    style={{
                    ...rightImageStyle,
                    opacity: currentIndex === groupIndex ? imageOpacity : 0,
                    pointerEvents: currentIndex === groupIndex ? "auto" : "none", 
                    transition: "opacity 0.7s cubic-bezier(0.77,0,0.175,1), transform 0.2s ease-out",
                    }}
                >
                    <div
                    className="relative overflow-hidden"
                    style={{
                        width: `${isMid ? image.width / imgSizeIndex : image.width}px`,
                        height: `${isMid ? image.height / imgSizeIndex : image.height}px`,
                    }}
                    >
                    <div className="w-full h-full rounded-[12px] overflow-hidden">
                        <Image
                        src={image.src}
                        alt={image.alt}
                        priority
                        unoptimized={image.src.endsWith('.gif')}
                        width={image.width}
                        height={image.height}
                        sizes="30vw"
                        className="w-full h-full object-cover"
                        />
                    </div>
                    </div>
                </div>
                );
            })}
        </>
    );
}
