// components/ui/progress-bar.tsx
'use client';
import NextTopLoader from 'nextjs-toploader';

export default function ProgressBar() {

    return (
        <NextTopLoader
            color="#2563eb"
            showSpinner={false}
            height={2}
            shadow={false}
            showForHashAnchor={false}
        />
    );
}