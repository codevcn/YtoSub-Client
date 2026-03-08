import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export const MobileToaster = () => {
  const [message, setMessage] = useState('')
  const conatinerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleToastify = (event: CustomEvent) => {
      setMessage(event.detail)
      openHideToaster(true)
    }
    document.addEventListener('toastify', handleToastify as EventListener)
    return () => {
      document.removeEventListener('toastify', handleToastify as EventListener)
    }
  }, [])

  const openHideToaster = (isOpen: boolean) => {
    const container = conatinerRef.current
    if (container) {
      const height = container.getBoundingClientRect().height
      container.style.top = isOpen ? '20px' : `-${height + 10}px`
    }
  }

  return createPortal(
    <div
      ref={conatinerRef}
      className="fixed left-1/2 -translate-x-1/2 z-99 transition-[top] duration-300"
      onClick={() => openHideToaster(false)}
    >
      <div className="w-fit h-fit max-w-[calc(100vw-100px)] max-h-[calc(100vh-100px)] overflow-auto bg-white text-black px-2 py-2 rounded shadow-lg border border-gray-800">
        <pre>{message}</pre>
      </div>
    </div>,
    document.body
  )
}
