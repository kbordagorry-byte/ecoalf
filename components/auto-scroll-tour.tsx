"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, SkipForward, X } from "lucide-react"

interface AutoScrollTourProps {
    sections: string[]
    scrollDuration?: number
    autoStart?: boolean
}

export function AutoScrollTour({
    sections,
    scrollDuration = 6000,
    autoStart = false,
}: AutoScrollTourProps) {
    const [isPlaying, setIsPlaying] = useState(autoStart)
    const [currentSection, setCurrentSection] = useState(0)
    const [isVisible, setIsVisible] = useState(true)
    const [isExpanded, setIsExpanded] = useState(false)
    const [progress, setProgress] = useState(0)

    // Scroll a una sección
    const scrollToSection = useCallback((index: number) => {
        const element = document.getElementById(sections[index])
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" })
        }
    }, [sections])

    // Avance automático
    useEffect(() => {
        if (!isPlaying || !isVisible) return

        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                const newProgress = prev + (100 / (scrollDuration / 100))
                if (newProgress >= 100) {
                    return 0
                }
                return newProgress
            })
        }, 100)

        const advanceInterval = setInterval(() => {
            setCurrentSection((prev) => {
                const next = (prev + 1) % sections.length
                scrollToSection(next)
                return next
            })
            setProgress(0)
        }, scrollDuration)

        return () => {
            clearInterval(progressInterval)
            clearInterval(advanceInterval)
        }
    }, [isPlaying, isVisible, scrollDuration, sections.length, scrollToSection])

    // Detectar sección actual al hacer scroll manual
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + window.innerHeight / 3

            for (let i = sections.length - 1; i >= 0; i--) {
                const element = document.getElementById(sections[i])
                if (element && element.offsetTop <= scrollPosition) {
                    setCurrentSection(i)
                    break
                }
            }
        }

        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [sections])

    const handleDotClick = (index: number) => {
        setIsPlaying(false)
        setCurrentSection(index)
        scrollToSection(index)
        setProgress(0)
    }

    const handleSkip = () => {
        const next = (currentSection + 1) % sections.length
        setCurrentSection(next)
        scrollToSection(next)
        setProgress(0)
    }

    const handleClose = () => {
        setIsVisible(false)
        setIsPlaying(false)
    }

    if (!isVisible) return null

    return (
        <>
            {/* Indicadores de sección (lado izquierdo) */}
            <AnimatePresence>
                <motion.div
                    key="section-indicators"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="fixed left-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2"
                >
                    {sections.map((_, index) => (
                        <motion.button
                            key={`dot-${index}`}
                            onClick={() => handleDotClick(index)}
                            whileHover={{ scale: 1.3 }}
                            whileTap={{ scale: 0.9 }}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSection
                                    ? "bg-white scale-150"
                                    : "bg-white/30 hover:bg-white/60"
                                }`}
                        >
                            {/* Pulso en sección activa cuando está reproduciendo */}
                            {index === currentSection && isPlaying && (
                                <motion.span
                                    className="absolute inset-0 rounded-full bg-white/50"
                                    animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                            )}
                        </motion.button>
                    ))}
                </motion.div>
            </AnimatePresence>

            {/* Controles principales (centro inferior) */}
            <AnimatePresence>
                <motion.div
                    key="tour-controls"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40"
                    onMouseEnter={() => setIsExpanded(true)}
                    onMouseLeave={() => setIsExpanded(false)}
                >
                    <motion.div
                        animate={{ width: isExpanded ? "auto" : "auto" }}
                        className="relative flex items-center gap-1 px-2 py-1.5 rounded-full backdrop-blur-md bg-black/20 border border-white/10"
                    >
                        {/* Botón Play/Pause */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            {isPlaying ? (
                                <Pause className="w-4 h-4 text-white/80" />
                            ) : (
                                <Play className="w-4 h-4 text-white/80" />
                            )}
                        </motion.button>

                        {/* Botón Skip */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSkip}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <SkipForward className="w-4 h-4 text-white/80" />
                        </motion.button>

                        {/* Contador de sección (visible en hover) */}
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div
                                    key="section-counter"
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: "auto" }}
                                    exit={{ opacity: 0, width: 0 }}
                                    className="flex items-center gap-2 overflow-hidden"
                                >
                                    <span className="text-white/60 text-xs whitespace-nowrap px-2">
                                        {currentSection + 1} / {sections.length}
                                    </span>

                                    {/* Botón Close */}
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleClose}
                                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                                    >
                                        <X className="w-4 h-4 text-white/80" />
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Barra de progreso */}
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-white/40"
                                style={{ width: `${progress}%` }}
                                transition={{ duration: 0.1 }}
                            />
                        </div>
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        </>
    )
}
