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
