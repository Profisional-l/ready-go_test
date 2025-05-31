import Link from 'next/link';

export function Header() {
  return (
    <header className="relative flex items-center justify-center py-5">
      {/* Logo positioned to the left */}
      <div className="absolute left-0">
        <Link href="/" className="text-2xl font-extrabold text-foreground">
          READY <span className="text-accent">GO</span>
        </Link>
      </div>
      
      {/* Navigation centered in the header */}
      <nav>
        <ul className="flex space-x-6">
          <li>
            <Link href="#cases" className="text-xs uppercase font-medium tracking-wider text-foreground hover:text-accent transition-colors">
              Кейсы
            </Link>
          </li>
          <li>
            <Link href="#about" className="text-xs uppercase font-medium tracking-wider text-foreground hover:text-accent transition-colors">
              О нас
            </Link>
          </li>
          <li>
            <Link href="#contact" className="text-xs uppercase font-medium tracking-wider text-foreground hover:text-accent transition-colors">
              Контакты
            </Link>
          </li>
        </ul>
      </nav>
      
      {/* If there were elements on the right, they could be absolutely positioned too */}
      {/* <div className="absolute right-0"></div> */}
    </header>
  );
}
