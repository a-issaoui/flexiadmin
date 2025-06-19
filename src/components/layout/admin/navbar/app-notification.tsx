// app-notification.jsx - Enhanced with theme toggle styling
'use client';

import React, { memo, useState, useEffect, useCallback, useMemo } from 'react';
import { Icon } from '@/components/shared/icon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavbar } from '@/components/layout/admin/navbar/app-navbar';
import { Skeleton } from "@/components/ui/skeleton";

// Mock notification data with priorities
const initialNotifications = [
    {
        id: '1',
        title: 'Security Alert',
        message: 'New login detected from unknown device.',
        time: '2m ago',
        read: false,
        icon: 'ShieldIcon',
        priority: 'high',
        type: 'security'
    },
    {
        id: '2',
        title: 'Server Maintenance',
        message: 'Scheduled maintenance on Sunday at 3 AM.',
        time: '1h ago',
        read: false,
        icon: 'GearIcon',
        priority: 'normal',
        type: 'system'
    },
    {
        id: '3',
        title: 'Welcome!',
        message: 'Thanks for signing up. Explore our features.',
        time: '1d ago',
        read: true,
        icon: 'UserCircleIcon',
        priority: 'low',
        type: 'general'
    },
    {
        id: '4',
        title: 'Password Updated',
        message: 'Your password was successfully changed.',
        time: '2d ago',
        read: true,
        icon: 'LockIcon',
        priority: 'normal',
        type: 'security'
    },
    {
        id: '5',
        title: 'New Comment',
        message: 'Alice commented on your article about React performance.',
        time: '5m ago',
        read: false,
        icon: 'MessageSquareicon',
        priority: 'normal',
        type: 'comment'
    },
];

// AppNotification actions based on type
const notificationActions = {
    'comment': { primary: 'Reply', secondary: 'View Post' },
    'system': { primary: 'View Details', secondary: 'Dismiss' },
    'security': { primary: 'Review', secondary: 'Mark Safe' },
    'general': { primary: 'View', secondary: 'Dismiss' }
};

