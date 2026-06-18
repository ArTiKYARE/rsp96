"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const COOKIE_CONSENT_KEY = "rsp-cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-md p-4 shadow-2xl">
      <div className="container flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Мы используем файлы cookie. Продолжая использовать сайт, вы соглашаетесь с{" "}
          <Link href="/cookie" className="text-primary hover:underline">
            политикой использования cookie
          </Link>
          .
        </p>
        <Button onClick={accept} size="sm" className="shrink-0">
          Принять
        </Button>
      </div>
    </div>
  );
}
