import { Slot } from "@radix-ui/react-slot";
import { X } from "lucide-react";
import React, { createContext, forwardRef, useContext, useState } from "react";

import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

// Types
interface ResponsiveDialogContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isMobile: boolean;
  disabled?: boolean;
  withCloseButton?: boolean;
}

const ResponsiveDialogContext = createContext<ResponsiveDialogContextValue | null>(null);

const useResponsiveDialogContext = () => {
  const context = useContext(ResponsiveDialogContext);
  if (!context) {
    throw new Error("ResponsiveDialog components must be used within ResponsiveDialog");
  }
  return context;
};

// Root Component
interface ResponsiveDialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  withCloseButton?: boolean;
}

const ResponsiveDialog = ({
  children,
  open,
  onOpenChange,
  disabled = false,
  withCloseButton = true,
}: ResponsiveDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isMobile = useIsMobile();

  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = (open: boolean) => {
    onOpenChange?.(open);
    setInternalOpen(open);
  };

  const contextValue = {
    isOpen,
    setIsOpen,
    isMobile,
    disabled,
    withCloseButton,
  };

  if (isMobile) {
    return (
      <ResponsiveDialogContext.Provider value={contextValue}>
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          {children}
        </Drawer>
      </ResponsiveDialogContext.Provider>
    );
  }

  return (
    <ResponsiveDialogContext.Provider value={contextValue}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {children}
      </Dialog>
    </ResponsiveDialogContext.Provider>
  );
};

// Trigger Component
interface ResponsiveDialogTriggerProps {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
  disabled?: boolean;
}

const ResponsiveDialogTrigger = forwardRef<HTMLButtonElement, ResponsiveDialogTriggerProps>(
  ({ children, className = "", asChild = false, variant, size, disabled, ...props }, ref) => {
    const { isMobile, isOpen, setIsOpen } = useResponsiveDialogContext();
    const Comp = asChild ? Slot : Button;

    if (isMobile) {
      return (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild>
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
          </DrawerTrigger>
        </Drawer>
      );
    }

    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
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
        </DialogTrigger>
      </Dialog>
    );
  },
);

ResponsiveDialogTrigger.displayName = "ResponsiveDialogTrigger";

// Content Component
interface ResponsiveDialogContentProps {
  children: React.ReactNode;
  className?: string;
}

const ResponsiveDialogContent = ({ children, className }: ResponsiveDialogContentProps) => {
  const { isMobile } = useResponsiveDialogContext();

  if (isMobile) {
    return (
      <DrawerContent className={cn("gap-0 rounded-t-2xl bg-[#F8FAFB] p-0", className)}>
        {children}
      </DrawerContent>
    );
  }

  return (
    <DialogContent
      showCloseButton={false}
      className={cn("flex flex-col gap-0 bg-[#F8FAFB] p-0", className)}
    >
      {children}
    </DialogContent>
  );
};

// Header Component
interface ResponsiveDialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const ResponsiveDialogHeader = ({ children, className }: ResponsiveDialogHeaderProps) => {
  const { isMobile, withCloseButton } = useResponsiveDialogContext();
  const { i18n } = useTranslation();

  if (isMobile) {
    return (
      <DrawerHeader
        dir={i18n.dir(i18n.language)}
        className={cn(
          "bg-background flex h-fit w-full flex-row items-center justify-between rounded-t-2xl p-4",
          className,
        )}
      >
        {children}
        {withCloseButton && (
          <DrawerClose asChild className="self-end">
            <Button variant="ghost" size="icon">
              <X className="size-5 text-[#686F83]" />
            </Button>
          </DrawerClose>
        )}
      </DrawerHeader>
    );
  }

