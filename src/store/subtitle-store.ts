import { create } from 'zustand'
import type { Subtitle } from '../types/global'
import { subtitleDefaults } from '../config/subtitle-config'
import type { LoadedSubtitleMeta } from '../components/player/SubtitleBrowser/subtitle-browser-types'

type SubtitleStore = {
  subtitles: Subtitle[]
  setSubtitles: (subtitles: Subtitle[]) => void

  appliedSubtitleMeta: LoadedSubtitleMeta | null
  setAppliedSubtitleMeta: (meta: LoadedSubtitleMeta | null) => void

  currentTime: number
  setCurrentTime: (time: number) => void

  subtitleOffsetY: number
  subtitleFontSize: number
  subtitleBgOpacity: number

  setSubtitleOffsetY: (value: number) => void
  setSubtitleFontSize: (value: number) => void
  setSubtitleBgOpacity: (value: number) => void
}

export const useSubtitleStore = create<SubtitleStore>(set => ({
  subtitles: [],
  setSubtitles: subtitles => set({ subtitles }),

  appliedSubtitleMeta: null,
  setAppliedSubtitleMeta: meta => set({ appliedSubtitleMeta: meta }),

  currentTime: 0,
  setCurrentTime: time => set({ currentTime: time }),

  subtitleOffsetY: subtitleDefaults.offsetY,
  subtitleFontSize: subtitleDefaults.fontSize,
  subtitleBgOpacity: subtitleDefaults.bgOpacity,

  setSubtitleOffsetY: value => set({ subtitleOffsetY: value }),
  setSubtitleFontSize: value => set({ subtitleFontSize: value }),
  setSubtitleBgOpacity: value => set({ subtitleBgOpacity: value })
}))
