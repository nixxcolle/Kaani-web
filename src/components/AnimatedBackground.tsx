import { useMemo } from 'react';

/**
 * AnimatedBackground renders lightweight ambient elements (soft leaves and aquatic bubbles)
 * Elements are purely decorative with pointer-events-none and low opacity.
 * Respects prefers-reduced-motion.
 */
export default function AnimatedBackground() {
  const elements = useMemo(() => {
    const items = [];
    // 5 subtle ambient leaves
    for (let i = 0; i < 5; i++) {
      items.push({
        type: 'leaf',
        id: `leaf-${i}`,
        style: {
          top: `${15 + i * 18}vh`,
          left: `${(i * 22 + 8) % 95}vw`,
          animationDelay: `${i * 2.2}s`,
          opacity: 0.25,
        },
      });
    }
    // 6 gentle aquatic bubbles
    for (let i = 0; i < 6; i++) {
      items.push({
        type: 'bubble',
        id: `bubble-${i}`,
        style: {
          top: `${80 - i * 12}vh`,
          left: `${(i * 17 + 12) % 90}vw`,
          animationDelay: `${i * 1.8}s`,
          opacity: 0.35,
        },
      });
    }
    return items;
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Soft Ambient Mesh Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-100/35 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-sky-100/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 left-1/4 w-96 h-96 bg-teal-100/30 rounded-full blur-3xl" />

      {/* Subtle Floating Ecological Elements */}
      {elements.map((el) => (
        <div key={el.id} className={el.type} style={el.style} />
      ))}
    </div>
  );
}
