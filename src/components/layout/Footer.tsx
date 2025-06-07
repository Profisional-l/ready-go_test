import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from "next/image";


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
    <footer id="contact" className="bg-[#101010] text-background p-7 m-3 rounded-xl">
      <div className="max-w-[1450px] mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-y-12 md:gap-y-0 items-start">
        {/* Left Column */}
        <div className="pt-1 mb-8 md:mb-0">
          <p className="text-[#ffffff] text-[20px] text-muted-foreground/80 pb-[55px]">&copy; READYGO 2025</p>
          <nav className="m-0 space-y-3">
            <Link href="#" aria-label="Instagram" className="text-[24px] block text-base text-background/90 underline hover:text-accent transition-colors">
              Instagram
            </Link>
            <Link href="mailto:hello@readygo.agency" aria-label="Email" className="text-[24px] block text-base text-background/90 underline hover:text-accent transition-colors">
              Email
            </Link>
          </nav>
        </div>

        {/* Right Column - Form */}
        <form action={handleSendMessage} className="w-full">
          <div className="mb-8">
            <h4 className="text-[20px] font-semibold uppercase tracking-wider pb-[55px]">SAY HELLO</h4>
            <p className="text-[#ffffff] text-[24px]">
              Опишите вашу задачу. Или оставьте контакты, <br /> мы с вами свяжемся и все узнаем
            </p>
          </div>

          <div className="mt-10 space-y-10">
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-10">
              <FooterInput type="text" name="name" placeholder="Имя" className="text-[24px]" />
              <FooterInput type="email" name="email" placeholder="Email" className="text-[24px]" />
            </div>

            <div className="relative">
              <FooterInput type="text" name="task" placeholder="Задача" className="text-[24px] pr-10" />
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
      <section className="bg-[#101010] text-background pt-20 md:pt-[170px]">
        <div className="max-w-[1450px] mx-auto  text-center">
          <h2 className="font-mycustom font-extrabold leading-tight uppercase footerText">
            ВЫ READY РАБОТАТЬ С НАМИ?
            <span className="inline-block">
              <Image
                src="/images/smile-icon.png"
                alt="Smile Icon"
                width={99} // Вам может потребоваться изменить эти значения
                height={99} // в зависимости от размеров вашего логотипа
              />
            </span>ТОГДА GO!
          </h2>
        </div>
      </section>
    </footer>
  );
}
