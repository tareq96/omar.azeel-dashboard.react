import { useMemo } from "react";

export type DriverTab = {
  id: number;
  label: string;
};

export function useDriversTabs(t: any): DriverTab[] {
  return useMemo(
    () => [
      { id: 1, label: t("drivers.tabs.orderPickupDropoff") },
      { id: 2, label: t("drivers.tabs.lockerInstallation") },
      { id: 3, label: t("drivers.tabs.topups") },
      { id: 4, label: t("drivers.tabs.lockerMaintenance") },
      { id: 5, label: t("drivers.tabs.lockerRemoval") },
    ],
    [t],
  );
}
