'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Menu } from 'lucide-react';
import { Separator } from '../ui/separator';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="relative flex items-center justify-between py-5 px-4 md:px-8 lg:px-12">
      {/* Logo positioned to the left */}
      <div className="flex-shrink-0">
        <Link href="/">
          <Image
            src="/images/logo.png"
            alt="Company Logo"
            width={95} // Вам может потребоваться изменить эти значения
            height={55} // в зависимости от размеров вашего логотипа
            className="h-auto w-auto" // Для лучшей адаптивности
          />
        </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex flex-grow justify-center">
        <ul className="flex space-x-6">
          <li>
            <Link
              href="#cases"
              className="relative group text-[20px] font-medium tracking-wider text-foreground"
              onClick={() => setIsOpen(false)}
            >
              Кейсы
              <span className="absolute left-0 bottom-[-4px] h-[2px] w-0 bg-foreground transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </li>
          <li>
            <Link
              href="#about"
              className="relative group text-[20px] font-medium tracking-wider text-foreground"
              onClick={() => setIsOpen(false)}
            >
              О нас
              <span className="absolute left-0 bottom-[-4px] h-[2px] w-0 bg-foreground transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </li>
          <li>
            <Link
              href="#contact"
              className="relative group text-[20px] font-medium tracking-wider text-foreground"
              onClick={() => setIsOpen(false)}
            >
              Контакты
              <span className="absolute left-0 bottom-[-4px] h-[2px] w-0 bg-foreground transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </li>
          <li>
            <Link
              href="#about"
              className="relative group text-[20px] font-medium tracking-wider text-foreground"
            >
              О нас
              <span className="absolute left-0 bottom-[-4px] h-[2px] w-0 bg-foreground transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </li>
          <li>
            <Link
              href="#contact"
              className="relative group text-[20px] font-medium tracking-wider text-foreground"
            >
              Контакты
              <span className="absolute left-0 bottom-[-4px] h-[2px] w-0 bg-foreground transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Mobile Navigation (Burger Menu) */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col space-y-4 pt-8">
              <Link
                href="#cases"
                className="text-lg font-medium text-foreground"
                onClick={() => setIsOpen(false)}
              >
                Кейсы
              </Link>
              <Separator />
              <Link
                href="#about"
                className="text-lg font-medium text-foreground"
                onClick={() => setIsOpen(false)}
              >
                О нас
              </Link>
              <Separator />
              <Link
                href="#contact"
                className="text-lg font-medium text-foreground"
                onClick={() => setIsOpen(false)}
              >
                Контакты
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}