import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="py-24 lg:py-32">
      <div className="container text-center">
        <h1 className="text-8xl md:text-9xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Страница не найдена</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Запрошенная страница не существует или была перемещена.
        </p>
        <Link href="/" className={buttonVariants({ size: "lg" })}>
          Вернуться на главную
        </Link>
      </div>
    </section>
  );
}
