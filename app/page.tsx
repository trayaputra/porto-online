import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import {
  Github,
  Linkedin,
  Mail,
  FileText,
  Monitor,
} from 'lucide-react';

export default function HomePage() {
  const [isOnline, setIsOnline] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Simulate online status
  useEffect(() => {
    const timer = setTimeout(() => setIsOnline(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Track mouse for particles
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Typing effect for hero text
  const [typedTitle, setTypedTitle] = useState('');
  const [typedSubtitle, setTypedSubtitle] = useState('');
  const fullTitle = "Hi, I'm Trayaputra";
  const fullSubtitle = 'Full-Stack Developer & UI/UX Enthusiast';

  useEffect(() => {
    let i = 0;
    const titleInterval = setInterval(() => {
      if (i < fullTitle.length) {
        setTypedTitle(fullTitle.slice(0, i + 1));
        i++;
      } else {
        clearInterval(titleInterval);
      }
    }, 120);

    let j = 0;
    const subtitleInterval = setInterval(() => {
      if (j < fullSubtitle.length) {
        setTypedSubtitle(fullSubtitle.slice(0, j + 1));
        j++;
      } else {
        clearInterval(subtitleInterval);
      }
    }, 120);

    return () => {
      clearInterval(titleInterval);
      clearInterval(subtitleInterval);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-bg-primary text-white overflow-x-hidden"
      style={{
        backgroundImage: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0, 240, 255, 0.08) 0%, transparent 50%),
                          radial-gradient(circle at ${100 - mousePosition.x}% ${100 - mousePosition.y}%, rgba(185, 103, 255, 0.06) 0%, transparent 50%)`,
      }}
    >
      {/* Particle background overlay */}
      <div className="absolute inset-0 z-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-accent-electric opacity-30"
            animate={{
              y: [0, -20, 0],
              x: [0, Math.sin(i) * 40, 0],
              scale: [0.8, 1.2, 0.8],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + i * 0.3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              left: `${10 + (i % 4) * 20}%`,
              top: `${15 + Math.floor(i / 4) * 25}%`,
            }}
          />
        ))}
      </div>

      <main className="relative z-10 container mx-auto px-4 py-16 md:py-24 lg:py-32">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center mb-24 md:mb-32">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-4 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="block">{typedTitle}</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 max-w-2xl mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {typedSubtitle}
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.a
              href="/projects"
              className="px-8 py-3 bg-accent-violet hover:bg-violet-500 text-white font-medium rounded-lg transition-colors shadow-lg shadow-violet-500/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore My Work
            </motion.a>
            <motion.a
              href="/cv.pdf"
              className="px-8 py-3 bg-transparent border-2 border-accent-electric text-accent-electric hover:bg-accent-electric hover:text-bg-primary font-medium rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Download CV
            </motion.a>
          </motion.div>

          <AnimatePresence>
            {isOnline && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium border border-green-500/30"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Online now</span>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* What I Do Section */}
        <section className="mb-24 md:mb-32">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">What I Do</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: <Monitor className="w-8 h-8" />, title: 'Full-Stack Development', desc: 'Next.js, Supabase, TypeScript, Docker' },
              { icon: <Github className="w-8 h-8" />, title: 'UI/UX Design', desc: 'Figma, Responsive Layouts, Accessibility' },
              { icon: <Linkedin className="w-8 h-8" />, title: 'DevOps & Deployment', desc: 'Vercel, GitHub Actions, CI/CD Pipelines' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="p-6 bg-bg-secondary/50 backdrop-blur-sm rounded-xl border border-gray-800/50 hover:border-accent-violet/50 transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="text-accent-electric mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Latest Projects Section */}
        <section className="mb-24 md:mb-32">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Latest Projects</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="bg-bg-secondary/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-800/50"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.15 }}
                whileHover={{ y: -5 }}
              >
                <div className="h-48 bg-gradient-to-r from-accent-electric/20 to-accent-violet/20 flex items-center justify-center">
                  <div className="text-gray-500">Project {i}</div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-1">Project Name {i}</h3>
                  <p className="text-gray-400 text-sm mb-3">A modern web application built with Next.js and Supabase.</p>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-accent-electric/20 text-accent-electric text-xs rounded">Next.js</span>
                    <span className="px-2 py-1 bg-accent-violet/20 text-accent-violet text-xs rounded">Supabase</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-12 pb-8 border-t border-gray-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Trayaputra. All rights reserved.
            </div>
            <div className="flex gap-4">
              <a href="https://github.com/trayaputra" className="text-gray-400 hover:text-accent-electric transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/in/trayaputra" className="text-gray-400 hover:text-accent-violet transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="mailto:hello@trayaputra.dev" className="text-gray-400 hover:text-accent-electric transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}