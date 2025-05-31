import Link from 'next/link';

export function Header() {
  return (
    <header className="flex items-center justify-between py-5">
      <Link href="/" className="text-2xl font-extrabold text-foreground">
        READY <span className="text-accent">GO</span>
      </Link>
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
    </header>
  );
}
