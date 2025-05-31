import Image from 'next/image';
import { Eye } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative py-16 md:py-24">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="relative w-full h-auto aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
          <Image
            src="https://placehold.co/600x800.png"
            alt="Фото худи"
            layout="fill"
            objectFit="cover"
            data-ai-hint="fashion hoodie model"
          />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground tracking-tight leading-tight">
            МЫ — DIGITAL<br />
            <span className="inline-block">АГЕНТСТВО</span>
            <Eye size={56} className="inline-block align-[-0.15em] mx-1 text-primary" />
            READY GO<br />
            К НАМ ПРИХОДЯТ<br />
            ЗА СТРАТЕГИЯМИ
          </h1>
        </div>
      </div>
      <div className="absolute top-[30%] right-0 w-32 h-48 md:w-48 md:h-64 transform translate-x-1/4 md:translate-x-1/2 lg:translate-x-0 -rotate-6 hidden md:block">
        <Image
          src="https://placehold.co/300x400.png"
          alt="3D буклет"
          layout="fill"
          objectFit="contain"
          className="rounded-md shadow-2xl"
          data-ai-hint="3d booklet brochure"
        />
      </div>
    </section>
  );
}
