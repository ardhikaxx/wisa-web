'use client'

import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'

interface Props {
  value: string
  size?: number
}

export function InvoiceQr({ value, size = 80 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!canvasRef.current || !value.trim()) return
    setError(false)
    QRCode.toCanvas(canvasRef.current, value.trim(), {
      width: size,
      margin: 1,
      color: { dark: '#0d9488', light: '#ffffff' },
    }).catch(() => setError(true))
  }, [value, size])

  if (!value.trim() || error) return null

  return <canvas ref={canvasRef} width={size} height={size} className="rounded" />
}
