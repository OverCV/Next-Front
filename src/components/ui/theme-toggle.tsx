"use client";

import { SunIcon, MoonIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "./button";


export function ThemeToggle(): JSX.Element {
    const { theme, setTheme } = useTheme();

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Cambiar tema"
        >
            <SunIcon className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
    );
}