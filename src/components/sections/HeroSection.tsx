import Image from "next/image";

import { OOIcon } from "@/components/icons/OOIcon";

export function HeroSection() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Text Block - Centered */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center max-w-[10080px] z-0"
        style={{ lineHeight: 1.05 }}
      >
<div className="text-[130px] font-black font-mycustom text-foreground">
  <span style={{ color: "white", WebkitTextStroke: "3.3px black" }}>МЫ — </span>DIGITAL
</div>

        <div className="text-[130px] font-black font-mycustom text-foreground mt-3">
          АГЕНТСТВО{" "}
          <span className="inline-block">
            <Image
              src="/images/eyes_Group127.png" // Placeholder, original aspect ratio maintained by height:auto
              alt="Черное худи с бирюзовым принтом"
              width={365}
              height={365} // Approximate height, actual height will be auto based on width
              objectFit="contain"
              className="w-full h-auto"
              data-ai-hint="black hoodie turquoise print"
            />
          </span>{" "}
          <span style={{ color: "white", WebkitTextStroke: "3.3px black" }}>READY GO</span>
        </div>
        <div className="text-[130px] font-black font-mycustom text-foreground mt-3">
          К НАМ ПРИХОДЯТ ЗА
        </div>
        <div className="text-[130px] font-black font-mycustom text-foreground mt-3">
          СТРАTЕГИЯМИ
        </div>
      </div>

      {/* Left Image (Hoodie) */}
      <div className="absolute left-8 top-1/2 transform -translate-y-1/2 z-10">
        <div className="relative w-[365px] rounded-xl overflow-hidden">
          <Image
            src="/images/back-1.png" // Placeholder, original aspect ratio maintained by height:auto
            alt="Черное худи с бирюзовым принтом"
            width={365}
            height={365} // Approximate height, actual height will be auto based on width
            objectFit="contain"
            className="w-full h-auto"
            data-ai-hint="black hoodie turquoise print"
          />
        </div>
      </div>

      {/* Right Image (3D Card) */}
      <div className="absolute right-8 bottom-8 z-10">
        <div className="relative w-[360px] h-[450px]  overflow-hidden">
          <Image
            src="/images/back-2.png"
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
