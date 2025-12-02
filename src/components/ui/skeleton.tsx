import * as React from "react";
import { cn } from "@/lib/utils";

type SkeletonProps<E extends React.ElementType = "div"> = {
  as?: E;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<E>, "className">;

function Skeleton<E extends React.ElementType = "div">({
  as,
  className,
  ...props
}: SkeletonProps<E>) {
  const Component = (as ?? "div") as React.ElementType;
  return <Component className={cn("bg-muted animate-pulse rounded-md", className)} {...props} />;
}

export { Skeleton };
