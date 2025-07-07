// src/components/debug/quick-locale-debug.tsx
'use client';

import { useEffect, useState } from 'react';
import { useLocaleStore } from '@/stores/locale.store';
import { getLocaleDataClient } from '@/lib/cookies/locale/locale-cookie.client';

export function QuickLocaleDebug() {
    const store = useLocaleStore();
    const [logs, setLogs] = useState<string[]>([]);

    // Track all state changes
    useEffect(() => {
        const log = `${new Date().toLocaleTimeString()}: isHydrated=${store.isHydrated}, isTranslationsReady=${store.isTranslationsReady}, locale=${store.locale}`;
        setLogs(prev => [...prev.slice(-4), log]); // Keep last 5 logs
    }, [store.isHydrated, store.isTranslationsReady, store.locale, store.isInitializing]);

    // Manual test functions
    const testHydration = () => {
        console.log('🔧 Manual hydration test triggered');
        store.hydrate();
    };

    const testMessages = () => {
        console.log('🔧 Manual message loading test triggered');
        store.initializeMessages();
    };

    const checkClientCookies = () => {
        console.log('🔧 Checking client cookies...');
        try {
            const data = getLocaleDataClient();
            console.log('🍪 Cookie data:', data);
            alert(`Cookie data: ${JSON.stringify(data)}`);
        } catch (error) {
            console.error('💥 Cookie test failed:', error);
            alert(`Cookie test failed: ${error}`);
        }
    };

    if (process.env.NODE_ENV !== 'development') return null;

    return (
        <div className="fixed bottom-4 right-4 bg-black/95 text-white p-4 rounded-lg max-w-sm text-xs z-50 font-mono">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-yellow-400">Locale Debug</h3>
                <div className={`w-3 h-3 rounded-full ${store.isHydrated ? 'bg-green-500' : 'bg-red-500'}`} />
            </div>

            {/* Current State */}
            <div className="space-y-1 mb-3 text-xs">
                <div>🌍 Locale: <span className="text-cyan-400">{store.locale}</span></div>
                <div>⬅️ Direction: <span className="text-cyan-400">{store.direction}</span></div>
                <div>💧 Hydrated: <span className={store.isHydrated ? 'text-green-400' : 'text-red-400'}>{store.isHydrated ? '✅' : '❌'}</span></div>
                <div>📝 Translations: <span className={store.isTranslationsReady ? 'text-green-400' : 'text-red-400'}>{store.isTranslationsReady ? '✅' : '❌'}</span></div>
                <div>🔄 Initializing: <span className={store.isInitializing ? 'text-orange-400' : 'text-gray-400'}>{store.isInitializing ? '🔄' : '⏸️'}</span></div>
                <div>📊 Messages: <span className="text-purple-400">{Object.keys(store.messages).length}</span></div>
                {store.translationError && (
                    <div className="text-red-400">❌ {store.translationError}</div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-1 mb-3">
                <button
                    onClick={testHydration}
                    className="w-full bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
                >
                    Test Hydration
                </button>
                <button
                    onClick={testMessages}
                    className="w-full bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs"
                >
                    Test Messages
                </button>
                <button
                    onClick={checkClientCookies}
                    className="w-full bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded text-xs"
                >
                    Check Cookies
                </button>
                <button
                    onClick={() => {
                        console.log('🔄 Resetting store...');
                        store.reset();
                        setTimeout(() => store.hydrate(), 100);
                    }}
                    className="w-full bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
                >
                    Reset & Retry
                </button>
            </div>

            {/* Recent Logs */}
            <div>
                <div className="font-bold text-yellow-400 mb-1">Recent Changes:</div>
                <div className="space-y-1 max-h-20 overflow-y-auto">
                    {logs.map((log, index) => (
                        <div key={index} className="text-xs text-gray-300">
                            {log}
                        </div>
                    ))}
                </div>
            </div>

            {/* Window Check */}
            <div className="mt-2 pt-2 border-t border-gray-600">
                <div className="text-xs text-gray-400">
                    Window: {typeof window !== 'undefined' ? '✅' : '❌'}
                </div>
            </div>
        </div>
    );
}