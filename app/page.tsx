"use client"

import React, { useState } from "react"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { OceanPreloader } from "@/components/ocean-preloader"
import { AutoScrollTour } from "@/components/auto-scroll-tour"
import { ScrollToTop } from "@/components/scroll-to-top"

// Bubble component for consistent use across sections
function FloatingBubbles({ count = 20, opacity = 0.3 }: { count?: number; opacity?: number }) {
  const [bubbles, setBubbles] = React.useState<Array<{
    x: number;
    duration: number;
    delay: number;
    width: number;
    height: number;
    opacityMultiplier: number;
  }>>([]);

  React.useEffect(() => {
    const newBubbles = Array.from({ length: count }, () => ({
      x: Math.random() * 100,
      duration: 12 + Math.random() * 8,
      delay: Math.random() * 10,
      width: 4 + Math.random() * 10,
      height: 4 + Math.random() * 10,
      opacityMultiplier: Math.random(),
    }));
    setBubbles(newBubbles);
  }, [count]);

  if (bubbles.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {bubbles.map((bubble, i) => (
        <motion.div
          key={i}
          initial={{
            y: "110vh",
            x: `${bubble.x}vw`,
            opacity: 0
          }}
          animate={{
            y: "-10vh",
            opacity: [0, opacity, opacity, 0],
          }}
          transition={{
            duration: bubble.duration,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeOut",
            delay: bubble.delay,
          }}
          className="absolute rounded-full"
          style={{
            width: bubble.width,
            height: bubble.height,
            background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,${opacity + 0.1}), rgba(255,255,255,${opacity * 0.3}))`,
            border: `1px solid rgba(255,255,255,${opacity * 0.5})`,
          }}
        />
      ))}
    </div>
  )
}

// Glass card with consistent styling
function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.3 }}
      className={`relative backdrop-blur-xl bg-white/5 border border-white/10 overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  )
}

// Animated section wrapper
function AnimatedSection({
  children,
  className = "",
  delay = 0
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// IDs de las secciones para el tour
const SECTION_IDS = [
  "portada",
  "conviccion",
  "contexto",
  "producto",
  "problema",
  "dafo",
  "posicionamiento",
  "ejes",
  "plan-accion",
  "campana",
  "cmo",
  "criterios",
  "cierre"
]

export default function EcoalfPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const productRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const { scrollYProgress: productScrollProgress } = useScroll({
    target: productRef,
    offset: ["start end", "end start"],
  })

  const productScale = useTransform(productScrollProgress, [0, 0.5, 1], [0.8, 1.05, 0.95])
  const productRotate = useTransform(productScrollProgress, [0, 0.5, 1], [-8, 0, 8])
  const productY = useTransform(productScrollProgress, [0, 0.5, 1], [80, 0, -40])

  return (
    <>
      {/* Preloader oceánico */}
      <OceanPreloader onComplete={() => setIsLoading(false)} />

      {/* Tour automático (solo visible después de cargar) */}
      {!isLoading && <AutoScrollTour sections={SECTION_IDS} scrollDuration={6000} autoStart={false} />}

      <main
        ref={containerRef}
        className="relative bg-[#051c24] text-white overflow-x-hidden"
        style={{
          opacity: isLoading ? 0 : 1,
          transition: "opacity 1.8s ease-out",
        }}
      >
        {/* Global background gradient that flows through entire page */}
        <div className="fixed inset-0 bg-gradient-to-b from-[#051c24] via-[#0a3d4f] to-[#062c38] pointer-events-none" />

        {/* Ambient animated orbs - fixed position */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="absolute top-[20%] left-[10%] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px]"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              x: [0, -30, 0],
              y: [0, -50, 0],
            }}
            transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="absolute top-[50%] right-[5%] w-[600px] h-[600px] rounded-full bg-teal-500/10 blur-[150px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
              y: [0, 40, 0],
            }}
            transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="absolute bottom-[10%] left-[30%] w-[400px] h-[400px] rounded-full bg-emerald-500/8 blur-[100px]"
          />
        </div>

        {/* Persistent bubbles layer */}
        <div className="fixed inset-0 pointer-events-none">
          <FloatingBubbles count={30} opacity={0.15} />
        </div>

        {/* SECTION 1: PORTADA */}
        <section id="portada" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
          {/* Light rays from top */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0.05 }}
                animate={{
                  opacity: [0.03, 0.1, 0.03],
                  y: [-50, 50],
                }}
                transition={{
                  duration: 10 + i * 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: i * 0.8,
                }}
                className="absolute top-0 w-[1px] h-[60%] bg-gradient-to-b from-white/20 via-white/5 to-transparent"
                style={{
                  left: `${20 + i * 15}%`,
                  transform: `rotate(${-3 + i}deg)`,
                }}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative z-10 text-center px-6 max-w-4xl"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl tracking-[0.4em] uppercase text-white/40 mb-0"
            >
              Propuesta estrategica de marketing
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mb-0 flex justify-center"
            >
              <div className="relative w-[90vw] max-w-[1600px] h-[200px] md:h-[300px] lg:h-[400px] -my-12 md:-my-16 lg:-my-24">
                <Image
                  src="/images/ecoalf-logo-hq.png"
                  alt="ECOALF"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extralight text-white/80"
            >
              De marca sostenible
              <br />
              <span className="font-medium text-white">a marca deseada</span>
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="mt-16 text-sm text-white/40"
            >
              Karen Luciana Bordagorry Fernandez · Febrero 2026
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            >
              <ChevronDown className="w-8 h-8 text-white/40" />
            </motion.div>
          </motion.div>
        </section>

        {/* SECTION 2: CONVICCION PERSONAL */}
        <section id="conviccion" className="relative min-h-screen flex flex-col items-center justify-center px-6 py-12">
          <AnimatedSection className="relative z-10 max-w-4xl">
            <GlassCard className="p-12 md:p-16 rounded-3xl">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="text-lg md:text-xl lg:text-2xl font-light leading-relaxed text-white/80"
              >
                <span className="block mb-8">
                  Este análisis parte de una convicción personal: en un mercado saturado de mensajes éticos, las marcas no compiten por quién es más responsable, sino por quién consigue ser{" "}
                  <span className="text-cyan-300 font-medium whitespace-nowrap">culturalmente relevante</span>{" "}
                  sin perder coherencia.
                </span>
                <span className="block text-lg md:text-xl lg:text-2xl font-light leading-relaxed text-white/80">
                  Este trabajo no busca describir la marca, sino tomar decisiones. He evitado deliberadamente caer en más datos de sostenibilidad, porque ese no es el problema de ECOALF hoy.
                </span>
              </motion.p>
            </GlassCard>
          </AnimatedSection>
        </section>

        {/* SECTION 3: CONTEXTO DE MERCADO */}
        <section id="contexto" className="relative min-h-screen flex flex-col items-center justify-center px-6 py-12">
          <div className="relative z-10 max-w-5xl w-full space-y-16">
            <AnimatedSection className="text-center">
              <p className="text-xl md:text-2xl tracking-[0.4em] uppercase text-white/40 mb-12 text-center">
                Contexto del mercado
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <p className="text-4xl md:text-5xl lg:text-6xl font-extralight text-center leading-tight">
                Hoy no gana la marca más sostenible,
                <br />
                <span className="font-semibold bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-transparent">
                  sino la más deseada
                </span>
                <br />
                <span className="text-white/60">que además es sostenible.</span>
              </p>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 gap-6 mt-16">
              {[
                "La sostenibilidad ha dejado de ser una ventaja competitiva para convertirse en un estandar aspiracional.",
                "El consumidor afirma valorar la sostenibilidad, pero sus decisiones siguen guiadas por diseno, marca y precio.",
                "Grandes marcas han incorporado el discurso sostenible, diluyendo la diferenciacion de los pioneros.",
                "Existe una clara saturacion de mensajes eticos y una creciente fatiga del discurso verde.",
              ].map((text, i) => (
                <AnimatedSection key={i} delay={0.1 * i}>
                  <GlassCard className="p-8 rounded-2xl h-full">
                    <div className="h-1 w-12 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full mb-6" />
                    <p className="text-white/70 leading-relaxed">{text}</p>
                  </GlassCard>
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection delay={0.6} className="mt-16 text-center px-4">
              <p className="text-2xl md:text-3xl font-light leading-relaxed text-white/80 max-w-5xl mx-auto text-center">
                Este contexto obliga a ECOALF a competir no solo por valores, sino por <span className="font-medium text-cyan-300">relevancia cultural</span> y <span className="font-medium text-teal-300">deseo de marca</span>
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* SECTION: PRODUCTO ECOALF */}
        <section
          id="producto"
          ref={productRef}
          className="relative min-h-[120vh] flex items-center justify-center overflow-hidden"
        >
          <div className="relative z-10 flex flex-col items-center justify-center px-6 py-24 w-full">
            {/* ECOALF OCEAN WASTE */}
            <motion.div
              initial={{ opacity: 0, y: -40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-center mb-8"
            >
              <div className="relative w-[80vw] max-w-[1400px] h-[150px] md:h-[250px] lg:h-[350px] mx-auto mb-4 -my-8 md:-my-16">
                <Image
                  src="/images/ecoalf-logo-hq.png"
                  alt="ECOALF"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-white/60 text-sm md:text-base lg:text-lg tracking-[0.4em] mt-2">
                OCEAN WASTE
              </p>
            </motion.div>

            {/* Product floating */}
            <motion.div
              style={{
                scale: productScale,
                rotateZ: productRotate,
                y: productY,
              }}
              className="relative w-full max-w-md md:max-w-lg aspect-square"
            >
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                className="relative w-full h-full"
              >
                <div className="absolute inset-0 blur-3xl bg-gradient-to-b from-cyan-400/25 via-teal-400/15 to-transparent scale-125" />
                <Image
                  src="/images/ecoalf-shoe.png"
                  alt="ECOALF Ocean Waste Sneaker"
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </motion.div>
            </motion.div>

            {/* BECAUSE THERE IS NO PLANET B */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-center mt-8"
            >
              <div className="border-2 border-white/80 px-6 py-4 md:px-10 md:py-6 inline-block backdrop-blur-sm bg-white/5">
                <p className="text-white font-bold text-xl md:text-2xl lg:text-3xl tracking-wide">
                  BECAUSE
                </p>
                <p className="text-white/80 text-lg md:text-xl lg:text-2xl tracking-wide">
                  THERE IS NO
                </p>
                <p className="text-white font-bold text-2xl md:text-3xl lg:text-4xl tracking-wider">
                  PLANET B
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 4: PROBLEMA CENTRAL */}
        <section id="problema" className="relative min-h-screen flex flex-col items-center justify-center px-8 py-12">
          <div className="relative z-10 max-w-5xl w-full space-y-24">
            <AnimatedSection className="text-center">
              <p className="text-xl md:text-2xl tracking-[0.4em] uppercase text-white/40 mb-12 text-center">
                Problema Estratégico
              </p>
              <div className="max-w-4xl mx-auto space-y-6 text-lg md:text-xl font-light leading-relaxed text-white/60 text-center">
                <p>ECOALF es una marca coherente, creíble y con un modelo de negocio diferencial real.</p>
                <p>Sin embargo, su principal riesgo no es operativo ni de producto, sino estratégico.</p>
                <p>La sostenibilidad, su principal bandera histórica, ya no es un territorio exclusivo.</p>
                <p>La marca corre el riesgo de ser percibida como correcta, pero no suficientemente aspiracional para escalar.</p>
              </div>
            </AnimatedSection>

            <AnimatedSection className="text-center" delay={0.2}>
              <p className="text-xl md:text-2xl tracking-[0.4em] uppercase text-white/40 mb-12 text-center">
                Problema Central
              </p>
              <p className="text-3xl md:text-4xl lg:text-5xl font-light leading-relaxed text-white text-center">
                Cómo proteger su valor diferencial y crecer en un mercado donde la sostenibilidad ya no basta para destacar.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* SECTION 5: DAFO */}
        <section id="dafo" className="relative min-h-screen flex flex-col items-center justify-center px-6 py-12">
          <div className="relative z-10 max-w-6xl w-full">
            <AnimatedSection className="text-center mb-12">
              <p className="text-xl md:text-2xl tracking-[0.4em] uppercase text-white/40 text-center">
                Análisis DAFO
              </p>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "Fortalezas",
                  color: "from-cyan-400 to-cyan-500",
                  items: [
                    "Proposito autentico y pionero",
                    "Modelo de upcycling real y trazable",
                    "Alta credibilidad frente al greenwashing",
                    "Producto de calidad con posicionamiento premium",
                  ],
                },
                {
                  title: "Debilidades",
                  color: "from-teal-400 to-teal-500",
                  items: [
                    "Bajo top of mind frente a grandes marcas",
                    "Precio elevado para publicos jovenes",
                    "Comunicacion excesivamente racional",
                    "Diseño percibido como poco aspiracional en algunos segmentos",
                  ],
                },
                {
                  title: "Oportunidades",
                  color: "from-emerald-400 to-emerald-500",
                  items: [
                    "Consumidor busca marcas con valores reales",
                    "Crecimiento del lifestyle consciente",
                    "Colaboraciones culturales con sentido",
                    "Canales propios para construir comunidad",
                  ],
                },
                {
                  title: "Amenazas",
                  color: "from-sky-400 to-sky-500",
                  items: [
                    "Greenwashing de grandes marcas",
                    "Commoditizacion del discurso sostenible",
                    "Marcas premium entrando en territorio eco",
                    "Consumidor infiel y sensible al precio",
                  ],
                },
              ].map((item, i) => (
                <AnimatedSection key={i} delay={0.1 * i}>
                  <GlassCard className="p-8 rounded-2xl h-full">
                    <div className={`h-1 w-16 bg-gradient-to-r ${item.color} rounded-full mb-6`} />
                    <h3 className="text-2xl font-light mb-6 text-white">{item.title}</h3>
                    <ul className="space-y-4">
                      {item.items.map((text, j) => (
                        <li key={j} className="text-white/70 flex items-start gap-3">
                          <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${item.color} mt-2 shrink-0`} />
                          {text}
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6: POSICIONAMIENTO */}
        <section id="posicionamiento" className="relative min-h-screen flex flex-col items-center justify-center px-6 py-12">
          <div className="relative z-10 max-w-6xl w-full">
            <AnimatedSection className="text-center mb-12">
              <p className="text-xl md:text-2xl tracking-[0.4em] uppercase text-white/40 text-center">
                SEGMENTACIÓN, TARGET Y POSICIONAMIENTO
              </p>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
              {/* ACTUAL */}
              <AnimatedSection delay={0.2}>
                <div className="space-y-6">
                  <h3 className="text-2xl font-light text-white/50">ACTUAL</h3>
                  <div className="p-8 rounded-2xl bg-white/5 border border-white/10 space-y-8">
                    <div className="flex flex-col gap-2">
                      <span className="text-xs uppercase tracking-[0.2em] text-white/40">Segmentación actual</span>
                      <span className="text-white/60">Adultos urbanos, concienciados, con nivel adquisitivo medio alto</span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-xs uppercase tracking-[0.2em] text-white/40">Target actual</span>
                      <span className="text-white/60">Consumidor ético racional que compra por coherencia con sus valores</span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-xs uppercase tracking-[0.2em] text-white/40">Posicionamiento actual</span>
                      <div className="text-white/60">
                        <p>Marca sostenible, responsable y de calidad</p>
                        <p className="mt-1">La sostenibilidad es el eje central del mensaje</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-4 border-t border-white/5">
                      <span className="text-xs uppercase tracking-[0.2em] text-white/40">Diagnóstico</span>
                      <span className="text-white/60 italic">Posicionamiento sólido, pero poco emocional y con limitada capacidad de atracción para nuevos públicos.</span>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* PROPUESTO */}
              <AnimatedSection delay={0.4}>
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-transparent">
                    PROPUESTO
                  </h3>
                  <GlassCard className="p-8 rounded-2xl border-cyan-500/30 space-y-8">
                    <div className="flex flex-col gap-2">
                      <span className="text-xs uppercase tracking-[0.2em] text-cyan-400/70">Nuevo target prioritario</span>
                      <div className="text-white font-medium">
                        <p className="text-lg">Urban premium conscious</p>
                        <p className="text-white/80 font-normal mt-1">Personas de entre 25 y 40 años</p>
                        <p className="text-white/80 font-normal mt-1">Valoran diseño, identidad, estatus simbólico y valores reales</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-xs uppercase tracking-[0.2em] text-cyan-400/70">Nuevo posicionamiento</span>
                      <div className="text-white font-medium">
                        <p>ECOALF como la marca premium que demuestra que el futuro ya está aquí</p>
                        <p className="text-white/80 font-normal mt-1">La sostenibilidad deja de explicarse y pasa a asumirse</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-4 border-t border-cyan-500/20">
                      <span className="text-xs uppercase tracking-[0.2em] text-cyan-400/70">Idea clave</span>
                      <span className="text-lg text-white font-semibold">Menos justificar, más inspirar.</span>
                    </div>
                  </GlassCard>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* SECTION 7: EJES ESTRATEGICOS */}
        <section id="ejes" className="relative min-h-screen flex flex-col items-center justify-center px-6 py-12">
          <div className="relative z-10 max-w-4xl w-full">
            <AnimatedSection className="text-center mb-12">
              <p className="text-xl md:text-2xl tracking-[0.4em] uppercase text-white/40 text-center mb-8">
                EJES ESTRATÉGICOS DEL MARKETING
              </p>
              <p className="text-xl md:text-2xl font-light text-white/70 max-w-4xl mx-auto leading-relaxed text-center">
                Estos ejes responden directamente al diagnóstico previo y buscan trasladar la sostenibilidad desde el discurso hacia la experiencia de marca.
              </p>
            </AnimatedSection>

            <div className="space-y-20">
              {[
                {
                  num: "01",
                  title: "Pasar de la conciencia al deseo",
                  desc: "La sostenibilidad no se comunica, se vive",
                },
                {
                  num: "02",
                  title: "De marca sostenible a simbolo cultural",
                  desc: "Representar una forma de estar en el mundo",
                },
                {
                  num: "03",
                  title: "De cliente fiel a comunidad activa",
                  desc: "Construir pertenencia mas alla de la compra",
                },
              ].map((item, i) => (
                <AnimatedSection key={i} delay={i * 0.15}>
                  <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className="text-8xl md:text-9xl font-bold bg-gradient-to-br from-cyan-400/20 to-teal-400/20 bg-clip-text text-transparent"
                    >
                      {item.num}
                    </motion.span>
                    <div className="text-center md:text-left">
                      <h3 className="text-3xl md:text-4xl font-light text-white/90">
                        {item.title}
                      </h3>
                      <p className="text-white/40 mt-3 text-lg md:text-xl font-light">{item.desc}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 8: PLAN DE ACCION */}
        <section id="plan-accion" className="relative min-h-screen flex flex-col items-center justify-center px-6 py-12">
          <div className="relative z-10 max-w-6xl w-full">
            <AnimatedSection className="text-center mb-12">
              <p className="text-xl md:text-2xl tracking-[0.4em] uppercase text-white/40 text-center">
                Plan de Acción
              </p>
              <p className="text-white/30 text-xs mt-2 text-center">Las 4P del Marketing Mix</p>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "Producto",
                  color: "from-cyan-400 to-cyan-500",
                  items: [
                    "Capsulas con diseno mas fashion forward",
                    "Colaboraciones con referentes culturales",
                    "Productos iconicos reconocibles",
                  ],
                },
                {
                  title: "Precio",
                  color: "from-teal-400 to-teal-500",
                  items: [
                    "Mantener posicionamiento premium",
                    "Productos de entrada aspiracionales",
                    "Transparencia como confianza",
                  ],
                },
                {
                  title: "Distribucion",
                  color: "from-emerald-400 to-emerald-500",
                  items: [
                    "Refuerzo del canal directo online",
                    "Tiendas como espacios de experiencia",
                    "Pop ups culturales estrategicos",
                  ],
                },
                {
                  title: "Comunicacion",
                  color: "from-sky-400 to-sky-500",
                  items: [
                    "Menos datos, mas historias humanas",
                    "Embajadores culturales con credibilidad",
                    "Contenido aspiracional con valores implicitos",
                  ],
                },
              ].map((item, i) => (
                <AnimatedSection key={i} delay={0.1 * i}>
                  <GlassCard className="p-8 rounded-2xl h-full">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`h-1 w-12 bg-gradient-to-r ${item.color} rounded-full`} />
                      <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                    </div>
                    <ul className="space-y-4">
                      {item.items.map((text, j) => (
                        <li key={j} className="text-white/70 text-sm flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/40 mt-1.5 shrink-0" />
                          {text}
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection delay={0.5} className="mt-12">
              <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center">
                <p className="text-white/90 text-sm md:text-base font-light leading-relaxed text-center">
                  La prioridad en el corto plazo debe centrarse en <span className="text-cyan-300 font-medium">comunicación</span> y <span className="text-teal-300 font-medium">producto</span>, como palancas principales de deseo
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* CAMPAIGN IMAGE */}
        <section id="campana" className="relative min-h-screen flex items-center justify-center px-6 py-24">
          <AnimatedSection className="relative z-10 max-w-6xl w-full">
            <div className="relative aspect-[3/2] md:aspect-[2/1] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src="/images/ecoalf-campaign.jpg"
                alt="Ecoalf Campaign"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </AnimatedSection>
        </section>

        {/* SECTION 9: SI YO FUERA CMO */}
        <section id="cmo" className="relative min-h-screen flex flex-col items-center justify-center px-6 py-12">
          <div className="relative z-10 max-w-4xl w-full">
            <AnimatedSection className="text-center mb-12">
              <p className="text-xl md:text-2xl tracking-[0.4em] uppercase text-white/40 text-center">
                Si yo fuera CMO de ECOALF
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <GlassCard className="p-10 md:p-16 rounded-[2.5rem] mb-12">
                <p className="text-lg md:text-xl leading-relaxed text-white/80 text-center">
                  Si asumiera hoy la dirección de marketing de ECOALF, mi prioridad no sería reforzar su discurso sostenible, sino elevar su{" "}
                  <span className="text-cyan-300">relevancia cultural</span> y su capacidad de generar{" "}
                  <span className="text-teal-300">deseo</span>, manteniendo intacta su coherencia y credibilidad.
                </p>
                <p className="text-lg md:text-xl leading-relaxed text-white mt-8 font-medium text-center">
                  La sostenibilidad debe ser el estándar silencioso.
                  <br />
                  <span className="text-2xl md:text-3xl block mt-4 bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-transparent">El deseo, la verdadera palanca de crecimiento.</span>
                </p>
              </GlassCard>
            </AnimatedSection>

            <AnimatedSection delay={0.4} className="mb-8">
              <h3 className="text-xl md:text-2xl font-light text-white/50 text-center">Tres decisiones claras</h3>
            </AnimatedSection>

            <div className="space-y-6">
              {[
                {
                  num: "1",
                  title: "Convertir el diseño en el primer driver de deseo",
                  desc: "Invertiría en cápsulas con una dirección creativa más marcada, capaces de competir visualmente con marcas premium, sin necesidad de justificar su origen sostenible en cada mensaje.",
                },
                {
                  num: "2",
                  title: "Pasar de comunicar impacto a crear símbolos culturales",
                  desc: "Apostaría por colaboraciones selectivas con referentes culturales y creativos que conviertan a ECOALF en un símbolo del consumo consciente urbano, no solo en una marca responsable.",
                },
                {
                  num: "3",
                  title: "Construir comunidad antes que volumen",
                  desc: "Priorizaría la creación de una comunidad activa y comprometida, entendiendo la fidelidad como pertenencia y no como repetición de compra.",
                },
              ].map((item, i) => (
                <AnimatedSection key={i} delay={0.3 + i * 0.1}>
                  <GlassCard className="p-6 rounded-2xl">
                    <div className="flex gap-6">
                      <span className="text-3xl font-bold text-cyan-400/50">{item.num}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                        <p className="text-white/60 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  </GlassCard>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 10: CRITERIOS DE EXITO */}
        <section id="criterios" className="relative min-h-screen flex flex-col items-center justify-center px-6 py-12">
          <div className="relative z-10 max-w-5xl w-full">
            <AnimatedSection className="text-center mb-12">
              <p className="text-xl md:text-2xl tracking-[0.4em] uppercase text-white/40 text-center">
                Criterios de Éxito
              </p>
            </AnimatedSection>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  category: "Marca",
                  items: [
                    "Incremento Top of Mind en mercados clave",
                    "Mayor reconocimiento espontáneo vs competidores",
                    "Mayor percepción aspiracional",
                    "Asociación con diseño y lifestyle"
                  ],
                },
                {
                  category: "Comunidad",
                  items: [
                    "Crecimiento engagement en canales propios",
                    "Interacción cualitativa con contenido",
                    "Más clientes recurrentes y miembros activos",
                    "Alta participación en eventos"
                  ],
                },
                {
                  category: "Negocio",
                  items: [
                    "Tráfico cualificado online",
                    "Mejor conversión en productos clave",
                    "Mayor ticket medio en colecciones clave",
                    "Mayor peso del canal directo"
                  ],
                },
              ].map((group, i) => (
                <AnimatedSection key={i} delay={0.1 * i}>
                  <GlassCard className="p-8 rounded-2xl h-full">
                    <h3 className="text-xs uppercase tracking-[0.2em] text-cyan-400/70 mb-6">
                      {group.category}
                    </h3>
                    <ul className="space-y-4">
                      {group.items.map((item, j) => (
                        <li key={j} className="text-white/70 text-sm flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/50 mt-1.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection delay={0.4} className="mt-12 grid md:grid-cols-2 gap-6">
              <GlassCard className="p-8 rounded-2xl border-teal-500/20">
                <h3 className="text-xs uppercase tracking-[0.2em] text-teal-300 mb-4">Indicador Clave Transversal</h3>
                <p className="text-white/90 font-light leading-relaxed">
                  Capacidad de la marca para generar deseo sin necesidad de justificar su sostenibilidad.
                </p>
              </GlassCard>
              <GlassCard className="p-8 rounded-2xl border-cyan-500/20">
                <h3 className="text-xs uppercase tracking-[0.2em] text-cyan-300 mb-4">Indicador Personal</h3>
                <p className="text-white/90 font-light leading-relaxed">
                  Que un consumidor recomiende ECOALF por lo que representa, no por lo que recicla.
                </p>
              </GlassCard>
            </AnimatedSection>
          </div>
        </section>

        {/* SECTION 11: CIERRE */}
        <section id="cierre" className="relative min-h-screen flex flex-col items-center justify-center px-6 py-12">
          <AnimatedSection className="relative z-10 max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="space-y-12 mb-16"
            >
              <p className="text-2xl md:text-3xl lg:text-4xl font-extralight leading-tight text-white/90">
                ECOALF no necesita ser más sostenible.
                <br />
                <span className="font-normal text-white">Necesita ser más deseada sin perder su verdad.</span>
              </p>

              <div className="space-y-4 text-2xl md:text-3xl lg:text-4xl text-white/60 font-extralight">
                <p>Convertir la sostenibilidad en el estándar silencioso</p>
                <p>Construir una marca premium aspiracional con impacto real</p>
              </div>

              <p className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tight pt-8 bg-gradient-to-r from-cyan-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                El futuro no se explica.
                <br />
                Se viste.
              </p>

              <div className="relative w-full max-w-2xl aspect-[16/9] mx-auto mt-12"
                style={{ maskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)', WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)' }}>
                <Image
                  src="/images/ecoalf-footer-final-hq.png"
                  alt="ECOALF"
                  fill
                  className="object-cover"
                />
              </div>


            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-white/40 text-sm"
            >
              <p>Karen Luciana Bordagorry Fernandez</p>
              <p className="mt-1">Febrero 2026</p>
            </motion.div>

            {/* Botón volver al inicio */}
            <ScrollToTop />
          </AnimatedSection>
        </section>
      </main>
    </>
  )
}
