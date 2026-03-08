import { apiClient } from '../config/api-config'

export type SrtFileItem = {
  video_id: string
  filename: string
}

type ListFilesResponse = {
  username: string
  files: SrtFileItem[]
}

class FileService {
  async listFilesByUsername(username: string): Promise<SrtFileItem[]> {
    const { data } = await apiClient.post<ListFilesResponse>('/file/list', { username })
    return data.files
  }
}

export const fileService = new FileService()
