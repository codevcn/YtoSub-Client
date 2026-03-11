import { useState, useCallback, useRef } from 'react'
import type { StreamTranslateParams, StartEventData, ProgressEventData, DoneEventData } from '../types/video'
import { apiClient } from '../config/api-config'
import { mobileToastify } from '../dev/mobile/toastify'
import { AxiosErrorHandler } from '../utils/axios-error-handler'

export type StreamStatus = 'idle' | 'pending' | 'translating' | 'done' | 'error'

export type TranslateEventSnapshot = {
  percent: number
  message: string
}

export type UseTranslateStreamReturn = {
  status: StreamStatus
  eventSnapshot: TranslateEventSnapshot | null
  result: DoneEventData | null
  error: string | null
  start: (params: StreamTranslateParams) => void
  cancel: () => void
}

function extractVideoId(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (parsed.hostname === 'youtu.be') return parsed.pathname.slice(1)
    if (parsed.hostname.includes('youtube.com')) return parsed.searchParams.get('v')
  } catch {
    return null
  }
  return null
}

export function useTranslateStream(): UseTranslateStreamReturn {
  const [status, setStatus] = useState<StreamStatus>('idle')
  const [eventSnapshot, setEventSnapshot] = useState<TranslateEventSnapshot | null>(null)
  const [result, setResult] = useState<DoneEventData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const eventSourceRef = useRef<EventSource | null>(null)

  const start = useCallback((params: StreamTranslateParams) => {
    // Đóng kết nối cũ nếu có (bao gồm cả React Strict Mode double-invoke)
    eventSourceRef.current?.close()

    setStatus('pending')
    setEventSnapshot(null)
    setResult(null)
    setError(null)

    const videoId = extractVideoId(params.video_url)
    if (!videoId) {
      setStatus('error')
      setError('URL YouTube không hợp lệ, không thể trích xuất video ID.')
      return
    }

    // Bước 1: Thiết lập SSE trước để không bỏ sót event start
    // Server buffer events trong Queue nên SSE kết nối trước POST là an toàn
    const baseUrl = import.meta.env.VITE_API_URL || ''
    console.log('>>> [sse] Base URL:', baseUrl)
    const sseQuery = new URLSearchParams({ username: params.username, video_id: videoId })
    const es = new EventSource(`${baseUrl}/video/sse?${sseQuery.toString()}`)
    eventSourceRef.current = es

    es.addEventListener('start', (e: MessageEvent) => {
      const data: StartEventData = JSON.parse(e.data)
      console.log('>>> [sse] start data:', data)
      setEventSnapshot({ percent: data.percent, message: data.message })
      setStatus('translating')
    })

    es.addEventListener('progress', (e: MessageEvent) => {
      const data: ProgressEventData = JSON.parse(e.data)
      console.log('>>> [sse] progress data:', data)
      setEventSnapshot({ percent: data.percent, message: data.message })
    })

    es.addEventListener('done', (e: MessageEvent) => {
      const data: DoneEventData = JSON.parse(e.data)
      console.log('>>> [sse] done data:', data)
      setEventSnapshot({ percent: data.percent, message: data.message })
      setResult(data)
      setStatus('done')
      es.close()
      eventSourceRef.current = null
    })

    es.addEventListener('error', (e: MessageEvent) => {
      console.log('>>> [sse] error data:', e.data)
      // Phân biệt lỗi nghiệp vụ từ server (có data) vs lỗi mất kết nối (không có data)
      if (e.data) {
        const data = JSON.parse(e.data)
        setError(data.detail ?? data.message ?? 'Lỗi không xác định.')
      } else {
        setError('Mất kết nối tới server. Vui lòng thử lại.')
      }
      setStatus('error')
      es.close()
      eventSourceRef.current = null
    })

    // Bước 2: Gửi POST để kích hoạt quá trình dịch (sau khi SSE đã sẵn sàng)
    apiClient
      .post('/video/translate', {
        username: params.username,
        video_url: params.video_url,
        video_summary: params.video_summary ?? null
      })
      .catch(err => {
        const detail = AxiosErrorHandler.handleError(err).message
        es.close()
        eventSourceRef.current = null
        setStatus('error')
        setError(detail)
        mobileToastify.show(AxiosErrorHandler.handleErrorForMobile(err))
      })
  }, [])

  const cancel = useCallback(() => {
    eventSourceRef.current?.close()
    eventSourceRef.current = null
    setStatus('idle')
    setEventSnapshot(null)
  }, [])

  return { status, eventSnapshot, result, error, start, cancel }
}
