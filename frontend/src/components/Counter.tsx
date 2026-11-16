'use client';
import { useEffect, useRef, useState } from 'react';

export default function Counter({ value, suffix = '', plain = false, duration = 1800 }: { value: number; suffix?: string; plain?: boolean; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(plain ? value : 0);
  useEffect(() => {
    if (plain) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setN(Math.round(value * eased));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value, duration, plain]);
  return <span ref={ref}>{plain ? value : n.toLocaleString('en-IN')}{suffix}</span>;
}
