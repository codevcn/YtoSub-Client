export type TranslateVideoRequest = {
  video_url: string
  video_summary?: string
  username: string
}

export type TranslateVideoResponse = {
  video_id: string
  output_file: string
  message: string
}

export type ErrorResponse = {
  detail: string
}

// SSE Stream types
export type StreamTranslateParams = {
  video_url: string
  username: string
  video_summary?: string
}

export type StartEventData = {
  total_lines: number
  total_chunks: number
  percent: number
  message: string
}

export type ProgressEventData = {
  chunk_index: number
  total_chunks: number
  lines_done: number
  total_lines: number
  percent: number
  message: string
}

export type DoneEventData = {
  video_id: string
  output_file: string
  percent: number
  message: string
}

export type ErrorEventData = {
  detail: string
  message: string
}

export type SseEventData = StartEventData | ProgressEventData | DoneEventData | ErrorEventData
