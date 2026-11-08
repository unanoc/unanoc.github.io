import { useEffect, useState } from 'react'

export function useNow(intervalMs: number) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    let id: ReturnType<typeof setTimeout>
    const schedule = () => {
      id = setTimeout(() => {
        setNow(new Date())
        schedule()
      }, intervalMs - (Date.now() % intervalMs))
    }
    schedule()

    return () => clearTimeout(id)
  }, [intervalMs])

  return now
}
