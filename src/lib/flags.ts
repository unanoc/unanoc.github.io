const FLAG_DIR = '/node_modules/country-flag-icons/3x2/'
const FLAG_URLS = import.meta.glob<string>('/node_modules/country-flag-icons/3x2/*.svg', { query: '?url', import: 'default' })

const urls = new Map<string, Promise<string | null>>()
const images = new Map<string, Promise<HTMLImageElement | null>>()

export function flagUrl(code: string): Promise<string | null> {
  const key = code.toUpperCase()
  let url = urls.get(key)
  if (!url) {
    const loader = FLAG_URLS[`${FLAG_DIR}${key}.svg`]
    url = loader ? loader().catch(() => null) : Promise.resolve(null)
    urls.set(key, url)
  }

  return url
}

export function loadFlag(code: string): Promise<HTMLImageElement | null> {
  const key = code.toUpperCase()
  let image = images.get(key)
  if (!image) {
    image = flagUrl(key).then(
      (src) =>
        new Promise<HTMLImageElement | null>((resolve) => {
          if (!src) return resolve(null)
          const img = new Image()
          img.onload = () => resolve(img)
          img.onerror = () => resolve(null)
          img.src = src
        }),
    )
    images.set(key, image)
  }

  return image
}
