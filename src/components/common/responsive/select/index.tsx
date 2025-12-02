import { Slot } from "@radix-ui/react-slot";
import { CheckIcon, ChevronDownIcon, X } from "lucide-react";
import React, { createContext, forwardRef, useContext, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile"; // Types
import { cn } from "@/lib/utils";

// Types
interface FilterItem {
  value: string;
  label: string;
}

interface ResponsiveSelectContextValue {
  value: string | undefined;
  onValueChange: (value: string) => void;
  drawerTitle?: string;
  disabled?: boolean;
  items: FilterItem[];
  addItem: (item: FilterItem) => void;
  isMobile: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  emptySelectionValue?: string;
  iconOnlyOnMobile?: boolean;
}

const ResponsiveSelectContext = createContext<ResponsiveSelectContextValue | null>(null);

const useResponsiveSelectContext = () => {
  const context = useContext(ResponsiveSelectContext);
  if (!context) {
    throw new Error("ResponsiveSelect components must be used within ResponsiveSelect");
  }
  return context;
};

// Root Component
interface ResponsiveSelectProps {
  children: React.ReactNode;
  value: string | undefined;
  onValueChange: (value: string) => void;
  drawerTitle?: string;
  disabled?: boolean;
  emptySelectionValue?: string;
  iconOnlyOnMobile?: boolean;
}

const ResponsiveSelect = ({
  children,
  value,
  onValueChange,
  drawerTitle,
  disabled = false,
  emptySelectionValue,
  iconOnlyOnMobile = true,
}: ResponsiveSelectProps) => {
  const [items, setItems] = useState<FilterItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const addItem = (item: FilterItem) => {
    setItems((prev) => {
      const exists = prev.some((existingItem) => existingItem.value === item.value);
      if (!exists) {
        return [...prev, item];
      }
      return prev;
    });
  };

  return (
    <ResponsiveSelectContext.Provider
      value={{
        value,
        onValueChange,
        drawerTitle,
        disabled,
        emptySelectionValue,
        items,
        addItem,
        isMobile,
        isOpen,
        setIsOpen,
        iconOnlyOnMobile,
      }}
    >
      {children}
    </ResponsiveSelectContext.Provider>
  );
};

// Trigger Component
interface ResponsiveSelectTriggerProps {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
  size?: "default" | "sm" | "lg" | undefined;
}

const ResponsiveSelectTrigger = forwardRef<HTMLButtonElement, ResponsiveSelectTriggerProps>(
  ({ children, className = "", asChild = false, size, ...props }, ref) => {
    const {
      isMobile,
      disabled,
      isOpen,
      setIsOpen,
      value,
      onValueChange,
      emptySelectionValue,
      iconOnlyOnMobile,
    } = useResponsiveSelectContext();
    const Comp = asChild ? Slot : Button;

    if (isMobile) {
      return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Comp
              ref={ref}
              className={cn(
                "relative bg-white hover:bg-gray-50",
                !value && "text-muted-foreground",
                className,
              )}
              disabled={disabled}
              size={size}
              variant={asChild ? undefined : "outline"}
              {...props}
            >
              {iconOnlyOnMobile && value && value !== emptySelectionValue && (
                <span className="bg-primary absolute top-2 right-2 h-2 w-2 rounded-full" />
              )}
              {children}
              {!iconOnlyOnMobile && <ChevronDownIcon className="size-4" />}
            </Comp>
          </SheetTrigger>
          <ResponsiveSelectMobileContent />
        </Sheet>
      );
    }

    return (
      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <SelectTrigger
          asChild={asChild}
          className={cn("bg-white hover:bg-gray-50", className)}
          ref={ref}
          size={size}
          {...props}
        >
          {children}
        </SelectTrigger>
        <ResponsiveSelectDesktopContent />
      </Select>
    );
  },
);

ResponsiveSelectTrigger.displayName = "ResponsiveSelectTrigger";

// Content Component (drawerTitle - actual content is rendered by Trigger)
interface ResponsiveSelectContentProps {
  children: React.ReactNode;
  className?: string;
}

