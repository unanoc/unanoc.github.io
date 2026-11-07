import { motion } from 'motion/react'
import { useState } from 'react'
import avatar from '@/assets/images/avatar.webp'
import { useI18n } from '@/i18n/useI18n'

export function Avatar({ alt }: { alt: string }) {
  const [waves, setWaves] = useState(0)
  const { m } = useI18n()
  const wave = () => setWaves((w) => w + 1)

  return (
    <button onClick={wave} onMouseEnter={wave} aria-label={m.ui.wave} className="relative">
      <img src={avatar} alt={alt} width={64} height={64} className="size-16 rounded-full border border-line object-cover" />
      <motion.span
        key={waves}
        aria-hidden
        className="absolute -right-1 -bottom-1 origin-[70%_70%] text-xl"
        initial={waves ? { rotate: 0, scale: 0.6, opacity: 0 } : false}
        animate={{ rotate: [0, 18, -8, 18, -4, 10, 0], scale: 1, opacity: 1 }}
        transition={{ duration: 1.1, ease: 'easeInOut' }}
      >
        👋
      </motion.span>
    </button>
  )
}
