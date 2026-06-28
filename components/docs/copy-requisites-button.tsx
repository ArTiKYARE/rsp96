"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

import { Button } from "@/components/ui/button";

interface RequisiteItem {
  label: string;
  value: string;
}

interface CopyRequisitesButtonProps {
  requisites: RequisiteItem[];
}

export function CopyRequisitesButton({ requisites }: CopyRequisitesButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = requisites.map((item) => `${item.label}: ${item.value}`).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleCopy}>
      {copied ? (
        <Check className="mr-2 h-4 w-4 text-green-600" />
      ) : (
        <Copy className="mr-2 h-4 w-4" />
      )}
      {copied ? "Скопировано" : "Скопировать реквизиты"}
    </Button>
  );
}
