// AppSms.jsx - Refactored with Button + Framer Motion
'use client';

import {useState, useEffect, useMemo, useCallback} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {Button} from '@/components/ui/button';
import {Icon} from '@/components/shared/icon';
import {Skeleton} from '@/components/ui/skeleton';

export default function AppSms() {
    const [isAvailable, setIsAvailable] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const toggleSMS = useCallback(async () => {
        if (isLoading) return;

        if (navigator.vibrate) navigator.vibrate(1);
        setIsLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 200));

            setIsAvailable(prev => {
                const newState = !prev;
                const announcement = `SMS notifications ${newState ? 'enabled' : 'disabled'}`;

                const announcer = document.createElement('div');
                announcer.setAttribute('aria-live', 'polite');
                announcer.className = 'sr-only';
                announcer.textContent = announcement;
                document.body.appendChild(announcer);
                setTimeout(() => document.body.removeChild(announcer), 1000);

                return newState;
            });
        } catch (error) {
            console.error('Failed to toggle AppSms:', error);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading]);

    const iconKey = useMemo(() => (isAvailable ? 'enabled' : 'disabled'), [isAvailable]);

    if (!isMounted) {
        return (
            <Skeleton
                aria-hidden
                className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center"
            />
        );
    }

    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.2}}
        >
            <Button
                variant="ghost"
                size="icon"
                onClick={toggleSMS}
                aria-label={`${isAvailable ? 'Disable' : 'Enable'} SMS notifications`}
                disabled={isLoading}
                className="rounded-full w-10 h-10 p-0  cursor-pointer"
            >
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={iconKey + (isLoading ? '-loading' : '')}
                        initial={{y: -8, opacity: 0}}
                        animate={{y: 0, opacity: 1}}
                        exit={{y: 8, opacity: 0}}
                        transition={{duration: 0.25, ease: 'easeInOut'}}
                        className="flex items-center justify-center relative w-7 h-7"
                    >
                        {isLoading ? (
                            <div
                                className="w-4 h-4 animate-spin border-2 border-primary border-t-transparent rounded-full"/>
                        ) : (
                            <>
                          <span  className={`text-[12px] font-semibold leading-none ${isAvailable ? 'text-green-500' : 'text-black-500'}`} >
                           SMS
                          </span>
                                {!isAvailable && (
                                    <Icon
                                        name="ProhibitIcon"
                                        size="40"
                                        weight="bold"
                                        className="absolute inset-0 m-auto size-7 opacity-65 text-red-500"
                                    />
                                )}
                            </>
                        )}
                    </motion.div>

                </AnimatePresence>
            </Button>
        </motion.div>
    );
}
