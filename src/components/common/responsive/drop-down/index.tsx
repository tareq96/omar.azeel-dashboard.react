import { Slot } from "@radix-ui/react-slot";
import { X } from "lucide-react";
import React, { createContext, forwardRef, useContext, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

// Types
interface ActionItem {
  type: "item";
  key: string;
  onSelect: () => void;
  disabled?: boolean;
  variant?: "default" | "destructive" | "secondary";
  hidden?: boolean;
  children: React.ReactNode;
  className?: string;
}

interface SeparatorItem {
  type: "separator";
  key: string;
  hidden?: boolean;
}

type MenuItem = ActionItem | SeparatorItem;

interface ResponsiveDropDownContextValue {
  variant?: "default" | "ghost" | "outline" | "secondary";
  drawerTitle?: string;
  disabled?: boolean;
  items: MenuItem[];
  addItem: (item: MenuItem) => void;
  removeItem: (itemKey: string) => void;
  isMobile: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  align?: "start" | "end" | "center";
}

const ResponsiveDropDownContext = createContext<ResponsiveDropDownContextValue | null>(null);

const useResponsiveDropDownContext = () => {
  const context = useContext(ResponsiveDropDownContext);
  if (!context) {
    throw new Error("ResponsiveDropDown components must be used within ResponsiveDropDown");
  }
  return context;
};

// Root Component
interface ResponsiveDropDownProps {
  children: React.ReactNode;
  drawerTitle?: string;
  disabled?: boolean;
  align?: "start" | "end" | "center";
}

const ResponsiveDropDown = ({
  children,
  drawerTitle,
  disabled = false,
  align = "start",
}: ResponsiveDropDownProps) => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const addItem = (item: MenuItem) => {
    setItems((prev) => {
      const exists = prev.some((existingItem) => existingItem.key === item.key);
      if (!exists) {
        return [...prev, item];
      }
      return prev;
    });
  };

  const removeItem = (itemKey: string) => {
    setItems((prev) => {
      const exists = prev.some((existingItem) => existingItem.key === itemKey);
      if (exists) {
        return prev.filter((existingItem) => existingItem.key !== itemKey);
      }
      return prev;
    });
  };

  return (
    <ResponsiveDropDownContext.Provider
      value={{
        drawerTitle,
        disabled,
        items,
        addItem,
        removeItem,
        isMobile,
        isOpen,
        setIsOpen,
        align,
      }}
    >
      {children}
    </ResponsiveDropDownContext.Provider>
  );
};

// Trigger Component
interface ResponsiveDropDownTriggerProps {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
  variant?: "default" | "ghost" | "outline" | "secondary";
  size?: "default" | "icon" | "sm" | "lg" | null | undefined;
}

const ResponsiveDropDownTrigger = forwardRef<HTMLButtonElement, ResponsiveDropDownTriggerProps>(
  ({ children, className = "", asChild = false, variant, size, ...props }, ref) => {
    const { isMobile, disabled, isOpen, setIsOpen, align, items } = useResponsiveDropDownContext();
    const Comp = asChild ? Slot : Button;

    if (!items?.length) {
      return null;
    }

    if (isMobile) {
      return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Comp
              ref={ref}
              className={className}
              disabled={disabled}
              variant={variant}
              size={size}
              {...props}
            >
              {children}
            </Comp>
          </SheetTrigger>
          <ResponsiveDropDownMobileContent />
        </Sheet>
      );
    }

    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Comp
            ref={ref}
            className={className}
            disabled={disabled}
            variant={variant}
            size={size}
            {...props}
          >
            {children}
          </Comp>
        </DropdownMenuTrigger>
        <ResponsiveDropDownDesktopContent align={align} />
      </DropdownMenu>
    );
  },
);

ResponsiveDropDownTrigger.displayName = "ResponsiveDropDownTrigger";

// Content Component (placeholder - actual content is rendered by Trigger)
interface ResponsiveDropDownContentProps {
  children: React.ReactNode;
  className?: string;
}

const ResponsiveDropDownContent = ({ children }: ResponsiveDropDownContentProps) => {
  // This component just collects children, actual rendering is handled by Trigger
  return <>{children}</>;
};

// Desktop Content (used internally)
interface ResponsiveDropDownDesktopContentProps {
  align?: "start" | "end" | "center";
}

const ResponsiveDropDownDesktopContent = ({ align }: ResponsiveDropDownDesktopContentProps) => {
  const { items } = useResponsiveDropDownContext();

  const visibleItems = items.filter((item) => !item.hidden);

  return (
    <DropdownMenuContent align={align}>
      {visibleItems.map((item) => {
        if (item.type === "separator") {
          return <DropdownMenuSeparator key={item.key} />;
        }

        const actionItem = item as ActionItem;
        return (
          <DropdownMenuItem
            key={actionItem.key}
            onSelect={actionItem.onSelect}
            disabled={actionItem.disabled}
            variant={actionItem.variant}
            className={`flex items-center gap-2 [&_svg]:size-4 ${
              actionItem.variant === "destructive" ? "text-destructive" : ""
            } ${actionItem.className || ""}`}
          >
            {actionItem.children}
          </DropdownMenuItem>
        );
      })}
    </DropdownMenuContent>
  );
};

