type StorageSchema = {
  'ytosub:last-url': string
  'ytosub:last-summary-url': string
}

type StorageKey = keyof StorageSchema

class LocalStorageManager {
  get<K extends StorageKey>(key: K): StorageSchema[K] | null {
    try {
      const raw = localStorage.getItem(key)
      if (raw === null) return null
      return JSON.parse(raw) as StorageSchema[K]
    } catch {
      return null
    }
  }

  getOrDefault<K extends StorageKey>(key: K, defaultValue: StorageSchema[K]): StorageSchema[K] {
    return this.get(key) ?? defaultValue
  }

  set<K extends StorageKey>(key: K, value: StorageSchema[K]): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // storage quota exceeded or unavailable — fail silently
    }
  }

  remove(key: StorageKey): void {
    localStorage.removeItem(key)
  }

  clear(): void {
    localStorage.clear()
  }
}

export const storage = new LocalStorageManager()
