import { apiClient } from '../config/api-config'

export type SubtitleListItem = {
  id: number
  username: string
  video_link: string
  is_public: boolean
  video_id: string
  file_path: string
  created_at: string
}

export type SubtitleListRequest = {
  video_id: string
  username?: string | null
  time_from?: string | null
  time_to?: string | null
  page: number
}

type SubtitleListResponse = {
  video_id: string
  total: number
  page: number
  page_size: number
  items: SubtitleListItem[]
}

class SubtitleService {
  async listSubtitles(req: SubtitleListRequest): Promise<SubtitleListResponse> {
    const { data } = await apiClient.post<SubtitleListResponse>('/subtitle/list', req)
    return data
  }

  async getSubtitleContent(id: number, password?: string | null): Promise<string> {
    const baseUrl = import.meta.env.VITE_API_URL || ''
    if (!baseUrl) {
      throw new Error('Server URL is not defined in environment variables.')
    }
    const response = await fetch(`${baseUrl}/subtitle/content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, password: password ?? null })
    })
    if (response.ok) {
      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('Không thể đọc nội dung phụ đề từ phản hồi của server.')
      }
      const decoder = new TextDecoder()
      let data = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        // Giải mã chunk nhị phân thành string
        const chunk = decoder.decode(value, { stream: true })
        data += chunk
      }

      return data
    }
    throw new Error((await response.json()).message || 'Không thể tải nội dung phụ đề.')
  }
}

export const subtitleService = new SubtitleService()
