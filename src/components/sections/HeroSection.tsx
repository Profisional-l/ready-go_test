import Image from 'next/image';
import { OOIcon } from '@/components/icons/OOIcon';

export function HeroSection() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12">
          {/* Left: Hoodie Image */}
          <div className="w-full lg:w-2/5 flex justify-center lg:justify-start">
            <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] md:w-[360px] md:h-[360px] lg:w-[400px] lg:h-[400px] bg-card p-4 sm:p-5 md:p-6 rounded-2xl shadow-xl">
              <Image
                src="https://placehold.co/400x400.png"
                alt="Черное худи с бирюзовым принтом"
                layout="fill"
                objectFit="contain"
                data-ai-hint="black hoodie turquoise print"
              />
            </div>
          </div>

          {/* Right: Text Content & 3D Card */}
          <div className="w-full lg:w-3/5 relative text-center lg:text-left">
            <div className="relative"> {/* Container for h1 and interactive dots */}
              <h1 className="text-[2.25rem] sm:text-[2.75rem] md:text-[3.25rem] lg:text-[3.5rem] xl:text-[4rem] font-extrabold text-foreground tracking-tighter leading-[1.1em]">
                МЫ — DIGITAL <br />
                АГЕНТСТВО <span className="inline-block align-middle text-[1.2em]">👀</span> READY <OOIcon className="inline-block align-[-0.11em] h-[0.72em] w-auto text-accent" /> GO <br />
                К НАМ ПРИХОДЯТ ЗА <br />
                СТРАТЕГИЯМИ
              </h1>
              
              {/* Interactive Dots */}
              <div 
                className="absolute top-[25%] left-[5%] w-3.5 h-3.5 bg-accent rounded-full cursor-pointer animate-pulse shadow-md" 
                title="Interactive point: Strategy"
              ></div>
              <div 
                className="absolute top-[55%] right-[10%] lg:right-[20%] w-3 h-3 bg-muted-foreground/40 rounded-full cursor-pointer hover:bg-accent transition-colors shadow-sm" 
                title="Interactive point: Digital"
              ></div>
              <div 
                className="absolute bottom-[5%] left-[30%] w-3 h-3 bg-muted-foreground/40 rounded-full cursor-pointer hover:bg-accent transition-colors shadow-sm" 
                title="Interactive point: Agency"
              ></div>
            </div>
            
            {/* 3D Card Image */}
            <div className="absolute -bottom-12 -right-5 sm:-bottom-16 sm:-right-8 md:-bottom-24 md:right-0 transform rotate-[-8deg] 
                            w-[180px] h-[108px] 
                            sm:w-[200px] sm:h-[120px] 
                            md:w-[240px] md:h-[144px]
                            hidden sm:block z-10"> 
              <div className="relative w-full h-full shadow-2xl rounded-xl overflow-hidden">
                <Image
                  src="https://placehold.co/240x144.png"
                  alt="3D рендер карточки Progress on velocity"
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint="3d card progress velocity"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