// Simplified icon component
const NotificationIcon = memo(({ iconName, className, priority }) => {
    return (
        <div className={cn(
            "relative flex-shrink-0 mt-0.5",
            priority === 'high' && "text-red-500",
            priority === 'normal' && "text-blue-500",
            priority === 'low' && "text-gray-500"
        )}>
            <Icon name={iconName} size={20} weight="duotone" className={className} />
            {priority === 'high' && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
        </div>
    );
});

NotificationIcon.displayName = 'NotificationIcon';

const AppNotification = memo(() => {
    const { activeDropdown, setActiveDropdown } = useNavbar();
    const [mounted, setMounted] = useState(false);
    const [notifications, setNotifications] = useState(initialNotifications);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isMenuOpen = activeDropdown === 'notifications';

    // Sort notifications by priority and time
    const sortedNotifications = useMemo(() => {
        return [...notifications].sort((a, b) => {
            const priorityOrder = { high: 3, normal: 2, low: 1 };
            const aPriority = priorityOrder[a.priority] || 2;
            const bPriority = priorityOrder[b.priority] || 2;

            if (aPriority !== bPriority) {
                return bPriority - aPriority;
            }

            // Sort unread first
            if (a.read !== b.read) {
                return a.read ? 1 : -1;
            }

            return new Date(b.time) - new Date(a.time);
        });
    }, [notifications]);

    const unreadCount = useMemo(() => {
        return notifications.filter(n => !n.read).length;
    }, [notifications]);

    const highPriorityCount = useMemo(() => {
        return notifications.filter(n => !n.read && n.priority === 'high').length;
    }, [notifications]);

    const handleNotificationClick = useCallback((notificationId, action = 'view') => {
        console.log(`Notification ${notificationId} ${action} clicked.`);

        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(1);
        }

        setNotifications(prevNotifications =>
            prevNotifications.map(n =>
                n.id === notificationId ? { ...n, read: true } : n
            )
        );
    }, []);

    const handleMarkAllAsRead = useCallback(() => {
        setNotifications(prevNotifications =>
            prevNotifications.map(n => ({ ...n, read: true }))
        );

        // Announce to screen readers
        const announcement = `All ${unreadCount} notifications marked as read`;
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.className = 'sr-only';
        announcer.textContent = announcement;
        document.body.appendChild(announcer);
        setTimeout(() => document.body.removeChild(announcer), 1000);
    }, [unreadCount]);

    const handleClearAll = useCallback(() => {
        setNotifications([]);
        setActiveDropdown(null);
    }, [setActiveDropdown]);

    const handleOpenChange = useCallback((open) => {
        setActiveDropdown(open ? 'notifications' : null);
    }, [setActiveDropdown]);

    if (!mounted) {
        return (
            <Skeleton
                aria-hidden
                className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center"
            />
        );
    }

    return (
        <>
        <DropdownMenu open={isMenuOpen} onOpenChange={handleOpenChange}>
            <DropdownMenuTrigger className="focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0" asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`View notifications, ${unreadCount} unread${highPriorityCount > 0 ? `, ${highPriorityCount} high priority` : ''}`}
                    className="rounded-full w-10 h-10 p-0 cursor-pointer relative focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                >
                    <div className="flex items-center justify-center">
                        <Icon
                            name="BellIcon"
                            size={24}
                            weight="duotone"
                            color={highPriorityCount > 0 ? "#ef4444" : "#64748b"}
                            className="size-6"
                        />
                    </div>
                    {unreadCount > 0 && (
                        <span
                            className={cn(
                                "absolute top-1 end-1 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white",
                                highPriorityCount > 0 ? "bg-red-500" : "bg-blue-500"
                            )}
                            aria-hidden="true"
                        >
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="w-[320px] min-w-[280px] max-w-[calc(100vw-32px)] rounded-lg shadow-xl p-0"
                side="bottom"
                align="end"
                sideOffset={12}
                collisionPadding={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <DropdownMenuLabel className="flex items-center justify-between px-3 py-2 border-b">
                            <span className="font-semibold text-md">
                                Notifications
                                {highPriorityCount > 0 && (
                                    <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">
                                        {highPriorityCount} urgent
                                    </span>
                                )}
                            </span>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllAsRead}
                            className="text-xs text-primary hover:underline focus:outline-none focus:ring-1 focus:ring-primary rounded px-1"
                        >
                            Mark all read
                        </button>
                    )}
                </DropdownMenuLabel>

                {notifications.length === 0 ? (
                    <div className="py-8 px-3 text-center">
                        <Icon name="BellIcon" size={32} className="mx-auto mb-2 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground">No notifications yet</p>
                        <p className="text-xs text-muted-foreground/70 mt-1">We'll notify you when something happens</p>
                    </div>
                ) : (
                    <ScrollArea className="h-[350px] max-h-[350px]">
                        <div className="p-1">
                            {sortedNotifications.map((notification, index) => {
                                const { id, title, message, time, read, icon, priority, type } = notification;
                                const actions = notificationActions[type] || notificationActions.general;

                                return (
                                    <DropdownMenuItem
                                        key={id}
                                        onClick={() => handleNotificationClick(id)}
                                        className={cn(
                                            "flex items-start gap-3 p-3 cursor-pointer transition-all duration-150 rounded-md mx-1 my-0.5 min-h-[60px]",
                                            !read && "bg-primary/5 border border-primary/10",
                                            "hover:bg-accent/50 hover:scale-[1.01]",
                                            priority === 'high' && !read && "bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-900/20"
                                        )}
                                    >
                                        <div className="flex items-start gap-2 flex-1">
                                            {!read && (
                                                <span
                                                    className={cn(
                                                        "mt-2 h-2 w-2 shrink-0 rounded-full",
                                                        priority === 'high' ? "bg-red-500" : "bg-primary"
                                                    )}
                                                    aria-label="Unread"
                                                />
                                            )}
                                            {read && <span className="mt-2 h-2 w-2 shrink-0" />}

                                            <NotificationIcon
                                                iconName={icon}
                                                priority={priority}
                                                className="mr-2 shrink-0"
                                            />

                                            <div className="flex-grow min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className={cn(
                                                        "font-medium text-sm truncate",
                                                        !read && "text-foreground",
                                                        read && "text-muted-foreground"
                                                    )}>
                                                        {title}
                                                    </p>
                                                    <span className={cn(
                                                        "text-xs shrink-0",
                                                        !read ? "text-primary/80" : "text-muted-foreground/70"
                                                    )}>
                                                                {time}
                                                            </span>
                                                </div>
                                                <p className={cn(
                                                    "text-xs mt-1 line-clamp-2",
                                                    !read ? "text-foreground/80" : "text-muted-foreground/80"
                                                )}>
                                                    {message}
                                                </p>
                                                {!read && (
                                                    <div className="flex gap-2 mt-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleNotificationClick(id, 'primary');
                                                            }}
                                                            className="text-xs px-2 py-1 bg-primary/10 text-primary rounded hover:bg-primary/20 focus:outline-none focus:ring-1 focus:ring-primary"
                                                        >
                                                            {actions.primary}
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleNotificationClick(id, 'secondary');
                                                            }}
                                                            className="text-xs px-2 py-1 text-muted-foreground hover:bg-accent rounded focus:outline-none focus:ring-1 focus:ring-accent"
                                                        >
                                                            {actions.secondary}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </DropdownMenuItem>
                                );
                            })}
                        </div>
                    </ScrollArea>
                )}

                {notifications.length > 0 && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={handleClearAll}
                            className="flex items-center justify-center gap-2 p-3 cursor-pointer text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/5 focus:bg-destructive/5 focus:text-destructive"
                        >
                            <Icon name="Trash" size={14} />
                            Clear all notifications
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>

    {/* Live region for announcements */}
    <div aria-live="polite" aria-atomic="true" className="sr-only" id="notification-announcer" />
</>
);
});

AppNotification.displayName = 'AppNotification';

export default AppNotification;