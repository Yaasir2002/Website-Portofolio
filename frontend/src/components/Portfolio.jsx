import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ExternalLink, Eye, Play, Sparkles, Filter, Code2, Wrench } from 'lucide-react';
import api from '../services/api';
import PortfolioModal from './PortfolioModal';

export default function Portfolio() {
  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);

  // Fallback initial categories
  const defaultCategories = [
    'All',
    'UI/UX Design',
    'Web Development',
    'Branding',
    'Mobile App',
    'Graphic Design',
    'Video / Motion Graphic',
  ];

  // Fallback sample items if API call is empty
  const fallbackPortfolios = [
    {
      _id: '1',
      title: 'NovaFin — Next-Gen AI Banking App',
      description: 'Platform perbankan digital berbasis AI dengan antarmuka futuristik, manajemen portofolio kripto & fiat, serta transaksi real-time.',
      category: 'UI/UX Design',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
      mediaType: 'image',
      tools: ['Figma', 'Protopie', 'Design System'],
      demoLink: 'https://dribbble.com',
      date: '2026',
      tags: ['Fintech', 'Mobile UI'],
      views: 1420,
    },
    {
      _id: '2',
      title: 'Aetheria — Minimalist E-Commerce Platform',
      description: 'Situs e-commerce luxury fashion menggunakan React, Vite, Tailwind CSS, dan Node.js. Transisi halaman cepat dan animasi smooth.',
      category: 'Web Development',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
      mediaType: 'image',
      tools: ['React', 'Vite', 'Tailwind', 'Node.js'],
      demoLink: 'https://example.com',
      githubLink: 'https://github.com',
      date: '2026',
      tags: ['Full-Stack', 'E-Commerce'],
      views: 2150,
    },
    {
      _id: '3',
      title: 'Luminary Co. — Brand Identity & Strategy',
      description: 'Identitas visual untuk startup energi terbarukan global. Meliputi desain logo, sistem tipografi, panduan warna, dan stationary.',
      category: 'Branding',
      thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
      mediaType: 'image',
      tools: ['Illustrator', 'Photoshop', 'InDesign'],
      demoLink: 'https://behance.net',
      date: '2025',
      tags: ['Brand Identity', 'Logo'],
      views: 980,
    },
    {
      _id: '4',
      title: 'PulseFit — Smart Fitness Tracker App',
      description: 'Aplikasi pelacak kebugaran dengan koneksi smartwatch, rekomendasi latihan cerdas, dan statistik kalori harian.',
      category: 'Mobile App',
      thumbnail: 'https://images.unsplash.com/photo-1510519138161-58446231f11c?auto=format&fit=crop&q=80&w=800',
      mediaType: 'image',
      tools: ['React Native', 'Figma', 'Redux'],
      demoLink: 'https://apple.com',
      date: '2025',
      tags: ['iOS', 'Fitness'],
      views: 840,
    },
    {
      _id: '5',
      title: 'Cyberpunk City — 3D Poster Art',
      description: 'Karya seni 3D poster bertema cyberpunk dengan kombinasi Blender, pencahayaan neon kustom, dan gaya tipografi eksperimental.',
      category: 'Graphic Design',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
      mediaType: 'image',
      tools: ['Blender 3D', 'Photoshop'],
      demoLink: 'https://artstation.com',
      date: '2025',
      tags: ['3D Art', 'Poster'],
      views: 1100,
    },
    {
      _id: '6',
      title: 'Orbit — Motion Graphic Teaser',
      description: 'Video teaser 3D motion graphic peluncuran produk SaaS dengan efek kinetik tipografi dan gerakan kamera dinamis.',
      category: 'Video / Motion Graphic',
      thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=800',
      mediaType: 'image',
      tools: ['After Effects', 'Cinema 4D'],
      demoLink: 'https://youtube.com',
      date: '2026',
      tags: ['Motion', '3D Video'],
      views: 1750,
    },
  ];

  useEffect(() => {
    fetchCategories();
    fetchPortfolios();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      if (res.data && res.data.length > 0) {
        const catNames = ['All', ...res.data.map((c) => c.name)];
        setCategories(catNames);
      } else {
        setCategories(defaultCategories);
      }
    } catch (err) {
      console.log('Using default category tabs');
      setCategories(defaultCategories);
    }
  };

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      const res = await api.get('/portfolios');
      if (res.data && res.data.length > 0) {
        setPortfolios(res.data);
      } else {
        setPortfolios(fallbackPortfolios);
      }
    } catch (err) {
      console.log('Using fallback portfolio items');
      setPortfolios(fallbackPortfolios);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item) => {
    setSelectedPortfolio(item);
    // Log visitor view analytics to backend if available
    try {
      api.post('/analytics/log', {
        path: `/portfolio/${item._id}`,
        portfolioId: item._id,
      });
    } catch (e) {
      // ignore silently
    }
  };

  // Filtered portfolios
  const filteredPortfolios = portfolios.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.tools && item.tools.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="portfolio" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-accent-cyan font-display text-sm font-semibold tracking-widest uppercase flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" /> Portofolio Pilihan
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white">
            Galeri <span className="text-gradient">Karya Terbaru</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">
            Kumpulan proyek terbaik dalam UI/UX Design, Web Development, Branding, Mobile App, Graphic Design, dan Motion Graphics.
          </p>
        </motion.div>

        {/* Filter Controls & Search */}
        <div className="space-y-6 mb-12">
          
          {/* Category Filter Tabs */}
          <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`relative px-5 py-2.5 rounded-full text-xs sm:text-sm font-display font-semibold transition-all duration-300 ${
                    isActive
                      ? 'text-dark-900 shadow-glow-cyan font-bold'
                      : 'text-gray-300 hover:text-white glass-card border border-white/10 hover:border-white/20'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryTab"
                      className="absolute inset-0 bg-gradient-to-r from-accent-cyan via-accent-electric to-accent-violet rounded-full -z-10"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>

          {/* Search Bar Input */}
          <div className="max-w-md mx-auto relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari judul, teknologi (React, Figma, 3D)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl glass-input text-sm text-white placeholder-gray-500 focus:outline-none"
            />
          </div>

        </div>

        {/* Portfolio Cards Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredPortfolios.map((item, index) => (
              <motion.div
                key={item._id || index}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => handleOpenModal(item)}
                className="group glass-card rounded-3xl overflow-hidden border border-white/10 cursor-pointer flex flex-col justify-between hover-cursor"
              >
                {/* Thumbnail Image / Video Overlay */}
                <div className="relative aspect-[16/10] overflow-hidden bg-dark-800">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-95 group-hover:brightness-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Category Pill Tag */}
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full glass-panel text-[11px] font-semibold text-accent-electric uppercase tracking-wider border border-white/10 shadow-lg">
                    {item.category}
                  </span>

                  {/* Hover Overlay Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-dark-900/40 backdrop-blur-xs">
                    <span className="px-5 py-2.5 rounded-full bg-accent-cyan text-dark-900 font-display font-bold text-xs flex items-center gap-2 shadow-glow-cyan transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <Eye className="w-4 h-4" /> Lihat Detail
                    </span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-bold text-xl text-white group-hover:text-accent-electric transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm line-clamp-2 mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Tools Badges & Views */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5 overflow-hidden max-h-6">
                      {item.tools &&
                        item.tools.slice(0, 3).map((tool, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 rounded-md bg-white/5 text-[10px] text-gray-300 font-medium border border-white/5"
                          >
                            {tool}
                          </span>
                        ))}
                    </div>
                    <span className="text-[11px] text-gray-400 flex items-center gap-1 flex-shrink-0">
                      <Eye className="w-3.5 h-3.5 text-accent-cyan" />
                      {item.views || 0}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty Search State */}
        {filteredPortfolios.length === 0 && !loading && (
          <div className="text-center py-16 glass-panel rounded-3xl max-w-md mx-auto space-y-3">
            <Filter className="w-10 h-10 text-accent-cyan mx-auto opacity-50" />
            <h3 className="font-display font-bold text-lg text-white">Portofolio Tidak Ditemukan</h3>
            <p className="text-xs text-gray-400">
              Tidak ada karya yang sesuai dengan kategori atau kata kunci "{searchQuery}".
            </p>
          </div>
        )}

      </div>

      {/* Portfolio Detail Modal */}
      {selectedPortfolio && (
        <PortfolioModal item={selectedPortfolio} onClose={() => setSelectedPortfolio(null)} />
      )}
    </section>
  );
}
