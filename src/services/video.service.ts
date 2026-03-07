import { apiClient } from '../config/api-config'
import type { TranslateVideoRequest, TranslateVideoResponse } from '../types/video'

const TRANSLATE_TIMEOUT_MS = 300_000 // 5 minutes

class VideoService {
  async translateVideo(payload: TranslateVideoRequest): Promise<TranslateVideoResponse> {
    try {
      const { data } = await apiClient.post<TranslateVideoResponse>('video/translate', payload, {
        timeout: TRANSLATE_TIMEOUT_MS
      })
      console.log('>>> data ser:', data)

      return data
    } catch (error) {
      console.error('>>> Error translating video:', error)
      throw error
    }
  }
}

export const videoService = new VideoService()
