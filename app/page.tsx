"use client";

import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import {
  Play,
  Film,
  Mail,
  ArrowRight,
  Monitor,
  Zap,
  Star,
  Instagram,
  Twitter,
  Youtube,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ---------------------------------------------------------------------------
// Static data — defined once outside render cycle
// ---------------------------------------------------------------------------

const FEATURES = [
  {
    icon: <Zap className="text-[#FFE600]" />,
    title: "Viral Pacing",
    desc: "Retention-optimized editing designed to hold viewer attention from frame one.",
  },
  {
    icon: <Star className="text-[#FFE600]" />,
    title: "Premium Color",
    desc: "Professional grade grading that gives your content a high-budget cinematic feel.",
  },
  {
    icon: <Monitor className="text-[#FFE600]" />,
    title: "Multi-Format",
    desc: "Master files delivered for 9:16, 16:9, and 1:1 layouts simultaneously.",
  },
];

const TESTIMONIALS = [
  { name: "Alex Carter",      role: "YouTube Creator",      img: "/client1.jpeg", message: "Umair completely transformed my content. The pacing and storytelling dramatically improved my audience retention." },
  { name: "Samantha Lee",     role: "Brand Manager",        img: "/client2.jpeg", message: "Extremely professional editing. The videos look cinematic and polished." },
  { name: "Lily Brooks",      role: "Tech Influencer",      img: "/client3.jpeg", message: "My engagement improved immediately. The editing style is modern and high quality." },
  { name: "Michael Torres",   role: "Startup Founder",      img: "/client4.jpeg", message: "Outstanding pacing and storytelling. Every edit feels intentional." },
  { name: "Jessica Wong",     role: "Content Strategist",  img: "/client5.jpeg", message: "Very clean editing and fast delivery. Highly recommended." },
  { name: "Ryan Patel",       role: "Marketing Consultant", img: "/client6.jpeg", message: "Our marketing videos looked premium after editing. Great work." },
];

const PROJECTS = [
  { title: "YouTube Style Videos",  category: "Gaming",     img: "/cyberpunk.png" },
  { title: "Tutorial Video",        category: "Cinematic",  img: "/urban.png" },
  { title: "PR/UGC Videos",         category: "Commercial", img: "/streetwear.png" },
  { title: "Facecam Videos",        category: "Music",      img: "/nightfall.png" },
  { title: "Product Videos",        category: "Commercial", img: "/tech.png" },
  { title: "Screencasting Videos",  category: "Cinematic",  img: "/tokyo.png" },
];

const CATEGORIES = ['All', 'Gaming', 'Cinematic', 'Commercial', 'Music'] as const;

const REEL_IDS = ["Ip3e1GCM_Bw", "h6NrKx1hw4c", "EkdhwuqC2QU"];

const BUDGET_OPTIONS = ["$500 - $1,500", "$1,500 - $5,000", "$5,000+"];

// ---------------------------------------------------------------------------
// Utility: detect touch/mobile once
// ---------------------------------------------------------------------------
const isMobileOrTouch = (): boolean =>
  typeof window !== 'undefined' &&
  (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768);

// ---------------------------------------------------------------------------
// BackgroundFlow
// ---------------------------------------------------------------------------
const BackgroundFlow = memo(() => (
  <div className="fixed inset-0 z-[-5] pointer-events-none overflow-hidden hidden md:block">
    <svg
      className="w-full h-full"
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="lineGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#FFE600" />
        </marker>
      </defs>

      {[...Array(8)].map((_, i) => (
        <motion.path
          key={i}
          d={`M ${-100 + i * 200} ${900} C ${400 + i * 100} ${600}, ${800 - i * 100} ${300}, ${1700} ${100 + i * 50}`}
          fill="transparent"
          stroke="#FFE600"
          strokeWidth="2"
          strokeDasharray="10 20"
          filter="url(#lineGlow)"
          markerEnd={i % 2 === 0 ? "url(#arrowhead)" : ""}
          initial={{ pathLength: 0, pathOffset: 0, opacity: 0 }}
          animate={{ pathLength: 1, pathOffset: [0, 1], opacity: [0, 0.4, 0.4, 0] }}
          transition={{ duration: 15 + i * 2, repeat: Infinity, ease: "linear", delay: i * 2 }}
        />
      ))}
    </svg>
  </div>
));
BackgroundFlow.displayName = 'BackgroundFlow';

// ---------------------------------------------------------------------------
// ReelHolder
// ---------------------------------------------------------------------------
const ReelHolder = memo(({ videoId }: { videoId: string }) => (
  <motion.div
    whileHover={{ y: -12, scale: 1.02 }}
    className="relative group aspect-[9/16] w-full max-w-[300px] mx-auto rounded-[2.5rem] overflow-hidden border border-[#FFE600]/30 shadow-[0_0_20px_rgba(255,230,0,0.15)] hover:shadow-[0_0_40px_rgba(255,230,0,0.4)] hover:border-[#FFE600] transition-all duration-700 bg-[#050505]"
  >
    <iframe
      className="w-full h-full object-cover pointer-events-auto"
      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&playsinline=1`}
      title="YouTube Shorts Player"
      allow="autoplay; encrypted-media; picture-in-picture"
      allowFullScreen
      frameBorder="0"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none" />
    <div className="absolute inset-0 rounded-[2.5rem] border border-white/5 pointer-events-none" />
  </motion.div>
));
ReelHolder.displayName = 'ReelHolder';

// ---------------------------------------------------------------------------
// MouseTrail
// ---------------------------------------------------------------------------
const MouseTrail = memo(() => {
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setTrail(prev => {
      const next = prev.length >= 12 ? prev.slice(1) : prev;
      return [...next, { x: e.clientX, y: e.clientY, id: Math.random() }];
    });
  }, []);

  useEffect(() => {
    if (isMobileOrTouch()) return;
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] hidden md:block">
      <AnimatePresence>
        {trail.map(point => (
          <motion.div
            key={point.id}
            initial={{ opacity: 0.4, scale: 1 }}
            animate={{ opacity: 0, scale: 0.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'absolute',
              left: point.x,
              top: point.y,
              width: '10px',
              height: '10px',
              backgroundColor: '#FFE600',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              filter: 'blur(4px)',
              boxShadow: '0 0 12px #FFE600',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
});
MouseTrail.displayName = 'MouseTrail';

// ---------------------------------------------------------------------------
// GlassCard
// ---------------------------------------------------------------------------
const GlassCard = memo(({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl ${className}`}>
    {children}
  </div>
));
GlassCard.displayName = 'GlassCard';

