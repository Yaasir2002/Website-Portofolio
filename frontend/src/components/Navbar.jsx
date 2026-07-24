import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, Sparkles, User, FolderKanban, Cpu, Mail } from 'lucide-react';

export default function Navbar({ profile }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Beranda', href: '#hero', icon: Sparkles },
    { name: 'Tentang', href: '#about', icon: User },
    { name: 'Portofolio', href: '#portfolio', icon: FolderKanban },
    { name: 'Keahlian', href: '#skills', icon: Cpu },
    { name: 'Kontak', href: '#contact', icon: Mail },
  ];

  const isHomePage = location.pathname === '/';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'py-3 glass-panel border-b border-white/10 shadow-lg' : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#hero" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-cyan via-accent-violet to-accent-pink p-[2px] transition-transform duration-300 group-hover:scale-105 shadow-glow-cyan">
            <div className="w-full h-full bg-dark-900 rounded-[10px] flex items-center justify-center font-display font-black text-lg text-white overflow-hidden">
              {profile?.logo ? (
                <img src={profile.logo} alt="Logo" className="w-full h-full object-cover rounded-[10px]" />
              ) : (
                (() => {
                  const name = profile?.name || 'Alex Rivera';
                  const parts = name.trim().split(' ').filter(Boolean);
                  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
                  return (parts[0][0] + parts[1][0]).toUpperCase();
                })()
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg text-white group-hover:text-accent-electric transition-colors">
              {profile?.name || 'Alex Rivera'}
            </span>
            <span className="text-xs text-gray-400 -mt-1 font-medium">Portfolio</span>
          </div>
        </a>

        {/* Desktop Navigation */}
        {isHomePage && (
          <nav className="hidden md:flex items-center gap-1 bg-dark-800/80 p-1.5 rounded-full border border-white/10 backdrop-blur-md">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-full transition-all duration-200 hover:bg-white/10 flex items-center gap-1.5"
              >
                <link.icon className="w-4 h-4 text-accent-cyan" />
                {link.name}
              </a>
            ))}
          </nav>
        )}

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl bg-dark-800 border border-white/10 text-gray-300 hover:text-white focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-panel border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 pt-3 pb-6 space-y-2">
              {isHomePage &&
                navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gray-200 hover:bg-accent-cyan/10 hover:text-accent-electric transition-colors"
                  >
                    <link.icon className="w-5 h-5 text-accent-cyan" />
                    {link.name}
                  </a>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
