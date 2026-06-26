"use client"

import { useRef, useEffect, useCallback, useState } from "react"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"
import { CardImageSwiper } from "@/components/card-image-swiper"

interface ModelImage {
  src: string
  alt: string
}

export interface ModelItem {
  images: ModelImage[]
  badgeSize: string
  badgeLabel: string
  title: string
  description: string
  videoId: string
}

interface ModelsCarouselProps {
  models: ModelItem[]
  onPlayVideo: (videoId: string) => void
}

export function ModelsCarousel({ models, onPlayVideo }: ModelsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const isAdjusting = useRef(false)
  const [isPointerDragging, setIsPointerDragging] = useState(false)
  const dragState = useRef<{ startX: number; startScroll: number; moved: boolean }>({
    startX: 0,
    startScroll: 0,
    moved: false,
  })

  // Renderiza 3 cópias dos modelos para criar o efeito de loop infinito
  const loopModels = [...models, ...models, ...models]

  // Posiciona o scroll no conjunto do meio ao montar
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const setWidth = track.scrollWidth / 3
    track.scrollLeft = setWidth
  }, [])

  // Reposiciona silenciosamente para manter o loop infinito
  const handleScroll = useCallback(() => {
    const track = trackRef.current
    if (!track || isAdjusting.current) return
    const setWidth = track.scrollWidth / 3
    if (track.scrollLeft < setWidth * 0.5) {
      isAdjusting.current = true
      track.scrollLeft += setWidth
      requestAnimationFrame(() => (isAdjusting.current = false))
    } else if (track.scrollLeft > setWidth * 1.5) {
      isAdjusting.current = true
      track.scrollLeft -= setWidth
      requestAnimationFrame(() => (isAdjusting.current = false))
    }
  }, [])

  const scrollByCard = useCallback((dir: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const firstCard = track.querySelector<HTMLElement>("[data-card]")
    const cardWidth = firstCard ? firstCard.offsetWidth + 16 : track.clientWidth * 0.8
    track.scrollBy({ left: dir * cardWidth, behavior: "smooth" })
  }, [])

  // Arraste com o ponteiro (desktop)
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const track = trackRef.current
    if (!track) return
    dragState.current = { startX: e.clientX, startScroll: track.scrollLeft, moved: false }
    setIsPointerDragging(true)
  }, [])

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isPointerDragging) return
      const track = trackRef.current
      if (!track) return
      const delta = e.clientX - dragState.current.startX
      if (Math.abs(delta) > 4) dragState.current.moved = true
      track.scrollLeft = dragState.current.startScroll - delta
    },
    [isPointerDragging],
  )

  const endPointer = useCallback(() => setIsPointerDragging(false), [])

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onScroll={handleScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerLeave={endPointer}
        className={`flex gap-4 overflow-x-auto scroll-smooth pb-4 scrollbar-hide snap-x snap-mandatory ${
          isPointerDragging ? "cursor-grabbing select-none" : "cursor-grab"
        }`}
        style={{ scrollbarWidth: "none" }}
      >
        {loopModels.map((model, i) => (
          <div
            key={i}
            data-card
            className="snap-center shrink-0 basis-[80%] sm:basis-[55%] md:basis-[calc(33.333%-11px)]"
          >
            <div className="glass-border-subtle overflow-hidden hover:border-orange-500/50 transition-all duration-300 group rounded-2xl h-full flex flex-col">
              <div className="pointer-events-auto" onClickCapture={(e) => dragState.current.moved && e.stopPropagation()}>
                <CardImageSwiper images={model.images} />
              </div>
              <div className="p-4 md:p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-md">
                    {model.badgeSize}
                  </span>
                  <span className="text-orange-400 text-xs font-semibold">{model.badgeLabel}</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-1">{model.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed flex-1">{model.description}</p>
                <button
                  onClick={() => {
                    if (dragState.current.moved) return
                    onPlayVideo(model.videoId)
                  }}
                  className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-xl transition-all active:scale-95 shadow-lg shadow-orange-500/30"
                >
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20">
                    <Play className="w-3 h-3 fill-current" />
                  </span>
                  Ver Vídeo
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Setas de navegação */}
      <button
        type="button"
        onClick={() => scrollByCard(-1)}
        aria-label="Modelos anteriores"
        className="absolute -left-2 md:-left-4 top-1/3 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-black/60 text-white backdrop-blur-md border border-white/15 hover:bg-orange-500 transition-colors active:scale-90"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => scrollByCard(1)}
        aria-label="Próximos modelos"
        className="absolute -right-2 md:-right-4 top-1/3 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-black/60 text-white backdrop-blur-md border border-white/15 hover:bg-orange-500 transition-colors active:scale-90"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}
