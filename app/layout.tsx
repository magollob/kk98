import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Smart Ilha - Especialistas em Smartwatches",
  description:
    "Descubra os melhores smartwatches com atendimento personalizado e garantia de qualidade. Mais de 2.400 pedidos entregues e 2 anos no mercado.",
  keywords: "smartwatch, relógio inteligente, tecnologia, ilha do governador, entrega rápida",
  generator: 'v0.dev',
  openGraph: {
    title: "Smart Ilha - Especialistas em Smartwatches",
    description: "Descubra os melhores smartwatches com atendimento personalizado e garantia de qualidade.",
    url: "https://smartilha.com",
    siteName: "Smart Ilha",
    images: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/imagemprelink-1NWatRggMGF56q6oa9D47eo0tQhmIY.webp",
        width: 1200,
        height: 630,
        alt: "Smart Ilha - Especialistas em Smartwatches",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Ilha - Especialistas em Smartwatches",
    description: "Descubra os melhores smartwatches com atendimento personalizado e garantia de qualidade.",
    images: ["https://hebbkx1anhila5yf.public.blob.vercel-storage.com/imagemprelink-1NWatRggMGF56q6oa9D47eo0tQhmIY.webp"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
