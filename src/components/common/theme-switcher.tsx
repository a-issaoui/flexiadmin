"use client";

import { useTheme } from "next-themes";
import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/common/icon";
import { Skeleton } from "@/components/ui/skeleton";

export function ThemeSwitcher() {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = useMemo(() => resolvedTheme === "dark", [resolvedTheme]);

    const toggleTheme = () => {
        setTheme(isDark ? "light" : "dark");
    };

    if (!mounted) {
        return (
            <Skeleton
                aria-hidden
                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center"
            />
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
        >
            <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
                className="rounded-full w-10 h-10 p-0  cursor-pointer"
            >
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={resolvedTheme}
                        initial={{ y: -8, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 8, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="flex items-center justify-center"
                    >
                        <Icon
                            name={isDark ? "SunIcon" : "MoonIcon"}
                            size={24}
                            weight="duotone"
                            color={isDark ? "#f59e0b" : "#64748b"}
                            className="size-6"
                        />
                    </motion.div>
                </AnimatePresence>
            </Button>
        </motion.div>
    );
}