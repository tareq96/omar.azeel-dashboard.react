import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatValue } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export interface MetricCardProps {
  label: string;
  value: unknown;
  icon?: LucideIcon;
  color?: string;
  bgColor?: string;
}

export function MetricCard({ label, value, icon: Icon, color, bgColor }: MetricCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">{label}</CardTitle>
        {Icon && (
          <div className={cn("rounded-full p-2", bgColor)}>
            <Icon className={cn("h-4 w-4", color)} />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatValue(value)}</div>
      </CardContent>
    </Card>
  );
}
