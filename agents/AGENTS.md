# AGENTS.md

## Coding Conventions

### 1. Type Definitions

- Always use `type` when declaring types.
- Only use `interface` when defining a contract for a **class that uses `implements`**.
- Do not use `interface` for general type definitions.

### 2. Spacing Rules

- Do **not use padding or margin greater than `24px`**.
- Excessive spacing can make the UI feel empty and unbalanced.

### 3. File Naming

#### General files

- All non-component files must use **kebab-case**.

Examples:

- ✅ `api-client.ts`
- ✅ `user-service.ts`
- ❌ `apiClient.ts`
- ❌ `ApiClient.ts`

#### React Component files

- Files that export **React Components** must use **PascalCase**.

Examples:

- ✅ `UserProfileCard.tsx`
- ✅ `LoginForm.tsx`
- ❌ `user-profile-card.tsx`
- ❌ `login-form.tsx`

### 4. Theme Consistency

- When designing UI components, always reference the **main theme configuration** located in:

```

src/styles

```

- Colors, spacing, typography, and other design tokens should follow the existing theme.

### 5. Icons

- Do **not use raw emoji icons** such as:
  - `🗑️`
  - `⚙️`
  - `💻`
- All icons must be implemented using **SVG elements**.

Example:

```html
<svg width="16" height="16" viewBox="0 0 24 24">...</svg>
```

### 6. Event Handling

- Event handler functions must be **declared inside the component body**.
- Avoid writing logic directly inside HTML/JSX templates.

Example:

✅ Recommended

```tsx
function handleClick() {
  // logic here
}

;<button onClick={handleClick}>Save</button>
```

❌ Avoid

```tsx
<button
  onClick={() => {
    // complex logic here
  }}
>
  Save
</button>
```

## 7. Quy tắc Phát triển và Tiêu chuẩn Viết Code (Coding Standards)

- Mọi đoạn mã phải tuân thủ các tiêu chuẩn viết code đã được quy định từ tài liệu **Senior React Developer (Vite-based) - Technical Standards & Core Skills** trong file `agent-skills/reactjs-vite-coding-standards.md`.
