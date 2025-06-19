import * as React from "react"

const MOBILE_BREAKPOINT = 768
const MOBILE_MEDIA_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`
const MOBILE_COOKIE_NAME = "is_mobile"
const MOBILE_COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export function useIsMobileWithCookies(): { isMobile: boolean; isHydrated: boolean } {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)
  const [isHydrated, setIsHydrated] = React.useState<boolean>(false)

  React.useEffect(() => {
    setIsHydrated(true)

    if (typeof window === "undefined") return

    const mql = window.matchMedia(MOBILE_MEDIA_QUERY)

    // Set initial value after hydration
    const currentIsMobile = mql.matches
    setIsMobile(currentIsMobile)

    // Save to cookie for next SSR
    document.cookie = `${MOBILE_COOKIE_NAME}=${currentIsMobile}; path=/; max-age=${MOBILE_COOKIE_MAX_AGE}`

    const onChange = ({ matches }: MediaQueryListEvent) => {
      setIsMobile(matches)
      // Update cookie when mobile state changes
      document.cookie = `${MOBILE_COOKIE_NAME}=${matches}; path=/; max-age=${MOBILE_COOKIE_MAX_AGE}`
    }

    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return {
    isMobile: isHydrated ? isMobile : false,
    isHydrated
  }
}

// Helper function to get mobile state from cookies (for SSR)
export function getIsMobileFromCookies(cookieHeader: string): boolean {
  if (!cookieHeader) return false

  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=')
    acc[key] = value
    return acc
  }, {} as Record<string, string>)

  return cookies[MOBILE_COOKIE_NAME] === 'true'
}