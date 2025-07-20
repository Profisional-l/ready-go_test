
"use client";

import React, { useEffect } from "react";
import ReactFullpage from "@fullpage/react-fullpage";
import type { Case } from "@/types";
import Lenis from '@studio-freight/lenis';

import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/sections/HeroSection";
import { CasesSection } from "@/components/sections/CasesSection";
import { ServiceBanner } from "@/components/sections/ServiceBanner";
import { AboutSection } from "@/components/sections/AboutSection";
import { Footer } from "@/components/layout/Footer";
import { ClientsSection } from "@/components/sections/ClientsSection";

import "fullpage.js/dist/fullpage.min.css";

interface HomepageClientProps {
  casesData: Case[];
}

export function HomepageClient({ casesData }: HomepageClientProps) {
  const licenseKey = "OPEN-SOURCE-GPLV3-LICENSE";
  const anchors = ["home", "cases", "about", "contact"];

  useEffect(() => {
    // This effect runs after fullpage.js has initialized and created the scrollable sections.
    // We find all scrollable sections and apply Lenis to them.
    const scrollableSections = document.querySelectorAll('.fp-scrollable');
    const lenisInstances: Lenis[] = [];

    scrollableSections.forEach(section => {
      const lenis = new Lenis({
        wrapper: section, // The scrollable container
        content: section.querySelector('.fp-scroller') as HTMLElement, // The content element
        smoothWheel: true,
        smoothTouch: true,
        lerp: 0.05, // Lower values are smoother and slower
      });
      lenisInstances.push(lenis);
    });

    let animationFrameId: number;

    function raf(time: number) {
      lenisInstances.forEach(lenis => lenis.raf(time));
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    // Cleanup function to destroy Lenis instances when the component unmounts
    return () => {
      cancelAnimationFrame(animationFrameId);
      lenisInstances.forEach(lenis => lenis.destroy());
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <ReactFullpage
      licenseKey={licenseKey}
      scrollingSpeed={1000}
      scrollOverflow={true}
      anchors={anchors}
      navigation
      navigationTooltips={anchors}
      credits={{
        enabled: false,
      }}
      render={({ state, fullpageApi }) => {
        return (
          <ReactFullpage.Wrapper>
            {/* Section 1: Hero */}
            <div className="section fp-noscroll">
              <div className="h-full flex flex-col">
                <Header />
                <div className="flex-grow">
                  <HeroSection />
                </div>
              </div>
            </div>

            {/* Section 2: Cases */}
            <div className="section fp-auto-height">
              <CasesSection casesDataFromProps={casesData} />
            </div>

            {/* Section 3: About */}
            <div className="section">
              <ServiceBanner />
              <div className="max-w-[1640px] mx-auto px-3 md:px-8">
                <AboutSection />
              </div>
              <div className="max-w-[100%]">
                <ClientsSection />
              </div>
            </div>

            {/* Section 4: Footer */}
            <div className="section fp-auto-height">
              <Footer />
            </div>
          </ReactFullpage.Wrapper>
        );
      }}
    />
  );
}
