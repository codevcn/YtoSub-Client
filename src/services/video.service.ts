import { apiClient } from '../config/api-config'
import type { TranslateVideoRequest, TranslateVideoResponse } from '../types/video'
import { storage } from '../utils/local-storage'
import { DEFAULT_USERNAME } from '../utils/constants'

const TRANSLATE_TIMEOUT_MS = 300_000 // 5 minutes

type TranslateVideoPayload = Omit<TranslateVideoRequest, 'username'>

class VideoService {
  async translateVideo(payload: TranslateVideoPayload): Promise<TranslateVideoResponse> {
    const username = storage.get('ytosub:username') ?? DEFAULT_USERNAME
    const fullPayload: TranslateVideoRequest = { ...payload, username }
    try {
      const { data } = await apiClient.post<TranslateVideoResponse>('video/translate', fullPayload, {
        timeout: TRANSLATE_TIMEOUT_MS
      })
      return data
    } catch (error) {
      console.error('>>> Error translating video:', error)
      throw error
    }
  }
}

export const videoService = new VideoService()
