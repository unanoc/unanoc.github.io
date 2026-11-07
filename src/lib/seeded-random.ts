export function seededRandom(seed: number) {
  let s = seed

  return () => {
    s = (s * 9301 + 49297) % 233280

    return s / 233280
  }
}
