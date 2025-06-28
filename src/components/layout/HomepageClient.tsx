'use client';

import React from 'react';
import ReactFullpage from '@fullpage/react-fullpage';
import type { Case } from '@/types';

import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/sections/HeroSection";
import { CasesSection } from "@/components/sections/CasesSection";
import { ServiceBanner } from "@/components/sections/ServiceBanner";
import { AboutSection } from "@/components/sections/AboutSection";
import { Footer } from "@/components/layout/Footer";

// It's crucial to import the fullpage.js CSS for it to work
import 'fullpage.js/dist/fullpage.min.css';

interface HomepageClientProps {
  casesData: Case[];
}

export function HomepageClient({ casesData }: HomepageClientProps) {
  const licenseKey = 'OPEN-SOURCE-GPLV3-LICENSE';
  const anchors = ['home', 'cases', 'about', 'contact'];

  return (
    <ReactFullpage
      licenseKey={licenseKey}
      scrollingSpeed={1000}
      scrollOverflow={true} // Enable scroll for sections taller than the viewport
      anchors={anchors}
      navigation
      navigationTooltips={anchors}
      
      render={({ state, fullpageApi }) => {
        return (
          <ReactFullpage.Wrapper>
            {/* Section 1: Hero */}
            <div className="section">
              <div className="max-w-[1640px] mx-auto px-3 md:px-8 h-full flex flex-col">
                <Header />
                <div className="flex-grow">
                  <HeroSection />
                </div>
              </div>
            </div>
            
            {/* Section 2: Cases (short preview) */}
            <div className="section fp-auto-height">
               <CasesSection casesDataFromProps={casesData} />
            </div>

            {/* Section 3: About */}
            <div className="section">
                {/* This section will scroll if content overflows */}
                <ServiceBanner />
                <div className="max-w-[1640px] mx-auto px-3 md:px-8">
                  <AboutSection />
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
