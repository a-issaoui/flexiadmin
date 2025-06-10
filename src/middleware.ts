import { NextRequest, NextResponse } from 'next/server'
import { defaultLocale, localesConfig } from '@/lib/config/locales'

export function middleware(request: NextRequest) {
    // Get locale from cookie
    const cookieName = `${process.env.NEXT_PUBLIC_APP_NAME || 'NEXT'}_LOCALE`
    const cookieValue = request.cookies.get(cookieName)?.value

    let locale = defaultLocale

    if (cookieValue) {
        try {
            const parsed = JSON.parse(cookieValue)
            const isValid = localesConfig.some(l => l.code === parsed.lang)
            if (isValid) {
                locale = parsed.lang
            }
        } catch (error) {
            console.error('Failed to parse locale cookie:', error)
        }
    }

    // Clone the request headers and add the locale
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-locale', locale)

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    })
}

export const config = {
    matcher: [
        // Match all pathnames except for
        // - api (API routes)
        // - _next/static (static files)
        // - _next/image (image optimization files)
        // - favicon.ico (favicon file)
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}