import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type Option = { label: string; value: string };

type ComboboxProps = {
  options: Option[];
  value?: string;
  onChange?: (value?: string) => void;
  placeholder?: string;
  className?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
};

export function Combobox({
  options,
  value,
  onChange,
  placeholder,
  className,
  searchValue,
  onSearchChange,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);
  const ref = useRef<HTMLButtonElement>(null);
  const [width, setWidth] = useState<number>();
  const { t } = useTranslation();

  useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver((entries) => {
      setWidth(entries[0].contentRect.width);
    });
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={ref as any}
          className={cn("h-8 w-48 justify-between", className)}
          role="combobox"
          variant="outline"
          aria-expanded={open}
        >
          <span className={cn("truncate", !selected && "text-muted-foreground")}>
            {selected
              ? selected.label
              : (placeholder ?? t("common.select", { defaultValue: "Select" }))}
          </span>
          <ChevronsUpDownIcon className="size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-[10000] p-0" style={{ width }}>
        <Command shouldFilter={!onSearchChange}>
          <CommandInput
            placeholder={t("search", { defaultValue: "Search..." })}
            value={searchValue}
            onValueChange={onSearchChange}
          />
          <CommandEmpty>{t("common.noResults", { defaultValue: "No results found" })}</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  onSelect={() => {
                    onChange?.(opt.value === value ? undefined : opt.value);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <CheckIcon
                    className={cn("mr-2 size-4", value === opt.value ? "opacity-100" : "opacity-0")}
                  />
                  {opt.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
