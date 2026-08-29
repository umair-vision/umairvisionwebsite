"use client";

import React, { useState, useRef, memo, useMemo, useEffect } from 'react';
import {
  Play,
  Film,
  Mail,
  ArrowRight,
  Monitor,
  Zap,
  Star,
  Instagram,
  Youtube,
  Menu,
  X,
  Mic,
  CheckCircle,
  Volume2,
  Sparkles,
  MessageCircle,
  Briefcase,
  Home,
  Grid
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ---------------------------------------------------------------------------
// Static Data
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
  { name: "Alex Carter", role: "YouTube Creator", img: "/client1.jpeg", message: "Umair completely transformed my content. The pacing and storytelling dramatically improved my audience retention." },
  { name: "Samantha Lee", role: "Brand Manager", img: "/client2.jpeg", message: "Extremely professional editing. The videos look cinematic and polished." },
  { name: "Lily Brooks", role: "Tech Influencer", img: "/client3.jpeg", message: "My engagement improved immediately. The editing style is modern and high quality." },
];

const PROJECTS = [
  { title: "YouTube Style Videos", category: "Gaming", img: "/cyberpunk.png" },
  { title: "Tutorial Video", category: "Cinematic", img: "/urban.png" },
  { title: "PR/UGC Videos", category: "Commercial", img: "/streetwear.png" },
  { title: "Facecam Videos", category: "Music", img: "/nightfall.png" },
  { title: "Product Videos", category: "Commercial", img: "/tech.png" },
  { title: "Screencasting Videos", category: "Cinematic", img: "/tokyo.png" },
];

const SERVICES_DATA = [
  {
    id: "video-editing",
    icon: <Film className="text-[#FFE600]" size={28} />,
    title: "High-Retention Video Editing",
    description: "Cinematic pacing, sound design, visual effects, and custom text motion graphics crafted for modern audience retention.",
    deliverables: ["4K Rendered Output", "Color Grading & FX", "Motion Graphics & Kinetic Text", "Platform Optimization (16:9 & 9:16)"]
  },
  {
    id: "saas-tutorials",
    icon: <Monitor className="text-[#FFE600]" size={28} />,
    title: "SaaS & Product Screen Recording",
    description: "Polished multi-platform software walkthroughs, feature spotlight demos, and high-FPS UI/UX desktop motion graphics.",
    deliverables: ["60FPS Screen Captures", "Glassy UI Callouts & Zoom Focus", "Curated B-Roll Overlay", "Interactive Demo Styling"]
  },
  {
    id: "voice-over",
    icon: <Mic className="text-[#FFE600]" size={28} />,
    title: "Professional Voice Over & Audio",
    description: "Clear, engaging, and professional voice recordings delivered with noise restoration, compression, and studio sound treatment.",
    deliverables: ["Broadcast Quality Audio (WAV/MP3)", "Noise Reduction & EQ Processing", "Pacing Alignment to Video", "Multiple Accent Options"]
  }
];

const VOICEOVER_SAMPLES = [
  { id: 1, title: "Skyler", style: "Energetic & Modern Tech", defaultDuration: "0:45", audioUrl: "/Skyler.mp3" },
  { id: 2, title: "Tee", style: "Clear, Professional & Instructional", defaultDuration: "1:10", audioUrl: "/Tee.mp3" },
  { id: 3, title: "kate", style: "Cinematic & Conversational", defaultDuration: "1:30", audioUrl: "/kate.mp3" },
  { id: 4, title: "Jane", style: "Commercial & Engaging", defaultDuration: "0:55", audioUrl: "/Jane.mp3" },
  { id: 5, title: "Maria", style: "Smooth Narrative & Corporate", defaultDuration: "1:15", audioUrl: "/Maria.mp3" }
];

const SAAS_SAMPLES = [
  { id: "Ip3e1GCM_Bw", title: "SaaS Workflow & Dashboard Overview", desc: "Interactive web app interface walkthrough with animated cursor tracking and zoom callouts.", category: "Product Demo" },
  { id: "h6NrKx1hw4c", title: "Cloud Mobile App Feature Launch", desc: "High-tempo software update reel built for social channels and landing pages.", category: "Promotional" }
];

const CATEGORIES = ['All', 'Gaming', 'Cinematic', 'Commercial', 'Music'] as const;
const REEL_IDS = ["Ip3e1GCM_Bw", "h6NrKx1hw4c", "EkdhwuqC2QU"];

