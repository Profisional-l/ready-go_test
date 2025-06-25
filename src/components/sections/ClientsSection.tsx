import Image from 'next/image';

const clientLogos = [
  { id: '1', name: 'CocaCola', src: 'https://placehold.co/150x80.png', aiHint: "CocaCola logo" },
  { id: '2', name: 'KFC', src: 'https://placehold.co/150x80.png', aiHint: "KFC logo" },
  { id: '3', name: 'MTBank', src: 'https://placehold.co/150x80.png', aiHint: "MTBank logo" },
  { id: '4', name: 'ARARAT', src: 'https://placehold.co/150x80.png', aiHint: "ARARAT logo" },
  { id: '5', name: 'Nivea', src: 'https://placehold.co/150x80.png', aiHint: "Nivea logo" },
  { id: '6', name: 'BonAqua', src: 'https://placehold.co/150x80.png', aiHint: "BonAqua logo" },
];

export function ClientsSection() {
  return (
    <section className="hidden md:block py-16 md:py-24 px-4">
      {/* <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-8 md:mb-12 text-center">НАШИ КЛИЕНТЫ</h2> */}{" "}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 md:gap-12 items-center justify-items-center">
        {clientLogos.map((logo) => (
          <div key={logo.id} className="relative w-[120px] h-[60px] md:w-[150px] md:h-[80px]">
            <Image
              src={logo.src}
              alt={logo.name}
              layout="fill"
              objectFit="contain"
              className="filter grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300"
              data-ai-hint={logo.aiHint}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
