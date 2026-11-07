import { motion } from 'motion/react'
import { Profile } from '@/components/layout/Profile'
import { Activity } from '@/components/sections/Activity'
import { Projects } from '@/components/sections/Projects'
import { Travel } from '@/components/sections/Travel'
import { EASE_OUT } from '@/lib/motion'

export default function App() {
  return (
    <div className="mx-auto max-w-[1080px] px-5 py-12 sm:py-16 lg:py-20">
      <div className="grid gap-14 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-20">
        <Profile className="lg:sticky lg:top-20 lg:self-start" />
        <motion.main
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE_OUT }}
          className="flex min-w-0 flex-col gap-14"
        >
          <Projects />
          <Activity />
        </motion.main>
      </div>
      <div className="mt-20 border-t border-line pt-14">
        <Travel />
      </div>
    </div>
  )
}
