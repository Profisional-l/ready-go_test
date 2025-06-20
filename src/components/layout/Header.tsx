'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Мобильное выезжающее меню */}
      <div
        className={`fixed top-0 left-0 w-full h-[443px] bg-black text-white uppercase flex flex-col items-center justify-center text-[78px] font-mycustom mb-10 transform transition-transform duration-500 ease-in-out z-40 ${
          isOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
        style={{ willChange: 'transform' }}
      >
        <a className='h-[75px]' href="#cases" onClick={(e) => handleLinkClick(e, '#cases')}>
          Кейсы
        </a>
        <a className='h-[75px]' href="#about" onClick={(e) => handleLinkClick(e, '#about')}>
          О нас
        </a>
        <a className='h-[75px]' href="#contact" onClick={(e) => handleLinkClick(e, '#contact')}>
          Контакты
        </a>
      </div>

      {/* Хедер */}
      <header className="top-0 left-0 w-full z-50 flex items-center justify-between py-4 px-4 md:px-8 bg-transparent">
        {/* Логотип со сменой изображения */}
        <Link href="/" className="relative w-[95px] h-[55px] z-50">
          <div className="relative w-full h-full">
            <Image
              src="/images/w_logo.png"
              alt="Logo dark"
              fill
              className={`transition-opacity duration-500 object-contain ${
                isOpen ? 'opacity-100' : 'opacity-0'
              }`}
            />
            <Image
              src="/images/logo.png"
              alt="Logo light"
              fill
              className={`absolute top-0 left-0 transition-opacity duration-500 object-contain ${
                isOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
          </div>
        </Link>

        {/* Десктоп навигация */}
        <nav className="hidden md:flex space-x-6 mr-[95px]">
          {['cases', 'about', 'contact'].map((id, i) => (
            <a
              key={i}
              href={`#${id}`}
              onClick={(e) => handleLinkClick(e, `#${id}`)}
              className="relative group text-[20px] font-medium tracking-wider text-foreground"
            >
              {id === 'cases' ? 'Кейсы' : id === 'about' ? 'О нас' : 'Контакты'}
              <span className="absolute left-0 bottom-[-4px] h-[2px] w-0 bg-foreground transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Мобильная кнопка (бургер → крестик) */}
        <div className="md:hidden z-50">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative w-[30px] h-6 flex flex-col justify-between items-center focus:outline-none "
          >
            <span
              className={`w-[28.87px] h-[3px] transform transition duration-300 ease-in-out ${
                isOpen ? 'rotate-45 translate-y-[10px] bg-white' : 'bg-black'
              }`}
            />
            <span
              className={`w-[28.87px] h-[3px] transition-opacity duration-300 ease-in-out ${
                isOpen ? 'opacity-0' : 'opacity-100 bg-black'
              }`}
            />
            <span
              className={`w-[28.87px] h-[3px] transform transition duration-300 ease-in-out ${
                isOpen ? '-rotate-45 -translate-y-[10px] bg-white' : 'bg-black'
              }`}
            />
          </button>
        </div>
      </header>
    </>
  );
}
