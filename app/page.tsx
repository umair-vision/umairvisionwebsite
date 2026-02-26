"use client";

import React, { useState, useEffect, useCallback } from 'react';
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

// --- New Feature: Mouse Trail Component ---

const MouseTrail = () => {
  const [trail, setTrail] = useState<{ x: number, y: number, id: number }[]>([]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const newPoint = { x: e.clientX, y: e.clientY, id: Date.now() };
    setTrail((prev) => [...prev.slice(-15), newPoint]); // Keeps the last 15 points for the trail
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <AnimatePresence>
        {trail.map((point, i) => (
          <motion.div
            key={point.id}
            initial={{ opacity: 0.4, scale: 1 }}
            animate={{ opacity: 0, scale: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              position: 'absolute',
              left: point.x,
              top: point.y,
              width: '8px',
              height: '8px',
              backgroundColor: '#FFE600',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              filter: 'blur(4px)',
              boxShadow: '0 0 10px #FFE600'
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// --- Components ---

const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl ${className}`}>
    {children}
  </div>
);

const SectionHeading = ({ subtitle, title }: { subtitle: string, title: string }) => (
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
);

const AnimatedLogo = () => {
  const [isFull, setIsFull] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFull(prev => !prev);
    }, 3000);
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
};

// --- Pages ---

const HomePage = ({ setPage }: { setPage: (p: string) => void }) => (
  <motion.div 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    exit={{ opacity: 0 }}
    className="pt-32 pb-20 px-6 max-w-7xl mx-auto"
  >
    <div className="text-center mb-32">
    <div className="relative w-40 h-40 mx-auto mb-8">
  <div className="absolute inset-0 rounded-full bg-yellow-400 blur-2xl opacity-40"></div>
  <img
    src="/profile.png"
    alt="Profile"
    className="relative w-40 h-40 object-cover rounded-full border-4 border-yellow-400"
  />
</div>
       <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FFE600]/20 bg-[#FFE600]/5 text-xs text-[#FFE600] mb-8 backdrop-blur-sm"
      >
        <span className="w-2 h-2 bg-[#FFE600] rounded-full animate-pulse" />
        PREMIUM VIDEO SOLUTIONS
      </motion.div>
      <motion.h1 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-6xl md:text-9xl font-black mb-6 tracking-tight leading-[0.9] text-white"
      >
        High-Value <br />
        <span className="bg-gradient-to-r from-[#FFE600] via-[#FFD700] to-[#FFFFFF] bg-clip-text text-transparent italic">Content.</span>
      </motion.h1>
      <motion.p 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light"
      >
        Visual storytelling that drives massive engagement. Optimized for the 
        modern digital landscape by <span className="text-[#FFE600] font-bold underline decoration-2 underline-offset-4">umair_vision</span>.
      </motion.p>
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <button className="flex items-center justify-center gap-2 bg-[#FFE600] text-black px-10 py-5 rounded-full font-black transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,230,0,0.3)]">
          Watch Showreel <Play size={18} fill="black" />
        </button>
        <button 
          onClick={() => setPage('projects')}
          className="flex items-center justify-center gap-2 backdrop-blur-md bg-white/5 border border-white/10 hover:bg-[#FFE600]/10 hover:border-[#FFE600]/30 px-10 py-5 rounded-full font-bold transition-all hover:scale-105 text-white"
        >
          View Archive <Film size={18} />
        </button>
      </motion.div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
      {[
        { icon: <Zap className="text-[#FFE600]" />, title: "Viral Pacing", desc: "Retention-optimized editing designed to hold viewer attention from frame one." },
        { icon: <Star className="text-[#FFE600]" />, title: "Premium Color", desc: "Professional grade grading that gives your content a high-budget cinematic feel." },
        { icon: <Monitor className="text-[#FFE600]" />, title: "Multi-Format", desc: "Master files delivered for 9:16, 16:9, and 1:1 layouts simultaneously." }
      ].map((feature, i) => (
        <GlassCard key={i} className="p-8 group hover:border-[#FFE600]/40 transition-colors">
          <div className="mb-4 p-3 bg-[#FFE600]/10 w-fit rounded-xl group-hover:scale-110 transition-transform">{feature.icon}</div>
          <h3 className="text-xl font-bold mb-2 uppercase tracking-tighter text-white">{feature.title}</h3>
          <p className="text-gray-400 leading-relaxed text-sm">{feature.desc}</p>
        </GlassCard>
      ))}
    </div>
  </motion.div>
);

const ProjectsPage = () => {
  const [filter, setFilter] = useState('All');
  const projects = [
    { title: "YouTube Style Videos", category: "Gaming", img: "/cyberpunk.png" },
{ title: "Tutorial Video", category: "Cinematic", img: "/urban.png" },
{ title: "PR/UGC Videos", category: "Commercial", img: "/streetwear.png" },
{ title: "Facecam Videos", category: "Music", img: "/nightfall.png" },
{ title: "Product Videos", category: "Commercial", img: "/tech.png" },
{ title: "Screecasting Videos", category: "Cinematic", img: "/tokyo.png" },
  ];

  const filteredProjects = filter === 'All' ? projects : projects.filter(p => p.category === filter);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="pt-32 pb-20 px-6 max-w-7xl mx-auto"
    >
      <SectionHeading subtitle="Success Stories" title="Project Archive" />
      
      <div className="flex flex-wrap gap-4 mb-12">
        {['All', 'Gaming', 'Cinematic', 'Commercial', 'Music'].map((cat) => (
          <button 
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-6 py-2 rounded-full border transition-all text-xs font-bold tracking-widest uppercase ${filter === cat ? 'bg-[#FFE600] text-black border-[#FFE600]' : 'bg-transparent border-white/10 text-gray-400 hover:border-[#FFE600]/50'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-white">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
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
  <h3 className="text-xl font-black text-white leading-tight tracking-tighter">
    {project.title}
  </h3>
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
};

const ContactPage = () => (
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
          High-performance editing is an investment, not an expense. 
          Let's discuss how we can skyrocket your retention and brand value.
        </p>
        
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#FFE600]/10 flex items-center justify-center border border-[#FFE600]/20">
              <Mail className="text-[#FFE600]" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Secure Line</p>
              <p className="text-lg font-bold">umairapcoms@gmial.com</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#FFE600]/10 flex items-center justify-center border border-[#FFE600]/20">
              <Instagram className="text-[#FFE600]" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Instagram</p>
              <p className="text-lg font-bold">@umair_vision</p>
            </div>
          </div>
        </div>
      </div>

      <GlassCard className="p-8 md:p-12 border-[#FFE600]/10">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#FFE600]">Client Name</label>
              <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#FFE600] outline-none transition-all text-white" placeholder="Enter name" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#FFE600]">Email Address</label>
              <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#FFE600] outline-none transition-all text-white" placeholder="Enter email" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-[#FFE600]">Budget Range</label>
            <select className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-[#FFE600] outline-none transition-all text-white">
              <option>$500 - $1,500</option>
              <option>$1,500 - $5,000</option>
              <option>$5,000+</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-[#FFE600]">Project Details</label>
            <textarea className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 h-32 focus:border-[#FFE600] outline-none transition-all resize-none text-white" placeholder="Briefly describe your goals..."></textarea>
          </div>
          <button className="w-full bg-[#FFE600] text-black hover:bg-[#FFD700] py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-[0_10px_40px_rgba(255,230,0,0.15)]">
            Initiate Project
          </button>
        </form>
      </GlassCard>
    </div>
  </motion.div>
);

export default function App() {
  const [page, setPage] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderPage = () => {
    switch(page) {
      case 'home': return <HomePage setPage={setPage} />;
      case 'projects': return <ProjectsPage />;
      case 'contact': return <ContactPage />;
      default: return <HomePage setPage={setPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#FFE600] selection:text-black overflow-x-hidden">
      {/* New Feature Added Here */}
      <MouseTrail />

      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#FFE600]/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#FFD700]/5 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'py-4' : 'py-8'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className={`backdrop-blur-xl transition-all duration-500 ${scrolled ? 'bg-white/5 border border-white/10 px-8 py-3 rounded-full' : 'bg-transparent px-0 py-0'} flex justify-between items-center`}>
            <button onClick={() => setPage('home')} className="group flex items-center">
              <AnimatedLogo />
            </button>
            
            <div className="hidden md:flex gap-10 text-[10px] font-black tracking-[0.2em] uppercase text-gray-400">
              <button onClick={() => setPage('home')} className={`hover:text-[#FFE600] transition-colors ${page === 'home' ? 'text-[#FFE600]' : ''}`}>Home</button>
              <button onClick={() => setPage('projects')} className={`hover:text-[#FFE600] transition-colors ${page === 'projects' ? 'text-[#FFE600]' : ''}`}>Portfolio</button>
              <button onClick={() => setPage('contact')} className={`hover:text-[#FFE600] transition-colors ${page === 'contact' ? 'text-[#FFE600]' : ''}`}>Consult</button>
            </div>

            <div className="hidden md:block">
              <button 
                onClick={() => setPage('contact')}
                className="bg-white text-black px-6 py-2 rounded-full text-[10px] font-black tracking-widest uppercase hover:bg-[#FFE600] transition-all transform hover:scale-105 active:scale-95"
              >
                Inquire
              </button>
            </div>

            <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="fixed inset-0 z-[90] bg-[#050505] pt-32 px-10 border-l border-[#FFE600]/20"
          >
            <div className="flex flex-col gap-8 text-4xl font-black italic tracking-tighter text-white">
              <button onClick={() => { setPage('home'); setIsMobileMenuOpen(false); }}>Home</button>
              <button onClick={() => { setPage('projects'); setIsMobileMenuOpen(false); }}>Portfolio</button>
              <button onClick={() => { setPage('contact'); setIsMobileMenuOpen(false); }}>Consult</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <AnimatePresence mode="wait">
          {renderPage()}
        </AnimatePresence>
      </main>

      <footer className="py-20 px-6 border-t border-white/5 bg-black/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div>
            <h2 className="text-3xl font-black tracking-tighter uppercase italic mb-2 text-white">umair<span className="text-[#FFE600]">_vision</span></h2>
            <p className="text-gray-500 text-[10px] tracking-widest uppercase">© 2026 Umair Vision Media. Building value through motion.</p>
          </div>
          <div className="flex gap-4 text-white">
            <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:border-[#FFE600] transition-all"><Instagram size={18} /></button>
            <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:border-[#FFE600] transition-all"><Twitter size={18} /></button>
            <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:border-[#FFE600] transition-all"><Youtube size={18} /></button>
          </div>
        </div>
      </footer>
    </div>
  );
}