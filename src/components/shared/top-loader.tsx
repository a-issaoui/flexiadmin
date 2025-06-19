// components/ui/top-loader.tsx
'use client';
import NextTopLoader from 'nextjs-toploader';

export default function TopLoader() {

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