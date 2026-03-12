import { useRef, useState, useEffect } from 'react'
import ReactPlayer from 'react-player'

export const DevPage = () => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Hàm kích hoạt fullscreen
  const testFullscreen = () => {
    if (ref.current) {
      if (!document.fullscreenElement) {
        ref.current.requestFullscreen().catch(err => {
          console.error(`Không thể bật chế độ toàn màn hình: ${err.message}`)
        })
      } else {
        document.exitFullscreen()
      }
    }
  }

  // Đồng bộ hóa biến trạng thái isFullscreen khi người dùng nhấn phím ESC
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  return (
    <div className="p-6 bg-pink-200 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Development Page</h1>
    </div>
  )
}
