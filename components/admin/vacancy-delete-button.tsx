"use client";

import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VacancyDeleteButtonProps {
  id: string;
}

export function VacancyDeleteButton({ id }: VacancyDeleteButtonProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Удалить вакансию?")) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/vacancies/${id}/`, { method: "DELETE" });
      if (res.ok) {
        window.location.reload();
      } else {
        alert("Ошибка удаления");
      }
    } catch {
      alert("Ошибка удаления");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleDelete}
      disabled={deleting}
      className="text-destructive hover:text-destructive"
    >
      {deleting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </Button>
  );
}
