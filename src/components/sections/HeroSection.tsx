import Image from 'next/image';
import { OOIcon } from '@/components/icons/OOIcon';

export function HeroSection() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Text Block - Centered */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center max-w-[780px] z-0"
        style={{ lineHeight: 1.05 }}
      >
        <div className="text-[72px] font-black text-foreground">
          МЫ — DIGITAL
        </div>
        <div className="text-[80px] font-black text-foreground mt-3">
          АГЕНТСТВО <span className="inline-block align-middle">👀</span> READY <OOIcon className="inline-block align-[-0.08em] h-[0.7em] w-auto text-accent" /> GO
        </div>
        <div className="text-[72px] font-black text-foreground mt-3">
          К НАМ ПРИХОДЯТ ЗА
        </div>
        <div className="text-[96px] font-black text-foreground mt-3">
          СТРАТЕГИЯМИ
        </div>
      </div>

      {/* Left Image (Hoodie) */}
      <div className="absolute left-8 top-1/2 transform -translate-y-1/2 z-10">
        <div className="relative w-[300px] bg-card p-4 rounded-2xl shadow-xl">
          <Image
            src="https://placehold.co/400x400.png" // Placeholder, original aspect ratio maintained by height:auto
            alt="Черное худи с бирюзовым принтом"
            width={300}
            height={300} // Approximate height, actual height will be auto based on width
            objectFit="contain"
            className="w-full h-auto"
            data-ai-hint="black hoodie turquoise print"
          />
        </div>
      </div>

      {/* Right Image (3D Card) */}
      <div className="absolute right-8 bottom-8 z-10">
        <div className="relative w-[320px] h-[240px] shadow-[0_12px_32px_rgba(0,0,0,0.2)] rounded-xl overflow-hidden">
          <Image
            src="https://placehold.co/320x240.png"
            alt="3D рендер карточки Progress on velocity"
            layout="fill"
            objectFit="cover"
            data-ai-hint="3d card progress dashboard"
          />
        </div>
      </div>
    </section>
  );
}
