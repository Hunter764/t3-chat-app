"use client"

import * as React from "react"
import {Sun , Moon} from "lucide-react"
import {useTheme} from "next-themes"

import {Button} from "@/components/ui/button"

export function ModeToggle(){
    const {theme, setTheme} = useTheme();

    return(
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" :"light")}
        >
            {theme === "light" ? (
                <Sun className="size-5" />
            ) : (
                <Moon className="size-5" />
            )}

        </Button>
    );
}