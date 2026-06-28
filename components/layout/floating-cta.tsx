"use client";

import Link from "next/link";
import { Phone, MessageSquareText } from "lucide-react";

import { siteConfig } from "@/lib/data";

export function FloatingCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:hidden pointer-events-none">
      <div className="flex gap-3 pointer-events-auto">
        <a
          href={siteConfig.phoneHref}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground h-12 text-sm font-medium shadow-lg hover:brightness-105 active:brightness-95 transition-all"
        >
          <Phone className="h-4 w-4" />
          Позвонить
        </a>
        <Link
          href="/contacts/"
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-accent text-accent-foreground h-12 text-sm font-medium shadow-lg hover:brightness-105 active:brightness-95 transition-all"
        >
          <MessageSquareText className="h-4 w-4" />
          Заявка
        </Link>
      </div>
    </div>
  );
}
