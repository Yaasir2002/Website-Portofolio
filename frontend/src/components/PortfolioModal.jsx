import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github, Calendar, Eye, Tag, Wrench, PlayCircle } from 'lucide-react';

export default function PortfolioModal({ item, onClose }) {
  if (!item) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-dark-900/80 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl bg-dark-800 border border-white/15 rounded-3xl overflow-hidden shadow-2xl z-10 my-8 max-h-[90vh] flex flex-col"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 glass-panel">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-accent-cyan/15 text-accent-cyan text-xs font-semibold uppercase tracking-wider">
                {item.category}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {item.date || '2026'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
            
            {/* Media Container (Image or Video) */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-dark-900 group aspect-video">
              {item.mediaType === 'video' || item.videoUrl ? (
                <iframe
                  src={item.videoUrl || item.thumbnail}
                  title={item.title}
                  className="w-full h-full object-cover"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
            </div>

            {/* Title & Description */}
            <div className="space-y-3">
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                {item.title}
              </h2>
              <p className="text-gray-300 text-base leading-relaxed whitespace-pre-line">
                {item.description}
              </p>
            </div>

            {/* Tools & Tech Stack */}
            {item.tools && item.tools.length > 0 && (
              <div className="space-y-2 pt-4 border-t border-white/10">
                <h4 className="text-xs uppercase tracking-wider text-gray-400 font-semibold flex items-center gap-1.5">
                  <Wrench className="w-4 h-4 text-accent-cyan" />
                  <span>Teknologi & Tools Yang Digunakan</span>
                </h4>
                <div className="flex flex-wrap gap-2 pt-1">
                  {item.tools.map((tool, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-dark-900 border border-white/10 text-xs font-semibold text-accent-cyan"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Optional Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs uppercase tracking-wider text-gray-400 font-semibold flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-accent-violet" />
                  <span>Tag & Kategori Spesifik</span>
                </h4>
                <div className="flex flex-wrap gap-2 pt-1">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-accent-violet/10 text-accent-violet text-xs font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Action Links & View Counter */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10">
              <div className="flex items-center gap-3">
                {item.demoLink && (
                  <a
                    href={item.demoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-violet text-dark-900 font-display font-bold text-sm flex items-center gap-2 shadow-glow-cyan hover:scale-105 transition-all"
                  >
                    <span>Lihat Live Demo</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                {item.githubLink && (
                  <a
                    href={item.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl glass-card border border-white/15 text-white hover:text-accent-cyan font-display font-semibold text-sm flex items-center gap-2 transition-all"
                  >
                    <Github className="w-4 h-4" />
                    <span>Source Code</span>
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Eye className="w-4 h-4 text-accent-cyan" />
                <span>{item.views || 0} Dilihat</span>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
