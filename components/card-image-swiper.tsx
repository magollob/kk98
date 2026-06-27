"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import Image from "next/image"

interface SwiperImage {
  src: string
  alt: string
}

interface CardImageSwiperProps {
  images: SwiperImage[]
  /** Tailwind aspect ratio class, e.g. "aspect-[5/6]" */
  aspectClassName?: string
}

export function CardImageSwiper({
  images,
  aspectClassName = "aspect-[5/6]",
}: CardImageSwiperProps) {
  const [index, setIndex] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startX = useRef(0)
  const containerWidth = useRef(1)
  const trackRef = useRef<HTMLDivElement>(null)

  const count = images.length

  const clamp = useCallback(
    (i: number) => Math.max(0, Math.min(count - 1, i)),
    [count],
  )

  const goTo = useCallback((i: number) => setIndex((prev) => Math.max(0, Math.min(count - 1, i))), [count])

  // Troca automática de imagens a cada 2.5s (loop), pausando durante o arraste
  useEffect(() => {
    if (count <= 1 || isDragging) return
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % count)
    }, 2500)
    return () => clearInterval(timer)
  }, [count, isDragging])

  const handleStart = useCallback((clientX: number) => {
    setIsDragging(true)
    startX.current = clientX
    containerWidth.current = trackRef.current?.offsetWidth || 1
  }, [])

  const handleMove = useCallback(
    (clientX: number) => {
      if (!isDragging) return
      let delta = clientX - startX.current
      // Resistência nas bordas
      if ((index === 0 && delta > 0) || (index === count - 1 && delta < 0)) {
        delta *= 0.35
      }
      setDragOffset(delta)
    },
    [isDragging, index, count],
  )

  const handleEnd = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)
    const threshold = containerWidth.current * 0.18
    if (dragOffset < -threshold) {
      setIndex((p) => clamp(p + 1))
    } else if (dragOffset > threshold) {
      setIndex((p) => clamp(p - 1))
    }
    setDragOffset(0)
  }, [isDragging, dragOffset, clamp])

  const offsetPercent = -(index * 100)

  return (
    <div className={`relative ${aspectClassName} overflow-hidden select-none touch-pan-y`}>
      <div
        ref={trackRef}
        className="flex h-full w-full"
        style={{
          transform: `translateX(calc(${offsetPercent}% + ${dragOffset}px))`,
          transition: isDragging ? "none" : "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseMove={(e) => isDragging && handleMove(e.clientX)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
      >
        {images.map((img, i) => (
          <div key={i} className="relative h-full w-full shrink-0">
            <Image
              src={img.src || "/placeholder.svg"}
              alt={img.alt}
              fill
              className="object-cover object-top"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* Indicadores (dots) */}
      {count > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
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
