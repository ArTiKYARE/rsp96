import {
  Shield,
  Clock,
  Truck,
  Users,
  FileCheck,
  PackageCheck,
  MapPin,
  Phone,
  Mail,
  Menu,
  X,
  Moon,
  Sun,
  ArrowRight,
  Check,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Shield,
  Clock,
  Truck,
  Users,
  FileCheck,
  PackageCheck,
  MapPin,
  Phone,
  Mail,
  Menu,
  X,
  Moon,
  Sun,
  ArrowRight,
  Check,
  ChevronRight,
};

export function DynamicIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = iconMap[name] || PackageCheck;
  return <Icon className={className} />;
}
