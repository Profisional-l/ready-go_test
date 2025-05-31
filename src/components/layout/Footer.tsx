import Link from 'next/link';
import { Instagram, Mail, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export function Footer() {
  // Basic server action placeholder
  async function handleSendMessage(formData: FormData) {
    "use server";
    const name = formData.get('name');
    const email = formData.get('email');
    const task = formData.get('task');
    console.log('New message:', { name, email, task });
    // Here you would typically send an email or save to a database
    // For now, we'll just log it.
  }

  return (
    <footer id="contact" className="bg-foreground text-background py-12 md:py-16">
      <div className="max-w-[1440px] mx-auto px-8 grid md:grid-cols-2 gap-12 md:gap-8 items-start">
        <div className="space-y-6">
          <h3 className="text-2xl font-bold">READY GO</h3>
          <p className="text-sm text-muted-foreground">&copy; READYGO 2025. Все права защищены.</p>
          <div className="flex space-x-4">
            <Link href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary-foreground transition-colors">
              <Instagram size={24} />
            </Link>
            <Link href="mailto:hello@readygo.agency" aria-label="Email" className="text-muted-foreground hover:text-primary-foreground transition-colors">
              <Mail size={24} />
            </Link>
          </div>
        </div>
        
        <form action={handleSendMessage} className="space-y-4">
          <h4 className="text-xl font-semibold mb-4">Расскажите о вашей задаче</h4>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input 
              type="text" 
              name="name"
              placeholder="Ваше имя" 
              required 
              className="bg-background/10 border-muted-foreground/50 placeholder:text-muted-foreground/70 text-primary-foreground focus:border-primary-foreground"
            />
            <Input 
              type="email" 
              name="email"
              placeholder="Email" 
              required 
              className="bg-background/10 border-muted-foreground/50 placeholder:text-muted-foreground/70 text-primary-foreground focus:border-primary-foreground"
            />
          </div>
          <Textarea 
            name="task"
            placeholder="Опишите вашу задачу" 
            required 
            rows={4}
            className="bg-background/10 border-muted-foreground/50 placeholder:text-muted-foreground/70 text-primary-foreground focus:border-primary-foreground"
          />
          <Button type="submit" variant="default" className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
            Отправить
            <Send size={18} className="ml-2" />
          </Button>
        </form>
      </div>
    </footer>
  );
}
