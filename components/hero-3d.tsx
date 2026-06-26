"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"

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
 * Hook que aplica um leve tilt 3D interativo ao palco do hero,
 * seguindo o ponteiro (desktop) e mantendo movimento suave.
 */
function useTilt() {
  const sceneRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const frame = useRef<number | null>(null)

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const scene = sceneRef.current
    const stage = stageRef.current
    if (!scene || !stage) return

    const rect = scene.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5

    if (frame.current) cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      // Inclinação sutil para não comprometer a leitura
      const rotateY = x * 8
      const rotateX = -y * 8
      stage.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    })
  }, [])

  const handlePointerLeave = useCallback(() => {
    const stage = stageRef.current
    if (!stage) return
    if (frame.current) cancelAnimationFrame(frame.current)
    stage.style.transform = "rotateX(0deg) rotateY(0deg)"
  }, [])

  useEffect(() => {
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [])

  return { sceneRef, stageRef, handlePointerMove, handlePointerLeave }
}

function MobileHero() {
  const [current, setCurrent] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const { sceneRef, stageRef, handlePointerMove, handlePointerLeave } = useTilt()

  const next = useCallback(() => setCurrent((prev) => (prev + 1) % mobileBanners.length), [])
  const prev = useCallback(() => setCurrent((p) => (p - 1 + mobileBanners.length) % mobileBanners.length), [])

  useEffect(() => {
    const timer = setInterval(next, 4500)
    return () => clearInterval(timer)
  }, [next])

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
    <div className="block w-full px-4 pt-2 md:hidden">
      <div
        ref={sceneRef}
        className="hero-3d-scene relative mx-auto w-full max-w-md"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        {/* Glow ambiente por trás do banner */}
        <div className="hero-glow absolute inset-x-4 -bottom-4 top-6 z-0 rounded-[2rem]" aria-hidden="true" />

        <div ref={stageRef} className="hero-3d-stage relative z-10">
          <div className="hero-float relative">
            <div
              className="hero-banner-shadow relative overflow-hidden rounded-3xl"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${current * 100}%)` }}
              >
                {mobileBanners.map((banner, i) => (
                  <div key={i} className="relative aspect-[3/4] w-full flex-shrink-0">
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

              {/* Reflexo de luz premium */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl" aria-hidden="true">
                <div className="hero-sheen absolute inset-y-0 -left-1/3 w-1/2" />
              </div>

              {/* Vinheta sutil para profundidade */}
              <div
                className="pointer-events-none absolute inset-0 rounded-3xl"
                style={{ boxShadow: "inset 0 -40px 60px -30px rgba(0,0,0,0.6)" }}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Indicadores */}
      <div className="flex items-center justify-center gap-2 py-4">
        {mobileBanners.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            aria-label={`Ir para o banner ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              current === i ? "w-6 bg-orange-500" : "w-2 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

function DesktopHero() {
  const { sceneRef, stageRef, handlePointerMove, handlePointerLeave } = useTilt()

  return (
    <div className="hidden w-full px-6 pt-4 md:block">
      <div
        ref={sceneRef}
        className="hero-3d-scene relative mx-auto w-full max-w-7xl"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        {/* Glow ambiente */}
        <div className="hero-glow absolute inset-x-10 -bottom-6 top-8 z-0 rounded-[3rem]" aria-hidden="true" />

        <div ref={stageRef} className="hero-3d-stage relative z-10">
          <div className="hero-float relative">
            <div className="hero-banner-shadow relative overflow-hidden rounded-[2rem]">
              <Image
                src={desktopBanner.src || "/placeholder.svg"}
                alt={desktopBanner.alt}
                width={1920}
                height={768}
                className="h-auto w-full"
                priority
              />

              {/* Reflexo de luz premium */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]" aria-hidden="true">
                <div className="hero-sheen absolute inset-y-0 -left-1/3 w-1/3" />
              </div>

              {/* Vinheta sutil */}
              <div
                className="pointer-events-none absolute inset-0 rounded-[2rem]"
                style={{ boxShadow: "inset 0 -60px 90px -50px rgba(0,0,0,0.55)" }}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
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
