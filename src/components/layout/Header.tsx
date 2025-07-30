"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function Header({ showNav = true }: { showNav?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  // Блокировка прокрутки body при открытом меню
  useEffect(() => {
    if (isOpen) {
      document.documentElement.classList.add('modal-open');
    } else {
      document.documentElement.classList.remove('modal-open');
    }
    // Cleanup function to remove class when component unmounts
    return () => {
      document.documentElement.classList.remove('modal-open');
    };
  }, [isOpen]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (isHomePage) {
      e.preventDefault();
      const targetElement = document.querySelector(href);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }
    setIsOpen(false);
  };

  const renderLink = (id: string, text: string) => {
    if (isHomePage) {
      return (
        <a
          href={id}
          onClick={(e) => handleLinkClick(e, id)}
          className="relative group text-[20px] font-medium text-[#0E0E0E]"
        >
          {text}
          <span className="absolute left-0 bottom-[0px] h-[2px] w-0 bg-[#0E0E0E] transition-all duration-300 group-hover:w-full" />
        </a>
      );
    } else {
      return (
        <Link
          href={`/${id}`}
          className="relative group text-[20px] font-medium text-[#0E0E0E]"
        >
          {text}
          <span className="absolute left-0 bottom-[0px] h-[2px] w-0 bg-[#0E0E0E] transition-all duration-300 group-hover:w-full" />
        </Link>
      );
    }
  };

  return (
    <>
      {showNav && (
        <>
          {/* Затемнение фона (по желанию) */}
          <div
            className={`fixed top-0 left-0 w-full h-full bg-black transition-opacity duration-500 z-30 pointer-events-none ${isOpen ? "opacity-50" : "opacity-0"
              }`}
          />

          {/* Мобильное меню */}
          <div
            className={`fixed top-0 left-0 w-full h-[443px] bg-black text-white uppercase flex flex-col items-center justify-center text-[78px] font-mycustom transform transition-transform duration-500 ease-in-out z-40 ${isOpen ? "translate-y-0" : "-translate-y-full"
              }`}
            style={{ willChange: "transform" }}
          >
            {["cases", "about", "contact"].map((id, i) => (
              isHomePage ? (
                <a
                  key={id}
                  className={`h-[75px] animate-fade-in-up delay-[${i * 100}ms]`}
                  href={`#${id}`}
                  onClick={(e) => handleLinkClick(e, `#${id}`)}
                >
                  {id === "cases"
                    ? "Кейсы"
                    : id === "about"
                      ? "О нас"
                      : "Контакты"}
                </a>
              ) : (
                <Link
                  key={id}
                  href={`/#${id}`}
                  className={`h-[75px] animate-fade-in-up delay-[${i * 100}ms]`}
                  onClick={() => setIsOpen(false)}
                >
                  {id === "cases"
                    ? "Кейсы"
                    : id === "about"
                      ? "О нас"
                      : "Контакты"}
                </Link>
              )
            ))}
          </div>
        </>
      )}

      {/* Хедер */}
      <header className="absolute top-0 left-[50%] w-full max-w-[1640px] -translate-x-[50%] z-50 flex items-center justify-between py-4 px-4 md:px-8  bg-transparent">
        {/* Логотип с переходом */}
        <Link href="/" className="relative w-[95px] h-[55px] z-50">
          <div className="relative w-full h-full">
            <Image
              src="/images/svg_w_logo.svg"
              alt="Logo dark"
              fill
              unoptimized={true}
              quality={100}
              className={`transition-opacity duration-500 object-contain ${isOpen ? "opacity-100" : "opacity-0"
                }`}
            />
            <Image
              src="/images/svg_logo.svg"
              alt="Logo light"
              fill
              unoptimized={true}
              quality={100}
              className={`absolute top-0 left-0 transition-opacity duration-500 object-contain ${isOpen ? "opacity-0" : "opacity-100"
                }`}
            />
          </div>
        </Link>

        {showNav && (
          <>
            {/* Десктоп навигация */}
            <nav className="hidden md:block absolute left-1/2 transform -translate-x-1/2  z-40">
              <div className="flex space-x-10">
                {["cases", "about", "contact"].map((id) => (
                  <div key={id}>
                    {renderLink(
                      `#${id}`,
                      id === "cases"
                        ? "Кейсы"
                        : id === "about"
                          ? "О нас"
                          : "Контакты"
                    )}
                  </div>
                ))}
              </div>
            </nav>

            {/* Мобильная кнопка */}
            <div className="md:hidden z-50">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-[30px] h-6 flex flex-col justify-between items-center focus:outline-none"
              >
                <span
                  className={`w-[28.87px] h-[3px] transform transition duration-300 ease-in-out ${isOpen ? "rotate-45 translate-y-[11px] bg-white" : "bg-black"
                    }`}
                />
                <span
                  className={`w-[28.87px] h-[3px] transition-opacity duration-300 ease-in-out ${isOpen ? "opacity-0" : "opacity-100 bg-black"
                    }`}
                />
                <span
                  className={`w-[28.87px] h-[3px] transform transition duration-300 ease-in-out ${isOpen ? "-rotate-45 -translate-y-[10px] bg-white" : "bg-black"
                    }`}
                />
              </button>
            </div>
          </>
        )}
      </header>

      {/* Анимация появления пунктов меню */}
      <style jsx>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.4s ease-out forwards;
        }

        .delay-[0ms] {
          animation-delay: 0ms;
        }
        .delay-[100ms] {
          animation-delay: 100ms;
        }
        .delay-[200ms] {
          animation-delay: 200ms;
        }
      `}</style>
    </>
  );
}