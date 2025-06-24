'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from "next/image";
import { useState } from 'react';
import { sendMessage } from '@/actions/sendMessage'; // ✅ Импорт server action

function ValidatedInput({
  type,
  name,
  placeholder,
  validate,
  className,
}: {
  type: string;
  name: string;
  placeholder: string;
  validate: (value: string) => string | null;
  className?: string;
}) {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const handleBlur = () => {
    setTouched(true);
    setError(validate(value));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (touched) {
      setError(validate(e.target.value));
    }
  };

  return (
    <div>
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onBlur={handleBlur}
        onChange={handleChange}
        className={cn(
          "w-full bg-transparent border-0 border-b text-white placeholder:text-white/50 focus:outline-none transition-all duration-300 py-3 appearance-none rounded-none",
          error
            ? "border-red-500 focus:border-red-500"
            : "border-white/40 focus:border-white",
          className
        )}
        required
      />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}

export function Footer() {
  return (
    <footer id="contact" className="bg-[#101010] text-background p-7 m-3 rounded-xl">
      <div className="max-w-[1450px] mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-y-12 md:gap-y-0 items-start footer-groop">
        {/* Left Column */}
        <div className="pt-1 mb-8 md:mb-0 footer-top">
          <p className="text-[#ffffff] text-[20px] pb-[55px] tight-spacing-1 footer-adapt-subtitle">&copy; READYGO 2025</p>
          <nav className="m-0 space-y-3">
            <Link href="#" aria-label="Instagram" className="text-[24px] block underline hover:text-accent transition-colors tight-spacing-1 footer-adapt-title">
              Instagram
            </Link>
            <Link href="mailto:hello@readygo.agency" aria-label="Email" className="text-[24px] underline block hover:text-accent transition-colors tight-spacing-1 footer-adapt-title">
              Email
            </Link>
          </nav>
        </div>

        {/* Right Column - Form */}
        <form action={sendMessage} className="w-full">
          <div className="mb-8">
            <h4 className="text-[20px] font-semibold uppercase tracking-wider pb-[55px] tight-spacing-1">ГОУ ЗНАКОМИТЬСЯ</h4>
            <p className="text-[#ffffff] text-[24px] tight-spacing-1">
              Опишите вашу задачу. Или оставьте контакты, <br /> мы с вами свяжемся и все узнаем
            </p>
          </div>

          <div className="mt-10 space-y-10">
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-10">
              <ValidatedInput
                type="text"
                name="name"
                placeholder="Имя"
                className="text-[24px] footer-input"
                validate={(val) => val.trim().length < 2 ? "Введите корректное имя" : null}
              />
              <ValidatedInput
                type="email"
                name="email"
                placeholder="Email"
                className="text-[24px] footer-input"
                validate={(val) =>
                  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? null : "Введите корректный email"
                }
              />
            </div>

            <div className="relative">
              <ValidatedInput
                type="text"
                name="task"
                placeholder="Задача"
                className="text-[24px] pr-10 footer-input footer-input-text"
                validate={(val) =>
                  val.trim().length < 5 ? "Опишите задачу подробнее" : null
                }
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-1/2 transform -translate-y-1/2 text-muted-foreground/70 hover:text-accent h-auto p-1 focus:ring-0 focus:ring-offset-0 ft-button"
                aria-label="Отправить"
              >
                <ArrowRight size={22} />
              </Button>
            </div>
          </div>
          {/* Adaptive Button */}
          <Button
            type="submit"
            variant="ghost"
            className="footer-button"
            aria-label="Отправить"
          >
            Отправить
          </Button>
        </form>
      </div>

      <section className="bg-[#101010] text-background pt-20 md:pt-[170px]">
        <div className="max-w-[1450px] mx-auto text-center">
          <h2 className="font-mycustom font-extrabold leading-tight uppercase footerText">
            ВЫ  <span className="textToBorderBlack">READY</span> РАБОТАТЬ  С НАМИ?
            <span className="inline-block">
              <Image
                src="/images/smile-icon.png"
                alt="Smile Icon"
                width={99}
                height={99}
              />
            </span>
            ТОГДА <span className="textToBorderBlack">GO!</span>
          </h2>
        </div>
      </section>
    </footer>
  );
}
