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
  // NOTE: fullPagejs license key is required for commercial projects.
  // You can get one at https://alvarotrigo.com/fullPage/
  const licenseKey = 'OPEN-SOURCE-GPLV3-LICENSE';

  return (
    <ReactFullpage
      licenseKey={licenseKey}
      scrollingSpeed={1000}
      scrollOverflow={true}
      anchors={['home', 'cases', 'about', 'contact']}
      navigation
      
      render={({ state, fullpageApi }) => {
        return (
          <ReactFullpage.Wrapper>
            <div className="section">
              <div className="max-w-[1640px] mx-auto px-3 md:px-8">
                <Header />
              </div>
              <div className="max-w-[1640px] mx-auto md:px-8">
                <HeroSection />
              </div>
            </div>
            <div className="section">
              <div className="bg-[#F1F0F0] md:bg-background py-10 md:py-12 h-full flex items-center">
                <div className="max-w-[1640px] mx-auto md:px-8 w-full">
                  <CasesSection casesDataFromProps={casesData} />
                </div>
              </div>
            </div>
            <div className="section">
                <ServiceBanner />
                <div className="max-w-[1640px] mx-auto px-3 md:px-8">
                  <AboutSection />
                </div>
            </div>
            <div className="section fp-auto-height">
              <Footer />
            </div>
          </ReactFullpage.Wrapper>
        );
      }}
    />
  );
}
