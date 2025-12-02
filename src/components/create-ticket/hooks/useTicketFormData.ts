import { useMemo } from "react";
import {
  useTicketsCreateFormData,
  useTicketsGetTypeOptions,
} from "@/services/api/generated/tickets/tickets";

export interface NamedOption {
  name: string;
  disabled?: boolean;
}

export interface IdNameOption {
  id: number;
  name: string;
}

export function useTicketFormData(selectedType: string) {
  const { data: createData, isLoading } = useTicketsCreateFormData();
  const { data: typeOptionsData } = useTicketsGetTypeOptions(
    { type: selectedType || "" },
    { query: { enabled: !!selectedType } },
  );

  const typeOptions: NamedOption[] = useMemo(() => {
    const list = (createData?.ticket_types ?? []).filter((name: string) => name !== "Installation");
    return list.map((name: string) => ({ name, disabled: name.toLowerCase() === "reminders" }));
  }, [createData]);

  const statusOptions: string[] = useMemo(() => createData?.ticket_statuses ?? [], [createData]);

  const customerOptions: IdNameOption[] = useMemo(() => {
    const dynamic = typeOptionsData?.customers ?? [];
    const initial = createData?.customers ?? [];
    return (dynamic.length ? dynamic : initial).map((c: any) => ({
      id: Number(c.id),
      name: c.name,
    }));
  }, [typeOptionsData, createData]);

  const assigneeOptions: IdNameOption[] = useMemo(() => {
    const dynamic = typeOptionsData?.assignees ?? [];
    if (dynamic.length) return dynamic.map((a: any) => ({ id: Number(a.id), name: a.name }));

    const assigneeMap: Record<string, any[]> = {
      Maintinance: createData?.maintinance_assignees ?? [],
      "Locker Removal": createData?.removal_assignees ?? [],
      "Recurring Days": createData?.recurring_days_assignees ?? [],
    };

    const assignees = assigneeMap[selectedType] ?? createData?.assignees ?? [];
    return assignees.map((a: any) => ({ id: Number(a.id), name: a.name }));
  }, [typeOptionsData, createData, selectedType]);

  return {
    createData,
    isLoading,
    typeOptions,
    statusOptions,
    customerOptions,
    assigneeOptions,
  } as const;
}
