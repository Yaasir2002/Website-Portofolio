import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDownRight, Mail, Sparkles, Code2, Palette, Terminal, ExternalLink } from 'lucide-react';

export default function Hero({ profile }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section id="hero" className="min-h-screen relative pt-32 pb-20 flex items-center justify-center overflow-hidden">
      {/* Background Decorative Glow Spheres */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-cyan/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-accent-violet/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & CTAs */}
          <motion.div
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Status Pill */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-accent-cyan/30 text-accent-electric text-xs font-semibold tracking-wide uppercase shadow-glow-cyan">
              <span className="w-2 h-2 rounded-full bg-accent-emerald animate-ping" />
              <Sparkles className="w-4 h-4 text-accent-cyan" />
              <span>Tersedia untuk Proyek & Karir Full-Time</span>
            </motion.div>

            {/* Name Heading */}
            <motion.h1 variants={itemVariants} className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl leading-tight text-white tracking-tight">
              Halo, Saya{' '}
              <span className="text-gradient hover:brightness-125 transition-all cursor-pointer">
                {profile?.name || 'Alex Rivera'}
              </span>
            </motion.h1>

            {/* Tagline */}
            <motion.p variants={itemVariants} className="font-display font-semibold text-xl sm:text-2xl text-accent-cyan/90">
              {profile?.title || 'Creative Designer & Full-Stack Developer'}
            </motion.p>

            {/* Bio Description */}
            <motion.p variants={itemVariants} className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {profile?.bio ||
                'Saya seorang desainer dan pengembang web apasionat yang berfokus menciptakan pengalaman digital modern, interaktif, dan berestetika tinggi.'}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <a
                href="#portfolio"
                className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-accent-cyan via-accent-electric to-accent-violet text-dark-900 font-display font-bold text-base shadow-glow-cyan hover:shadow-glow-combined transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                <span>Lihat Portofolio</span>
                <ArrowDownRight className="w-5 h-5 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
              </a>

              <a
                href="#contact"
                className="px-8 py-4 rounded-2xl glass-card border border-white/15 text-white hover:text-accent-electric hover:border-accent-cyan/50 transition-all duration-300 font-display font-semibold text-base flex items-center gap-2"
              >
                <Mail className="w-5 h-5 text-accent-cyan" />
                <span>Hubungi Saya</span>
              </a>
            </motion.div>

            {/* Quick Metrics */}
            <motion.div variants={itemVariants} className="pt-8 border-t border-white/10 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
              <div>
                <span className="block font-display font-black text-2xl sm:text-3xl text-white">
                  {profile?.stats?.yearsExperience || 5}+
                </span>
                <span className="text-xs text-gray-400 font-medium">Tahun Pengalaman</span>
              </div>
              <div>
                <span className="block font-display font-black text-2xl sm:text-3xl text-accent-cyan">
                  {profile?.stats?.completedProjects || 42}+
                </span>
                <span className="text-xs text-gray-400 font-medium">Karya Selesai</span>
              </div>
              <div>
                <span className="block font-display font-black text-2xl sm:text-3xl text-accent-violet">
                  {profile?.stats?.happyClients || 30}+
                </span>
                <span className="text-xs text-gray-400 font-medium">Klien Puas</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Organic Profile Frame & Floating Cards */}
          <motion.div
            className="lg:col-span-5 flex justify-center relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Animated Gradient Aura */}
            <div className="absolute inset-0 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-gradient-to-tr from-accent-cyan via-accent-violet to-accent-pink opacity-40 blur-2xl animate-spin-slow pointer-events-none" />

            {/* Main Profile Photo with Organic Blob Mask & Glowing Border */}
            <div className="relative w-72 sm:w-96 h-72 sm:h-96 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] p-2 bg-gradient-to-tr from-accent-electric via-accent-violet to-accent-pink shadow-glow-combined overflow-hidden group">
              <img
                src={
                  profile?.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800'
                }
                alt={profile?.name || 'Profile Avatar'}
                className="w-full h-full object-cover rounded-[58%_42%_32%_68%/58%_32%_68%_42%] group-hover:scale-105 transition-transform duration-700 filter brightness-105"
              />
            </div>

            {/* Floating Badge 1: UI/UX & Code */}
            <motion.div
              className="absolute -top-4 -left-4 sm:left-0 glass-panel px-4 py-3 rounded-2xl flex items-center gap-3 border border-white/10 shadow-xl"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
            >
              <div className="w-10 h-10 rounded-xl bg-accent-cyan/20 flex items-center justify-center text-accent-cyan">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs text-gray-400 font-medium">Design & Code</span>
                <span className="font-display font-bold text-sm text-white">Full-Stack UX</span>
              </div>
            </motion.div>

            {/* Floating Badge 2: Modern Tech Stack */}
            <motion.div
              className="absolute -bottom-6 -right-4 sm:right-0 glass-panel px-4 py-3 rounded-2xl flex items-center gap-3 border border-white/10 shadow-xl"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut', delay: 1 }}
            >
              <div className="w-10 h-10 rounded-xl bg-accent-violet/20 flex items-center justify-center text-accent-violet">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs text-gray-400 font-medium">Frontend & Backend</span>
                <span className="font-display font-bold text-sm text-white">React + Node.js</span>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
