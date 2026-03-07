# Senior React Developer (Vite-based) - Technical Standards & Core Skills

## 1. Core Technical Stack (Vite Ecosystem)

- **Build Tool:** **Vite:** Thành thạo cấu hình `vite.config.ts`, tối ưu hóa Hot Module Replacement (HMR), sử dụng các plugin như `@vitejs/plugin-react` và quản lý biến môi trường qua `.env`.
- **Language:** **TypeScript (Strict Mode):** Tận dụng tối đa Type-safety, Generics, Utility Types (`Pick`, `Omit`, `Partial`) và xử lý Type cho React Props/Events.
- **Runtime:** React 18+ (Hooks, Concurrent Mode, Transitions).

## 2. State & Data Management

- **Server State:** **TanStack Query (React Query):** Đây là kỹ năng bắt buộc để xử lý logic Fetching, Caching, Syncing và Mutation dữ liệu từ API thay cho `useEffect` thuần túy.
- **Client State:** \* **Zustand:** Ưu tiên hàng đầu cho việc quản lý Global State nhờ sự gọn nhẹ và hiệu năng cao.
- **Context API:** Dùng cho các Dependency Injection hoặc State cục bộ trong một nhóm Component (Compound Components).

- **Validation:** **React Hook Form** kết hợp với **Zod** để đảm bảo dữ liệu đầu vào luôn chuẩn xác.

## 3. Routing & Navigation

- **React Router v6/v7:** Nắm vững Data APIs (`loaders`, `actions`), Nested Routes và Protected Routes.
- **TanStack Router:** Lựa chọn thay thế hiện đại với khả năng Type-safe tuyệt đối cho các tham số trên URL.

## 4. UI Architecture & Styling

- **Styling:** **Tailwind CSS** (Utility-first) là tiêu chuẩn chính. Hiểu cách cấu hình `tailwind.config.ts` và tối ưu hóa CSS Bundle.
- **Component Pattern:** \* **Compound Components:** Xây dựng UI linh hoạt (ví dụ: Modal, Select, Tabs).
- **Headless UI:** Sử dụng **Radix UI** hoặc **Aria Kits** để đảm bảo Accessibility mà vẫn tự do tùy biến giao diện.
- **Shadcn/ui:** Kỹ năng tích hợp và tùy biến các component dựng sẵn vào hệ thống thiết kế riêng.

## 5. Performance Optimization (CSR Focused)

- **Code Splitting:** Sử dụng `React.lazy()` và `Suspense` để chia nhỏ Bundle, giảm thời gian tải trang đầu tiên (FCP).
- **Rendering Optimization:** Sử dụng đúng cách `useMemo`, `useCallback` và `React.memo` dựa trên kết quả đo đạc từ React DevTools.
- **Asset Management:** Tối ưu hóa kích thước hình ảnh (WebP), Lazy load Assets và sử dụng Vite plugins để nén file (`vite-plugin-compression`).
- **Bundle Analysis:** Sử dụng `rollup-plugin-visualizer` để kiểm soát các thư viện bên thứ ba và giảm thiểu kích thước file `.js`.

## 6. Project Structure & Quality

- **Feature-based Architecture:** Tổ chức thư mục theo tính năng (ví dụ: `src/features/auth`, `src/features/dashboard`) thay vì phân loại kỹ thuật đơn thuần (`components`, `hooks`).
- **Custom Hooks:** Đóng gói toàn bộ logic nghiệp vụ (Business Logic) và logic liên quan đến API vào Hooks, giữ cho Component chỉ tập trung vào hiển thị.
- **Testing:** \* **Vitest:** Thay thế cho Jest vì sự tương thích tuyệt đối và tốc độ nhanh trong môi trường Vite.
- **React Testing Library:** Kiểm thử hành vi người dùng trên Component.

- **Code Quality:** Cấu hình nghiêm ngặt **ESLint**, **Prettier**, kết hợp với **Husky** và **lint-staged** để chặn code lỗi trước khi commit.

## 7. Interaction with AI Agent

- **Prompting Standard:** Khi yêu cầu AI Agent viết code, hãy luôn nhắc nó tuân thủ:
- Sử dụng Functional Components với Arrow Functions.
- Ưu tiên Tailwind CSS cho UI.
- Luôn định nghĩa rõ ràng `interface/type` cho Props.
- Sử dụng TanStack Query cho mọi thao tác liên quan đến dữ liệu từ Server.

---

_Document Purpose: Cung cấp ngữ cảnh kỹ thuật tập trung vào React + Vite để AI Agent hỗ trợ lập trình, sửa lỗi và thiết kế kiến trúc hệ thống một cách nhất quán._
