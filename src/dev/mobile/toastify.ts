class MobileToastify {
  show(message: string) {
    document.dispatchEvent(new CustomEvent('toastify', { detail: message }))
  }
}

export const mobileToastify = new MobileToastify()