const ResponsiveSelectContent = ({ children }: ResponsiveSelectContentProps) => {
  // This component just collects children, actual rendering is handled by Trigger
  return <>{children}</>;
};

// Desktop Content (used internally)
const ResponsiveSelectDesktopContent = () => {
  const { items, value, onValueChange, setIsOpen } = useResponsiveSelectContext();

  return (
    <SelectContent>
      {items.map((item) => (
        <SelectItem
          key={item.value}
          value={item.value}
          // Toggle: if clicking the already selected value, deselect it
          onPointerUp={async (e) => {
            if (value === item.value) {
              e.preventDefault();
              e.stopPropagation();
              onValueChange("");
              setIsOpen(false);
            }
          }}
        >
          {item.label}
        </SelectItem>
      ))}
    </SelectContent>
  );
};

// Mobile Content (used internally)
const ResponsiveSelectMobileContent = () => {
  const { value, onValueChange, items, drawerTitle, setIsOpen } = useResponsiveSelectContext();

  return (
    <SheetContent side="bottom" className="rounded-t-2xl">
      <SheetHeader className="flex w-full flex-row items-center justify-between">
        <SheetTitle className="overflow-hidden text-start text-lg font-semibold text-ellipsis whitespace-nowrap">
          {drawerTitle}
        </SheetTitle>
        <SheetClose asChild className="self-end">
          <Button variant="ghost" size="icon">
            <X className="h-4 w-4 text-[#686F83]" />
          </Button>
        </SheetClose>
      </SheetHeader>
      <div className="space-y-0 bg-[#F8FAFB] p-4 pb-8">
        <div className="flex flex-col gap-4 rounded-sm bg-white p-3">
          {items.map((item) => (
            <SheetClose asChild key={item.value}>
              <button
                onClick={() => {
                  // Toggle: if clicking the already selected value, deselect it
                  onValueChange(value === item.value ? "" : item.value);
                  setIsOpen(false);
                }}
                className="flex w-full items-center justify-between py-1 text-start"
              >
                <span className="px-1">{item.label}</span>
                {value === item.value && <CheckIcon className="h-4 w-4 text-green-600" />}
              </button>
            </SheetClose>
          ))}
        </div>
      </div>
    </SheetContent>
  );
};

// Item Component
interface ResponsiveSelectItemProps {
  children: React.ReactNode;
  value: string;
  disabled?: boolean;
}

const ResponsiveSelectItem = ({ children, value }: ResponsiveSelectItemProps) => {
  const { addItem } = useResponsiveSelectContext();

  // Register this item with the context
  React.useEffect(() => {
    addItem({
      value,
      label: typeof children === "string" ? children : value,
    });
  }, [addItem, value, children]);

  // This component doesn't render anything itself
  // The actual rendering is handled by the Content components
  return null;
};

// Value Component (for showing current selection)
interface ResponsiveSelectValueProps {
  placeholder?: React.ReactNode;
}

const ResponsiveSelectValue = ({ placeholder }: ResponsiveSelectValueProps) => {
  const { isMobile, iconOnlyOnMobile, items, value } = useResponsiveSelectContext();

  if (isMobile) {
    const currentItem = items.find((item) => item.value === value);
    return iconOnlyOnMobile ? null : (
      <span className={cn("text-sm", !currentItem && "text-muted-foreground")}>
        {currentItem?.label || placeholder}
      </span>
    );
  }

  return <SelectValue placeholder={placeholder} />;
};

// Export compound component
ResponsiveSelect.Trigger = ResponsiveSelectTrigger;
ResponsiveSelect.Content = ResponsiveSelectContent;
ResponsiveSelect.Item = ResponsiveSelectItem;
ResponsiveSelect.Value = ResponsiveSelectValue;

export {
  ResponsiveSelect,
  ResponsiveSelectContent,
  ResponsiveSelectItem,
  ResponsiveSelectTrigger,
  ResponsiveSelectValue,
};

export default ResponsiveSelect;
