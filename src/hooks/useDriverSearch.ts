import { useState, useMemo } from "react";
import { useUsersGetDrivers } from "@/services/api/generated/users/users";

export function useDriverSearch() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: driversData, isFetching: isLoading } = useUsersGetDrivers<any>(
    { per_page: 10, q: searchQuery.trim() || undefined, status: "Active" } as any,
    { query: { enabled: true } },
  );

  const driverOptions = useMemo(() => {
    const root = driversData as any;
    const drivers = Array.isArray(root)
      ? root
      : (root?.data ?? root?.drivers ?? root?.users ?? root?.list ?? root?.items ?? []);
    return (drivers as any[]).map((driver) => ({
      label: driver?.name ?? String(driver?.id),
      value: String(driver?.id),
    }));
  }, [driversData]);

  return { driverOptions, isLoading, searchQuery, setSearchQuery };
}
