import { cn } from "@/lib/utils";
import Image from "next/image";

interface LogoProps {
  className?: string;
  showName?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { icon: 24, text: "text-lg" },
  md: { icon: 32, text: "text-xl" },
  lg: { icon: 40, text: "text-2xl" },
};

export function Logo({ className, showName = false, size = "md" }: LogoProps) {
  const { icon: iconSize, text: textClass } = sizeMap[size];
  return (
    <div
      className={cn("inline-flex items-center gap-2 font-medium", className)}
      data-slot="logo"
    >
      <Image
        src="/logo.svg"
        alt="Insurx"
        width="200"
        height="400"
        priority
        className="shrink-0 h-12"
      />
      {showName && (
        <span className={cn("text-foreground", textClass)}>Insurx</span>
      )}
    </div>
  );
}
