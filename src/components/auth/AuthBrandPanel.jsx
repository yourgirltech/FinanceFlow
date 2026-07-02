import FlowLine from '../FlowLine'
import Logo from '../landing/Logo'

export default function AuthBrandPanel({ heading, sub }) {
  return (
    <div className="hidden lg:flex flex-col justify-between w-[45%] bg-navy p-12 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-emerald/[0.08] blur-[100px] rounded-full" />
      <Logo dark className="relative z-10" />

      <div className="relative z-10">
        <h2 className="font-display font-extrabold text-white text-3xl leading-tight tracking-tight mb-4 max-w-sm">
          {heading}
        </h2>
        <p className="text-white/50 text-[15px] leading-relaxed max-w-sm mb-10">{sub}</p>

        <div className="rounded-2xl bg-white/[0.06] border border-white/10 p-3">
          <FlowLine className="w-full h-16" />
        </div>
      </div>

      <p className="relative z-10 text-white/30 text-xs">© {new Date().getFullYear()} Finance Flow</p>
    </div>
  )
}
