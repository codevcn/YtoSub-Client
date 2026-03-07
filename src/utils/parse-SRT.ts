import type { Subtitle } from '../types/global'

function timeToSeconds(timeStr: string): number {
  const [hours, minutes, seconds] = timeStr.split(':')
  const [sec, ms] = seconds.split(',')
  return parseInt(hours, 10) * 3600 + parseInt(minutes, 10) * 60 + parseInt(sec, 10) + parseInt(ms, 10) / 1000
}

export function parseSRT(srtContent: string): Subtitle[] {
  // Normalize line endings
  const content = srtContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const blocks = content.split(/\n\n+/)

  const subtitles: Subtitle[] = []

  for (const block of blocks) {
    if (!block.trim()) continue

    // SRT format:
    // 1
    // 00:00:01,000 --> 00:00:04,000
    // text
    const lines = block.split('\n')
    if (lines.length >= 3) {
      const id = parseInt(lines[0], 10)
      const timeLine = lines[1]
      const match = timeLine.match(/(\d{2}:\d{2}:\d{2},\d{3})\s+-->\s+(\d{2}:\d{2}:\d{2},\d{3})/)

      if (match) {
        const start = timeToSeconds(match[1])
        const end = timeToSeconds(match[2])
        const text = lines.slice(2).join('\n')

        subtitles.push({ id, start, end, text })
      }
    }
  }

  return subtitles
}
