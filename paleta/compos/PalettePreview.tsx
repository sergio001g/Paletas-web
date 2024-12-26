import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PalettePreviewProps {
  colors: string[]
}

export function PalettePreview({ colors }: PalettePreviewProps) {
  return (
    <Card className="bg-gray-900/80 border-red-600">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-red-600">Vista Previa</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-2 mb-6">
          {colors.map((color, index) => (
            <div key={index} className="flex flex-col items-center">
              <div 
                className="w-12 h-12 rounded-full border-2 border-white shadow-lg mb-2"
                style={{ backgroundColor: color }}
              ></div>
              <span className="font-mono text-xs text-white bg-gray-800 px-2 py-1 rounded">
                {color}
              </span>
            </div>
          ))}
        </div>
        <div 
          className="mt-8 p-6 rounded-lg shadow-lg relative overflow-hidden"
          style={{ backgroundColor: colors[0] }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10">
            <h2 
              className="text-3xl font-bold mb-4 bg-black/40 inline-block px-3 py-1 rounded" 
              style={{ color: colors[1] }}
            >
              Diseño de Ejemplo
            </h2>
            <p 
              className="mb-6 text-lg bg-black/40 p-3 rounded" 
              style={{ color: colors[2] }}
            >
              Este es un ejemplo de cómo se verían los colores en un diseño real. 
              La combinación de colores puede crear un impacto visual único.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                className="px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300 hover:opacity-90 shadow-lg"
                style={{ 
                  backgroundColor: colors[3], 
                  color: colors[4],
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }}
              >
                Botón Principal
              </button>
              <button 
                className="px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300 hover:opacity-90 shadow-lg"
                style={{ 
                  backgroundColor: colors[4], 
                  color: colors[3],
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }}
              >
                Botón Secundario
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

