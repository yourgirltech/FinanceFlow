import { useEffect, useRef, useState } from 'react'

// Animates a number from 0 to `value` when it scrolls into view (or immediately).
export function useCountUp(value, { duration = 1200, decimals = 0, start = true } = {}) {
  const [display, setDisplay] = useState(0)
  const frame = useRef(null)

  useEffect(() => {
    if (!start) return
    const startTime = performance.now()
    const from = 0

    function tick(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // ease-out-expo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setDisplay(from + (value - from) * eased)
      if (progress < 1) {
        frame.current = requestAnimationFrame(tick)
      } else {
        setDisplay(value)
      }
    }

    frame.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame.current)
  }, [value, duration, start])

  return decimals > 0 ? display.toFixed(decimals) : Math.round(display)
}

export function useInView(options = { threshold: 0.3 }) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        observer.disconnect()
      }
    }, options)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, inView]
}
