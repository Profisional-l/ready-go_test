"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { sendMessage } from "@/actions/sendMessage";

// Validation logic (can be moved to a separate file if it grows)
const validateName = (value: string) =>
  value.trim().length < 2 ? "Введите корректное имя" : null;
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
  const [value, setValue] = useState("");
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
          "w-full bg-transparent border-0 border-b text-white placeholder:text-white/50 focus:outline-none transition-all duration-300 py-1 appearance-none rounded-none",
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
  const eyesRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [eyeStyle, setEyeStyle] = useState<React.CSSProperties>({});

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  // Определяем мобильное устройство
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Анимация глаз
  useEffect(() => {
    const mouse = { x: 0, y: 0 };
    let animFrame: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const update = () => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const { x, y } = mouse;

      if (eyesRef.current) {
        const eyesRect = eyesRef.current.getBoundingClientRect();
        const eyesCenterX = eyesRect.left + eyesRect.width / 2;
        const eyesCenterY = eyesRect.top + eyesRect.height / 2;

        const angle = Math.atan2(y - eyesCenterY, x - eyesCenterX);
        const distance = 8;
        const eyeX = Math.cos(angle) * distance;
        const eyeY = Math.sin(angle) * distance * 1.7;

        setEyeStyle({
          transform: `translate(${eyeX}px, ${eyeY}px)`,
          transition: "transform 0.22s ease-out",
        });
      }

      animFrame = requestAnimationFrame(update);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animFrame = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Clear the form fields
    const form = event.currentTarget;
    (form.elements.namedItem("name") as HTMLInputElement).value = "";
    (form.elements.namedItem("email") as HTMLInputElement).value = "";
    (form.elements.namedItem("task") as HTMLInputElement).value = "";

    // Show the success modal

    setShowSuccessModal(true);
  };
  return (
      <footer id="contact" className="md:bg-[#0E0E0E] text-background m-3 rounded-xl footer-content-wrapper">
        <div className="max-w-[1450px] mx-auto px-4 bg-transparent grid grid-cols-1 md:grid-cols-2 gap-y-12 md:gap-y-0 items-start footer-groop">
          {/* Left Column (Links & Copyright) - shows on left on desktop */}
          <div className="pt-1 md:mb-0 links-container">
            <p className="text-foreground md:text-white text-[20px] pb-[55px] font-semibold tight-spacing-1 footer-adapt-subtitle">
              &copy; READYGO 2025
            </p>
            <nav className="m-0 space-y-3">
              <Link
                href="https://www.instagram.com/ready.go.agency/"
                aria-label="Instagram"
                className="text-foreground md:text-white text-[24px] block underline hover:text-accent transition-colors tight-spacing-1 footer-adapt-title"
              >
                Instagram
              </Link>
              <Link
                href="mailto:go@rg.by"
                aria-label="Email"
                className="text-foreground md:text-white text-[24px] underline block hover:text-accent transition-colors tight-spacing-1 footer-adapt-title"
              >
                Email
              </Link>
            </nav>
          </div>

          {/* Right Column - Form - shows on right on desktop */}
          <form onSubmit={handleSubmit} className="w-full form-container">
            <div className="mb-8">
              <h4 className="text-[16px] md:text-[20px] font-semibold uppercase tracking-wider pb-[42px] tight-spacing-1 text-white">
                ГОУ ЗНАКОМИТЬСЯ
              </h4>
              <p className="text-[#ffffff] text-[18px] md:text-[24px] tight-spacing-1">
                Опишите вашу задачу. Или оставьте контакты,{" "}
                <br className="hidden md:block" /> мы с вами свяжемся и все
                узнаем
              </p>
            </div>

            <div className="mt-10 space-y-6 max-w-[555px]">
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
                <ValidatedInput
                  type="text"
                  name="name"
                  placeholder="Имя"
                  className="text-[18px] md:text-[24px] footer-input"
                  validate={(val) =>
                    val.trim().length < 2 ? "Введите корректное имя" : null
                  }
                />
                <ValidatedInput
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="text-[18px] md:text-[24px] footer-input"
                  validate={(val) =>
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
                      ? null
                      : "Введите корректный email"
                  }
                />
              </div>

              <div className="relative task-adapt">
                <ValidatedInput
                  type="text"
                  name="task"
                  placeholder="Задача"
                  className="text-[18px] md:text-[24px] pr-10 footer-input footer-input-text"
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
                  {isMobile ? (
                    <ArrowRight size={22} />
                  ) : showSuccessModal ? (
                    <Check size={22} color="#04D6E3" />
                  ) : (
                    <ArrowRight size={22} />
                  )}
                </Button>
              </div>
            </div>

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

      <section className="text-center pt-20 md:pt-[170px] overflow-hidden">
        <div className="w-full max-w-[1600px] mx-auto px-4">
          <h2
            className="font-mycustom font-extrabold uppercase text-white whitespace-nowrap w-full"
            style={{ fontSize: "7.5vw", lineHeight: 1.1 }}
          >
            ВЫ <span className="textToBorderBlack">READY</span> РАБОТАТЬ С НАМИ?
            <span className="inline-block relative align-middle -mt-5" style={{ height: ".83em", width: "calc(95/103 * 1em)" }} ref={eyesRef}>
              <div className="relative w-full h-full">
                {isMobile ? (
                  <Image src="/images/eyes_Group127.svg" alt="глаза" unoptimized layout="fill" objectFit="contain" />
                ) : (
                  <>
                    <Image src="/images/eyes0.svg" alt="глаза" unoptimized layout="fill" objectFit="contain" />
                    <div className="absolute top-1/2 left-1/2 w-full h-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                      <div style={{
                        position: "absolute",
                        top: "33%",
                        left: "33%",
                        width: "50%",
                        aspectRatio: "59/35",
                        transform: "translate(-50%, -50%)",
                        ...eyeStyle,
                      }}>
                        <Image src="/images/eyes1.svg" alt="зрачки" unoptimized layout="fill" objectFit="contain" />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </span>
            ТОГДА <span className="textToBorderBlack">GO</span>!
          </h2>
        </div>
      </section>

        {showSuccessModal && isMobile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center relative footer-message">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-4 right-4 rounded-full bg-gray-200 p-2 hover:bg-gray-300 transition-colors"
                aria-label="Закрыть"
              >
                <Image
                  src="/images/close_Vector.png"
                  alt="close"
                  width={16}
                  height={16}
                />
              </button>
              <h3 className="text-[27px] font-bold tight-spacing-1 text-black">
                Спасибо!
              </h3>
              <p className="text-[16px] text-[#0E0E0E80] text-600 text-lg">
                Ваше сообщение успешно <br></br> отправлено
              </p>
            </div>
          </div>
        )}
      </footer>
  );
}
