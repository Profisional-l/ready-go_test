import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Custom Input component for the footer
function FooterInput({ type, name, placeholder, className, required = true }: { type: string, name: string, placeholder: string, className?: string, required?: boolean }) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      required={required}
      className={cn(
        "w-full bg-transparent border-0 border-b border-background/40 text-background placeholder:text-muted-foreground/70 focus:ring-0 focus:border-accent transition-colors duration-300 py-3 appearance-none rounded-none text-base",
        className
      )}
    />
  );
}

export function Footer() {
  async function handleSendMessage(formData: FormData) {
    "use server";
    const name = formData.get('name');
    const email = formData.get('email');
    const task = formData.get('task');
    console.log('New message:', { name, email, task });
    // TODO: Add actual email sending logic or toast message here
  }

  return (
    <footer id="contact" className="bg-foreground text-background py-16 md:py-24">
      <div className="max-w-[1440px] mx-auto px-8 grid md:grid-cols-2 gap-x-16 gap-y-12 md:gap-y-0 items-start">
        {/* Left Column */}
        <div className="space-y-6 pt-1">
          <p className="text-sm text-muted-foreground/80">&copy; READYGO 2025</p>
          <nav className="space-y-3">
            <Link href="#" aria-label="Instagram" className="block text-base text-background/90 underline hover:text-accent transition-colors">
              Instagram
            </Link>
            <Link href="mailto:hello@readygo.agency" aria-label="Email" className="block text-base text-background/90 underline hover:text-accent transition-colors">
              Email
            </Link>
          </nav>
        </div>
        
        {/* Right Column - Form */}
        <form action={handleSendMessage} className="w-full">
          <div className="mb-3">
            <h4 className="text-lg font-semibold uppercase tracking-wider mb-3">SAY HELLO</h4>
            <p className="text-sm text-muted-foreground/80 max-w-md">
              Опишите вашу задачу. Или оставьте контакты, мы с вами свяжемся и все узнаем
            </p>
          </div>
          
          <div className="mt-10 space-y-10">
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-10">
              <FooterInput type="text" name="name" placeholder="Имя" />
              <FooterInput type="email" name="email" placeholder="Email" />
            </div>
            
            <div className="relative">
              <FooterInput type="text" name="task" placeholder="Задача" className="pr-10" />
              <Button 
                type="submit" 
                variant="ghost" 
                size="icon" 
                className="absolute right-0 top-1/2 transform -translate-y-1/2 text-muted-foreground/70 hover:text-accent h-auto p-1 focus:ring-0 focus:ring-offset-0"
                aria-label="Отправить"
              >
                <ArrowRight size={22} />
              </Button>
            </div>
          </div>
        </form>
      </div>
      <section className="bg-foreground text-background py-16 md:py-24">
      <div className="max-w-[1440px] mx-auto px-8 text-center">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight uppercase">
          ВЫ READY РАБОТАТЬ<br className="hidden sm:inline" /> С НАМИ?
          <span className="mx-2 text-accent">☻</span>
          ТОГДА <span className="text-accent">GO!</span>
        </h2>
      </div>
    </section>
    </footer>
  );
}
