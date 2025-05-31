import Image from 'next/image';
import { OOIcon } from '@/components/icons/OOIcon';

export function HeroSection() {
  return (
    <section className="relative py-16 md:py-24">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="grid md:grid-cols-2 gap-x-8 lg:gap-x-12 xl:gap-x-16 gap-y-10 items-center">
          {/* Main Image (Hoodie) */}
          <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[420px] mx-auto md:ml-0 md:mr-auto aspect-square rounded-2xl overflow-hidden shadow-xl bg-card p-4 sm:p-5 md:p-6">
            <Image
              src="https://placehold.co/400x400.png" 
              alt="Черное худи с принтом"
              layout="fill"
              objectFit="contain"
              data-ai-hint="hoodie design black" 
            />
          </div>
          
          {/* Text Content & Secondary Image Container */}
          <div className="relative text-left md:text-left">
            <h1 className="text-[2.5rem] sm:text-[3.25rem] md:text-[3.75rem] lg:text-[4.5rem] xl:text-[5rem] font-extrabold text-foreground tracking-tighter leading-[0.95em]">
              МЫ — DIGITAL<br />
              АГЕНТСТВО <OOIcon className="inline-block align-[-0.11em] h-[0.72em] w-auto text-accent" /> READY <span className="text-accent">GO</span><br />
              К НАМ ПРИХОДЯТ ЗА<br />
              СТРАТЕГИЯМИ
            </h1>
            
            {/* Secondary Image (Crate/Magazine) */}
            <div 
              className="absolute 
                         bottom-[-30px] right-[-30px]
                         sm:bottom-[-40px] sm:right-[-35px]
                         md:bottom-[-50px] md:right-[-45px] 
                         lg:bottom-[-60px] lg:right-[-55px]
                         w-[150px] h-[120px] 
                         sm:w-[180px] sm:h-[140px] 
                         md:w-[200px] md:h-[160px]
                         lg:w-[240px] lg:h-[190px]
                         transform rotate-[6deg] shadow-xl rounded-lg overflow-hidden hidden sm:block z-[5]"
            >
              <Image
                src="https://placehold.co/300x250.png" 
                alt="Креативная упаковка в ящике"
                layout="fill"
                objectFit="cover"
                data-ai-hint="packaging design modern" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
