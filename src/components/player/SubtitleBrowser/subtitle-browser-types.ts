import type { SubtitleListItem } from '../../../services/subtitle.service'
import type { Subtitle } from '../../../types/global'

// ─── Types ────────────────────────────────────────────────────────────────────

export type BrowserStatus = 'loading' | 'done' | 'error'

export type SearchArgs = {
  videoId: string
  username: string
  timeFromPreset: string
  timeToPreset: string
  page: number
}

export type LoadedSubtitleMeta = {
  item: SubtitleListItem
  subtitles: Subtitle[]
}

export type SelectOption = { label: string; value: string }

// ─── Constants ────────────────────────────────────────────────────────────────

export const FROM_OPTIONS: SelectOption[] = [
  { label: 'Tất cả', value: '' },
  { label: 'Hôm nay', value: 'today' },
  { label: '7 ngày trước', value: '7d' },
  { label: '30 ngày trước', value: '30d' },
  { label: '3 tháng trước', value: '90d' }
]

export const TO_OPTIONS: SelectOption[] = [
  { label: 'Hiện tại', value: '' },
  { label: 'Cuối hôm nay', value: 'today_end' },
  { label: 'Cuối hôm qua', value: 'yesterday_end' },
  { label: '7 ngày trước', value: '7d_end' },
  { label: '30 ngày trước', value: '30d_end' }
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function extractVideoId(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (parsed.hostname === 'youtu.be') return parsed.pathname.slice(1).split('?')[0]
    if (parsed.hostname.includes('youtube.com')) return parsed.searchParams.get('v')
  } catch {
    return null
  }
  return null
}

function toISOLocal(date: Date): string {
  const z = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${z(date.getMonth() + 1)}-${z(date.getDate())}T${z(date.getHours())}:${z(date.getMinutes())}:${z(date.getSeconds())}`
}

export function resolveTimeFrom(preset: string): string | null {
  if (!preset) return null
  const d = new Date()
  if (preset === 'today') {
    d.setHours(0, 0, 0, 0)
    return toISOLocal(d)
  }
  const days: Record<string, number> = { '7d': 7, '30d': 30, '90d': 90 }
  if (days[preset] !== undefined) {
    d.setDate(d.getDate() - days[preset])
    d.setHours(0, 0, 0, 0)
    return toISOLocal(d)
  }
  return null
}

export function resolveTimeTo(preset: string): string | null {
  if (!preset) return null
  const d = new Date()
  if (preset === 'today_end') {
    d.setHours(23, 59, 59, 0)
    return toISOLocal(d)
  }
  if (preset === 'yesterday_end') {
    d.setDate(d.getDate() - 1)
    d.setHours(23, 59, 59, 0)
    return toISOLocal(d)
  }
  const days: Record<string, number> = { '7d_end': 7, '30d_end': 30 }
  if (days[preset] !== undefined) {
    d.setDate(d.getDate() - days[preset])
    d.setHours(23, 59, 59, 0)
    return toISOLocal(d)
  }
  return null
}

export function extractFilename(filePath: string): string {
  return filePath.split(/[/\\]/).pop() ?? filePath
}

export function formatSeconds(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  const z = (n: number) => String(n).padStart(2, '0')
  return `${z(h)}:${z(m)}:${z(s)}`
}

export function formatDate(iso: string): string {
  try {
    const d = new Date(iso)
    const z = (n: number) => String(n).padStart(2, '0')
    return `${z(d.getDate())}/${z(d.getMonth() + 1)}/${d.getFullYear()} ${z(d.getHours())}:${z(d.getMinutes())}`
  } catch {
    return iso
  }
}

export function buildPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const result: (number | '...')[] = [1]
  if (current > 3) result.push('...')
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) result.push(i)
  if (current < total - 2) result.push('...')
  result.push(total)
  return result
}
