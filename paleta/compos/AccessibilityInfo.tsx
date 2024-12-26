import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AccessibilityInfoProps {
  colors: string[]
}

function getContrastRatio(color1: string, color2: string) {
  const getLuminance = (color: string) => {
    const rgb = parseInt(color.slice(1), 16)
    const r = (rgb >> 16) & 0xff
    const g = (rgb >>  8) & 0xff
    const b = (rgb >>  0) & 0xff
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
    return luminance <= 0.03928
      ? luminance / 12.92
      : Math.pow((luminance + 0.055) / 1.055, 2.4)
  }

  const luminance1 = getLuminance(color1)
  const luminance2 = getLuminance(color2)

  const ratio = luminance1 > luminance2
    ? (luminance1 + 0.05) / (luminance2 + 0.05)
    : (luminance2 + 0.05) / (luminance1 + 0.05)

  return ratio.toFixed(2)
}

function getContrastLevel(ratio: number) {
  if (ratio >= 7) return 'AAA'
  if (ratio >= 4.5) return 'AA'
  if (ratio >= 3) return 'AA (Texto Grande)'
  return 'Insuficiente'
}

export function AccessibilityInfo({ colors }: AccessibilityInfoProps) {
  return (
    <Card className="bg-gray-800 border-red-600">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-red-600">Información de Accesibilidad</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {colors.map((color, index) => (
            <div key={index} className="bg-gray-700 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4" style={{color: color}}>Color {index + 1}: {color}</h3>
              <div className="space-y-4">
                <ContrastInfo background={color} foreground="#FFFFFF" name="Blanco" />
                <ContrastInfo background={color} foreground="#000000" name="Negro" />
                {colors.filter((_, i) => i !== index).map((otherColor, otherIndex) => (
                  <ContrastInfo key={otherIndex} background={color} foreground={otherColor} name={`Color ${otherIndex + 1}`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ContrastInfo({ background, foreground, name }: { background: string; foreground: string; name: string }) {
  const ratio = getContrastRatio(background, foreground)
  const level = getContrastLevel(parseFloat(ratio))
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: foreground }}></div>
        <span>{name}</span>
      </div>
      <div className="text-right">
        <span className={`font-bold ${level === 'Insuficiente' ? 'text-red-500' : 'text-green-500'}`}>
          {ratio}:1 ({level})
        </span>
      </div>
    </div>
  )
}