// ---------------------------------------------------------------------------
// Voiceover Player Item Component
// ---------------------------------------------------------------------------

const VoiceoverItem = ({
  sample,
  activeAudioId,
  toggleAudio,
  handleMetadataLoaded,
  duration
}: {
  sample: typeof VOICEOVER_SAMPLES[number];
  activeAudioId: number | null;
  toggleAudio: (id: number) => void;
  handleMetadataLoaded: (id: number, e: React.SyntheticEvent<HTMLAudioElement, Event>) => void;
  duration: string;
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const isPlaying = activeAudioId === sample.id;

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  // Manage Play / Pause safely via standard React effect
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      // Connect Web Audio API lazily on first user interaction
      if (!audioCtxRef.current) {
        try {
          const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          const ctx = new AudioContextClass();
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 64;

          const source = ctx.createMediaElementSource(audio);
          source.connect(analyser);
          analyser.connect(ctx.destination);

          audioCtxRef.current = ctx;
          analyserRef.current = analyser;
          sourceRef.current = source;
        } catch {
          // Fallback if media source is already connected or restricted
        }
      }

      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      audio.play().catch(err => console.error("Audio playback error:", err));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Canvas visualizer render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const numBars = 16;
      const barGap = 3;
      const totalGaps = (numBars - 1) * barGap;
      const barWidth = (width - totalGaps) / numBars;

      if (isPlaying && analyserRef.current) {
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

        for (let i = 0; i < numBars; i++) {
          const value = dataArray[i] || 0;
          const percent = value / 255;
          const barHeight = Math.max(4, percent * height);

          const x = i * (barWidth + barGap);
          const y = (height - barHeight) / 2;

          ctx.fillStyle = '#FFE600';
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, 2);
          ctx.fill();
        }
      } else {
        // Muted / Static Waveform bars
        for (let i = 0; i < numBars; i++) {
          const barHeight = 4;
          const x = i * (barWidth + barGap);
          const y = (height - barHeight) / 2;

          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, 2);
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlaying]);

  return (
    <GlassCard className="p-6 flex items-center justify-between">
      <audio
        ref={audioRef}
        src={sample.audioUrl}
        preload="metadata"
        onLoadedMetadata={(e) => handleMetadataLoaded(sample.id, e)}
        onEnded={() => toggleAudio(sample.id)}
      />
      <div className="flex items-center gap-4">
        <button
          onClick={() => toggleAudio(sample.id)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            isPlaying ? 'bg-[#FFE600] text-black shadow-[0_0_15px_rgba(255,230,0,0.5)]' : 'bg-white/10 text-white hover:bg-[#FFE600] hover:text-black'
          }`}
        >
          {isPlaying ? <Volume2 size={20} className="animate-pulse" /> : <Play size={20} className="ml-0.5" />}
        </button>
        <div>
          <h4 className="font-bold text-white text-base">{sample.title}</h4>
          <span className="text-xs text-[#FFE600]">{sample.style}</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <canvas
          ref={canvasRef}
          width={120}
          height={28}
          className="w-[120px] h-[28px] pointer-events-none"
        />
        <span className="text-xs font-mono text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
          {duration}
        </span>
      </div>
    </GlassCard>
  );
};

// ---------------------------------------------------------------------------
// Reusable UI Components
// ---------------------------------------------------------------------------

const GlassCard = memo(({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl ${className}`}>
    {children}
  </div>
));
GlassCard.displayName = 'GlassCard';

const SectionHeading = memo(({ subtitle, title }: { subtitle: string; title: string }) => (
  <div className="mb-12">
    <span className="text-[#FFE600] font-bold text-sm tracking-widest uppercase">{subtitle}</span>
    <h2 className="text-4xl md:text-5xl font-black mt-2 tracking-tighter text-white">{title}</h2>
  </div>
));
SectionHeading.displayName = 'SectionHeading';

