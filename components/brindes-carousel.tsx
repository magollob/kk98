import { Watch, Shield, Truck, Headphones, Sparkles, Percent } from "lucide-react"

const brindes = [
  { icon: Watch, text: "+2 Pulseiras Extras" },
  { icon: Shield, text: "+90 Dias de Garantia" },
  { icon: Truck, text: "+Frete Grátis" },
  { icon: Headphones, text: "+Suporte Vitalício" },
  { icon: "bluetooth", text: "+Fone Bluetooth" },
  { icon: Sparkles, text: "+Kit Película e Limpeza" },
  { icon: Shield, text: "+Capinha Protetora" },
  { icon: Percent, text: "+30% De Desconto" },
]

const BluetoothIcon = () => (
  <svg className="w-4 h-4 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14.24 12.01l2.32 2.32c.28-.72.44-1.51.44-2.33 0-.82-.16-1.59-.43-2.31l-2.33 2.32zm5.29-5.3l-1.26 1.26c.63 1.21.98 2.57.98 4.02s-.36 2.82-.98 4.02l1.2 1.2c.97-1.54 1.54-3.36 1.54-5.31-.01-1.89-.55-3.67-1.48-5.19zm-3.82 1L10 2H9v7.59L4.41 5 3 6.41 8.59 12 3 17.59 4.41 19 9 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM11 5.83l1.88 1.88L11 9.59V5.83zm1.88 10.46L11 18.17v-3.76l1.88 1.88z"/>
  </svg>
)

export function BrindesCarousel() {
  return (
    <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto px-1">
      {brindes.map((brinde, index) => {
        return (
          <div
            key={index}
            className="flex items-center gap-2.5 bg-gray-900/60 border border-white/5 rounded-xl px-3 py-2.5"
          >
            <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
              {brinde.icon === "bluetooth" ? (
                <BluetoothIcon />
              ) : (
                <brinde.icon className="w-3.5 h-3.5 text-orange-400" />
              )}
            </div>
            <span className="text-gray-200 text-xs font-medium leading-tight">{brinde.text}</span>
          </div>
        )
      })}
    </div>
  )
}
