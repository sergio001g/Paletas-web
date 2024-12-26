import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Lock, Unlock, Trash2, Plus } from 'lucide-react'
import { motion } from 'framer-motion'

interface ColorPaletteProps {
  colors: string[]
  onColorChange: (index: number, color: string) => void
  onDeleteColor: (index: number) => void
  onAddColor: () => void
  lockedColors: boolean[]
  onToggleLock: (index: number) => void
}

export function ColorPalette({ 
  colors, 
  onColorChange, 
  onDeleteColor, 
  onAddColor, 
  lockedColors, 
  onToggleLock 
}: ColorPaletteProps) {
  return (
    <div className="space-y-4">
      {colors.map((color, index) => (
        <motion.div
          key={index}
          className="flex items-center space-x-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <div className="relative group">
            <Input
              type="color"
              value={color}
              onChange={(e) => onColorChange(index, e.target.value)}
              className="w-12 h-12 p-1 rounded-full border-2 border-red-600 shadow-lg transition-transform transform group-hover:scale-110"
            />
            <div
              className="absolute inset-0 rounded-full shadow-inner pointer-events-none"
              style={{ backgroundColor: color }}
            ></div>
          </div>
          <Input
            type="text"
            value={color}
            onChange={(e) => onColorChange(index, e.target.value)}
            className="flex-grow font-mono text-lg bg-gray-800 text-white border-red-600"
          />
          <Button
            size="icon"
            variant="outline"
            onClick={() => onToggleLock(index)}
            className="transition-transform transform hover:scale-105 border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
          >
            {lockedColors[index] ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
          </Button>
          <Button
            size="icon"
            variant="destructive"
            onClick={() => onDeleteColor(index)}
            className="transition-transform transform hover:scale-105 bg-red-600 hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </motion.div>
      ))}
      <Button onClick={onAddColor} className="w-full mt-4 transition-transform transform hover:scale-105 bg-red-600 hover:bg-red-700">
        <Plus className="h-4 w-4 mr-2" />
        Añadir Color
      </Button>
    </div>
  )
}

