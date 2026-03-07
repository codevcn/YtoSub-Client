import { MOBILE_BREAKPOINT } from './constants'

export const isMobileScreen = (): boolean => window.innerWidth < MOBILE_BREAKPOINT
