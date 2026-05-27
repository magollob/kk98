"use client"

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'wistia-player': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        'media-id'?: string;
        seo?: string;
        aspect?: string;
      }, HTMLElement>;
    }
  }
}

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { X, Gift, Watch, Headphones, Shield, Truck, Sparkles, MapPin, Ruler, Play } from "lucide-react"
import Image from "next/image"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { BrindesCarousel } from "@/components/brindes-carousel"

// Hook otimizado para fade-in na rolagem
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(element)
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return { ref, isVisible }
}

export default function LandingPage() {
  const [visitCount, setVisitCount] = useState(20)
  const [showWristImage, setShowWristImage] = useState(false)
  const [showPromoPopup, setShowPromoPopup] = useState(false)
  const [isPopupClosing, setIsPopupClosing] = useState(false)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [isSizeGuideClosing, setIsSizeGuideClosing] = useState(false)
  const [showGiftButton, setShowGiftButton] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showInstallmentPopup, setShowInstallmentPopup] = useState(false)
  const [isInstallmentClosing, setIsInstallmentClosing] = useState(false)
  const [showFunctionsPopup, setShowFunctionsPopup] = useState(false)
  const [isFunctionsClosing, setIsFunctionsClosing] = useState(false)
  const [activeVideo, setActiveVideo] = useState<string | null>(null)
  const [isVideoClosing, setIsVideoClosing] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Proteção anti-cópia: bloquear clique direito
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    document.addEventListener("contextmenu", handleContextMenu)
    return () => document.removeEventListener("contextmenu", handleContextMenu)
  }, [])

  // Mostrar botão de presente após 2 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGiftButton(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  const openPromoPopup = useCallback(() => {
    setShowPromoPopup(true)
    setShowConfetti(true)
    // Parar confetti após 4 segundos
    setTimeout(() => setShowConfetti(false), 4000)
  }, [])

  const closePromoPopup = useCallback(() => {
    setIsPopupClosing(true)
    setShowConfetti(false)
    // Aguardar animação de fechamento antes de esconder
    setTimeout(() => {
      setShowPromoPopup(false)
      setIsPopupClosing(false)
    }, 400)
  }, [])

  const closeSizeGuide = useCallback(() => {
    setIsSizeGuideClosing(true)
    setTimeout(() => {
      setShowSizeGuide(false)
      setIsSizeGuideClosing(false)
    }, 400)
  }, [])

  const closeInstallmentPopup = useCallback(() => {
    setIsInstallmentClosing(true)
    setTimeout(() => {
      setShowInstallmentPopup(false)
      setIsInstallmentClosing(false)
    }, 400)
  }, [])

  const closeFunctionsPopup = useCallback(() => {
    setIsFunctionsClosing(true)
    setTimeout(() => {
      setShowFunctionsPopup(false)
      setIsFunctionsClosing(false)
    }, 400)
  }, [])

  const closeVideoPopup = useCallback(() => {
    setIsVideoClosing(true)
    setTimeout(() => {
      setActiveVideo(null)
      setIsVideoClosing(false)
    }, 400)
  }, [])

  useEffect(() => {
    if (activeVideo) {
      const script = document.createElement("script")
      script.src = "https://fast.wistia.com/player.js"
      script.async = true
      document.body.appendChild(script)

      const embedScript = document.createElement("script")
      embedScript.src = `https://fast.wistia.com/embed/${activeVideo}.js`
      embedScript.async = true
      embedScript.type = "module"
      document.body.appendChild(embedScript)

      return () => {
        document.body.removeChild(script)
        if (document.body.contains(embedScript)) {
          document.body.removeChild(embedScript)
        }
      }
    }
  }, [activeVideo])

  // Refs para fade-in de cada seção
  const heroFade = useFadeIn()
  const instagramFade = useFadeIn()
  const faqFade = useFadeIn()
  const ctaFade = useFadeIn()
  const review2Ref = useRef<HTMLImageElement>(null)
  const hasOpenedPopupRef = useRef(false)

  // Detectar quando review2 fica visível para abrir o popup
  useEffect(() => {
    const element = review2Ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasOpenedPopupRef.current) {
          hasOpenedPopupRef.current = true
          openPromoPopup()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [openPromoPopup])

  useEffect(() => {
    const calculateVisits = () => {
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes()

      let minutesSinceStart: number

      // Começa às 1h da manhã
      if (hours >= 1) {
        minutesSinceStart = (hours - 1) * 60 + minutes
      } else {
        // Entre 0:00 e 0:30 ainda está contando, após 0:30 termina
        minutesSinceStart = 23 * 60 + minutes
      }

      const totalMinutes = 23 * 60 + 30 // 1:00 até 0:30 = 1410 minutos

      // Após 0:30 retorna o máximo
      if (hours === 0 && minutes > 30) {
        return 1500
      }

      const progress = Math.min(minutesSinceStart / totalMinutes, 1)
      // Começa em 20 e vai até 1500
      const visits = Math.floor(20 + 1480 * progress)

      const randomVariation = Math.floor(Math.random() * 10)
      return Math.min(visits + randomVariation, 1500)
    }

    setVisitCount(calculateVisits())

    const interval = setInterval(() => {
      setVisitCount(calculateVisits())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight * 3
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    interface Particle {
      x: number
      y: number
      radius: number
      vx: number
      vy: number
      alpha: number
      targetAlpha: number
    }

    const particles: Particle[] = []
    const isMobile = window.innerWidth < 768
    const particleCount = isMobile ? 40 : 30

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: isMobile ? Math.random() * 1.5 + 0.5 : Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.4 + 0.1,
        targetAlpha: Math.random() * 0.4 + 0.1,
      })
    }

    const animate = () => {
      if (!ctx || !canvas) return

      ctx.fillStyle = "#000000"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        if (Math.random() > 0.99) {
          particle.targetAlpha = Math.random() * 0.5 + 0.2
        }
        particle.alpha += (particle.targetAlpha - particle.alpha) * 0.02

        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.radius * 4,
        )
        gradient.addColorStop(0, `rgba(249, 115, 22, ${particle.alpha})`)
        gradient.addColorStop(0.5, `rgba(249, 115, 22, ${particle.alpha * 0.3})`)
        gradient.addColorStop(1, "rgba(249, 115, 22, 0)")

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius * 4, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 180, 100, ${particle.alpha})`
        ctx.fill()
      })

      const connectionDistance = isMobile ? 60 : 100
      ctx.strokeStyle = "rgba(249, 115, 22, 0.08)"
      ctx.lineWidth = 0.3
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.globalAlpha = (1 - distance / connectionDistance) * 0.2
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])



  useEffect(() => {
    const interval = setInterval(() => {
      setShowWristImage((prev) => !prev)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const whatsappLink = "https://tintim.link/whatsapp/805044db-e307-4a5a-b566-b1ee3911b3f3/dd46302b-1cfd-415f-bda0-f2d785c160ea"

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Canvas Background - Fixo na tela */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0" />

      {/* Botão flutuante de presente */}
      {showGiftButton && (
        <button
          onClick={openPromoPopup}
          className="fixed bottom-20 left-4 z-50 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white p-3 rounded-full shadow-lg shadow-orange-500/30 transition-all duration-300 hover:scale-110 animate-fade-in"
          aria-label="Ver promoção"
        >
          <Gift className="w-5 h-5" />
        </button>
      )}

      <div className="fixed bottom-4 left-4 z-50 bg-gray-900/80 backdrop-blur-md border border-orange-500/30 rounded-xl px-4 py-2 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-300 text-xs md:text-sm">
            <span className="text-orange-400 font-bold">{visitCount}</span> visitas hoje
          </span>
        </div>
      </div>

      {/* Popup Promocional */}
      {showPromoPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closePromoPopup}
          />

          {/* Confetti Animation */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="confetti-piece"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    backgroundColor: ['#FF6B00', '#FFD700', '#FF4500', '#FFA500', '#FFFF00'][Math.floor(Math.random() * 5)]
                  }}
                />
              ))}
            </div>
          )}

          {/* Popup Content */}
          <div className={`relative bg-gradient-to-b from-gray-900 via-black to-gray-900 border-2 border-orange-500/50 rounded-2xl max-w-sm w-full shadow-2xl shadow-orange-500/20 ${isPopupClosing ? 'animate-popup-close' : 'animate-popup-scale'}`}>
            {/* Header */}
            <div className="relative bg-gradient-to-b from-rose-900/30 to-transparent p-4 text-center">
              <div className="flex justify-center items-center gap-2 mb-1">
                <span className="text-xl">💕</span>
                <h2 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-rose-400 via-orange-400 to-rose-500 bg-clip-text text-transparent drop-shadow-lg">
                  PROMOÇÃO
                </h2>
                <span className="text-xl">💕</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                DIA DOS NAMORADOS
              </h3>
              <div className="bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold py-1.5 px-3 rounded-full text-xs md:text-sm inline-block">
                ADQUIRA SEU SMARTWATCH E RECEBA 👇
              </div>
            </div>

            {/* Desconto */}
            <div className="px-4 py-2">
              <div className="border-2 border-rose-500/50 rounded-xl p-3 bg-gradient-to-b from-rose-900/20 to-transparent text-center mb-3">
                <p className="text-rose-400 font-semibold text-xs mb-0.5">DIA DOS NAMORADOS</p>
                <div className="flex items-center justify-center gap-3">
                  <div>
                    <p className="text-xs text-gray-300 mb-0.5">1º SMARTWATCH</p>
                    <p className="text-3xl md:text-4xl font-black bg-gradient-to-b from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                      25%
                    </p>
                    <p className="text-sm font-bold text-white">OFF</p>
                  </div>
                  <span className="text-2xl text-rose-400 font-bold">+</span>
                  <div>
                    <p className="text-xs text-gray-300 mb-0.5">2º SMARTWATCH</p>
                    <p className="text-3xl md:text-4xl font-black bg-gradient-to-b from-rose-400 via-rose-500 to-rose-600 bg-clip-text text-transparent">
                      20%
                    </p>
                    <p className="text-sm font-bold text-white">OFF</p>
                  </div>
                </div>
              </div>

              {/* Lista de Presentes */}
              <div className="space-y-1.5">
                <div className="bg-gradient-to-r from-orange-500/20 to-transparent border border-orange-500/40 rounded-lg p-2 flex items-center justify-between">
                  <span className="text-white font-semibold text-xs"><span className="text-orange-400">+2</span> PULSEIRAS EXTRAS</span>
                  <Watch className="w-4 h-4 text-orange-400" />
                </div>
                <div className="bg-gradient-to-r from-orange-500/20 to-transparent border border-orange-500/40 rounded-lg p-2 flex items-center justify-between">
                  <span className="text-white font-semibold text-xs"><span className="text-orange-400">+1</span> FONE BLUETOOTH AIRDOT</span>
                  <Headphones className="w-4 h-4 text-orange-400" />
                </div>
                <div className="bg-gradient-to-r from-orange-500/20 to-transparent border border-orange-500/40 rounded-lg p-2 flex items-center justify-between">
                  <span className="text-white font-semibold text-xs"><span className="text-orange-400">+</span> KIT PELICULA & LIMPEZA</span>
                  <Sparkles className="w-4 h-4 text-orange-400" />
                </div>
                <div className="bg-gradient-to-r from-orange-500/20 to-transparent border border-orange-500/40 rounded-lg p-2 flex items-center justify-between">
                  <span className="text-white font-semibold text-xs"><span className="text-orange-400">+</span> CAPINHA PROTETORA</span>
                  <Shield className="w-4 h-4 text-orange-400" />
                </div>
                <div className="bg-gradient-to-r from-orange-500/20 to-transparent border border-orange-500/40 rounded-lg p-2 flex items-center justify-between">
                  <span className="text-white font-semibold text-xs"><span className="text-orange-400">+90</span> DIAS DE GARANTIA</span>
                  <Shield className="w-4 h-4 text-orange-400" />
                </div>
                <div className="bg-gradient-to-r from-orange-500/20 to-transparent border border-orange-500/40 rounded-lg p-2 flex items-center justify-between">
                  <span className="text-white font-semibold text-xs"><span className="text-orange-400">+</span> FRETE GRATIS P/ TODO O RJ</span>
                  <Truck className="w-4 h-4 text-orange-400" />
                </div>
                <div className="bg-gradient-to-r from-orange-500/20 to-transparent border border-orange-500/40 rounded-lg p-2 flex items-center justify-between">
                  <span className="text-white font-semibold text-xs"><span className="text-orange-400">+</span> SUPORTE ESPECIALIZADO</span>
                  <Headphones className="w-4 h-4 text-orange-400" />
                </div>
              </div>

              {/* Botao Fechar */}
              <button
                onClick={closePromoPopup}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors mt-3"
              >
                <X className="w-4 h-4" />
                Fechar janela
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup Guia de Medidas */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            onClick={closeSizeGuide}
          />

          {/* Popup Content - Fullscreen mobile, centered desktop */}
          <div className={`relative bg-gradient-to-b from-gray-900 to-gray-950 w-full md:max-w-md md:rounded-2xl md:m-4 max-h-[90vh] md:max-h-[85vh] flex flex-col shadow-2xl border-t md:border border-orange-500/30 ${isSizeGuideClosing ? 'animate-popup-close' : 'animate-popup-scale'}`}>
            {/* Header Fixo */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-gray-800 to-gray-900 px-5 py-4 flex items-center justify-between border-b border-gray-700/50 rounded-t-none md:rounded-t-2xl">
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-orange-400" />
                <h2 className="text-white text-lg font-bold">Guia de Medidas</h2>
              </div>
              <button
                onClick={closeSizeGuide}
                className="text-gray-400 hover:text-white transition-colors p-1"
                aria-label="Fechar guia de medidas"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content com Scroll */}
            <div className="flex-1 overflow-y-auto p-5 md:p-6">
              {/* Titulo */}
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3 leading-tight">
                Qual o tamanho ideal do seu smartwatch?
              </h3>
              <p className="text-gray-400 text-sm md:text-base mb-6">
                Meça seu punho com uma fita ou barbante e veja a recomendação abaixo:
              </p>

              {/* Cards de Tamanhos */}
              <div className="space-y-4">
                {/* Tamanho P */}
                <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">P</span>
                    <span className="text-orange-400 font-semibold text-sm">Punho menor que 16 cm</span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Modelos recomendados: <span className="text-white font-semibold">Mini (41mm ou 42mm)</span>
                  </p>
                </div>

                {/* Tamanho M */}
                <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">M</span>
                    <span className="text-orange-400 font-semibold text-sm">Punho entre 16 e 18 cm</span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Modelos recomendados: <span className="text-white font-semibold">Medios (45mm a 47mm)</span>
                  </p>
                </div>

                {/* Tamanho G */}
                <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">G</span>
                    <span className="text-orange-400 font-semibold text-sm">Punho maior que 18 cm</span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Modelos recomendados: <span className="text-white font-semibold">Grandes (49mm)</span>
                  </p>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mt-6 bg-gray-800/40 border border-gray-700/30 rounded-lg p-4">
                <p className="text-gray-400 text-xs leading-relaxed">
                  * Essa sugestão e apenas um direcionamento. Lembre-se de levar em consideracao seu gosto pessoal por relógios maiores ou menores.
                </p>
              </div>
            </div>

            {/* Footer Fixo com Botao */}
            <div className="sticky bottom-0 bg-gray-900/95 border-t border-gray-700/50 p-4">
              <button
                onClick={closeSizeGuide}
                className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <X className="w-4 h-4" />
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup de Parcelamento */}
      {showInstallmentPopup && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            onClick={closeInstallmentPopup}
          />

          {/* Popup Content */}
          <div className={`relative bg-gradient-to-b from-gray-900 to-gray-950 w-full md:max-w-md md:rounded-2xl md:m-4 max-h-[90vh] md:max-h-[85vh] flex flex-col shadow-2xl border-t md:border border-orange-500/30 ${isInstallmentClosing ? 'animate-popup-close' : 'animate-popup-scale'}`}>
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-gray-800 to-gray-900 px-5 py-4 flex items-center justify-between border-b border-gray-700/50 rounded-t-none md:rounded-t-2xl">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
                <h2 className="text-white text-lg font-bold">Parcelamento no Cartão</h2>
              </div>
              <button
                onClick={closeInstallmentPopup}
                className="text-gray-400 hover:text-white transition-colors p-1"
                aria-label="Fechar tabela de parcelamento"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content com Scroll */}
            <div className="flex-1 overflow-y-auto p-5 md:p-6">
              <div className="mb-4">
                <p className="text-gray-400 text-sm">
                  Valor do produto: <span className="text-white font-bold">R$325,00</span>
                </p>
              </div>

              <div className="space-y-2">
                {[
                  { parcelas: "1x", valor: "R$ 325,00", total: "R$ 325,00", semJuros: true },
                  { parcelas: "2x", valor: "R$ 162,50", total: "R$ 325,00", semJuros: true },
                  { parcelas: "3x", valor: "R$ 108,34", total: "R$ 325,02", semJuros: true },
                  { parcelas: "4x", valor: "R$ 81,25", total: "R$ 325,00", semJuros: true },
                  { parcelas: "5x", valor: "R$ 65,00", total: "R$ 325,00", semJuros: true },
                  { parcelas: "6x", valor: "R$ 54,17", total: "R$ 325,02", semJuros: true },
                  { parcelas: "7x", valor: "R$ 47,98", total: "R$ 335,86", semJuros: false },
                  { parcelas: "8x", valor: "R$ 42,39", total: "R$ 339,12", semJuros: false },
                  { parcelas: "9x", valor: "R$ 38,04", total: "R$ 342,36", semJuros: false },
                  { parcelas: "10x", valor: "R$ 34,57", total: "R$ 345,70", semJuros: false },
                  { parcelas: "11x", valor: "R$ 31,73", total: "R$ 349,03", semJuros: false },
                  { parcelas: "12x", valor: "R$ 29,36", total: "R$ 352,32", semJuros: false },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 ${index === 0 ? "bg-orange-500/15 border border-orange-500/40" : "bg-gray-800/50 border border-gray-700/30"}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`font-black text-base w-8 ${index === 0 ? "text-orange-400" : "text-white"}`}>
                        {item.parcelas}
                      </span>
                      <div>
                        <span className="text-white font-semibold text-sm">
                          {item.valor}
                        </span>
                        {item.semJuros && (
                          <span className="ml-1.5 text-green-400 text-xs font-medium">sem juros</span>
                        )}
                      </div>
                    </div>
                    <span className="text-gray-400 text-xs">
                      total {item.total}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 bg-gray-800/40 border border-gray-700/30 rounded-lg p-4">
                <p className="text-gray-400 text-xs leading-relaxed">
                  * Parcelamento sujeito a aprovação da operadora do cartão. Valores podem variar conforme a bandeira utilizada.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-900/95 border-t border-gray-700/50 p-4">
              <button
                onClick={closeInstallmentPopup}
                className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <X className="w-4 h-4" />
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup de Vídeo */}
      {activeVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/95 backdrop-blur-sm"
            onClick={closeVideoPopup}
          />
          <div className={`relative w-full max-w-[340px] md:max-w-[380px] ${isVideoClosing ? "animate-popup-close" : "animate-popup-scale"}`}>
              {/* Container do vídeo vertical (stories format) */}
            <div
              className="relative w-full rounded-2xl overflow-hidden border-2 border-orange-500/40 shadow-2xl shadow-orange-500/30"
              style={{
                paddingTop: "177.78%",
              }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
                {typeof window !== "undefined" && activeVideo && (
                  <wistia-player media-id={activeVideo} seo="false" aspect="0.5625" />
                )}
              </div>
            </div>
            {/* Botão fechar abaixo do vídeo */}
            <div className="mt-4">
              <button
                onClick={closeVideoPopup}
                className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors"
                aria-label="Fechar vídeo"
              >
                <X className="w-4 h-4" />
                Fechar janela
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup Confira as Funções */}
      {showFunctionsPopup && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            onClick={closeFunctionsPopup}
          />
          <div className={`relative bg-gradient-to-b from-gray-900 to-gray-950 w-full md:max-w-lg md:rounded-2xl md:m-4 max-h-[90vh] md:max-h-[85vh] flex flex-col shadow-2xl border-t md:border border-orange-500/30 ${isFunctionsClosing ? 'animate-popup-close' : 'animate-popup-scale'}`}>
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-gray-800 to-gray-900 px-5 py-4 flex items-center justify-between border-b border-gray-700/50 rounded-t-none md:rounded-t-2xl">
              <div className="flex items-center gap-2">
                <Watch className="w-5 h-5 text-orange-400" />
                <h2 className="text-white text-lg font-bold">Funções do Smartwatch</h2>
              </div>
              <button
                onClick={closeFunctionsPopup}
                className="text-gray-400 hover:text-white transition-colors p-1"
                aria-label="Fechar lista de funções"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 md:p-6">
              <p className="text-gray-400 text-sm mb-5">
                Veja tudo que o seu smartwatch é capaz de fazer:
              </p>
              <ul className="space-y-2.5">
                {[
                  "Responde Whatsapp",
                  "Chat GPT em português",
                  "Atende ligações por gesto",
                  "Bloqueio de tela por senha",
                  "Ilha de notificações",
                  "Faz e recebe ligações",
                  "NFC para portas e janelas",
                  "Leitor de E-book",
                  "Tradutor por AI",
                  "Notifica redes sociais (WhatsApp, Instagram, Facebook, etc.)",
                  "Personaliza foto e vídeos na tela do relogio",
                  "+500 Watch Faces disponíveis no Aplicativo (MActive Pro)",
                  "GPS em tempo real no aplicativo",
                  "Abas de atalhos rápidos",
                  "2 botões funcionais",
                  "Relógio de cabeceira",
                  "6 estilos de menu",
                  "Monitor de passos",
                  "Monitor de batimentos cardíacos",
                  "Monitor de pressão arterial",
                  "Monitor de oxigênio no sangue",
                  "Monitor de sono",
                  "Monitor de sedentarismo",
                  "Monitor de decibéis",
                  "Prevenção de enjoos para viagens",
                  "Monitor de esportes (Caminhada, Corrida, Ciclismo, Futebol, Levantamento de peso, etc.)",
                  "Monitor de calorias gastas, distância, tempo e passos durante o treino",
                  "Rastreamento do ciclo menstrual feminino",
                  "Previsão do tempo",
                  "Nível de estresse",
                  "Atenção plena com estado psicológico",
                  "Treino de respiração",
                  "Assistente de voz",
                  "Cronômetro",
                  "Music Player (Controle de Musicas)",
                  "Jogos",
                  "Controle remoto da câmera do celular",
                  "Contagem regressiva",
                  "Modo massagem",
                  "Função anti perda",
                  "Bússola",
                  "Lanterna",
                  "Calculadora",
                  "Calendário",
                  "Abajur",
                  "SOS",
                ].map((funcao, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 bg-gray-800/50 border border-gray-700/30 rounded-xl px-4 py-3"
                  >
                    <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-orange-500/20 border border-orange-500/50 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 block" />
                    </span>
                    <span className="text-gray-200 text-sm leading-relaxed">{funcao}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-900/95 border-t border-gray-700/50 p-4">
              <button
                onClick={closeFunctionsPopup}
                className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <X className="w-4 h-4" />
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Banner Principal */}
      <section className="relative z-10 w-full">
        {/* Banner Mobile */}
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/headmobiledisdosnamorados-CtKczLbo3ZB0gUY9EUgM57Wt8rB33d.webp"
          alt="Dia dos Namorados Smart Ilha - Tecnologia que conecta corações - 25% OFF no 1º smartwatch + 20% OFF no 2º"
          width={800}
          height={1280}
          className="block md:hidden w-full h-auto"
          priority
        />
        {/* Banner Desktop */}
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/headdesktopdiadosnamorados-OVjA118zCyhBz5Y00wXgZ8mpdoO6NK.webp"
          alt="Dia dos Namorados Smart Ilha - Tecnologia que conecta corações - 25% OFF no 1º smartwatch + 20% OFF no 2º"
          width={1920}
          height={768}
          className="hidden md:block w-full h-auto"
          priority
        />
      </section>

      <section className="relative z-10 flex flex-col items-center justify-start px-4 pt-8 pb-8 md:pt-12 md:pb-12">
        {/* Modelos Disponiveis */}
        <div className="w-full max-w-md md:max-w-5xl mb-6 md:mb-10">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight text-balance mb-2 md:mb-3">
              CONHEÇA NOSSOS{" "}
              <span className="text-orange-400">MODELOS</span>
            </h2>
            <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
              Encontre o smartwatch perfeito para o seu estilo e pulso
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Series 11 Ultra */}
            <div className="bg-gray-900/70 backdrop-blur-md border border-orange-500/20 rounded-2xl overflow-hidden hover:border-orange-500/50 transition-all duration-300 group">
              <div className="relative aspect-[5/6] overflow-hidden">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/series11ultra-ivh8EAhP37F5bvDQLoQyjzZtVjMu6x.webp"
                  alt="Smartwatch Series 11 Ultra 49mm"
                  fill
                  className={`object-cover transition-opacity duration-1000 ease-in-out ${showWristImage ? "opacity-0" : "opacity-100"}`}
                />
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pulsoseries11ultra-DN8ZLXo3Eu3P75BtOxTjtnqpRghixB.webp"
                  alt="Series 11 Ultra no pulso"
                  fill
                  className={`object-cover transition-opacity duration-1000 ease-in-out ${showWristImage ? "opacity-100" : "opacity-0"}`}
                />
              </div>
              <div className="p-4 md:p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-md">49mm</span>
                  <span className="text-orange-400 text-xs font-semibold">MAIOR TELA</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-1">Series 11 Ultra</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Design robusto, ideal para pulsos mais largos. A maior tela da linha para quem quer visibilidade máxima.
                </p>
  <button
  onClick={() => setActiveVideo("25q3ta3r2w")}
  className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-xl transition-all active:scale-95 shadow-lg shadow-orange-500/30 group/btn"
  >
  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20">
    <Play className="w-3 h-3 fill-current" />
  </span>
  Ver Vídeo
  </button>
              </div>
            </div>

            {/* Series 11 Pro */}
            <div className="bg-gray-900/70 backdrop-blur-md border border-orange-500/20 rounded-2xl overflow-hidden hover:border-orange-500/50 transition-all duration-300 group">
              <div className="relative aspect-[5/6] overflow-hidden">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/series11pro-mu97IGpYVVPA96meRty7RvGt86dYy7.webp"
                  alt="Smartwatch Series 11 Pro 47mm"
                  fill
                  className={`object-cover transition-opacity duration-1000 ease-in-out ${showWristImage ? "opacity-0" : "opacity-100"}`}
                />
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pulsoseries11pro-QnxU8cUS5pEWkAC5SgV3Qy1ci2cKah.webp"
                  alt="Series 11 Pro no pulso"
                  fill
                  className={`object-cover transition-opacity duration-1000 ease-in-out ${showWristImage ? "opacity-100" : "opacity-0"}`}
                />
              </div>
              <div className="p-4 md:p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-md">47mm</span>
                  <span className="text-orange-400 text-xs font-semibold">BORDA INFINITA</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-1">Series 11 Pro</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Tela borda infinita com design clássico. Ideal para pulsos medianos e largos.
                </p>
                <button
                  onClick={() => setActiveVideo("9lt7mipuad")}
                  className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-xl transition-all active:scale-95 shadow-lg shadow-orange-500/30"
                >
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20">
                    <Play className="w-3 h-3 fill-current" />
                  </span>
                  Ver Vídeo
                </button>
              </div>
            </div>

            {/* S11 Pro Mini */}
            <div className="bg-gray-900/70 backdrop-blur-md border border-orange-500/20 rounded-2xl overflow-hidden hover:border-orange-500/50 transition-all duration-300 group">
              <div className="relative aspect-[5/6] overflow-hidden">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/s11promini-J1yd35MDQWu7EPfD9vnI0M8QCxMSlz.webp"
                  alt="Smartwatch S11 Pro Mini 42mm"
                  fill
                  className={`object-cover transition-opacity duration-1000 ease-in-out ${showWristImage ? "opacity-0" : "opacity-100"}`}
                />
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pulsos11promini-jlpZN6QErznUObkwmt6GkBTyHXsjAP.webp"
                  alt="S11 Pro Mini no pulso"
                  fill
                  className={`object-cover transition-opacity duration-1000 ease-in-out ${showWristImage ? "opacity-100" : "opacity-0"}`}
                />
              </div>
              <div className="p-4 md:p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-md">42mm</span>
                  <span className="text-orange-400 text-xs font-semibold">MINIMALISTA</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-1">S11 Pro Mini</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Tela borda infinita com design minimalista. Ideal para pulsos femininos médio e fino.
                </p>
                <button
                  onClick={() => setActiveVideo("724zt9lhcf")}
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

          {/* Confira as Funções - Botão */}
          <div className="mt-6 md:mt-8 flex justify-center">
            <button
              onClick={() => setShowFunctionsPopup(true)}
              className="group relative flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-orange-500/40 hover:shadow-orange-500/60 hover:scale-105 active:scale-95 font-bold text-base md:text-lg"
            >
              <Watch className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              <span>Conheça as Funções</span>
            </button>
          </div>

          {/* Seção Confira os Valores */}
          <div className="mt-10 md:mt-14">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight text-balance">
                CONFIRA OS{" "}
                <span className="text-orange-400">VALORES</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {/* Card Series 11 Ultra */}
              <div className="bg-gray-900/80 border border-gray-800 rounded-2xl overflow-hidden flex flex-col">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Series%2011%20Ultra-fPD0FiQfr6tAkIqMDca3hLjXDVBnWV.webp"
                    alt="Series 11 Ultra 49mm"
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <div className="p-5 flex flex-col gap-3">
                  <div>
                    <h3 className="text-white font-bold text-lg leading-tight">
                      Series 11 Ultra{" "}
                      <span className="text-gray-400 font-normal text-sm">(49mm)</span>
                    </h3>
                    <p className="text-gray-500 text-sm line-through mt-0.5">R$435,00</p>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-white text-3xl font-black">R$325,00</span>
                      <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-md">25% OFF</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-300 space-y-0.5">
                    <p>6x de R$54,17 <span className="text-green-400 text-xs font-semibold">sem juros</span></p>
                    <p className="text-green-400 font-semibold">R$299,90 via Pix</p>
                  </div>
                  <button
                    onClick={() => setShowInstallmentPopup(true)}
                    className="flex items-center gap-2 text-orange-400 hover:text-orange-300 text-sm font-semibold transition-colors w-fit"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                    ver detalhes
                  </button>
                </div>
              </div>

              {/* Card Series 11 Pro */}
              <div className="bg-gray-900/80 border border-gray-800 rounded-2xl overflow-hidden flex flex-col">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Series%2011%20Pro-adNwSBlnpR7U6KHVPS3j8fRCejemK9.webp"
                    alt="Series 11 Pro 47mm"
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <div className="p-5 flex flex-col gap-3">
                  <div>
                    <h3 className="text-white font-bold text-lg leading-tight">
                      Series 11 Pro{" "}
                      <span className="text-gray-400 font-normal text-sm">(47mm)</span>
                    </h3>
                    <p className="text-gray-500 text-sm line-through mt-0.5">R$435,00</p>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-white text-3xl font-black">R$325,00</span>
                      <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-md">25% OFF</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-300 space-y-0.5">
                    <p>6x de R$54,17 <span className="text-green-400 text-xs font-semibold">sem juros</span></p>
                    <p className="text-green-400 font-semibold">R$299,90 via Pix</p>
                  </div>
                  <button
                    onClick={() => setShowInstallmentPopup(true)}
                    className="flex items-center gap-2 text-orange-400 hover:text-orange-300 text-sm font-semibold transition-colors w-fit"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                    ver detalhes
                  </button>
                </div>
              </div>

              {/* Card S11 Pro Mini */}
              <div className="bg-gray-900/80 border border-gray-800 rounded-2xl overflow-hidden flex flex-col">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/S11%20Mini-NMjKBnjxFqNDSH8BkDkSsgxfDlNFga.webp"
                    alt="S11 Pro Mini 42mm"
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <div className="p-5 flex flex-col gap-3">
                  <div>
                    <h3 className="text-white font-bold text-lg leading-tight">
                      S11 Pro Mini{" "}
                      <span className="text-gray-400 font-normal text-sm">(42mm)</span>
                    </h3>
                    <p className="text-gray-500 text-sm line-through mt-0.5">R$435,00</p>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-white text-3xl font-black">R$325,00</span>
                      <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-md">25% OFF</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-300 space-y-0.5">
                    <p>6x de R$54,17 <span className="text-green-400 text-xs font-semibold">sem juros</span></p>
                    <p className="text-green-400 font-semibold">R$299,90 via Pix</p>
                  </div>
                  <button
                    onClick={() => setShowInstallmentPopup(true)}
                    className="flex items-center gap-2 text-orange-400 hover:text-orange-300 text-sm font-semibold transition-colors w-fit"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                    ver detalhes
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Guia de Medidas - Botão destacado */}
          <div className="mt-6 md:mt-8 flex justify-center">
            <button
              onClick={() => setShowSizeGuide(true)}
              className="group relative flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-orange-500/40 hover:shadow-orange-500/60 hover:scale-105 active:scale-95 font-bold text-base md:text-lg"
            >
              <Ruler className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              <span>Guia de Medidas</span>
            </button>
          </div>

          {/* Valores e Condições */}
          <div className="mt-6 md:mt-8">
            <div className="bg-gradient-to-b from-gray-900/90 to-gray-950/90 border border-gray-800 rounded-2xl p-6 md:p-8 text-center">
              {/* Imagem do Kit Completo */}
              <div className="mb-6">
                <div className="flex justify-center items-center gap-2 mb-4">
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-white drop-shadow-lg uppercase tracking-wide">
                    Confira todos os brindes do{" "}
                    <span className="text-orange-400">Dia dos Namorados</span>
                  </h3>
                </div>
                <div className="relative w-full max-w-md mx-auto rounded-xl overflow-hidden border-4 border-orange-500/60 shadow-xl shadow-orange-500/30">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/brindes-9O96OIhSqzKijVMMYDntZSmXjCHOG5.webp"
                    alt="Kit completo com smartwatch, fone bluetooth, pulseiras extras, capinha e acessórios"
                    width={500}
                    height={750}
                    className="w-full h-auto"
                  />
                </div>
              </div>

              {/* Brindes */}
              <div className="mt-8">
                {/* Subtítulo PRESENTES EXCLUSIVOS */}
                <div className="flex items-center justify-center gap-2 mb-6">
                  <svg className="w-5 h-5 text-rose-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  <span className="text-rose-400 font-bold text-sm uppercase tracking-wider">Presentes Exclusivos</span>
                  <svg className="w-5 h-5 text-rose-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>

                {/* Grid de brindes */}
                <BrindesCarousel />

                {/* Destaque R$105,00 em presentes GRÁTIS HOJE */}
                <div className="mt-6 flex flex-col items-center">
                  <div className="bg-gradient-to-r from-rose-500/20 via-rose-400/30 to-rose-500/20 border border-rose-500/50 rounded-xl px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-rose-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                      <span className="text-rose-400 font-black text-lg line-through">R$105,00</span>
                      <span className="text-white text-sm font-medium">em presentes</span>
                    </div>
                    <span className="text-rose-300 font-bold text-2xl uppercase tracking-wide animate-pulse">GRÁTIS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção Instagram */}
        <div
          ref={instagramFade.ref}
          className={`w-full max-w-md md:max-w-2xl transition-all duration-700 ease-out mb-8 md:mb-12 ${instagramFade.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="flex flex-col items-center text-center">
            {/* Icone Instagram */}
            <div className="mb-3 md:mb-5">
              <svg className="w-12 h-12 md:w-14 md:h-14 text-orange-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </div>

            {/* Titulo */}
            <h2 className="text-lg md:text-2xl lg:text-3xl font-semibold text-white mb-5 md:mb-8 leading-snug px-2">
              Acompanhe nossas <span className="text-orange-400">ofertas</span> e{" "}
              <span className="text-orange-400">feedbacks</span> de clientes em nosso Instagram
            </h2>

            {/* Imagem do perfil Instagram */}
            <div className="w-full max-w-[300px] md:max-w-[400px]">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/perfilinstagram-KvhduoKKP6hKuRpkhR6JAMQFM1BrzY.png"
                alt="Perfil Instagram Smart Ilha"
                width={400}
                height={800}
                loading="lazy"
                className="w-full h-auto rounded-3xl shadow-2xl shadow-black/50"
              />
            </div>
          </div>
        </div>

        {/* Seção de Reviews dos Clientes */}
        <div className="w-full max-w-md md:max-w-xl lg:max-w-2xl mb-8 md:mb-12">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 md:mb-3 tracking-tight">
              Veja o que nossos <span className="text-orange-400">clientes</span> estão dizendo
            </h2>
            <p className="text-gray-300 text-base md:text-lg">
              Avaliações reais de quem já comprou na Smart Ilha
            </p>
          </div>

          <div className="w-full px-2 md:px-8 lg:px-12 space-y-6 md:space-y-8">
            <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/review-zBAqKtyTX2IfCBguykCTzTNjlqrx9x.webp"
              alt="Avaliações de clientes da Smart Ilha no Instagram"
              width={600}
              height={900}
              loading="lazy"
              className="w-full h-auto rounded-xl md:rounded-2xl border border-gray-700/50 shadow-2xl shadow-black/50"
            />
            <Image
              ref={review2Ref}
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/review2-xFIU0DY7BDK8j7eqLQlvSFkh9HgLB4.webp"
              alt="Avaliações de clientes da Smart Ilha no WhatsApp"
              width={600}
              height={1200}
              loading="lazy"
              className="w-full h-auto rounded-xl md:rounded-2xl border border-gray-700/50 shadow-2xl shadow-black/50"
            />
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/review3-89jXguVcBqjnjEWtp2KS3ZslU0OIlp.webp"
              alt="Mais avaliações de clientes satisfeitos - Fernanda, Brenda, Léo Durães, Gui, Pedro Ivo e Johnny Rodrigues"
              width={600}
              height={1400}
              loading="lazy"
              className="w-full h-auto rounded-xl md:rounded-2xl border border-gray-700/50 shadow-2xl shadow-black/50"
            />
          </div>
        </div>

        {/* Seção Entrega Rápida e Garantida */}
        <div className="w-full max-w-md md:max-w-2xl mb-8 md:mb-12">
          <div className="text-left mb-4 md:mb-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              ENTREGA RÁPIDA
            </h2>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-orange-500 tracking-tight leading-tight">
              E GARANTIDA!
            </h2>
            <p className="text-gray-400 text-sm md:text-base mt-2">
              Seu pedido com seguranca e agilidade em todas as etapas.
            </p>
          </div>

          {/* Imagem do caminhão */}
          <div className="relative w-full mb-6 md:mb-8">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/caminhao-xn6h4TI9mAaj3fzgIkBLaWwyngvOZ6.png"
              alt="Caminhão SEDEX Correios com caixas Smart Ilha"
              width={640}
              height={400}
              loading="lazy"
              className="w-full h-auto"
            />
          </div>

          {/* Cards de benefícios */}
          <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
              {/* 1-2 Dias Úteis */}
              <div className="flex items-center gap-4 bg-gray-900/80 border border-gray-700/50 rounded-xl p-4">
                <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icon-calendar-3d-mgsdK904uaUbddYUX6TvFtIRyQU4UK.webp"
                    alt="Calendário 1-2 dias"
                    width={64}
                    height={64}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              <div>
                <h3 className="text-orange-500 font-bold text-base md:text-lg">1-2 DIAS ÚTEIS</h3>
                <p className="text-gray-400 text-sm">Receba em 1 a 2 dias úteis</p>
              </div>
            </div>

              {/* Garantia de Entrega */}
              <div className="flex items-center gap-4 bg-gray-900/80 border border-gray-700/50 rounded-xl p-4">
                <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icon-shield-3d-i1bFzAqrV4erfJuQU5sLLBUGXtCvvt.webp"
                    alt="Garantia de entrega"
                    width={64}
                    height={64}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              <div>
                <h3 className="text-orange-500 font-bold text-base md:text-lg">GARANTIA DE ENTREGA</h3>
                <p className="text-gray-400 text-sm">Garantimos que seu pedido sera entregue</p>
              </div>
            </div>

              {/* Garantia Contra Extravio */}
              <div className="flex items-center gap-4 bg-gray-900/80 border border-gray-700/50 rounded-xl p-4">
                <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icon-lock-3d-AJ6u6Xd9m8LHQHU0mkPpd3CdV0Yhz0.jpg"
                    alt="Garantia contra extravio"
                    width={64}
                    height={64}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              <div>
                <h3 className="text-orange-500 font-bold text-base md:text-lg">GARANTIA CONTRA EXTRAVIO</h3>
                <p className="text-gray-400 text-sm">Proteção total em caso de perda ou extravio</p>
              </div>
            </div>

              {/* Código de Rastreio */}
              <div className="flex items-center gap-4 bg-gray-900/80 border border-gray-700/50 rounded-xl p-4">
                <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icon-tracking-3d-7M7oOya59OWTbkxO4QLqzwKXlEB2od.webp"
                    alt="Código de rastreio"
                    width={64}
                    height={64}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              <div>
                <h3 className="text-orange-500 font-bold text-base md:text-lg">PEDIDO COM CÓDIGO DE RASTREIO</h3>
                <p className="text-gray-400 text-sm">Acompanhe seu pedido do inicio ao fim</p>
              </div>
            </div>
          </div>

          {/* Timeline do processo */}
          <div className="bg-gray-900/80 border border-gray-700/50 rounded-xl p-5 md:p-6 mb-6 md:mb-8">
            <div className="flex items-center justify-between relative">
              {/* Linha conectora */}
              <div className="absolute top-8 left-[10%] right-[10%] h-0.5 bg-orange-500/50"></div>

              {/* Pedido Realizado */}
              <div className="flex flex-col items-center text-center z-10 flex-1">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden mb-2 border border-orange-500/30 shadow-lg shadow-orange-500/20">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icon-order-bright-C9MtqAQShYYdcV0VSa84AoFSPKcKpf.webp"
                    alt="Pedido Realizado"
                    width={64}
                    height={64}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-white font-bold text-[10px] md:text-xs uppercase">Pedido</span>
                <span className="text-white font-bold text-[10px] md:text-xs uppercase">Realizado</span>
              </div>

              {/* Preparação */}
              <div className="flex flex-col items-center text-center z-10 flex-1">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden mb-2 border border-orange-500/30 shadow-lg shadow-orange-500/20">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icon-preparation-bright-3VEqA9OCQOfyX2i4WPBce4GUCfgWo8.webp"
                    alt="Preparação Imediata"
                    width={64}
                    height={64}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-white font-bold text-[10px] md:text-xs uppercase">Preparação</span>
                <span className="text-white font-bold text-[10px] md:text-xs uppercase">Imediata</span>
              </div>

              {/* Envio Rápido */}
              <div className="flex flex-col items-center text-center z-10 flex-1">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden mb-2 border border-orange-500/30 shadow-lg shadow-orange-500/20">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icon-shipping-bright-McPOEsQAeM3HIMnI9gtMXK9POxJMAa.webp"
                    alt="Envio Rápido"
                    width={64}
                    height={64}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-white font-bold text-[10px] md:text-xs uppercase">Envio</span>
                <span className="text-white font-bold text-[10px] md:text-xs uppercase">Rápido</span>
              </div>

              {/* Entrega Garantida */}
              <div className="flex flex-col items-center text-center z-10 flex-1">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden mb-2 border border-orange-500/30 shadow-lg shadow-orange-500/20">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icon-delivery-bright-ZAOJQP0XrrpQc3zlTRf5JtaTtOJJeh.webp"
                    alt="Entrega Garantida"
                    width={64}
                    height={64}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-white font-bold text-[10px] md:text-xs uppercase">Entrega</span>
                <span className="text-white font-bold text-[10px] md:text-xs uppercase">Garantida</span>
              </div>
            </div>
          </div>

          {/* Entrega local - Motoboy e Retirada */}
          <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-xl p-4 md:p-5">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-orange-400 font-bold text-sm md:text-base mb-1">ILHA DO GOVERNADOR, RJ</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Oferecemos <span className="text-orange-400 font-semibold">entrega via motoboy</span> para a região da Ilha do Governador e <span className="text-orange-400 font-semibold">retirada presencial</span> agendando um horario pelo WhatsApp.
                </p>
              </div>
            </div>
          </div>

          {/* Faixa de Carrossel - Entrega no mesmo dia */}
          <div className="w-full overflow-hidden bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 py-2.5 mt-4 rounded-lg">
            <div className="animate-marquee whitespace-nowrap flex items-center">
              <span className="text-white font-bold text-sm md:text-base mx-8 flex items-center gap-2">
                <Truck className="w-4 h-4" /> ENTREGA NO MESMO DIA - ILHA DO GOVERNADOR, RJ
              </span>
              <span className="text-white font-bold text-sm md:text-base mx-8 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> ENTREGA NO MESMO DIA - ILHA DO GOVERNADOR, RJ
              </span>
              <span className="text-white font-bold text-sm md:text-base mx-8 flex items-center gap-2">
                <Truck className="w-4 h-4" /> ENTREGA NO MESMO DIA - ILHA DO GOVERNADOR, RJ
              </span>
              <span className="text-white font-bold text-sm md:text-base mx-8 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> ENTREGA NO MESMO DIA - ILHA DO GOVERNADOR, RJ
              </span>
              <span className="text-white font-bold text-sm md:text-base mx-8 flex items-center gap-2">
                <Truck className="w-4 h-4" /> ENTREGA NO MESMO DIA - ILHA DO GOVERNADOR, RJ
              </span>
              <span className="text-white font-bold text-sm md:text-base mx-8 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> ENTREGA NO MESMO DIA - ILHA DO GOVERNADOR, RJ
              </span>
            </div>
          </div>
        </div>

        {/* Banner Motoboy - Mobile */}
        <div className="block md:hidden w-full max-w-md mb-8">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mobile1-ntSOGH7zAET6xF3RPh9VnX1m1WkRCE.webp"
            alt="Compro, Chegou!! Motoboy Full Grátis - Ilha do Governador, RJ"
            width={800}
            height={1000}
            className="w-full h-auto rounded-xl"
          />
        </div>

        {/* Banner Motoboy - Desktop */}
        <div className="hidden md:block w-full max-w-5xl mb-10">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/desktop1-PJRv2rW4DcmIZeWmfPNKrPc2DkZ7rd.webp"
            alt="Compro, Chegou!! Motoboy Full Grátis - Ilha do Governador, RJ"
            width={1920}
            height={640}
            className="w-full h-auto rounded-xl"
          />
        </div>

        {/* Seção FAQ */}
        <div
          ref={faqFade.ref}
          className={`w-full max-w-md md:max-w-3xl transition-all duration-700 ease-out mb-8 md:mb-12 ${faqFade.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 md:mb-3 tracking-tight">
              Dúvidas <span className="text-orange-400">Frequentes</span>
            </h2>
            <p className="text-gray-300 text-base md:text-lg">
              Compre com segurança, entrega rápida e garantia real.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-3 md:space-y-4">
            <AccordionItem
              value="item-1"
              className="bg-gray-900/70 backdrop-blur-md border border-orange-500/20 rounded-xl md:rounded-2xl overflow-hidden hover:border-orange-500/40 transition-all duration-300 px-4 md:px-6"
            >
              <AccordionTrigger className="text-white text-left text-sm md:text-base font-medium py-4 md:py-5 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                Como faço para comprar?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 text-sm md:text-base pb-4 md:pb-5 leading-relaxed">
                Basta entrar em contato pelo nosso WhatsApp (logo abaixo). Um atendente 100% humanizado irá te ajudar em todo o processo, desde a escolha do produto até a finalização do pedido, de forma rápida, simples e segura.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-2"
              className="bg-gray-900/70 backdrop-blur-md border border-orange-500/20 rounded-xl md:rounded-2xl overflow-hidden hover:border-orange-500/40 transition-all duration-300 px-4 md:px-6"
            >
              <AccordionTrigger className="text-white text-left text-sm md:text-base font-medium py-4 md:py-5 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                Os produtos são à pronta entrega?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 text-sm md:text-base pb-4 md:pb-5 leading-relaxed">
                Sim, trabalhamos exclusivamente com produtos em estoque. Durante o atendimento, os itens são separados em tempo real para garantir a disponibilidade antes da finalização da compra.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-3"
              className="bg-gray-900/70 backdrop-blur-md border border-orange-500/20 rounded-xl md:rounded-2xl overflow-hidden hover:border-orange-500/40 transition-all duration-300 px-4 md:px-6"
            >
              <AccordionTrigger className="text-white text-left text-sm md:text-base font-medium py-4 md:py-5 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                A loja Smart Ilha é confiável?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 text-sm md:text-base pb-4 md:pb-5 leading-relaxed">
                Sim, a Smart Ilha é uma loja confiável, com mais de 3 anos de atuação no mercado, mais de 25.000 seguidores e clientes no Instagram e zero reclamações no Reclame Aqui.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-4"
              className="bg-gray-900/70 backdrop-blur-md border border-orange-500/20 rounded-xl md:rounded-2xl overflow-hidden hover:border-orange-500/40 transition-all duration-300 px-4 md:px-6"
            >
              <AccordionTrigger className="text-white text-left text-sm md:text-base font-medium py-4 md:py-5 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                Os produtos têm garantia?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 text-sm md:text-base pb-4 md:pb-5 leading-relaxed">
                Sim, todos os smartwatches possuem 90 dias de garantia contra defeitos de fabricação. Caso ocorra qualquer problema, nosso suporte resolve de forma rápida e sem burocracia.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-5"
              className="bg-gray-900/70 backdrop-blur-md border border-orange-500/20 rounded-xl md:rounded-2xl overflow-hidden hover:border-orange-500/40 transition-all duration-300 px-4 md:px-6"
            >
              <AccordionTrigger className="text-white text-left text-sm md:text-base font-medium py-4 md:py-5 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                Qual o prazo de entrega?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 text-sm md:text-base pb-4 md:pb-5 leading-relaxed">
                Para clientes da Ilha do Governador (RJ), realizamos entrega no mesmo dia via motoboy. Para outras regiões do Rio de Janeiro, o envio é feito via SEDEX, com prazo médio de 1 a 2 dias úteis.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-6"
              className="bg-gray-900/70 backdrop-blur-md border border-orange-500/20 rounded-xl md:rounded-2xl overflow-hidden hover:border-orange-500/40 transition-all duration-300 px-4 md:px-6"
            >
              <AccordionTrigger className="text-white text-left text-sm md:text-base font-medium py-4 md:py-5 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                O pedido tem garantia de entrega?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 text-sm md:text-base pb-4 md:pb-5 leading-relaxed">
                Sim, a Smart Ilha oferece 100% de garantia de entrega. Todos os pedidos possuem código de rastreio, transporte seguro e proteção total em caso de perda ou extravio.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Pronto para encontrar seu Smartwatch Ideal? */}
        <div
          ref={ctaFade.ref}
          className={`w-full max-w-md md:max-w-3xl transition-all duration-700 ease-out ${ctaFade.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="bg-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-xl">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 md:mb-6 tracking-tight text-center">
              Pronto para garantir seu
              <span className="text-orange-400"> Smartwatch Ideal?</span>
            </h2>

            {/* Imagem Promocional */}
            <div className="flex justify-center mb-5 md:mb-6">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/valor2-0FgS8K90K6OpUCyqmeS02Hx0NOXY5p.webp"
                alt="Selecione seu Smartwatch - Series 11 Ultra, Series 11 Pro e S11 Pro Mini"
                width={400}
                height={500}
                className="w-full max-w-[320px] md:max-w-[380px] h-auto rounded-xl shadow-xl shadow-orange-500/20"
              />
            </div>

            <p className="text-gray-300 mb-6 md:mb-8 text-base md:text-lg lg:text-xl font-light text-center">
              Clique no botao abaixo e realize seu pedido!
            </p>

            <div className="space-y-4 md:space-y-5 text-center">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="block w-full group">
                <Button
                  size="lg"
                  className="relative overflow-hidden bg-gradient-to-r from-green-500 via-green-400 to-green-500 hover:from-green-400 hover:via-green-500 hover:to-green-400 text-white font-black uppercase tracking-wider px-8 md:px-12 py-6 md:py-7 rounded-2xl text-base md:text-xl lg:text-2xl shadow-2xl shadow-green-500/30 transition-all duration-300 hover:scale-105 hover:shadow-green-400/50 w-full flex items-center justify-center gap-4 whitespace-nowrap min-h-[70px] md:min-h-[80px] border-2 border-green-300/30"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wpp1-bXe5BeGoQZrDKo4XQhhxtBrIU3Nx2K.png"
                    alt="WhatsApp"
                    width={32}
                    height={32}
                    className="w-6 h-6 md:w-8 md:h-8 rounded-sm flex-shrink-0 drop-shadow-lg"
                  />
                  <span className="drop-shadow-lg">INICIAR ATENDIMENTO</span>
                </Button>
              </a>
              <p className="text-gray-400 text-sm md:text-base">Atendimento de seg. a sáb. das 8h às 20h</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 bg-[#0c1929] py-8 md:py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Logo */}
          <div className="flex justify-center mb-5 md:mb-6">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo11-cuksuwu8ou7MvjNmTEi8GVf7KXM1ja.png"
              alt="Smart Ilha Logo"
              width={140}
              height={50}
              className="h-10 md:h-12 w-auto"
            />
          </div>

          {/* Informações da empresa */}
          <div className="text-center mb-5 md:mb-6">
            <p className="text-white font-semibold text-sm md:text-base mb-1">
              Smart Ilha - Ilha do Governador, RJ
            </p>
            <p className="text-gray-400 text-xs md:text-sm mb-1">
              CNPJ: 56.997.212/0001-40
            </p>
            <p className="text-gray-400 text-xs md:text-sm mb-2">
              WhatsApp: (21) 98041-3692
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
              <a href="https://smartilha.com.br" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-400 transition-colors text-xs md:text-sm">
                www.smartilha.com.br
              </a>
              <span className="text-gray-600 hidden md:inline">|</span>
              <a href="https://www.instagram.com/smartilha" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-400 transition-colors text-xs md:text-sm">
                @smartilha
              </a>
            </div>
          </div>

          {/* Divisor */}
          <div className="border-t border-gray-700/50 my-5 md:my-6"></div>

          {/* Selo Reclame Aqui */}
          <div className="flex justify-center mb-5 md:mb-6">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/reclameaq-wFLpsKWg75ZKTha9H9mAUqbmBht8l4.png"
              alt="Zero reclamações no Reclame Aqui"
              width={180}
              height={50}
              className="h-10 md:h-12 w-auto"
            />
          </div>

          {/* Badges */}
          <div className="flex justify-center items-center gap-4 md:gap-8 mb-5 md:mb-6">
            <div className="flex items-center gap-1.5 text-gray-400 text-xs md:text-sm">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <span>Site Seguro</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400 text-xs md:text-sm">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Compra Garantida</span>
            </div>
          </div>

          {/* Copyright */}
          <p className="text-gray-500 text-center text-xs md:text-sm">
            2026 Smart Ilha. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
