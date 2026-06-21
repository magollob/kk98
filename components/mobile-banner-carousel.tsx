"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"

const banners = [
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/headmobile-32X0vSqm2dzfl98CPlWZJCShJHg1SD.webp",
    alt: "Lançamentos 2026 Microwear - Os novos Series 11 - Smart Ilha",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bannerhead2-pRJgtY8HwGpEKxgbOliIPUp9U7IIzT.webp",
    alt: "Copa de Brindes - 30% OFF no primeiro smartwatch e 10% no segundo - Smart Ilha",
  },
]

export function MobileBannerCarousel() {
  const [current, setCurrent] = useState(0)
  const touchStartX = useRef<number | null>(null)

  const next = () => setCurrent((prev) => (prev + 1) % banners.length)
  const prev = () => setCurrent((prev) => (prev - 1 + banners.length) % banners.length)

  useEffect(() => {
    const timer = setInterval(next, 4500)
    return () => clearInterval(timer)
  }, [])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) {
      if (diff > 0) next()
      else prev()
    }
    touchStartX.current = null
  }

  return (
    <div
      className="block md:hidden relative w-full overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((banner, i) => (
          <div key={i} className="relative w-full flex-shrink-0 aspect-[3/4]">
            <Image
              src={banner.src || "/placeholder.svg"}
              alt={banner.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover object-top"
            />
          </div>
        ))}
      </div>

      {/* Indicadores (bolinhas) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            aria-label={`Ir para o banner ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              current === i ? "w-6 bg-orange-500" : "w-2 bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
