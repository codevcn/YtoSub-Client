export async function downloadFile(filename: string, videoId: string, username: string): Promise<void> {
  const baseUrl = import.meta.env.VITE_API_URL ?? ''

  const response = await fetch(`${baseUrl}/file/download`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, video_id: videoId, filename }),
  })

  if (!response.ok) {
    let message = `Lỗi ${response.status}`
    try {
      const body = await response.json()
      message = body.detail ?? message
    } catch {
      // response không phải JSON
    }
    if (response.status === 404) throw new Error(`File không tồn tại: ${filename}`)
    if (response.status === 403) throw new Error('Truy cập bị từ chối.')
    if (response.status === 400) throw new Error(`Tham số không hợp lệ: ${message}`)
    throw new Error(message)
  }

  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
