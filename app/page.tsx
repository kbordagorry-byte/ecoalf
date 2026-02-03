"use client"

import React from "react"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { ChevronDown } from "lucide-react"

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

export default function EcoalfPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const productRef = useRef<HTMLDivElement>(null)

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
    <main
      ref={containerRef}
      className="relative bg-[#051c24] text-white overflow-x-hidden"
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
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
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
            className="text-sm tracking-[0.3em] uppercase text-white/50 mb-8"
          >
            Propuesta estrategica de marketing
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mb-8 flex justify-center"
          >
            <div className="relative w-[300px] md:w-[500px] lg:w-[700px] aspect-[4/1]">
              <Image
                src="/images/ecoalf-logo-processed.png"
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
            className="text-2xl md:text-3xl lg:text-4xl font-light text-white/70"
          >
            De marca sostenible
            <br />
            <span className="font-medium text-white/90">a marca deseada</span>
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
      <section className="relative min-h-screen flex items-center justify-center px-6 py-24">
        <AnimatedSection className="relative z-10 max-w-4xl">
          <GlassCard className="p-12 md:p-16 rounded-3xl">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="text-xl md:text-2xl lg:text-3xl font-light leading-relaxed text-white/80"
            >
              <span className="block mb-8">
                Este analisis parte de una conviccion personal: en un mercado saturado de mensajes eticos, las marcas no compiten por quien es mas responsable, sino por quien consigue ser{" "}
                <span className="text-cyan-300 font-medium">culturalmente relevante</span>{" "}
                sin perder coherencia.
              </span>
              <span className="block text-xl md:text-2xl lg:text-3xl font-light leading-relaxed text-white/80">
                Este trabajo no busca describir la marca, sino tomar decisiones. He evitado deliberadamente caer en más datos de sostenibilidad, porque ese no es el problema de ECOALF hoy.
              </span>
            </motion.p>
          </GlassCard>
        </AnimatedSection>
      </section>

      {/* SECTION 3: CONTEXTO DE MERCADO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24">
        <div className="relative z-10 max-w-5xl w-full space-y-16">
          <AnimatedSection className="text-center">
            <p className="text-sm tracking-[0.3em] uppercase text-white/40 mb-8">
              Contexto del mercado
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <p className="text-3xl md:text-5xl lg:text-6xl font-light text-center leading-tight">
              Hoy no gana la marca mas sostenible,
              <br />
              <span className="font-semibold bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-transparent">
                sino la mas deseada
              </span>
              <br />
              <span className="text-white/70">que ademas es sostenible.</span>
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
            <p className="text-xl md:text-2xl font-light leading-relaxed text-white/90 max-w-4xl mx-auto">
              Este contexto obliga a ECOALF a competir no solo por valores, sino por <span className="font-medium text-cyan-300">relevancia cultural</span> y <span className="font-medium text-teal-300">deseo de marca</span>
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* SECTION: PRODUCTO ECOALF */}
      <section
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
            <div className="relative w-[200px] md:w-[300px] lg:w-[400px] aspect-[4/1] mx-auto mb-4">
              <Image
                src="/images/ecoalf-logo-processed.png"
                alt="ECOALF"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-white/60 text-lg md:text-xl lg:text-2xl tracking-[0.4em] mt-2">
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
      <section className="relative min-h-screen flex items-center justify-center px-6 py-24">
        <div className="relative z-10 max-w-5xl w-full space-y-24">
          <AnimatedSection className="text-center">
            <p className="text-sm tracking-[0.3em] uppercase text-white/40 mb-8">
              Problema Estrategico
            </p>
            <div className="max-w-4xl mx-auto space-y-6 text-xl md:text-2xl font-light leading-relaxed text-white/80">
              <p>ECOALF es una marca coherente, creíble y con un modelo de negocio diferencial real.</p>
              <p>Sin embargo, su principal riesgo no es operativo ni de producto, sino estratégico.</p>
              <p>La sostenibilidad, su principal bandera histórica, ya no es un territorio exclusivo.</p>
              <p>La marca corre el riesgo de ser percibida como correcta, pero no suficientemente aspiracional para escalar.</p>
            </div>
          </AnimatedSection>

          <AnimatedSection className="text-center" delay={0.2}>
            <p className="text-sm tracking-[0.3em] uppercase text-white/40 mb-8">
              Problema Central
            </p>
            <p className="text-2xl md:text-4xl lg:text-5xl font-light leading-relaxed text-white">
              Cómo proteger su valor diferencial y crecer en un mercado donde la sostenibilidad ya no basta para destacar.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* SECTION 5: DAFO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24">
        <div className="relative z-10 max-w-6xl w-full">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-sm tracking-[0.3em] uppercase text-white/40">
              Analisis DAFO
            </h2>
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
                color: "from-rose-400 to-rose-500",
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
                ],
              },
              {
                title: "Amenazas",
                color: "from-amber-400 to-amber-500",
                items: [
                  "Greenwashing de grandes marcas",
                  "Commoditizacion del discurso sostenible",
                  "Marcas premium entrando en territorio eco",
                ],
              },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={0.1 * i}>
                <GlassCard className="p-8 rounded-2xl h-full">
                  <div className={`h-1 w-16 bg-gradient-to-r ${item.color} rounded-full mb-6`} />
                  <h3 className="text-xl font-semibold mb-6 text-white">{item.title}</h3>
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
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24">
        <div className="relative z-10 max-w-6xl w-full">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-sm tracking-[0.3em] uppercase text-white/40">
              Posicionamiento
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* ANTES */}
            <AnimatedSection delay={0.2}>
              <div className="space-y-6">
                <h3 className="text-2xl font-light text-white/50">Antes</h3>
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
                  {[
                    { label: "Target", value: "Consumidor etico racional" },
                    { label: "Mensaje", value: "Marca sostenible, responsable y de calidad" },
                    { label: "Eje", value: "La sostenibilidad como centro" },
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col gap-2 mb-6 last:mb-0">
                      <span className="text-xs uppercase tracking-[0.2em] text-white/40">
                        {item.label}
                      </span>
                      <span className="text-white/60">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* Arrow */}
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <motion.div
                animate={{ x: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center"
              >
                <svg className="w-5 h-5 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </motion.div>
            </div>

            {/* DESPUES */}
            <AnimatedSection delay={0.4}>
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-transparent">
                  Despues
                </h3>
                <GlassCard className="p-8 rounded-2xl border-cyan-500/30">
                  {[
                    { label: "Target", value: "Urban premium conscious (25-40 anos)" },
                    { label: "Mensaje", value: "La marca premium que demuestra que el futuro ya esta aqui" },
                    { label: "Eje", value: "Menos justificar, mas inspirar" },
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col gap-2 mb-6 last:mb-0">
                      <span className="text-xs uppercase tracking-[0.2em] text-cyan-400/70">
                        {item.label}
                      </span>
                      <span className="text-white font-medium">{item.value}</span>
                    </div>
                  ))}
                </GlassCard>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* SECTION 7: EJES ESTRATEGICOS */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24">
        <div className="relative z-10 max-w-4xl w-full">
          <AnimatedSection className="text-center mb-20">
            <h2 className="text-sm tracking-[0.3em] uppercase text-white/40">
              Ejes Estrategicos
            </h2>
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
                    className="text-7xl md:text-8xl font-bold bg-gradient-to-br from-cyan-400/30 to-teal-400/30 bg-clip-text text-transparent"
                  >
                    {item.num}
                  </motion.span>
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl md:text-3xl font-light text-white/90">
                      {item.title}
                    </h3>
                    <p className="text-white/50 mt-3 text-lg">{item.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8: PLAN DE ACCION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24">
        <div className="relative z-10 max-w-6xl w-full">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-sm tracking-[0.3em] uppercase text-white/40">
              Plan de Accion
            </h2>
            <p className="text-white/30 text-sm mt-2">Las 4P del Marketing Mix</p>
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
              <p className="text-white/70 text-sm">
                Prioridad en el corto plazo:{" "}
                <span className="text-cyan-300 font-medium">comunicacion</span> y{" "}
                <span className="text-teal-300 font-medium">producto</span> como palancas de deseo
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* SECTION 9: SI YO FUERA CMO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24">
        <div className="relative z-10 max-w-4xl w-full">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-sm tracking-[0.3em] uppercase text-white/40">
              Si yo fuera CMO de ECOALF
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <GlassCard className="p-10 md:p-12 rounded-3xl mb-12">
              <p className="text-lg md:text-xl leading-relaxed text-white/80">
                Mi prioridad no seria reforzar su discurso sostenible, sino elevar su{" "}
                <span className="text-cyan-300">relevancia cultural</span> y su capacidad de generar{" "}
                <span className="text-teal-300">deseo</span>, manteniendo intacta su coherencia y credibilidad.
              </p>
            </GlassCard>
          </AnimatedSection>

          <div className="space-y-6">
            {[
              {
                num: "1",
                title: "Redefinir la comunicacion",
                desc: "Menos pedagogia, mas aspiracion; menos justificar, mas inspirar",
              },
              {
                num: "2",
                title: "Elevar la marca a territorio cultural",
                desc: "Alianzas con creadores, artistas y proyectos que representen ese futuro que ECOALF encarna",
              },
              {
                num: "3",
                title: "Activar la comunidad",
                desc: "Convertir clientes en embajadores reales, co-creando contenido y experiencias",
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
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24">
        <div className="relative z-10 max-w-5xl w-full">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-sm tracking-[0.3em] uppercase text-white/40">
              Criterios de Exito
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                category: "Percepcion",
                items: ["Incremento en brand desire", "Mayor asociacion con innovacion", "Reduccion de percepcion de precio alto"],
              },
              {
                category: "Engagement",
                items: ["Crecimiento de comunidad activa", "Mayor interaccion con contenido", "Aumento de UGC"],
              },
              {
                category: "Negocio",
                items: ["Incremento de ventas directas", "Mayor recurrencia de compra", "Expansion de audiencia"],
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
        </div>
      </section>

      {/* SECTION 11: CIERRE */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24">
        <AnimatedSection className="relative z-10 max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-3xl md:text-5xl lg:text-6xl font-light leading-tight mb-16"
          >
            El reto de ECOALF no es demostrar que es sostenible.
            <br />
            <span className="font-semibold bg-gradient-to-r from-cyan-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
              Es demostrar que el futuro ya esta aqui
            </span>
            <br />
            <span className="text-white/60">y que ellos lo estan construyendo.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-white/40 text-sm"
          >
            <p>Karen Luciana Bordagorry Fernandez</p>
            <p className="mt-1">Febrero 2026</p>
          </motion.div>
        </AnimatedSection>
      </section>
    </main>
  )
}
