import { apiClient } from '../config/api-config'

export type SrtFileItem = {
  video_id: string
  filename: string
}

type ListFilesResponse = {
  username: string
  files: SrtFileItem[]
}

export type SubtitleUploadRequest = {
  username: string
  video_link: string
  is_public: boolean
  file: File
  password?: string
}

export type SubtitleUploadResponse = {
  id: number
  username: string
  video_link: string
  is_public: boolean
  video_id: string
  file_path: string
  created_at: string
}

class FileService {
  async listFilesByUsername(username: string): Promise<SrtFileItem[]> {
    const { data } = await apiClient.post<ListFilesResponse>('/file/list', { username })
    return data.files
  }

  async uploadSubtitle(params: SubtitleUploadRequest): Promise<SubtitleUploadResponse> {
    const formData = new FormData()
    formData.append('username', params.username)
    formData.append('video_link', params.video_link)
    formData.append('is_public', String(params.is_public))
    if (params.password) formData.append('password', params.password)
    formData.append('file', params.file)

    const { data } = await apiClient.post<SubtitleUploadResponse>('/subtitle/upload', formData, {
      headers: { 'Content-Type': undefined }
    })
    return data
  }
}

export const fileService = new FileService()
