import { useState, useEffect } from 'react'
import { isMobileScreen } from '../utils/helpers'

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(isMobileScreen)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(isMobileScreen())
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return isMobile
}
