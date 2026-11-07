import { useEffect, useState } from 'react'

export function useNow(intervalMs: number) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs)

    return () => clearInterval(id)
  }, [intervalMs])

  return now
}
