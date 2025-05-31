import Image from 'next/image';
import { OOIcon } from '@/components/icons/OOIcon';

export function HeroSection() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-8">
        {/* Этот div является основным контекстом позиционирования для абсолютных изображений и центрированного текста */}
        <div className="relative flex flex-col items-center justify-center text-center min-h-[60vh] md:min-h-[70vh]">
          
          {/* Главное изображение (Худи) - слева, с перекрытием */}
          <div className="absolute left-[5%] sm:left-[8%] md:left-[10%] top-1/2 transform -translate-y-1/2 z-0 
                          w-[180px] h-[180px] 
                          sm:w-[260px] sm:h-[260px] 
                          md:w-[340px] md:h-[340px] 
                          lg:w-[400px] lg:h-[400px] 
                          xl:w-[450px] xl:h-[450px]">
            <div className="relative w-full h-full aspect-square rounded-2xl overflow-hidden shadow-xl bg-card p-3 sm:p-4 md:p-5">
              <Image
                src="https://placehold.co/400x400.png"
                alt="Черное худи с принтом"
                layout="fill"
                objectFit="contain"
                data-ai-hint="hoodie design black"
              />
            </div>
          </div>

          {/* Текстовый контент - по центру */}
          {/* max-width текста настроен так, чтобы изображения могли его обрамлять */}
          <div className="relative z-10 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
            <h1 className="text-[2.5rem] sm:text-[3.25rem] md:text-[3.75rem] lg:text-[4.5rem] xl:text-[5rem] font-extrabold text-foreground tracking-tighter leading-[0.95em]">
              МЫ — DIGITAL<br />
              АГЕНТСТВО <OOIcon className="inline-block align-[-0.11em] h-[0.72em] w-auto text-accent" /> READY <span className="text-accent">GO</span><br />
              К НАМ ПРИХОДЯТ ЗА<br />
              СТРАТЕГИЯМИ
            </h1>
          </div>

          {/* Вторичное изображение (Упаковка/Журнал) - справа, с перекрытием */}
          <div className="absolute right-[5%] sm:right-[8%] md:right-[10%] top-1/2 transform -translate-y-1/2 -rotate-[6deg] z-0
                          w-[100px] h-[80px] 
                          sm:w-[150px] sm:h-[120px] 
                          md:w-[190px] md:h-[150px] 
                          lg:w-[230px] lg:h-[180px]
                          xl:w-[270px] xl:h-[210px]">
            <div className="relative w-full h-full shadow-xl rounded-lg overflow-hidden">
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
