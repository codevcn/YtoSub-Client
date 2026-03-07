import type { Subtitle } from '../types/global'

/**
 * Tìm kiếm phụ đề hiện tại dựa trên thời gian video bằng Binary Search
 * Độ phức tạp: O(log N)
 */
export function findSubtitleByTime(subtitles: Subtitle[], currentTime: number): Subtitle | null {
  let left = 0
  let right = subtitles.length - 1

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    const sub = subtitles[mid]

    // Nếu thời gian hiện tại nằm trong khoảng của phụ đề này
    if (currentTime >= sub.start && currentTime <= sub.end) {
      return sub
    }

    // Nếu thời gian hiện tại nhỏ hơn thời gian bắt đầu, tìm ở nửa bên trái
    if (currentTime < sub.start) {
      right = mid - 1
    }
    // Nếu thời gian hiện tại lớn hơn thời gian kết thúc, tìm ở nửa bên phải
    else {
      left = mid + 1
    }
  }

  // Không tìm thấy phụ đề phù hợp (ví dụ: đoạn video đang không có người nói)
  return null
}
