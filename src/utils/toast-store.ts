export type ToastType = 'success' | 'error' | 'info' | 'warning'

export type Toast = {
  id: string
  message: string
  type: ToastType
  duration: number
}

type ToastListener = (toasts: Toast[]) => void

class ToastStore {
  private _toasts: Toast[] = []
  private _listeners: ToastListener[] = []

  private notify() {
    this._listeners.forEach(l => l(this._toasts))
  }

  subscribe(listener: ToastListener): () => void {
    this._listeners.push(listener)
    return () => {
      this._listeners = this._listeners.filter(l => l !== listener)
    }
  }

  add(message: string, type: ToastType = 'info', duration = 3500): string {
    const id = Math.random().toString(36).slice(2, 9)
    this._toasts = [...this._toasts, { id, message, type, duration }]
    this.notify()
    return id
  }

  remove(id: string) {
    this._toasts = this._toasts.filter(t => t.id !== id)
    this.notify()
  }

  success(message: string) { return this.add(message, 'success') }
  error(message: string) { return this.add(message, 'error') }
  info(message: string) { return this.add(message, 'info') }
  warning(message: string) { return this.add(message, 'warning') }
}

export const toast = new ToastStore()
