import React, { useState } from 'react'
import { YouTubePlayer } from '../components/player/YouTubePlayer'
import { SubtitleUploader } from '../components/player/SubtitleUploader'
import { SubtitleBrowser } from '../components/player/SubtitleBrowser'
import { storage } from '../utils/local-storage'

const DEFAULT_URL = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

export function HomePage() {
  const [youtubeUrl, setYoutubeUrl] = useState<string>(() => storage.getOrDefault('ytosub:last-url', DEFAULT_URL))

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setYoutubeUrl(url)
    storage.set('ytosub:last-url', url)
  }

  return (
    <main>
      {/* Input URL Section */}
      <section className="bg-white dark:bg-zinc-800 shadow-sm p-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 w-full">
          <label
            htmlFor="youtube-url"
            className="block text-center text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
          >
            Đường dẫn video YouTube
          </label>
          <input
            id="youtube-url"
            type="text"
            value={youtubeUrl}
            onChange={handleUrlChange}
            placeholder="Nhập đường dẫn YouTube tại đây (vd: https://youtube.com/watch?v=...)"
            className="text-center w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-2 outline-(--main-cl) focus:border-transparent transition-all"
          />
        </div>
      </section>

      {/* Player Section */}
      <section className="w-full mx-auto">
        <YouTubePlayer url={youtubeUrl} />
      </section>

      {/* Uploader Section */}
      <section>
        <SubtitleUploader videoUrl={youtubeUrl} />
      </section>

      {/* Subtitle Browser Section */}
      <section className="px-4 pb-8">
        <SubtitleBrowser videoUrl={youtubeUrl} />
      </section>
    </main>
  )
}
