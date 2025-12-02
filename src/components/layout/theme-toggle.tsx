import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const themes = [
  { translationKey: "sidebar.themeSwitcher.light", value: "light", icon: Sun },
  { translationKey: "sidebar.themeSwitcher.dark", value: "dark", icon: Moon },
  { translationKey: "sidebar.themeSwitcher.system", value: "system", icon: Monitor },
];

export default function ThemeToggle() {
  const { setTheme, theme: currentTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.value}
            onClick={() => setTheme(theme.value)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <theme.icon className="mr-2 h-4 w-4" />
              {t(theme.translationKey)}
            </div>
            {theme.value === currentTheme && <Check className="text-primary h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
