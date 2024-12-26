'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { ColorPalette } from '@/components/ColorPalette'
import { AccessibilityInfo } from '@/components/AccessibilityInfo'
import { PalettePreview } from '@/components/PalettePreview'
import { CSSGenerator } from '@/components/CSSGenerator'
import { EntryAnimation } from '@/components/EntryAnimation'
import { Save, Share2, Shuffle, Lock, Unlock, Download, Upload } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast, Toaster } from 'react-hot-toast'

function generateRandomColor() {
  return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
}

function adjustColorBrightness(color: string, amount: number) {
  const hex = color.replace('#', '')
  const r = Math.max(0, Math.min(255, parseInt(hex.slice(0, 2), 16) + amount))
  const g = Math.max(0, Math.min(255, parseInt(hex.slice(2, 4), 16) + amount))
  const b = Math.max(0, Math.min(255, parseInt(hex.slice(4, 6), 16) + amount))
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

export default function AkatsukiColorPaletteTool() {
  const [colors, setColors] = useState<string[]>([])
  const [lockedColors, setLockedColors] = useState<boolean[]>([])
  const [savedPalettes, setSavedPalettes] = useState<string[][]>([])
  const [showEntryAnimation, setShowEntryAnimation] = useState(true)
  const [harmonyType, setHarmonyType] = useState<'analogous' | 'monochromatic' | 'triadic' | 'complementary'>('analogous')
  const [brightness, setBrightness] = useState(0)

  useEffect(() => {
    const storedPalettes = localStorage.getItem('savedPalettes')
    if (storedPalettes) {
      setSavedPalettes(JSON.parse(storedPalettes))
    }
    if (colors.length === 0) {
      generatePalette()
    }
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const sharedPalette = params.get('p')
      if (sharedPalette) {
        try {
          const decodedColors = JSON.parse(atob(sharedPalette))
          if (Array.isArray(decodedColors) && decodedColors.every(color => typeof color === 'string')) {
            setColors(decodedColors)
            window.history.replaceState({}, '', window.location.pathname)
          }
        } catch (error) {
          console.error('Error al cargar la paleta compartida')
        }
      }
    }
  }, [])

  const generatePalette = useCallback(() => {
    let newColors: string[]
    switch (harmonyType) {
      case 'analogous':
        newColors = generateAnalogousPalette()
        break
      case 'monochromatic':
        newColors = generateMonochromaticPalette()
        break
      case 'triadic':
        newColors = generateTriadicPalette()
        break
      case 'complementary':
        newColors = generateComplementaryPalette()
        break
      default:
        newColors = Array(5).fill(null).map(() => generateRandomColor())
    }
    setColors(newColors.map((color, index) => lockedColors[index] ? colors[index] : color))
  }, [harmonyType, lockedColors, colors])

  const generateAnalogousPalette = () => {
    const baseHue = Math.floor(Math.random() * 360)
    return Array(5).fill(null).map((_, i) => {
      const hue = (baseHue + i * 30) % 360
      return `hsl(${hue}, 70%, 50%)`
    })
  }

  const generateMonochromaticPalette = () => {
    const baseColor = generateRandomColor()
    return Array(5).fill(null).map((_, i) => {
      return adjustColorBrightness(baseColor, (i - 2) * 20)
    })
  }

  const generateTriadicPalette = () => {
    const baseHue = Math.floor(Math.random() * 360)
    return [
      `hsl(${baseHue}, 70%, 50%)`,
      `hsl(${(baseHue + 120) % 360}, 70%, 50%)`,
      `hsl(${(baseHue + 240) % 360}, 70%, 50%)`,
      adjustColorBrightness(`hsl(${baseHue}, 70%, 50%)`, 20),
      adjustColorBrightness(`hsl(${baseHue}, 70%, 50%)`, -20)
    ]
  }

  const generateComplementaryPalette = () => {
    const baseHue = Math.floor(Math.random() * 360)
    const complementHue = (baseHue + 180) % 360
    return [
      `hsl(${baseHue}, 70%, 50%)`,
      `hsl(${complementHue}, 70%, 50%)`,
      adjustColorBrightness(`hsl(${baseHue}, 70%, 50%)`, 20),
      adjustColorBrightness(`hsl(${baseHue}, 70%, 50%)`, -20),
      adjustColorBrightness(`hsl(${complementHue}, 70%, 50%)`, 20)
    ]
  }

  const handleColorChange = useCallback((index: number, color: string) => {
    const newColors = [...colors]
    newColors[index] = color
    setColors(newColors)
  }, [colors])

  const handleDeleteColor = useCallback((index: number) => {
    const newColors = colors.filter((_, i) => i !== index)
    setColors(newColors)
    setLockedColors(lockedColors.filter((_, i) => i !== index))
  }, [colors, lockedColors])

  const handleAddColor = useCallback(() => {
    setColors([...colors, generateRandomColor()])
    setLockedColors([...lockedColors, false])
  }, [colors, lockedColors])

  const toggleLock = useCallback((index: number) => {
    const newLockedColors = [...lockedColors]
    newLockedColors[index] = !newLockedColors[index]
    setLockedColors(newLockedColors)
  }, [lockedColors])

  const savePalette = useCallback(() => {
    const newSavedPalettes = [...savedPalettes, colors]
    setSavedPalettes(newSavedPalettes)
    localStorage.setItem('savedPalettes', JSON.stringify(newSavedPalettes))
    toast.success('Paleta guardada exitosamente')
  }, [colors, savedPalettes])

  const sharePalette = useCallback(() => {
    try {
      const paletteData = btoa(JSON.stringify(colors))
      const url = new URL(window.location.href)
      url.searchParams.set('p', paletteData)
      navigator.clipboard.writeText(url.toString())
      toast.success('URL de la paleta copiada al portapapeles')
    } catch (error) {
      toast.error('Error al compartir la paleta')
    }
  }, [colors])

  const exportPalette = useCallback(() => {
    try {
      const jsonString = JSON.stringify(colors, null, 2)
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'akatsuki_palette.json'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      toast.success('Paleta exportada exitosamente')
    } catch (error) {
      toast.error('Error al exportar la paleta')
    }
  }, [colors])

  const importPalette = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          if (typeof e.target?.result !== 'string') {
            throw new Error('Formato inválido')
          }
          const importedColors = JSON.parse(e.target.result)
          if (!Array.isArray(importedColors) || !importedColors.every(color => 
            typeof color === 'string' && /^#[0-9A-Fa-f]{6}$/.test(color)
          )) {
            throw new Error('Formato de colores inválido')
          }
          setColors(importedColors)
          toast.success('Paleta importada exitosamente')
        } catch (error) {
          toast.error('Error: El archivo debe contener una lista válida de colores hexadecimales')
        }
      }
      reader.onerror = () => {
        toast.error('Error al leer el archivo')
      }
      reader.readAsText(file)
    }
  }, [])

  const adjustBrightness = useCallback((value: number[]) => {
    setBrightness(value[0])
    const adjustedColors = colors.map(color => adjustColorBrightness(color, value[0]))
    setColors(adjustedColors)
  }, [colors])

  return (
    <div className="min-h-screen bg-black text-white">
      <Toaster />
      {showEntryAnimation && (
        <EntryAnimation onAnimationComplete={() => setShowEntryAnimation(false)} />
      )}
      
      <motion.div
        className="relative z-10 py-12 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h1 className="text-5xl font-bold text-red-600 mb-4 drop-shadow-[0_0_10px_rgba(255,0,0,0.5)] bg-black bg-opacity-50 inline-block px-4 py-2 rounded">
              Akatsuki Color Palette
            </h1>
            <p className="text-xl text-gray-300 bg-black bg-opacity-50 inline-block px-4 py-2 rounded">
              Crea combinaciones de colores dignas de un ninja renegado
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="bg-gray-900/80 border-red-600">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-red-600">Generador de Paleta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de Armonía</label>
                  <select
                    value={harmonyType}
                    onChange={(e) => setHarmonyType(e.target.value as any)}
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-md p-2"
                  >
                    <option value="analogous">Análoga</option>
                    <option value="monochromatic">Monocromática</option>
                    <option value="triadic">Triádica</option>
                    <option value="complementary">Complementaria</option>
                  </select>
                </div>
                <ColorPalette
                  colors={colors}
                  onColorChange={handleColorChange}
                  onDeleteColor={handleDeleteColor}
                  onAddColor={handleAddColor}
                  lockedColors={lockedColors}
                  onToggleLock={toggleLock}
                />
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Ajustar Brillo</label>
                    <Slider
                      value={[brightness]}
                      onValueChange={adjustBrightness}
                      min={-100}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      onClick={generatePalette} 
                      className="flex-grow bg-red-600 hover:bg-red-700"
                    >
                      <Shuffle className="h-4 w-4 mr-2" />
                      Generar Nueva Paleta
                    </Button>
                    <Button 
                      onClick={savePalette} 
                      variant="outline" 
                      className="flex-grow border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Guardar Paleta
                    </Button>
                    <Button 
                      onClick={sharePalette} 
                      variant="outline" 
                      className="flex-grow border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Compartir Paleta
                    </Button>
                    <Button 
                      onClick={exportPalette} 
                      variant="outline" 
                      className="flex-grow border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Exportar Paleta
                    </Button>
                    <label className="flex-grow">
                      <input
                        type="file"
                        accept=".json"
                        onChange={importPalette}
                        className="hidden"
                      />
                      <Button 
                        variant="outline" 
                        className="w-full border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Importar Paleta
                      </Button>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <PalettePreview colors={colors} />
          </motion.div>

          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Tabs defaultValue="accessibility" className="bg-gray-900/80 border-red-600 rounded-lg p-4">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger 
                  value="accessibility"
                  className="text-red-600 data-[state=active]:bg-red-600 data-[state=active]:text-white"
                >
                  Accesibilidad
                </TabsTrigger>
                <TabsTrigger 
                  value="css"
                  className="text-red-600 data-[state=active]:bg-red-600 data-[state=active]:text-white"
                >
                  Código CSS
                </TabsTrigger>
                <TabsTrigger 
                  value="saved"
                  className="text-red-600 data-[state=active]:bg-red-600 data-[state=active]:text-white"
                >
                  Paletas Guardadas
                </TabsTrigger>
              </TabsList>
              <TabsContent value="accessibility">
                <AccessibilityInfo colors={colors} />
              </TabsContent>
              <TabsContent value="css">
                <CSSGenerator colors={colors} />
              </TabsContent>
              <TabsContent value="saved">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {savedPalettes.map((palette, index) => (
                    <motion.div
                      key={index}
                      className="cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                      onClick={() => setColors(palette)}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    >
                      <div className="h-20 flex">
                        {palette.map((color, i) => (
                          <div key={i} style={{backgroundColor: color}} className="flex-1" />
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