  return (
    <DialogHeader
      dir={i18n.dir(i18n.language)}
      className={cn(
        "bg-background flex h-fit w-full flex-row items-center justify-between rounded-t-lg p-4",
        className,
      )}
    >
      {children}
      {withCloseButton && (
        <DialogClose asChild className="self-end">
          <Button variant="ghost" size="icon">
            <X className="size-5 text-[#686F83]" />
          </Button>
        </DialogClose>
      )}
    </DialogHeader>
  );
};

// Title Component
interface ResponsiveDialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

const ResponsiveDialogTitle = ({ children, className }: ResponsiveDialogTitleProps) => {
  const { isMobile } = useResponsiveDialogContext();

  if (isMobile) {
    return (
      <DrawerTitle
        className={cn(
          "overflow-hidden text-start text-lg font-semibold text-ellipsis whitespace-nowrap",
          className,
        )}
      >
        {children}
      </DrawerTitle>
    );
  }

  return <DialogTitle className={className}>{children}</DialogTitle>;
};

// Description Component
interface ResponsiveDialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

const ResponsiveDialogDescription = ({ children, className }: ResponsiveDialogDescriptionProps) => {
  const { isMobile } = useResponsiveDialogContext();

  if (isMobile) {
    return <DrawerDescription className={className}>{children}</DrawerDescription>;
  }

  return <DialogDescription className={className}>{children}</DialogDescription>;
};

// Body/Main Content Component
interface ResponsiveDialogBodyProps {
  children: React.ReactNode;
  className?: string;
}

const ResponsiveDialogBody = ({ children, className }: ResponsiveDialogBodyProps) => {
  return (
    <div
      className={cn(
        "bg-background flex-1 gap-4 overflow-auto rounded-sm p-3 md:rounded-lg md:p-6",
        className,
      )}
    >
      {children}
    </div>
  );
};

// Footer Component
interface ResponsiveDialogFooterProps {
  children?: React.ReactNode;
  className?: string;
}

const ResponsiveDialogFooter = ({ children, className }: ResponsiveDialogFooterProps) => {
  const { isMobile } = useResponsiveDialogContext();

  if (isMobile) {
    return (
      <DrawerFooter className={cn("bg-background flex flex-col gap-2 p-4", className)}>
        {children}
      </DrawerFooter>
    );
  }

  return (
    <DialogFooter className={cn("bg-background rounded-b-lg p-4", className)}>
      {children}
    </DialogFooter>
  );
};

// Close Component
interface ResponsiveDialogCloseProps {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
}

const ResponsiveDialogClose = forwardRef<HTMLButtonElement, ResponsiveDialogCloseProps>(
  ({ children, className, asChild = false, variant, size, ...props }, ref) => {
    const { isMobile, setIsOpen } = useResponsiveDialogContext();
    const Comp = asChild ? Slot : Button;

    const handleClick = (e: React.MouseEvent) => {
      setIsOpen(false);
      if (props.onClick) {
        props.onClick(e);
      }
    };

    if (isMobile) {
      return (
        <DrawerClose asChild>
          <Comp
            ref={ref}
            className={className}
            variant={variant}
            size={size}
            {...props}
            onClick={handleClick}
          >
            {children}
          </Comp>
        </DrawerClose>
      );
    }

    return (
      <Comp
        ref={ref}
        className={className}
        variant={variant}
        size={size}
        {...props}
        onClick={handleClick}
      >
        {children}
      </Comp>
    );
  },
);

ResponsiveDialogClose.displayName = "ResponsiveDialogClose";

// Export compound component
ResponsiveDialog.Trigger = ResponsiveDialogTrigger;
ResponsiveDialog.Content = ResponsiveDialogContent;
ResponsiveDialog.Header = ResponsiveDialogHeader;
ResponsiveDialog.Title = ResponsiveDialogTitle;
ResponsiveDialog.Description = ResponsiveDialogDescription;
ResponsiveDialog.Body = ResponsiveDialogBody;
ResponsiveDialog.Footer = ResponsiveDialogFooter;
ResponsiveDialog.Close = ResponsiveDialogClose;

export {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
};

export default ResponsiveDialog;
