const FLAG_URLS = import.meta.glob<string>('/node_modules/country-flag-icons/3x2/*.svg', { query: '?url', import: 'default' })

const cache = new Map<string, Promise<HTMLImageElement | null>>()

export function loadFlag(code: string): Promise<HTMLImageElement | null> {
  const cached = cache.get(code)
  if (cached) return cached
  const loader = FLAG_URLS[`/node_modules/country-flag-icons/3x2/${code.toUpperCase()}.svg`]
  const promise = loader
    ? loader().then(
        (url) =>
          new Promise<HTMLImageElement | null>((resolve) => {
            const img = new Image()
            img.onload = () => resolve(img)
            img.onerror = () => resolve(null)
            img.src = url
          }),
      )
    : Promise.resolve(null)
  cache.set(code, promise)

  return promise
}
