import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  return (
    <header className="relative flex items-center justify-center py-5">
      {/* Logo positioned to the left */}
      <div className="absolute left-0">
        <Link href="/">
          <Image
            src="/images/logo.png"
            alt="Company Logo"
            width={95} // Вам может потребоваться изменить эти значения
            height={55} // в зависимости от размеров вашего логотипа
          />
        </Link>
      </div>

      {/* Navigation centered in the header */}
      <nav>
        <ul className="flex space-x-6">
          <li>
            <Link
              href="#cases"
              className="relative group text-[20px] uppercase font-medium tracking-wider text-foreground"
            >
              Кейсы
              <span className="absolute left-0 bottom-[-4px] h-[2px] w-0 bg-foreground transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </li>
          <li>
            <Link
              href="#about"
              className="relative group text-[20px] uppercase font-medium tracking-wider text-foreground"
            >
              О нас
              <span className="absolute left-0 bottom-[-4px] h-[2px] w-0 bg-foreground transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </li>
          <li>
            <Link
              href="#contact"
              className="relative group text-[20px] uppercase font-medium tracking-wider text-foreground"
            >
              Контакты
              <span className="absolute left-0 bottom-[-4px] h-[2px] w-0 bg-foreground transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* If there were elements on the right, they could be absolutely positioned too */}
      {/* <div className="absolute right-0"></div> */}
    </header>
  );
}
