import * as React from "react";

export function ReadonlyField({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-medium">{label}</span>
      <span className={valueClassName}>{value}</span>
    </div>
  );
}
