import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";

import { siteConfig, navigation } from "@/lib/data";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                <Image src="/images/logo.svg" alt={siteConfig.name} fill className="object-contain" />
              </div>
              <div>
                <p className="font-bold leading-tight">{siteConfig.shortName}</p>
                <p className="text-xs text-muted-foreground leading-tight">РемСтройПроект</p>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground">
              Не просто доставка — связь регионов. Для гигантов и тех, кто ими становится.
            </p>
            <div className="space-y-2 text-sm">
              <a href={siteConfig.phoneHref} className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone className="h-4 w-4 text-primary" />
                {siteConfig.phone}
              </a>
              <a href={siteConfig.emailHref} className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="h-4 w-4 text-primary" />
                {siteConfig.email}
              </a>
              <p className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {siteConfig.address}
              </p>
            </div>
          </div>

          {/* Menu */}
          <div>
            <h4 className="font-semibold mb-4">Меню</h4>
            <ul className="space-y-2.5 text-sm">
              {navigation.footer.menu.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Услуги</h4>
            <ul className="space-y-2.5 text-sm">
              {navigation.footer.services.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Документы</h4>
            <ul className="space-y-2.5 text-sm">
              {navigation.footer.legal.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-xs text-muted-foreground">
          <p>
            Материалы сайта носят информационный характер и не являются публичной офертой, определяемой положениями
            Статьи 437 Гражданского кодекса РФ.
          </p>
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}
