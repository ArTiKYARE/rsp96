"use client";

import React from "react";
import type { Icon, IconWeight } from "@phosphor-icons/react";
import {
  Shield,
  Clock,
  Truck,
  Users,
  FileText,
  Phone,
  Envelope,
  MapPin,
  ArrowRight,
  Check,
  List,
  X,
  Moon,
  Sun,
  CaretLeft,
  CaretRight,
  Question,
} from "@phosphor-icons/react";

const iconMap: Record<string, Icon> = {
  Shield,
  Clock,
  Truck,
  Users,
  FileText,
  FileCheck: FileText,
  Phone,
  Mail: Envelope,
  Envelope,
  MapPin,
  ArrowRight,
  Check,
  Menu: List,
  X,
  Moon,
  Sun,
  CaretLeft,
  CaretRight,
  Question,
};

interface PhosphorIconProps {
  name: string;
  className?: string;
  weight?: IconWeight;
}

export function PhosphorIcon({ name, className, weight = "duotone" }: PhosphorIconProps) {
  const Icon = iconMap[name] || FileText;
  return <Icon className={className} weight={weight} />;
}
