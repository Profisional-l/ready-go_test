
"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState, useEffect, useRef, type FormEvent, type ChangeEvent } from "react";
import { sendMessage } from "@/actions/sendMessage";
import { useIsMac } from '@/hooks/isSafari';

const validateName = (value: string) => value.trim().length >= 2 ? null : "Имя слишком короткое";
const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : "Введите корректный email";
const validateTask = (value: string) => value.trim().length >= 5 ? null : "Опишите задачу подробнее";

function ValidatedInput({
  type,
  name,
  placeholder,
  validate,
  onValidate,
  className,
  isSubmitting,
  reset,
}: {
  type: string;
  name: string;
  placeholder: string;
  validate: (value: string) => string | null;
  onValidate: (name: string, isValid: boolean) => void;
  className?: string;
  isSubmitting: boolean;
  reset: boolean;
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  
  useEffect(() => {
    if (reset) {
      setValue("");
      setError(null);
      setTouched(false);
    }
  }, [reset]);

  const handleBlur = () => {
    setTouched(true);
    const validationError = validate(value);
    setError(validationError);
    onValidate(name, !validationError);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (touched) {
      const validationError = validate(newValue);
      setError(validationError);
      onValidate(name, !validationError);
    }
  };

  const InputComponent = type === 'textarea' ? 'textarea' : 'input';

  return (
    <div className="relative h-full">
      <InputComponent
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onBlur={handleBlur}
        onChange={handleChange}
        required
        disabled={isSubmitting}
        id={`form-adapt-${name}`}
        rows={type === 'textarea' ? 1 : undefined}
        className={cn(
          "w-full bg-transparent footer-form text-white placeholder:text-white/50 focus:outline-none transition-all duration-300 py-1 appearance-none rounded-xl",
          error
            ? "form-adapt-error border-red-500 focus:border-red-500"
            : "form-adapt-ok [&:not(:placeholder-shown)]:border-white border-white/40 focus:border-white",
          className
        )}
      />
      {error && <p className="text-red-500 text-sm mt-1 absolute -bottom-5 left-0">{error}</p>}
    </div>
  );
}

export function Footer() {
  const eyesRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isBig, setIsBig] = useState(false);
  const [isSoBig, setIsSoBig] = useState(false);
  const [isExtraBig, setIsExtraBig] = useState(false);
  const [isXExtraBig, setIsXExtraBig] = useState(false);

  const [eyeStyle, setEyeStyle] = useState<React.CSSProperties>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetFields, setResetFields] = useState(false);
  const [fieldValidity, setFieldValidity] = useState({
    name: false,
    email: false,
    task: false,
  });

  const isFormValid = Object.values(fieldValidity).every(Boolean);

  // --- Start of Effects ---
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const checkBig = () => setIsBig(window.innerWidth > 1650 && window.innerWidth < 1921);
    checkBig();
    window.addEventListener("resize", checkBig);
    return () => window.removeEventListener("resize", checkBig);
  }, []);

  useEffect(() => {
    const checkSoBig = () => setIsSoBig(window.innerWidth > 1921 && window.innerWidth < 2200);
    checkSoBig();
    window.addEventListener("resize", checkSoBig);
    return () => window.removeEventListener("resize", checkSoBig);
  }, []);

  useEffect(() => {
    const checkExtraBig = () => setIsExtraBig(window.innerWidth > 2200 && window.innerWidth < 2320);
    checkExtraBig();
    window.addEventListener("resize", checkExtraBig);
    return () => window.removeEventListener("resize", checkExtraBig);
  }, []);

  useEffect(() => {
    const checkXExtraBig = () => setIsXExtraBig(window.innerWidth > 2320);
    checkXExtraBig();
    window.addEventListener("resize", checkXExtraBig);
    return () => window.removeEventListener("resize", checkXExtraBig);
  }, []);

  useEffect(() => {
    const mouse = { x: 0, y: 0 };
    let animFrame: number | null = null;
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const update = () => {
      if (eyesRef.current) {
        const rect = eyesRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angle = Math.atan2(mouse.y - centerY, mouse.x - centerX);
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
  // --- End of Effects ---

  const handleFieldValidate = (name: string, isValid: boolean) => {
    setFieldValidity((prev) => ({ ...prev, [name]: isValid }));
  };
  
  const isSafariOrIOS = useIsMac();
  
  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      // Trigger blur on all fields to show errors if not touched
      Array.from(formRef.current!.elements).forEach(el => {
          if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
              el.focus();
              el.blur();
          }
      });
      
      // Check validity after triggering validation
      if (!isFormValid) {
          return;
      }

      setIsSubmitting(true);
      setResetFields(false);

      const formData = new FormData(event.currentTarget);
      const result = await sendMessage(formData);
      
      setIsSubmitting(false);

      if (result.success) {
          setShowSuccessModal(true);
          setResetFields(true); // Signal to child components to reset
          setFieldValidity({ name: false, email: false, task: false });
          setTimeout(() => setShowSuccessModal(false), 3000);
      } else {
          alert(result.message || 'Произошла ошибка при отправке.');
      }
  };

  return (
    <footer
      id="contact"
      className="md:bg-[#0E0E0E] text-background m-3 rounded-xl footer-content-wrapper"
    >
      <div className="max-w-[1640px] px-[23px] md:mx-auto pt-5 bg-transparent grid grid-cols-1 md:grid-cols-2 gap-y-12 md:gap-y-0 items-start footer-groop">
        <div className="md:pt-1 md:mb-0 links-container">
          <p className="text-foreground md:text-white text-[20px] pb-[55px] font-semibold tight-spacing-1 footer-adapt-subtitle">
            &copy; READYGO 2025
          </p>
          <nav className="m-0 space-y-3">
            <Link
              href="https://www.instagram.com/ready.go.agency/"
              className="text-foreground md:text-white text-[24px] block hover:text-accent transition-colors tight-spacing-1 footer-adapt-title"
            >
              Instagram
            </Link>
            <Link
              href="mailto:go@rg.by"
              className="text-foreground md:text-white text-[24px] block hover:text-accent transition-colors tight-spacing-1 footer-adapt-title"
            >
              Email
            </Link>
          </nav>
        </div>

        <form ref={formRef} onSubmit={handleFormSubmit} className="w-full form-container" noValidate>
          <div className="mb-8">
            <h4 className="text-[16px] md:text-[20px] font-semibold uppercase tracking-wider pb-[42px] tight-spacing-1 text-white">
              ГОУ ЗНАКОМИТЬСЯ
            </h4>
            <p className="text-[#ffffff] text-[18px] md:text-[24px] tight-spacing-1 footer-subtitle">
              Опишите вашу задачу. Или <br className="block md:hidden" />{" "}
              оставьте контакты, <br className="hidden md:block" /> мы с вами{" "}
              <br className="block md:hidden" /> свяжемся и все узнаем
            </p>
          </div>

          <div className="mt-10 space-y-8 max-w-[555px]">
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-8">
              <ValidatedInput
                type="text"
                name="name"
                placeholder="Имя"
                className="text-[18px] md:text-[24px] footer-input"
                validate={validateName}
                onValidate={handleFieldValidate}
                isSubmitting={isSubmitting}
                reset={resetFields}
              />
              <ValidatedInput
                type="email"
                name="email"
                placeholder="Email"
                className="text-[18px] md:text-[24px] footer-input"
                validate={validateEmail}
                onValidate={handleFieldValidate}
                isSubmitting={isSubmitting}
                reset={resetFields}
              />
            </div>
            <div className="relative task-adapt">
              <ValidatedInput
                  type="textarea"
                  name="task"
                  placeholder="Задача"
                  className="text-[18px] md:text-[24px] pr-10 footer-input footer-input-text"
                  validate={validateTask}
                  onValidate={handleFieldValidate}
                  isSubmitting={isSubmitting}
                  reset={resetFields}
                />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-1/2 transform -translate-y-1/2 text-muted-foreground/70 hover:text-accent h-auto p-1 focus:ring-0 focus:ring-offset-0 ft-button"
                aria-label="Отправить"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                ) : (
                  <Image
                    src="/images/ArrowRight.svg"
                    alt="Стрелка"
                    width={22}
                    height={22}
                  />
                )}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            variant="ghost"
            className="footer-button"
            aria-label="Отправить"
            disabled={isSubmitting || !isFormValid}
          >
             {isSubmitting ? 'Отправка...' : 'Отправить'}
          </Button>
        </form>
      </div>

      <section className="text-center pt-20 md:pt-[170px] overflow-hidden">
        <div className="w-full max-w-[1600px] mx-auto px-0">
          <h2
            className={`font-mycustom mb-4 font-extrabold uppercase text-white whitespace-nowrap w-full footer-lable ${isSafariOrIOS ? 'safari-fix' : ''}`}
            style={
              isBig
                ? { fontSize: "5.4vw", lineHeight: 1.1 }
                : isSoBig
                  ? { fontSize: "5.43vw", lineHeight: 1.1 }
                  : isExtraBig
                    ? { fontSize: "5.45vw", lineHeight: 1.1 }
                    : isXExtraBig
                      ? { fontSize: "126px", lineHeight: 1.1 }
                      : { fontSize: "7.6vw", lineHeight: 1.1 }
            }
          >
            ВЫ <span className="textToBorderBlack">READY</span> РАБОТАТЬ С НАМИ?
            <span
              className="inline-block relative align-middle -mt-7"
              style={{ height: ".87em", width: "calc(95/103 * 1em)" }}
              ref={eyesRef}
            >
              <div className="relative w-full h-full">
                {isMobile ? (
                  <Image
                    src="/images/eyes_Group127.svg"
                    alt="глаза"
                    unoptimized
                    layout="fill"
                    objectFit="contain"
                  />
                ) : (
                  <>
                    <Image
                      src="/images/eyes0.svg"
                      alt="глаза"
                      unoptimized
                      layout="fill"
                      objectFit="contain"
                    />
                    <div className="absolute top-1/2 left-1/2 w-full h-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                      <div
                        style={{
                          position: "absolute",
                          top: "33%",
                          left: "33%",
                          width: "50%",
                          aspectRatio: "59/35",
                          transform: "translate(-50%, -50%)",
                          ...eyeStyle,
                        }}
                      >
                        <Image
                          src="/images/eyes1.svg"
                          alt="зрачки"
                          unoptimized
                          layout="fill"
                          objectFit="contain"
                        />
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
              Ваше сообщение успешно <br /> отправлено
            </p>
          </div>
        </div>
      )}
    </footer>
  );
}

    