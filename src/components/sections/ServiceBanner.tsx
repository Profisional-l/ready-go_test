import { OOIcon } from '@/components/icons/OOIcon';

const BannerContent = () => (
  <span className="text-3xl md:text-4xl lg:text-5xl font-extrabold uppercase whitespace-nowrap py-2 px-4">
    Strategy + Branding
    <OOIcon className="inline-block align-[-0.1em] h-[0.8em] w-auto mx-2 transform scale-x-[-1]" />
    Digital
  </span>
);

export function ServiceBanner() {
  return (
    <section className="bg-accent text-accent-foreground py-10 md:py-12 overflow-x-hidden">
      <div className="relative flex flex-nowrap">
        <div className="animate-marquee flex-shrink-0 flex items-center">
          <BannerContent />
          <BannerContent />
          <BannerContent />
          <BannerContent />
        </div>
        <div className="absolute top-0 animate-marquee2 flex-shrink-0 flex items-center">
          <BannerContent />
          <BannerContent />
          <BannerContent />
          <BannerContent />
        </div>
      </div>
    </section>
  );
}
