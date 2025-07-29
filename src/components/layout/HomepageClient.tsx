
"use client";

import React from "react";
import type { Case } from "@/types";

import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/sections/HeroSection";
import { CasesSection } from "@/components/sections/CasesSection";
import { ServiceBanner } from "@/components/sections/ServiceBanner";
import { AboutSection } from "@/components/sections/AboutSection";
import { Footer } from "@/components/layout/Footer";
import { ClientsSection } from "@/components/sections/ClientsSection";

interface HomepageClientProps {
  casesData: Case[];
}

export function HomepageClient({ casesData }: HomepageClientProps) {

  return (
    <main>
        <Header/>
        
        <section id="home" className="h-screen flex flex-col">
            <div className="flex-grow">
                <HeroSection />
            </div>
        </section>

        <section id="cases" className="mt-[10%]">
            <CasesSection casesDataFromProps={casesData} />
        </section>

        <section id="about">
            <ServiceBanner />
            <div className="max-w-[1640px] mx-auto px-3 md:px-8">
            <AboutSection />
            </div>
            <div className="max-w-[100%]">
            <ClientsSection />
            </div>
        </section>
        
        <footer id="contact">
            <Footer />
        </footer>
    </main>
  );
}