// ---------------------------------------------------------------------------
// SectionHeading
// ---------------------------------------------------------------------------
const SectionHeading = memo(({ subtitle, title }: { subtitle: string; title: string }) => (
  <div className="mb-12">
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="text-[#FFE600] font-bold text-sm tracking-widest uppercase"
    >
      {subtitle}
    </motion.span>
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="text-4xl md:text-5xl font-black mt-2 tracking-tighter text-white"
    >
      {title}
    </motion.h2>
  </div>
));
SectionHeading.displayName = 'SectionHeading';

// ---------------------------------------------------------------------------
// AnimatedLogo
// ---------------------------------------------------------------------------
const AnimatedLogo = memo(() => {
  const [isFull, setIsFull] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setIsFull(prev => !prev), 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-14 overflow-hidden flex items-center px-6">
      <AnimatePresence mode="wait">
        {isFull ? (
          <motion.div
            key="full"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
            className="text-2xl md:text-3xl font-black tracking-tighter uppercase italic text-white pr-4"
          >
            umair<span className="text-[#FFE600]">_vision</span>
          </motion.div>
        ) : (
          <motion.div
            key="short"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
            className="text-2xl md:text-3xl font-black tracking-tighter uppercase italic text-[#FFE600] pr-4"
          >
            vision
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
AnimatedLogo.displayName = 'AnimatedLogo';

// ---------------------------------------------------------------------------
// TestimonialsSection
// ---------------------------------------------------------------------------
const TestimonialsSection = memo(() => (
  <div className="mb-32">
    <SectionHeading subtitle="Client Feedback" title="What Clients Say" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {TESTIMONIALS.map((t, i) => (
        <GlassCard key={i} className="p-6 hover:border-[#FFE600]/40 transition-all group">
          <div className="flex items-center gap-4 mb-4">
            <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full object-cover border border-[#FFE600]" />
            <div>
              <h4 className="font-bold text-white text-sm">{t.name}</h4>
              <p className="text-xs text-gray-400">{t.role}</p>
            </div>
          </div>
          <div className="flex gap-1 mb-3">
            {[...Array(5)].map((_, idx) => (
              <Star key={idx} size={16} className="text-[#FFE600]" fill="#FFE600" />
            ))}
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">{t.message}</p>
        </GlassCard>
      ))}
    </div>
  </div>
));
TestimonialsSection.displayName = 'TestimonialsSection';

// ---------------------------------------------------------------------------
// GlowSocialHub Component (With Enhanced Box Sizes & High-Energy Hover Effects)
// ---------------------------------------------------------------------------
const GlowSocialHub = memo(() => (
  <div className="w-full max-w-5xl mx-auto mt-20 text-center space-y-8">
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[11px] font-black tracking-widest uppercase text-gray-400">
      Instant Dynamic Channels
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left px-4">
      
      {/* 1. WHATSAPP BOX - PROMINENT SIZE & SPRING ANIMATED */}
      <motion.a 
        href="https://wa.me/923191386775?text=Hi%20Umair,%20I%20want%20to%20collaborate%20on%20a%20video%20project!"
        target="_blank" 
        rel="noopener noreferrer"
        whileHover={{ scale: 1.07, y: -8 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className="relative block rounded-3xl p-[3px] overflow-hidden group transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.5)] cursor-pointer"
      >
        {/* Dynamic Multi-layered High Intensity Light Aura */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500 opacity-40 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-[#00FF66] to-emerald-400 animate-[spin_4s_linear_infinite] opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Enhanced Inside Card Content Container */}
        <div className="relative bg-[#070707] rounded-[21px] p-8 md:p-10 h-full flex flex-col justify-between border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)] group-hover:shadow-[0_0_50px_rgba(16,185,129,0.6)] group-hover:bg-[#0c0c0c] transition-all duration-300">
          <div>
            <div className="flex items-center gap-4 mb-5">
              {/* Oversized WhatsApp SVG Icon Block */}
              <div className="p-3.5 bg-emerald-500/20 rounded-2xl text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.4)] group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-300 flex items-center justify-center">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.454 5.709 1.455h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <span className="text-[11px] font-black tracking-widest text-emerald-400 uppercase bg-emerald-500/5 px-2.5 py-1 rounded-md border border-emerald-500/10">Live Chatroom</span>
            </div>
            
            <h4 className="font-black text-white text-2xl md:text-3xl tracking-tight transition-colors group-hover:text-emerald-300">WhatsApp Messenger</h4>
            <p className="text-sm text-gray-400 mt-3.5 leading-relaxed font-light">
              Instantly connect to align fast-paced workflows, review post-production metrics, or secure ongoing creative production retainers directly.
            </p>
          </div>
          
          <div className="mt-8 pt-5 border-t border-white/10 flex items-center justify-between text-xs font-black text-emerald-400 group-hover:text-emerald-300 uppercase tracking-widest">
            <span>Ping Creator Now</span>
            <motion.div variants={{ hover: { x: 5 } }} className="transform transition-transform group-hover:translate-x-2">
              <ArrowRight size={16} />
            </motion.div>
          </div>
        </div>
      </motion.a>

      {/* 2. INSTAGRAM BOX - PROMINENT SIZE & SPRING ANIMATED */}
      <motion.a 
        href="https://instagram.com/umair_vision" 
        target="_blank" 
        rel="noopener noreferrer"
        whileHover={{ scale: 1.07, y: -8 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className="relative block rounded-3xl p-[3px] overflow-hidden group transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.5)] cursor-pointer"
      >
        {/* Dynamic Multi-layered High Intensity Light Aura */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-[#FFE600] to-yellow-300 opacity-40 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFE600] via-yellow-500 to-[#FFFFFF] animate-[spin_4s_linear_infinite] opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Enhanced Inside Card Content Container */}
        <div className="relative bg-[#070707] rounded-[21px] p-8 md:p-10 h-full flex flex-col justify-between border border-[#FFE600]/30 shadow-[0_0_20px_rgba(255,230,0,0.15)] group-hover:shadow-[0_0_50px_rgba(255,230,0,0.6)] group-hover:bg-[#0c0c0c] transition-all duration-300">
          <div>
            <div className="flex items-center gap-4 mb-5">
              {/* Oversized Instagram Component Block */}
              <div className="p-3.5 bg-[#FFE600]/20 rounded-2xl text-[#FFE600] border border-[#FFE600]/30 shadow-[0_0_15px_rgba(255,230,0,0.4)] group-hover:scale-110 group-hover:bg-[#FFE600] group-hover:text-black transition-all duration-300 flex items-center justify-center">
                <Instagram size={28} />
              </div>
              <span className="text-[11px] font-black tracking-widest text-[#FFE600] uppercase bg-[#FFE600]/5 px-2.5 py-1 rounded-md border border-[#FFE600]/10">Creative Network</span>
            </div>
            
            <h4 className="font-black text-white text-2xl md:text-3xl tracking-tight transition-colors group-hover:text-yellow-200">@umair_vision</h4>
            <p className="text-sm text-gray-400 mt-3.5 leading-relaxed font-light">
              Explore immediate high-fidelity concept drops, motion graphics framework break-downs, and regular short-form design strategies.
            </p>
          </div>
          
          <div className="mt-8 pt-5 border-t border-white/10 flex items-center justify-between text-xs font-black text-[#FFE600] group-hover:text-yellow-200 uppercase tracking-widest">
            <span>View Network Portfolio</span>
            <motion.div className="transform transition-transform group-hover:translate-x-2">
              <ArrowRight size={16} />
            </motion.div>
          </div>
        </div>
      </motion.a>

    </div>
  </div>
));
GlowSocialHub.displayName = 'GlowSocialHub';

// ---------------------------------------------------------------------------
// HomePage
// ---------------------------------------------------------------------------
const HomePage = memo(({ setPage }: { setPage: (p: string) => void }) => {
  const goProjects = useCallback(() => setPage('projects'), [setPage]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-32 pb-20 px-6 max-w-7xl mx-auto"
    >
      {/* Hero */}
      <div className="text-center mb-32">
        <div className="relative w-40 h-40 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full bg-yellow-400 blur-2xl opacity-40 animate-pulse hidden md:block" />
          <img src="/profile.png" alt="Profile" className="relative w-40 h-40 object-cover rounded-full border-4 border-yellow-400" />
        </div>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FFE600]/20 bg-[#FFE600]/5 text-xs text-[#FFE600] mb-8 backdrop-blur-sm"
        >
          <span className="w-2 h-2 bg-[#FFE600] rounded-full animate-pulse" />
          PREMIUM VIDEO SOLUTIONS
        </motion.div>
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-5xl md:text-9xl font-black mb-6 tracking-tight leading-[0.9] text-white"
        >
          High-Value <br />
          <span className="bg-gradient-to-r from-[#FFE600] via-[#FFD700] to-[#FFFFFF] bg-clip-text text-transparent italic">Content.</span>
        </motion.h1>
        <motion.p className="text-gray-400 text-base md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Visual storytelling that drives massive engagement. Optimized for the modern digital landscape by{' '}
          <span className="text-[#FFE600] font-bold underline decoration-2 underline-offset-4">umair_vision</span>.
        </motion.p>
        
        {/* Call To Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="flex items-center justify-center gap-2 bg-[#FFE600] text-black px-10 py-5 rounded-full font-black transition-all hover:scale-105 shadow-[0_0_30px_rgba(255,230,0,0.3)]">
            Watch Showreel <Play size={18} fill="black" />
          </button>
          <button
            onClick={goProjects}
            className="flex items-center justify-center gap-2 backdrop-blur-md bg-white/5 border border-white/10 hover:bg-[#FFE600]/10 hover:border-[#FFE600]/30 px-10 py-5 rounded-full font-bold transition-all hover:scale-105 text-white"
          >
            Samples <Film size={18} />
          </button>
        </div>

        {/* Global Glowing Dynamic Contact Grid Container */}
        <GlowSocialHub />
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
        {FEATURES.map((feature, i) => (
          <GlassCard key={i} className="p-8 group hover:border-[#FFE600]/40 transition-colors">
            <div className="mb-4 p-3 bg-[#FFE600]/10 w-fit rounded-xl group-hover:scale-110 transition-transform">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold mb-2 uppercase tracking-tighter text-white">{feature.title}</h3>
            <p className="text-gray-400 leading-relaxed text-sm">{feature.desc}</p>
          </GlassCard>
        ))}
      </div>

      {/* Reels */}
      <div className="mb-32">
        <SectionHeading subtitle="Motion Gallery" title="Viral 9:16 Reels" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {REEL_IDS.map(id => <ReelHolder key={id} videoId={id} />)}
        </div>
      </div>

      <TestimonialsSection />
    </motion.div>
  );
});
HomePage.displayName = 'HomePage';

// ---------------------------------------------------------------------------
// ProjectsPage
// ---------------------------------------------------------------------------
const ProjectsPage = memo(() => {
  const [filter, setFilter] = useState<typeof CATEGORIES[number]>('All');

  const filteredProjects = useMemo(
    () => filter === 'All' ? PROJECTS : PROJECTS.filter(p => p.category === filter),
    [filter]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-32 pb-20 px-6 max-w-7xl mx-auto"
    >
      <SectionHeading subtitle="Success Stories" title="Project Archive" />
      <div className="flex flex-wrap gap-4 mb-12">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-6 py-2 rounded-full border transition-all text-xs font-bold tracking-widest uppercase ${
              filter === cat
                ? 'bg-[#FFE600] text-black border-[#FFE600]'
                : 'bg-transparent border-white/10 text-gray-400 hover:border-[#FFE600]/50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-white">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map(project => (
            <motion.div
              layout
              key={project.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group relative overflow-hidden rounded-3xl border border-white/5 hover:border-[#FFE600]/30 transition-colors"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={project.img}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#FFE600]/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                <span className="text-[10px] font-black tracking-widest uppercase bg-white text-black px-2 py-0.5 rounded w-fit mb-2">
                  {project.category}
                </span>
                <h3 className="text-xl font-black text-white leading-tight tracking-tighter">{project.title}</h3>
                <button className="mt-4 flex items-center gap-2 text-xs font-black text-white uppercase tracking-widest">
                  View Case Study <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});
ProjectsPage.displayName = 'ProjectsPage';

// ---------------------------------------------------------------------------
// ContactPage
// ---------------------------------------------------------------------------
const ContactPage = memo(() => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-white"
  >
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
      <div>
        <SectionHeading subtitle="Invest in Vision" title="Scale your brand today." />
        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
          High-performance editing is an investment, not an expense. Let's discuss how we can skyrocket your retention and brand value.
        </p>
        <div className="space-y-6">
          {[
            { Icon: Mail,      label: "Email",     value: "umairapcoms@gmail.com", href: "mailto:umairapcoms@gmail.com" },
            { Icon: Instagram, label: "Instagram", value: "@umair_vision", href: "https://instagram.com/umair_vision" },
          ].map(({ Icon, label, value, href }) => (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer" 
              key={label} 
              className="flex items-center gap-4 group cursor-pointer w-fit"
            >
              <div className="w-12 h-12 rounded-full bg-[#FFE600]/10 flex items-center justify-center border border-[#FFE600]/20 group-hover:border-[#FFE600] transition-colors">
                <Icon className="text-[#FFE600]" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-lg font-bold group-hover:text-[#FFE600] transition-colors">{value}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      <GlassCard className="p-8 md:p-12 border-[#FFE600]/10">
        <form className="space-y-6" onSubmit={e => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { id: "name",  label: "Client Name",    type: "text",  placeholder: "Enter name" },
              { id: "email", label: "Email Address",  type: "email", placeholder: "Enter email" },
            ].map(({ id, label, type, placeholder }) => (
              <div key={id} className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[#FFE600]">{label}</label>
                <input
                  type={type}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#FFE600] outline-none transition-all text-white"
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-[#FFE600]">Budget Range</label>
            <select className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-[#FFE600] outline-none transition-all text-white">
              {BUDGET_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-[#FFE600]">Project Details</label>
            <textarea
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 h-32 focus:border-[#FFE600] outline-none transition-all resize-none text-white"
              placeholder="Briefly describe your goals..."
            />
          </div>
          <button className="w-full bg-[#FFE600] text-black hover:bg-[#FFD700] py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-[0_10px_40px_rgba(255,230,0,0.15)]">
            Initiate Project
          </button>
        </form>
      </GlassCard>
    </div>
  </motion.div>
));
ContactPage.displayName = 'ContactPage';

// ---------------------------------------------------------------------------
// Root App Entry Point
// ---------------------------------------------------------------------------
export default function App() {
  const [page, setPage] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigate = useCallback((p: string) => {
    setPage(p);
    setIsMobileMenuOpen(false);
  }, []);

  const renderedPage = useMemo(() => {
    switch (page) {
      case 'home':     return <HomePage setPage={navigate} />;
      case 'projects': return <ProjectsPage />;
      case 'contact':  return <ContactPage />;
      default:         return <HomePage setPage={navigate} />;
    }
  }, [page, navigate]);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#FFE600] selection:text-black overflow-x-hidden">
      <MouseTrail />
      <BackgroundFlow />

      {/* Ambient background blur elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none hidden md:block">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#FFE600]/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#FFD700]/5 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navigation Layer */}
      <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'py-4' : 'py-8'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className={`backdrop-blur-xl transition-all duration-500 ${scrolled ? 'bg-white/5 border border-white/10 px-8 py-3 rounded-full' : 'bg-transparent px-0 py-0'} flex justify-between items-center`}>
            <button onClick={() => navigate('home')} className="group flex items-center">
              <AnimatedLogo />
            </button>

            {/* Viewports Desktop Nav links */}
            <div className="hidden md:flex gap-10 text-sm font-black tracking-[0.15em] uppercase text-gray-400">
              {(['home', 'projects', 'contact'] as const).map(p => {
                const labels: Record<string, string> = { home: 'Home', projects: 'Portfolio', contact: 'Consult' };
                return (
                  <button
                    key={p}
                    onClick={() => navigate(p)}
                    className={`hover:text-[#FFE600] transition-colors ${page === p ? 'text-[#FFE600]' : ''}`}
                  >
                    {labels[p]}
                  </button>
                );
              })}
            </div>

            <div className="hidden md:block">
              <button
                onClick={() => navigate('contact')}
                className="bg-white text-black px-6 py-2 rounded-full text-[10px] font-black tracking-widest uppercase hover:bg-[#FFE600] transition-all transform hover:scale-105 active:scale-95"
              >
                Inquire
              </button>
            </div>

            <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(o => !o)}>
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="fixed inset-0 z-[90] bg-[#050505] pt-32 px-10 border-l border-[#FFE600]/20"
          >
            <div className="flex flex-col gap-10 text-4xl font-black italic tracking-tighter text-white">
              {(['home', 'projects', 'contact'] as const).map(p => {
                const labels: Record<string, string> = { home: 'Home', projects: 'Portfolio', contact: 'Consult' };
                return (
                  <button key={p} className="text-left" onClick={() => navigate(p)}>
                    {labels[p]}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Application Lifecycle Content */}
      <main>
        <AnimatePresence mode="wait">{renderedPage}</AnimatePresence>
      </main>

      {/* Global Footer */}
      <footer className="py-20 px-6 border-t border-white/5 bg-black/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div>
            <h2 className="text-3xl font-black tracking-tighter uppercase italic mb-2 text-white">
              umair<span className="text-[#FFE600]">_vision</span>
            </h2>
            <p className="text-gray-500 text-[10px] tracking-widest uppercase">
              © 2026 Umair Vision Media. Building value through motion.
            </p>
          </div>
          <div className="flex gap-4 text-white">
            {[Instagram, Twitter, Youtube].map((Icon, i) => {
              const links = ["https://instagram.com/umair_vision", "#", "#"];
              return (
                <a 
                  key={i} 
                  href={links[i]} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:border-[#FFE600] transition-all"
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>
        </div>
      </footer>
    </div>
  );
}