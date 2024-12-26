import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function EntryAnimation({ onAnimationComplete }: { onAnimationComplete: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black flex items-center justify-center"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.3, delay: 1 }}
        onAnimationComplete={onAnimationComplete}
      >
        <motion.div
          className="w-64 h-64"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 1, ease: "linear" }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="45" fill="#FF0000"/>
              <g fill="#000">
                <path d="M50 15 A35 35 0 0 1 85 50 L50 50 Z" />
                <path d="M50 15 A35 35 0 0 1 85 50 L50 50 Z" transform="rotate(120 50 50)" />
                <path d="M50 15 A35 35 0 0 1 85 50 L50 50 Z" transform="rotate(240 50 50)" />
              </g>
              <circle cx="50" cy="50" r="10" fill="#000"/>
              <circle cx="50" cy="50" r="42" fill="none" stroke="#000" strokeWidth="1"/>
              <circle cx="50" cy="50" r="38" fill="none" stroke="#000" strokeWidth="1"/>
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

