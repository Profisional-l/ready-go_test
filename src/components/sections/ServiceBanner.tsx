import Image from "next/image";

const BannerContent = () => (
  <span className="relative h-[191px] w-[3560px] mx-8">
    <Image
      src="/images/Group103.png"
      alt="service banner"
      className="object-cover"
      width={3560}
      height={190}
    />
  </span>
);

export function ServiceBanner() {
  return (
    <section className="bg-accent text-accent-foreground overflow-hidden h-[190px] py-4 md:py-0">
      <div className="relative flex flex-nowrap h-full">
        <div className="animate-marquee flex-shrink-0 flex items-center h-full">
          <BannerContent />
          <BannerContent />
          <BannerContent />
          <BannerContent />
        </div>
        <div className="absolute top-0 animate-marquee2 flex-shrink-0 flex items-center h-full">
          <BannerContent />
          <BannerContent />
          <BannerContent />
          <BannerContent />
        </div>
      </div>
    </section>
  );
}