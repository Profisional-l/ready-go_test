"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export function ServiceBanner() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const bannerWidth = isMobile ? 1827 : 3560;
  const bannerHeight = isMobile ? 99 : 190;

  const BannerContent = () => (
    <span className="relative h-[99px] md:h-[191px] w-auto md:w-[3560px] mx-8">
      <Image
        src="/images/Group103.png"
        alt="service banner"
        className="object-cover"
        width={bannerWidth}
        height={bannerHeight}
      />
    </span>
  );

  return (
    <section className="bg-accent text-accent-foreground overflow-hidden h-[99px] md:h-[190px] py-4 md:py-0">
      <div className="relative flex flex-nowrap h-full">
        <div className="animate-marquee flex-shrink-0 flex items-center h-full">
          <BannerContent />
          <BannerContent />
          <BannerContent />
          <BannerContent />
        </div>
        <div className="animate-marquee flex-shrink-0 flex items-center h-full">
          <BannerContent />
          <BannerContent />
          <BannerContent />
          <BannerContent />
        </div>
      </div>
    </section>
  );
}
