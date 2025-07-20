"use client";

import React from "react";
import ReactFullpage from "@fullpage/react-fullpage";
import type { Case } from "@/types";

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

  return (
    <ReactFullpage
      licenseKey={licenseKey}
      scrollingSpeed={1200}
      scrollOverflow={true}
      anchors={anchors}
      navigation={true}
      navigationTooltips={anchors}
      credits={{
        enabled: false,
      }}
      easing="easeInOutCubic"
      easingcss3="cubic-bezier(0.645, 0.045, 0.355, 1)"
      touchSensitivity={15}
      normalScrollElementTouchThreshold={5}
      keyboardScrolling={true}
      recordHistory={false}
      css3={true}
      fitToSection={true}
      fitToSectionDelay={300}
      scrollBar={false}
      continuousVertical={false}
      dragAndMove={true}
      offsetSections={false}
      resetSliders={false}
      render={({ state, fullpageApi }) => {
        return (
          <ReactFullpage.Wrapper>
            {/* Section 1: Hero */}
            <div className="section fp-noscroll">
              <div className="max-w-[1640px] mx-auto px-3 md:px-8 h-full flex flex-col">
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