// Mobile Content (used internally)
const ResponsiveDropDownMobileContent = () => {
  const { items, drawerTitle, setIsOpen } = useResponsiveDropDownContext();
  const { i18n } = useTranslation();

  const visibleItems = items.filter((item) => !item.hidden);

  return (
    <SheetContent side="bottom" className="rounded-t-2xl">
      <SheetHeader
        dir={i18n.dir(i18n.language)}
        className="flex w-full flex-row items-center justify-between"
      >
        <SheetTitle className="overflow-hidden text-start text-lg font-semibold text-ellipsis whitespace-nowrap">
          {drawerTitle}
        </SheetTitle>
        <SheetClose asChild className="self-end">
          <Button variant="ghost" size="icon">
            <X className="h-4 w-4 text-[#686F83]" />
          </Button>
        </SheetClose>
      </SheetHeader>
      <div className="space-y-0">
        <div className="flex flex-col gap-1 rounded-sm bg-white p-3">
          {visibleItems.map((item) => {
            if (item.type === "separator") {
              return <Separator key={item.key} className="my-2" />;
            }

            const actionItem = item as ActionItem;
            return (
              <SheetClose asChild key={actionItem.key}>
                <button
                  onClick={() => {
                    if (!actionItem.disabled) {
                      actionItem.onSelect();
                    }
                    setIsOpen(false);
                  }}
                  disabled={actionItem.disabled}
                  className={`flex w-full items-center justify-end gap-3 px-1 py-3 text-end rtl:flex-row-reverse [&_svg]:size-4 ${
                    actionItem.variant === "destructive"
                      ? "text-destructive"
                      : actionItem.variant === "secondary"
                        ? "text-secondary"
                        : "text-foreground"
                  } ${
                    actionItem.disabled ? "cursor-not-allowed opacity-50" : "hover:bg-gray-50"
                  } ${actionItem.className || ""}`}
                >
                  <div className="flex items-center gap-3">{actionItem.children}</div>
                </button>
              </SheetClose>
            );
          })}
        </div>
      </div>
    </SheetContent>
  );
};

// Item Component
interface ResponsiveDropDownItemProps {
  children: React.ReactNode;
  onSelect: () => void;
  icon?: React.ReactNode;
  translationKey?: string;
  disabled?: boolean;
  variant?: "default" | "destructive" | "secondary";
  hidden?: boolean;
  className?: string;
}

let itemCounter = 0;

const ResponsiveDropDownItem = ({
  children,
  onSelect,
  disabled = false,
  variant = "default",
  hidden = false,
  className,
}: ResponsiveDropDownItemProps) => {
  const { addItem, removeItem } = useResponsiveDropDownContext();
  const [itemKey] = useState(() => `item-${++itemCounter}`);

  // Register this item with the context
  React.useEffect(() => {
    if (hidden) {
      removeItem(itemKey);
      return;
    }
    const item: ActionItem = {
      type: "item",
      key: itemKey,
      children,
      onSelect,
      disabled,
      variant,
      hidden,
      className,
    };
    addItem(item);
  }, [children, addItem, itemKey, children, onSelect, disabled, variant, hidden, className]);

  // This component doesn't render anything itself
  return null;
};

// Separator Component
interface ResponsiveDropDownSeparatorProps {
  hidden?: boolean;
}

let separatorCounter = 0;

const ResponsiveDropDownSeparator = ({ hidden = false }: ResponsiveDropDownSeparatorProps) => {
  const { addItem } = useResponsiveDropDownContext();
  const [separatorKey] = useState(() => `separator-${++separatorCounter}`);

  React.useEffect(() => {
    const item: SeparatorItem = {
      type: "separator",
      key: separatorKey,
      hidden,
    };
    addItem(item);
  }, [addItem, separatorKey, hidden]);

  return null;
};

// Export compound component
ResponsiveDropDown.Trigger = ResponsiveDropDownTrigger;
ResponsiveDropDown.Content = ResponsiveDropDownContent;
ResponsiveDropDown.Item = ResponsiveDropDownItem;
ResponsiveDropDown.Separator = ResponsiveDropDownSeparator;

export {
  ResponsiveDropDown,
  ResponsiveDropDownContent,
  ResponsiveDropDownItem,
  ResponsiveDropDownSeparator,
  ResponsiveDropDownTrigger,
};

export default ResponsiveDropDown;
