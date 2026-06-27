"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

const mobileBanners = [
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bannerhead2-pRJgtY8HwGpEKxgbOliIPUp9U7IIzT.webp",
    alt: "Copa de Brindes - 30% OFF no primeiro smartwatch e 10% no segundo - Smart Ilha",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/headmobile-gl1by3fooOMXJ28ucYYFIvfBcCFCGy.png",
    alt: "Lançamentos 2026 Microwear - Os novos Series 11 - Smart Ilha",
  },
]

const desktopBanner = {
  src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/headdesktop-AcuNF1CKi7kIYJepbuarJJa2K3ywLp.webp",
  alt: "Lançamentos 2026 Microwear - Os novos Series 11 - Smart Ilha",
}

/**
 * Carrossel infinito full-wide para mobile.
 * - Loop contínuo nos dois sentidos usando slides clonados nas pontas.
 * - Suporte a arrasto (touch) e setas de navegação.
 */
function MobileHero() {
  const banners = mobileBanners
  // Slides com clones nas extremidades para o loop infinito:
  // [ último(clone), ...reais, primeiro(clone) ]
  const slides = [banners[banners.length - 1], ...banners, banners[0]]

  const [index, setIndex] = useState(1)
  const [withTransition, setWithTransition] = useState(true)
  const isAnimating = useRef(false)
  const touchStartX = useRef<number | null>(null)
  const dragDelta = useRef(0)

  const goNext = useCallback(() => {
    if (isAnimating.current) return
    isAnimating.current = true
    setWithTransition(true)
    setIndex((i) => i + 1)
  }, [])

  const goPrev = useCallback(() => {
    if (isAnimating.current) return
    isAnimating.current = true
    setWithTransition(true)
    setIndex((i) => i - 1)
  }, [])

  const goTo = useCallback((real: number) => {
    if (isAnimating.current) return
    isAnimating.current = true
    setWithTransition(true)
    setIndex(real + 1)
  }, [])

  // Ao chegar num clone, salta instantaneamente para o slide real equivalente.
  const handleTransitionEnd = () => {
    isAnimating.current = false
    if (index === slides.length - 1) {
      setWithTransition(false)
      setIndex(1)
    } else if (index === 0) {
      setWithTransition(false)
      setIndex(banners.length)
    }
  }

  // Reativa a transição após o salto instantâneo.
  useEffect(() => {
    if (!withTransition) {
      const id = requestAnimationFrame(() => setWithTransition(true))
      return () => cancelAnimationFrame(id)
    }
  }, [withTransition])

  // Autoplay contínuo.
  useEffect(() => {
    const timer = setInterval(goNext, 4500)
    return () => clearInterval(timer)
  }, [goNext])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    dragDelta.current = 0
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    dragDelta.current = touchStartX.current - e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (touchStartX.current === null) return
    const diff = dragDelta.current
    if (Math.abs(diff) > 40) {
      if (diff > 0) goNext()
      else goPrev()
    }
    touchStartX.current = null
    dragDelta.current = 0
  }

  const realIndex = (index - 1 + banners.length) % banners.length

  return (
    <div className="block w-full md:hidden">
      <div
        className="relative w-full overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={`flex ${withTransition ? "transition-transform duration-500 ease-out" : ""}`}
          style={{ transform: `translateX(-${index * 100}%)` }}
          onTransitionEnd={handleTransitionEnd}
        >
          {slides.map((banner, i) => (
            <div key={i} className="relative aspect-[3/4] w-full flex-shrink-0">
              <Image
                src={banner.src || "/placeholder.svg"}
                alt={banner.alt}
                fill
                priority={i === 1}
                sizes="100vw"
                className="object-cover object-top"
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Setas de navegação */}
        <button
          type="button"
          onClick={goPrev}
          aria-label="Banner anterior"
          className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors active:bg-black/60"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={goNext}
          aria-label="Próximo banner"
          className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors active:bg-black/60"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Indicadores */}
      <div className="flex items-center justify-center gap-2 bg-black py-3">
        {banners.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Ir para o banner ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              realIndex === i ? "w-6 bg-orange-500" : "w-2 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

function DesktopHero() {
  return (
    <Image
      src={desktopBanner.src || "/placeholder.svg"}
      alt={desktopBanner.alt}
      width={1920}
      height={768}
      className="hidden h-auto w-full md:block"
      priority
    />
  )
}

export function Hero3D() {
  return (
    <>
      <MobileHero />
      <DesktopHero />
    </>
  )
}
