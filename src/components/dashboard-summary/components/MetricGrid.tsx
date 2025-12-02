import { DASHBOARD_TOTAL_CARDS } from "@/components/dashboard-summary/constants/constants";
import { MetricCard } from "./MetricCard";
import { MetricCardSkeleton } from "./MetricCardSkeleton";
import type { LucideIcon } from "lucide-react";

export interface MetricGridProps {
  isLoading: boolean;
  cards: Array<{
    label: string;
    value: unknown;
    icon?: LucideIcon;
    color?: string;
    bgColor?: string;
  }>;
}

export function MetricGrid({ isLoading, cards }: MetricGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
      {isLoading
        ? Array.from({ length: DASHBOARD_TOTAL_CARDS }).map((_, i) => (
            <MetricCardSkeleton key={`skeleton-${i}`} index={i} />
          ))
        : cards.map((card, idx) => (
            <MetricCard
              key={`metric-${idx}`}
              label={card.label}
              value={card.value}
              icon={card.icon}
              color={card.color}
              bgColor={card.bgColor}
            />
          ))}
    </div>
  );
}
