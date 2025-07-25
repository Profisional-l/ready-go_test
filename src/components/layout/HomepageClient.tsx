
"use client";

import React from "react";
import type { Case } from "@/types";
import dynamic from 'next/dynamic';

import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/sections/HeroSection";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load non-critical components
const CasesSection = dynamic(() => import('@/components/sections/CasesSection').then(mod => mod.CasesSection), { 
    loading: () => <Skeleton className="w-full h-[500px]" />,
    ssr: false 
});
const ServiceBanner = dynamic(() => import('@/components/sections/ServiceBanner').then(mod => mod.ServiceBanner), { ssr: false });
const AboutSection = dynamic(() => import('@/components/sections/AboutSection').then(mod => mod.AboutSection), { ssr: false });
const ClientsSection = dynamic(() => import('@/components/sections/ClientsSection').then(mod => mod.ClientsSection), { ssr: false });
const Footer = dynamic(() => import('@/components/layout/Footer').then(mod => mod.Footer), { ssr: false });


interface HomepageClientProps {
  casesData: Case[];
}

export function HomepageClient({ casesData }: HomepageClientProps) {

  return (
    <main>
        <Header />
        
        <section id="home" className="h-screen flex flex-col">
            <div className="flex-grow">
                <HeroSection />
            </div>
        </section>

        <section id="cases">
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
        
        <div id="contact">
            <Footer />
        </div>
    </main>
  );
}
