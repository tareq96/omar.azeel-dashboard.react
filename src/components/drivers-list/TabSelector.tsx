import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type DriverTabItem = {
  id: number;
  label: string;
};

type Props = {
  tabs: DriverTabItem[];
  activeId: number;
  onChange: (id: number) => void;
  className?: string;
};

export function TabSelector({ tabs, activeId, onChange, className }: Props) {
  return (
    <Tabs
      value={String(activeId)}
      onValueChange={(val) => onChange(Number(val))}
      className={className}
    >
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={String(tab.id)}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

export default TabSelector;
