import * as React from "react"

const MOBILE_BREAKPOINT = 768
const MOBILE_MEDIA_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia(MOBILE_MEDIA_QUERY).matches
    }
    return false // Default for SSR
  })

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const mql = window.matchMedia(MOBILE_MEDIA_QUERY)
    const onChange = ({ matches }: MediaQueryListEvent) => setIsMobile(matches)

    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}
