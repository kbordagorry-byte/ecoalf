"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

// Función para generar números pseudo-aleatorios con seed (evitar hydration mismatch)
function seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000
    const raw = x - Math.floor(x)
    return Math.round(raw * 100) / 100
}

interface OceanPreloaderProps {
    onComplete: () => void
}

export function OceanPreloader({ onComplete }: OceanPreloaderProps) {
    const [progress, setProgress] = useState(0)
    const [isComplete, setIsComplete] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    // Progreso de carga (incremento orgánico)
    useEffect(() => {
        if (isComplete) return

        const interval = setInterval(() => {
            setProgress((prev) => {
                const increment = Math.random() * 8 + 2 // Incremento aleatorio entre 2-10
                const next = Math.min(prev + increment, 100)
                return next
            })
        }, 200)

        return () => clearInterval(interval)
    }, [isComplete])

    // Cuando llega a 100%, esperar y completar
    useEffect(() => {
        if (progress >= 100 && !isComplete) {
            const timeout = setTimeout(() => {
                setIsComplete(true)
                onComplete()
            }, 500)
            return () => clearTimeout(timeout)
        }
    }, [progress, isComplete, onComplete])

    // Generar burbujas con seed
    const bubbles = Array.from({ length: 25 }, (_, i) => ({
        id: i,
        x: seededRandom(i * 42) * 100,
        size: 8 + seededRandom(i * 17) * 20,
        duration: 3 + seededRandom(i * 31) * 3,
        delay: seededRandom(i * 23) * 2,
    }))

    // Generar peces
    const fishes = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        y: 20 + seededRandom(i * 57) * 60,
        duration: 8 + seededRandom(i * 73) * 4,
        delay: seededRandom(i * 29) * 5,
        size: 20 + seededRandom(i * 41) * 15,
    }))

    // Generar rayos de luz
    const lightRays = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        left: 20 + i * 15,
        rotation: -3 + i,
        duration: 10 + i * 2,
        delay: i * 0.8,
    }))

    // Generar partículas flotantes
    const particles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: seededRandom(i * 67) * 100,
        y: seededRandom(i * 89) * 100,
        size: 4 + seededRandom(i * 37) * 12,
        duration: 4 + seededRandom(i * 53) * 4,
        delay: seededRandom(i * 71) * 3,
    }))

    // Generar partículas de profundidad
    const depthParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: seededRandom(i * 47) * 100,
        y: seededRandom(i * 83) * 100,
        duration: 3 + seededRandom(i * 61) * 3,
        delay: seededRandom(i * 79) * 4,
        yOffset: seededRandom(i * 59) * 100,
    }))

    if (!isMounted) return null

    return (
        <AnimatePresence>
            {!isComplete && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 1.5, ease: [0.65, 0, 0.35, 1] }}
                    className="fixed inset-0 z-[9999] overflow-hidden"
                    style={{
                        background: "linear-gradient(to bottom, #051c24 0%, #0a3d4f 40%, #062c38 100%)",
                    }}
                >
                    {/* Rayos de luz desde arriba */}
                    <div className="absolute inset-0 overflow-hidden">
                        {lightRays.map((ray) => (
                            <motion.div
                                key={`ray-${ray.id}`}
                                initial={{ opacity: 0.03 }}
                                animate={{
                                    opacity: [0.03, 0.1, 0.03],
                                    y: [-50, 50],
                                }}
                                transition={{
                                    duration: ray.duration,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: ray.delay,
                                }}
                                className="absolute top-0 w-[1px] h-[60%]"
                                style={{
                                    left: `${ray.left}%`,
                                    transform: `rotate(${ray.rotation}deg)`,
                                    background: "linear-gradient(to bottom, rgba(255,255,255,0.2), rgba(255,255,255,0.05), transparent)",
                                }}
                            />
                        ))}
                    </div>

                    {/* Olas del océano */}
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={`wave-${i}`}
                            initial={{ x: "-100%" }}
                            animate={{ x: "100%" }}
                            transition={{
                                duration: 3 + i * 0.5,
                                repeat: Infinity,
                                ease: "linear",
                                delay: i * 0.3,
                            }}
                            className="absolute bottom-0 w-full h-32"
                            style={{
                                opacity: 0.05 - i * 0.01,
                                transform: `translateY(${i * 15}px)`,
                                background: `linear-gradient(to top, rgba(255,255,255,0.1), transparent)`,
                            }}
                        />
                    ))}

                    {/* Burbujas */}
                    {bubbles.map((bubble) => (
                        <motion.div
                            key={`bubble-${bubble.id}`}
                            initial={{ y: "100vh", x: `${bubble.x}vw`, opacity: 0 }}
                            animate={{
                                y: "-100px",
                                opacity: [0, 0.8, 0.8, 0],
                            }}
                            transition={{
                                duration: bubble.duration,
                                repeat: Infinity,
                                ease: "easeOut",
                                delay: bubble.delay,
                            }}
                            className="absolute rounded-full"
                            style={{
                                width: bubble.size,
                                height: bubble.size,
                                background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(255,255,255,0.2))",
                                border: "1px solid rgba(255,255,255,0.4)",
                                boxShadow: "0 0 10px rgba(255,255,255,0.3)",
                            }}
                        />
                    ))}

                    {/* Peces nadando */}
                    {fishes.map((fish) => (
                        <motion.div
                            key={`fish-${fish.id}`}
                            initial={{ left: "-10%", y: 0 }}
                            animate={{
                                left: "110%",
                                y: [0, -20, 0, 20, 0],
                            }}
                            transition={{
                                left: {
                                    duration: fish.duration,
                                    repeat: Infinity,
                                    ease: "linear",
                                    delay: fish.delay,
                                },
                                y: {
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                },
                            }}
                            className="absolute"
                            style={{
                                top: `${fish.y}%`,
                                opacity: 0.6,
                            }}
                        >
                            {/* SVG del pez */}
                            <svg
                                width={fish.size}
                                height={fish.size * 0.6}
                                viewBox="0 0 40 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                {/* Cola (izquierda) */}
                                <polygon points="6,12 -2,4 -2,20" fill="rgba(255,255,255,0.3)" />
                                {/* Cuerpo */}
                                <ellipse cx="20" cy="12" rx="14" ry="8" fill="rgba(255,255,255,0.4)" />
                                {/* Ojo (derecha) */}
                                <circle cx="28" cy="10" r="2" fill="rgba(255,255,255,0.8)" />
                            </svg>
                        </motion.div>
                    ))}

                    {/* Partículas flotantes (glassmorphism) */}
                    {particles.map((particle) => (
                        <motion.div
                            key={`particle-${particle.id}`}
                            initial={{
                                left: `${particle.x}%`,
                                top: `${particle.y}%`,
                                opacity: 0,
                                scale: 0.5,
                            }}
                            animate={{
                                y: [0, -40, 0],
                                x: [-10, 10, -10],
                                opacity: [0, 0.7, 0],
                                scale: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: particle.duration,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: particle.delay,
                            }}
                            className="absolute rounded-full"
                            style={{
                                width: particle.size,
                                height: particle.size,
                                background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6), rgba(255,255,255,0.1))",
                                border: "1px solid rgba(255,255,255,0.3)",
                                boxShadow: "0 4px 20px rgba(255,255,255,0.15)",
                            }}
                        />
                    ))}

                    {/* Partículas de profundidad */}
                    {depthParticles.map((dp) => (
                        <motion.div
                            key={`depth-${dp.id}`}
                            initial={{
                                left: `${dp.x}%`,
                                top: `${dp.y}%`,
                                opacity: 0.3,
                            }}
                            animate={{
                                y: [0, dp.yOffset],
                                opacity: [0.3, 0, 0.3],
                            }}
                            transition={{
                                duration: dp.duration,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: dp.delay,
                            }}
                            className="absolute w-1 h-1 rounded-full bg-white/30"
                        />
                    ))}

                    {/* Contenido central */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
                        {/* Logo ECOALF imagen */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative w-[90vw] max-w-[1600px] h-[200px] md:h-[300px] lg:h-[400px]"
                        >
                            <Image
                                src="/images/ecoalf-logo-hq.png"
                                alt="ECOALF"
                                fill
                                className="object-contain"
                                priority
                            />
                        </motion.div>

                        {/* Subtítulo */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="text-white/60 text-sm md:text-base tracking-[0.3em] uppercase -mt-16 md:-mt-24 lg:-mt-32 mb-4"
                        >
                            Because there is no planet B
                        </motion.p>

                        {/* Barra de progreso */}
                        <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 256 }}
                            transition={{ duration: 0.5, delay: 0.7 }}
                            className="relative h-1.5 w-64 bg-white/20 rounded-full overflow-hidden"
                        >
                            <motion.div
                                className="h-full rounded-full relative"
                                style={{
                                    width: `${progress}%`,
                                    background: "linear-gradient(to right, #22d3ee, #2dd4bf)",
                                }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* Shimmer effect */}
                                <motion.div
                                    className="absolute inset-0"
                                    animate={{
                                        x: ["-100%", "100%"],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                    style={{
                                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                                    }}
                                />
                            </motion.div>
                        </motion.div>

                        {/* Porcentaje */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.9 }}
                            className="text-white/40 text-xs mt-4 tracking-widest"
                        >
                            {Math.round(progress)}%
                        </motion.p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
