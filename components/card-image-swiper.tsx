"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface SwiperImage {
  src: string
  alt: string
}

interface CardImageSwiperProps {
  images: SwiperImage[]
  /** Tailwind aspect ratio class, e.g. "aspect-[4/5]" */
  aspectClassName?: string
}

export function CardImageSwiper({
  images,
  aspectClassName = "aspect-[4/5]",
}: CardImageSwiperProps) {
  const [index, setIndex] = useState(0)
  const count = images.length

  // Troca automática com efeito de fade a cada 3 segundos
  useEffect(() => {
    if (count <= 1) return
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % count)
    }, 3000)
    return () => clearInterval(timer)
  }, [count])

  return (
    <div className={`relative ${aspectClassName} overflow-hidden select-none`}>
      {images.map((img, i) => (
        <Image
          key={i}
          src={img.src || "/placeholder.svg"}
          alt={img.alt}
          fill
          draggable={false}
          className="object-cover object-top transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === index ? 1 : 0 }}
        />
      ))}

      {/* Indicadores (dots) */}
      {count > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ir para foto ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-5 bg-orange-500" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
