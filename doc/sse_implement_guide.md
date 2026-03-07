# Tài liệu Triển khai SSE cho Frontend (ReactJS)

Tài liệu này hướng dẫn cách tích hợp **Server-Sent Events (SSE)** vào ứng dụng React để nhận dữ liệu thời gian thực từ server.

---

## 1. Luồng Hoạt động trong React (Workflow)

Khi sử dụng SSE trong React, luồng chuẩn sẽ gắn liền với vòng đời của Component:

1. **Mounting:** Khi Component xuất hiện, khởi tạo `new EventSource()`.
2. **Listening:** Thiết lập các listener (`onmessage`, `addEventListener`) để cập nhật **State**.
3. **Updating:** Khi nhận dữ liệu, React cập nhật State -> UI tự động re-render.
4. **Unmounting:** **Bắt buộc** phải đóng kết nối (`eventSource.close()`) để tránh lãng phí tài nguyên và lỗi logic.

---

## 2. Triển khai với Custom Hook (Khuyên dùng)

Việc tách logic SSE ra một Custom Hook giúp code sạch hơn và dễ tái sử dụng ở nhiều màn hình khác nhau.

### `useSSE.js`

```javascript
import { useState, useEffect } from 'react'

export const useSSE = url => {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('connecting')

  useEffect(() => {
    const eventSource = new EventSource(url)

    // Lắng nghe sự kiện mặc định
    eventSource.onmessage = event => {
      const parsedData = JSON.parse(event.data)
      setData(parsedData)
    }

    // Theo dõi trạng thái kết nối
    eventSource.onopen = () => setStatus('connected')

    eventSource.onerror = () => {
      setStatus('error')
      // Trình duyệt sẽ tự động reconnect, trừ khi ta đóng nó
    }

    // QUAN TRỌNG: Cleanup function để đóng kết nối khi component unmount
    return () => {
      eventSource.close()
      console.log('SSE Connection Closed')
    }
  }, [url])

  return { data, status }
}
```

### Sử dụng trong Component

```jsx
import { useSSE } from './hooks/useSSE'

const RealTimeDashboard = () => {
  const { data, status } = useSSE('http://api.example.com/v1/stream')

  return (
    <div>
      <h3>Trạng thái: {status === 'connected' ? '🟢 Online' : '🔴 Offline'}</h3>
      <div className="display-box">
        {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Đang chờ dữ liệu...</p>}
      </div>
    </div>
  )
}
```

---

## 3. Các vấn đề kỹ thuật quan trọng

### ⚠️ React Strict Mode (Development)

Trong môi trường phát triển (`dev`), React Strict Mode sẽ render component **2 lần**. Điều này dẫn đến việc khởi tạo 2 kết nối SSE đồng thời.

- **Giải pháp:** Đảm bảo hàm `cleanup` (return trong `useEffect`) đã gọi `eventSource.close()`. React sẽ tự động đóng kết nối thừa đầu tiên cho bạn.

### 🔑 Vấn đề Authentication (Token)

Mặc định, API `EventSource` **không hỗ trợ gửi Header** (như `Authorization`). Bạn có 2 cách giải quyết:

1. **Sử dụng Query String:** Gửi token qua URL: `new EventSource('/events?token=abc')`.
2. **Sử dụng Thư viện bổ trợ:** Dùng [event-source-polyfill](https://www.npmjs.com/package/event-source-polyfill) để có thể truyền Header như Fetch API.

### 📉 Giới hạn số lượng kết nối

Nếu ứng dụng chạy trên **HTTP/1.1**, trình duyệt giới hạn 6 kết nối mỗi domain. Nếu người dùng mở >6 tab, các tab sau sẽ không nhận được dữ liệu.

- **Giải pháp:** Ưu tiên sử dụng **HTTP/2** để nâng giới hạn lên hàng trăm kết nối.

---

## 4. Bảng so sánh nhanh

| Đặc điểm                | EventSource (SSE)            | WebSockets                 |
| ----------------------- | ---------------------------- | -------------------------- |
| **Hướng dữ liệu**       | Một chiều (Server -> Client) | Hai chiều (Bi-directional) |
| **Giao thức**           | HTTP tiêu chuẩn              | WebSockets Protocol        |
| **Tự động kết nối lại** | Có sẵn (Native)              | Phải tự code logic         |
| **Định dạng dữ liệu**   | UTF-8 Text                   | Text & Binary              |
| **Độ phức tạp**         | Thấp                         | Cao                        |
