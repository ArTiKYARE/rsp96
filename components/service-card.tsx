import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Service } from "@/lib/models";

interface ServiceCardProps {
  service: Service;
  variant?: "default" | "minimal";
}

export function ServiceCard({ service, variant = "default" }: ServiceCardProps) {
  if (variant === "minimal") {
    return (
      <Link
        href={`/services/${service.slug}/`}
        className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl"
      >
        <Card className="relative h-full overflow-hidden rounded-2xl border-border/40 bg-card card-top-accent transition-all duration-300 hover:shadow-elevated hover:-translate-y-0.5 hover:border-primary/20">
          <div className="relative aspect-[16/9] overflow-hidden bg-muted">
            <Image
              src={service.image}
              alt={service.title}
              fill
              loading="lazy"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <CardContent className="p-5">
            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
              {service.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {service.shortDescription}
            </p>
            <span className="inline-flex items-center text-sm text-muted-foreground group-hover:text-primary transition-colors">
              Подробнее
              <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link
      href={`/services/${service.slug}/`}
      className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl"
    >
      <Card className="relative h-full overflow-hidden rounded-2xl border-border/50 bg-gradient-to-b from-card to-muted/30 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 hover:border-primary/30">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/60 to-accent z-10" />

        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={service.image}
            alt={service.title}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="bg-white text-foreground rounded-full p-3 shadow-xl translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <ArrowUpRight className="h-6 w-6" />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-5">
            <Badge
              variant="secondary"
              className="mb-2 bg-white/15 text-white border-white/10 backdrop-blur-sm hover:bg-white/20"
            >
              Услуга РСП
            </Badge>
            <h3 className="text-xl md:text-2xl font-bold text-white drop-shadow-sm line-clamp-2">
              {service.title}
            </h3>
          </div>
        </div>

        <CardContent className="p-6">
          <p className="text-muted-foreground mb-5 line-clamp-2">
            {service.shortDescription}
          </p>
          <span className="inline-flex items-center text-sm font-semibold text-primary">
            Подробнее
            <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
