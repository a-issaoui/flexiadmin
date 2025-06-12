'use client'
import { AnimatePresence, motion } from 'framer-motion'

interface AnimatedContainerProps {
    children: React.ReactNode
    triggerKey: string
}

export function AnimatedContainer({ children, triggerKey }: AnimatedContainerProps) {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={triggerKey}
                initial={{
                    opacity: 0,
                    y: 5,
                    scale: 0.99
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1
                }}
                exit={{
                    opacity: 0,
                    y: -5,
                    scale: 1.01
                }}
                transition={{
                    duration: 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94]
                }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    )
}