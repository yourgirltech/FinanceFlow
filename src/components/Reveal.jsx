import { useInView } from '../lib/useCountUp'

export default function Reveal({ children, className = '', delay = 0 }) {
  const [ref, inView] = useInView({ threshold: 0.15 })
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${className}`}
      style={{ transitionDelay: inView ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  )
}
