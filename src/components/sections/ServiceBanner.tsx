import { Eye } from 'lucide-react';

export function ServiceBanner() {
  return (
    <section className="bg-accent text-accent-foreground py-10 md:py-12">
      <div className="max-w-[1440px] mx-auto px-8 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
          STRATEGY + BRANDING 
          <Eye size={48} className="inline-block align-[-0.1em] mx-2 transform scale-x-[-1]" />
          DIGITAL
        </h2>
      </div>
    </section>
  );
}
