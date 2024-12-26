import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface CSSGeneratorProps {
  colors: string[]
}

export function CSSGenerator({ colors }: CSSGeneratorProps) {
  const cssCode = `
:root {
  --color-primary: ${colors[0]};
  --color-secondary: ${colors[1]};
  --color-accent: ${colors[2]};
  --color-background: ${colors[3]};
  --color-text: ${colors[4]};
}

body {
  background-color: var(--color-background);
  color: var(--color-text);
}

.button-primary {
  background-color: var(--color-primary);
  color: var(--color-text);
}

.button-secondary {
  background-color: var(--color-secondary);
  color: var(--color-text);
}

.accent {
  color: var(--color-accent);
}
  `.trim()

  const handleCopyCSS = () => {
    navigator.clipboard.writeText(cssCode)
    toast.success('Código CSS copiado al portapapeles')
  }

  return (
    <Card className="bg-gray-800 border-red-600">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-red-600">Generador de CSS</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
          <code className="text-sm text-white">{cssCode}</code>
        </pre>
        <Button 
          onClick={handleCopyCSS} 
          className="mt-4 bg-red-600 hover:bg-red-700"
        >
          <Copy className="h-4 w-4 mr-2" />
          Copiar CSS
        </Button>
      </CardContent>
    </Card>
  )
}

