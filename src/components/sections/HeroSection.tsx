import Image from 'next/image';
import { OOIcon } from '@/components/icons/OOIcon';

export function HeroSection() {
  return (
    <section className="relative py-16 md:py-24">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="relative w-full h-auto aspect-[3/4] md:aspect-[500/670] rounded-lg overflow-hidden shadow-lg">
          <Image
            src="https://placehold.co/500x670.png"
            alt="Фото худи"
            layout="fill"
            objectFit="cover"
            data-ai-hint="fashion hoodie splash"
          />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground tracking-tight leading-tight">
            МЫ — DIGITAL<br />
            АГЕНТСТВО <OOIcon className="inline-block align-[-0.1em] h-[0.8em] w-auto text-accent" />
            READY <span className="text-accent">GO</span><br />
            К НАМ ПРИХОДЯТ<br />
            ЗА СТРАТЕГИЯМИ
          </h1>
        </div>
      </div>
      <div className="absolute top-[30%] right-0 w-32 h-48 md:w-40 md:h-60 transform translate-x-1/4 md:translate-x-1/2 lg:translate-x-0 -rotate-6 hidden md:block">
        <Image
          src="https://placehold.co/200x300.png"
          alt="Digital art magazine"
          layout="fill"
          objectFit="contain"
          className="rounded-md shadow-2xl"
          data-ai-hint="digital art magazine"
        />
      </div>
    </section>
  );
}