const ReelHolder = memo(({ videoId }: { videoId: string }) => (
  <div className="relative group aspect-[9/16] w-full max-w-[300px] mx-auto rounded-[2.5rem] overflow-hidden border border-[#FFE600]/30 shadow-[0_0_20px_rgba(255,230,0,0.15)] bg-[#050505]">
    <iframe
      className="w-full h-full object-cover"
      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0`}
      title="YouTube Reel"
      allow="autoplay; encrypted-media"
      frameBorder="0"
    />
  </div>
));
ReelHolder.displayName = 'ReelHolder';

// ---------------------------------------------------------------------------
// Header Navigation
// ---------------------------------------------------------------------------

const GlossyTopBar = memo(({ page, setPage }: { page: string; setPage: (p: string) => void }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'services', label: 'Services & VO', icon: Grid },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        <motion.div 
          onClick={() => setPage('home')}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="pointer-events-auto cursor-pointer relative group rounded-2xl p-[1px] bg-gradient-to-r from-white/20 via-[#FFE600]/40 to-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]"
        >
          <div className="bg-black/60 backdrop-blur-2xl rounded-[15px] px-5 py-2.5 flex items-center gap-2 border border-white/10 group-hover:border-[#FFE600]/50 transition-all duration-300">
            <span className="text-xl font-black tracking-tighter uppercase italic text-white">
              umair<span className="text-[#FFE600]">_vision</span>
            </span>
            <div className="w-2 h-2 rounded-full bg-[#FFE600] animate-pulse" />
          </div>
        </motion.div>

        <nav className="hidden md:flex pointer-events-auto items-center gap-1 p-1.5 rounded-full bg-black/40 backdrop-blur-2xl border border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = page === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`relative px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${
                  isActive ? 'text-black' : 'text-gray-300 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-pill"
                    className="absolute inset-0 bg-[#FFE600] rounded-full shadow-[0_0_15px_rgba(255,230,0,0.5)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon size={14} />
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="hidden md:block pointer-events-auto">
          <button
            onClick={() => setPage('contact')}
            className="relative group overflow-hidden rounded-full p-[1px] bg-gradient-to-r from-[#FFE600] via-yellow-200 to-[#FFE600]"
          >
            <div className="bg-black hover:bg-transparent text-white group-hover:text-black font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-full transition-all duration-300 backdrop-blur-xl flex items-center gap-2">
              <Sparkles size={14} /> Let's Work
            </div>
          </button>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden pointer-events-auto p-3 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/15 text-white"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pointer-events-auto mt-3 md:hidden rounded-3xl bg-black/90 backdrop-blur-3xl border border-white/15 p-6 shadow-2xl space-y-3"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setPage(item.id); setMobileOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold uppercase tracking-wider text-sm transition-all ${
                  page === item.id ? 'bg-[#FFE600] text-black' : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
});
GlossyTopBar.displayName = 'GlossyTopBar';

// ---------------------------------------------------------------------------
// Floating Bottom Hub
// ---------------------------------------------------------------------------

const BottomGlassSocialHub = memo(() => (
  <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-xl pointer-events-auto">
    <div className="p-2 rounded-2xl bg-black/60 backdrop-blur-2xl border border-white/20 shadow-[0_15px_35px_rgba(0,0,0,0.6)] flex items-center justify-between gap-2">
      <a
        href="https://wa.me/923191386775?text=Hi%20Umair,%20I%20want%20to%20collaborate%20on%20a%20video%20project!"
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 group relative overflow-hidden rounded-xl p-3 bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/50 transition-all duration-300 flex items-center justify-center gap-3"
      >
        <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
          <MessageCircle size={18} />
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Instant Chat</p>
          <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">WhatsApp</p>
        </div>
      </a>

      <a
        href="https://instagram.com/umair_vision"
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 group relative overflow-hidden rounded-xl p-3 bg-white/5 hover:bg-[#FFE600]/20 border border-white/10 hover:border-[#FFE600]/50 transition-all duration-300 flex items-center justify-center gap-3"
      >
        <div className="p-2 rounded-lg bg-[#FFE600]/20 text-[#FFE600] group-hover:scale-110 transition-transform">
          <Instagram size={18} />
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Portfolio</p>
          <p className="text-xs font-bold text-white group-hover:text-[#FFE600] transition-colors">@umair_vision</p>
        </div>
      </a>

      <a
        href="https://youtube.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 group relative overflow-hidden rounded-xl p-3 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 transition-all duration-300 flex items-center justify-center gap-3"
      >
        <div className="p-2 rounded-lg bg-red-500/20 text-red-400 group-hover:scale-110 transition-transform">
          <Youtube size={18} />
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Channel</p>
          <p className="text-xs font-bold text-white group-hover:text-red-400 transition-colors">YouTube</p>
        </div>
      </a>
    </div>
  </div>
));
BottomGlassSocialHub.displayName = 'BottomGlassSocialHub';

// ---------------------------------------------------------------------------
// Views
// ---------------------------------------------------------------------------

const HomePage = memo(({ setPage }: { setPage: (p: string) => void }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-36 pb-32 px-6 max-w-7xl mx-auto">
    <div className="text-center mb-24">
      <div className="relative w-40 h-40 mx-auto mb-8">
        <div className="absolute inset-0 rounded-full bg-yellow-400 blur-2xl opacity-40 animate-pulse" />
        <img src="/profile.png" alt="Profile" className="relative w-40 h-40 object-cover rounded-full border-4 border-yellow-400" />
      </div>
      <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tight leading-none text-white">
        High-Value <br />
        <span className="bg-gradient-to-r from-[#FFE600] via-[#FFD700] to-white bg-clip-text text-transparent italic">Content.</span>
      </h1>
      <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8 font-light">
        Visual storytelling that drives massive retention and engagement by <span className="text-[#FFE600] font-bold">umair_vision</span>.
      </p>
      <div className="flex justify-center gap-4">
        <button onClick={() => setPage('projects')} className="bg-[#FFE600] text-black px-8 py-4 rounded-full font-black flex items-center gap-2 hover:scale-105 transition-transform">
          Explore Work <ArrowRight size={18} />
        </button>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
      {FEATURES.map((f, i) => (
        <GlassCard key={i} className="p-8">
          <div className="mb-4 p-3 bg-[#FFE600]/10 w-fit rounded-xl">{f.icon}</div>
          <h3 className="text-xl font-bold mb-2 text-white">{f.title}</h3>
          <p className="text-gray-400 text-sm">{f.desc}</p>
        </GlassCard>
      ))}
    </div>

    <div className="mb-24">
      <SectionHeading subtitle="Motion Showcase" title="Featured SaaS" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {REEL_IDS.map(id => <ReelHolder key={id} videoId={id} />)}
      </div>
    </div>

    <div className="mb-12">
      <SectionHeading subtitle="Client Feedback" title="What Creators Say" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {TESTIMONIALS.map((t, i) => (
          <GlassCard key={i} className="p-6 border-white/10">
            <div className="flex items-center gap-4 mb-4">
              <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full object-cover border border-[#FFE600]" />
              <div>
                <h4 className="font-bold text-white text-sm">{t.name}</h4>
                <p className="text-xs text-gray-400">{t.role}</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">{t.message}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  </motion.div>
));
HomePage.displayName = 'HomePage';

const ServicesPage = memo(() => {
  const [activeAudioId, setActiveAudioId] = useState<number | null>(null);
  const [durations, setDurations] = useState<{ [key: number]: string }>({});

  const toggleAudio = (id: number) => {
    setActiveAudioId(prev => (prev === id ? null : id));
  };

  const handleMetadataLoaded = (id: number, e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    const durationSec = e.currentTarget.duration;
    if (durationSec && !isNaN(durationSec)) {
      const minutes = Math.floor(durationSec / 60);
      const seconds = Math.floor(durationSec % 60).toString().padStart(2, '0');
      setDurations(prev => ({ ...prev, [id]: `${minutes}:${seconds}` }));
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-36 pb-32 px-6 max-w-7xl mx-auto text-white">
      <SectionHeading subtitle="Services" title="Production Capabilities" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {SERVICES_DATA.map(s => (
          <GlassCard key={s.id} className="p-8">
            <div className="p-4 bg-[#FFE600]/10 rounded-2xl w-fit mb-6">{s.icon}</div>
            <h3 className="text-2xl font-black mb-3">{s.title}</h3>
            <p className="text-gray-400 text-sm mb-6">{s.description}</p>
            <ul className="space-y-2">
              {s.deliverables.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                  <CheckCircle size={14} className="text-[#FFE600]" /> {item}
                </li>
              ))}
            </ul>
          </GlassCard>
        ))}
      </div>

      <div className="mb-20">
        <SectionHeading subtitle="Demos" title="SaaS Screen Captures" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SAAS_SAMPLES.map(saas => (
            <GlassCard key={saas.id} className="p-6">
              <div className="aspect-video w-full rounded-xl overflow-hidden mb-4 border border-white/10">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${saas.id}?modestbranding=1&rel=0`}
                  title={saas.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  frameBorder="0"
                />
              </div>
              <span className="text-[10px] font-black tracking-widest uppercase bg-[#FFE600]/10 text-[#FFE600] px-2.5 py-1 rounded">
                {saas.category}
              </span>
              <h4 className="text-xl font-bold mt-2 text-white">{saas.title}</h4>
              <p className="text-xs text-gray-400 mt-1">{saas.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>

      <div>
        <SectionHeading subtitle="Talent" title="Voice Over Soundboard" />
        <div className="space-y-4">
          {VOICEOVER_SAMPLES.map(sample => (
            <VoiceoverItem
              key={sample.id}
              sample={sample}
              activeAudioId={activeAudioId}
              toggleAudio={toggleAudio}
              handleMetadataLoaded={handleMetadataLoaded}
              duration={durations[sample.id] || sample.defaultDuration}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
});
ServicesPage.displayName = 'ServicesPage';

const ProjectsPage = memo(() => {
  const [filter, setFilter] = useState<typeof CATEGORIES[number]>('All');

  const filteredProjects = useMemo(
    () => filter === 'All' ? PROJECTS : PROJECTS.filter(p => p.category === filter),
    [filter]
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-36 pb-32 px-6 max-w-7xl mx-auto text-white">
      <SectionHeading subtitle="Portfolio" title="Project Archive" />
      
      <div className="flex flex-wrap gap-3 mb-10">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-5 py-2 rounded-full border transition-all text-xs font-bold uppercase tracking-widest ${
              filter === cat ? 'bg-[#FFE600] text-black border-[#FFE600]' : 'bg-transparent border-white/10 text-gray-400 hover:border-[#FFE600]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredProjects.map(p => (
          <GlassCard key={p.title} className="p-4 border-white/10 group hover:border-[#FFE600]/40 transition-colors">
            <div className="overflow-hidden rounded-xl mb-4">
              <img src={p.img} alt={p.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <h4 className="text-lg font-bold">{p.title}</h4>
            <span className="text-xs text-[#FFE600] font-mono uppercase tracking-wider">{p.category}</span>
          </GlassCard>
        ))}
      </div>
    </motion.div>
  );
});
ProjectsPage.displayName = 'ProjectsPage';

const ContactPage = memo(() => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-36 pb-32 px-6 max-w-7xl mx-auto text-white">
    <SectionHeading subtitle="Connect" title="Initiate Project" />
    <GlassCard className="p-8 max-w-2xl mx-auto border-[#FFE600]/20">
      <form className="space-y-6" onSubmit={e => e.preventDefault()}>
        <div>
          <label className="text-xs font-bold text-[#FFE600] uppercase tracking-widest block mb-2">Your Name</label>
          <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-[#FFE600] transition-colors" placeholder="Enter your full name" />
        </div>
        <div>
          <label className="text-xs font-bold text-[#FFE600] uppercase tracking-widest block mb-2">Email Address</label>
          <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-[#FFE600] transition-colors" placeholder="Enter your email" />
        </div>
        <div>
          <label className="text-xs font-bold text-[#FFE600] uppercase tracking-widest block mb-2">Project Brief</label>
          <textarea className="w-full bg-white/5 border border-white/10 rounded-xl p-3 h-32 text-white outline-none focus:border-[#FFE600] transition-colors resize-none" placeholder="Describe your video project goals..." />
        </div>
        <button className="w-full bg-[#FFE600] text-black font-black py-4 rounded-xl uppercase tracking-widest hover:bg-yellow-400 transition-colors shadow-[0_0_20px_rgba(255,230,0,0.3)]">
          Send Project Inquiry
        </button>
      </form>
    </GlassCard>
  </motion.div>
));
ContactPage.displayName = 'ContactPage';

// ---------------------------------------------------------------------------
// Root App Entry Point
// ---------------------------------------------------------------------------

export default function App() {
  const [page, setPage] = useState('home');

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans relative overflow-x-hidden selection:bg-[#FFE600] selection:text-black">
      
      <GlossyTopBar page={page} setPage={setPage} />

      <main>
        <AnimatePresence mode="wait">
          {page === 'home' && <HomePage key="home" setPage={setPage} />}
          {page === 'services' && <ServicesPage key="services" />}
          {page === 'projects' && <ProjectsPage key="projects" />}
          {page === 'contact' && <ContactPage key="contact" />}
        </AnimatePresence>
      </main>

      <BottomGlassSocialHub />

    </div>
  );
}