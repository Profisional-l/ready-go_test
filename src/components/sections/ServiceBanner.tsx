import { OOIcon } from '@/components/icons/OOIcon';

export function ServiceBanner() {
  return (
    <section className="bg-accent text-accent-foreground py-10 md:py-12">
      <div className="max-w-[1440px] mx-auto px-8 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold uppercase">
          Strategy + Branding 
          <OOIcon className="inline-block align-[-0.1em] h-[0.8em] w-auto mx-2 transform scale-x-[-1]" />
          Digital
        </h2>
      </div>
    </section>
  );
}
