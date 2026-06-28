"use client";

import Image from "next/image";
import { Eye, Download } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DocumentPreviewProps {
  src: string;
  title: string;
}

export function DocumentPreview({ src, title }: DocumentPreviewProps) {
  const trigger = (
    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-border/50 bg-muted group cursor-pointer card-top-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
      <Image
        src={src}
        alt={title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 50vw, 25vw"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-white/90 text-foreground rounded-full p-3 shadow-lg">
          <Eye className="h-5 w-5" />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
        <p className="text-sm font-medium text-white">{title}</p>
      </div>
    </div>
  );

  return (
    <Dialog>
      <DialogTrigger render={trigger} />
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="relative w-full max-h-[80vh] bg-black flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={title}
            className="max-h-[80vh] w-auto object-contain"
          />
        </div>
        <div className="p-4 border-t bg-muted/30 flex items-center justify-between gap-4">
          <p className="font-medium text-sm truncate">{title}</p>
          <Button
            variant="outline"
            size="sm"
            render={
              <a
                href={src}
                download
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            <Download className="mr-2 h-4 w-4" />
            Скачать
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
