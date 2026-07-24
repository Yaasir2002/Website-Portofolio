import React from 'react';
import { ArrowUp } from 'lucide-react';

export default function Footer({ profile }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/10 glass-panel py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Brand & Copyright */}
        <div className="text-center md:text-left space-y-1">
          <p className="font-display font-bold text-lg text-white">
            {profile?.name || 'Alex Rivera'}
          </p>
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Hak Cipta Dilindungi. Dibuat dengan React & Express.
          </p>
        </div>



        {/* Right: Back to Top Button */}
        <button
          onClick={scrollToTop}
          className="p-3 rounded-2xl glass-card border border-white/10 text-gray-300 hover:text-accent-electric hover:border-accent-cyan transition-all duration-300 flex items-center gap-2 text-xs font-semibold"
          aria-label="Back to top"
        >
          <span>Kembali ke Atas</span>
          <ArrowUp className="w-4 h-4" />
        </button>

      </div>
    </footer>
  );
}
