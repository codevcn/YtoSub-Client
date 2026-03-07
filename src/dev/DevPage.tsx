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

      <div
        style={{ height: isFullscreen ? undefined : '300px', aspectRatio: isFullscreen ? undefined : '16 / 9' }}
        ref={ref}
      >
        <ReactPlayer
          src={'https://youtu.be/EKgy5EM-Vhw?si=QsL4l5-C3YbPjpXZ'}
          width="100%"
          height="100%"
          controls={true}
          config={{
            youtube: {
              rel: 0,
              fs: 0
            }
          }}
        />
        <button
          onClick={testFullscreen}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded absolute bottom-2 right-2"
        >
          {isFullscreen ? 'Thoát Fullscreen' : 'Bật Fullscreen'}
        </button>
      </div>

      <p className="text-zinc-500 mt-4 mb-4">This page is for testing and development purposes.</p>
    </div>
  )
}
