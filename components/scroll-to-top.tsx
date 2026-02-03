"use client"

import { motion } from "framer-motion"
import { ChevronUp } from "lucide-react"

export function ScrollToTop() {
    const handleClick = () => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    return (
        <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
            className="flex flex-col items-center gap-3 group mt-16"
        >
            {/* Círculo con icono */}
            <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/40 transition-colors"
            >
                <ChevronUp className="w-5 h-5 text-white/40 group-hover:text-white/70 transition-colors" />
            </motion.div>

            {/* Texto */}
            <span className="text-xs tracking-[0.2em] uppercase text-white/40 group-hover:text-white/70 transition-colors">
                Volver al inicio
            </span>
        </motion.button>
    )
}
