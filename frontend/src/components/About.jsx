import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Award, MapPin, Mail, Calendar, CheckCircle2, ChevronRight } from 'lucide-react';

export default function About({ profile }) {
  const [activeTab, setActiveTab] = useState('experience');

  const defaultExperiences = [
    {
      period: '2024 — Sekarang',
      role: 'Senior Full-Stack UI/UX Developer',
      company: 'Tech Innovators Studio',
      description: 'Memimpin perancangan UI/UX & pengembangan aplikasi web berskala enterprise menggunakan React, Tailwind CSS, Node.js, dan cloud architecture.',
    },
    {
      period: '2022 — 2024',
      role: 'UI/UX Designer & Frontend Engineer',
      company: 'Digital Creative Agency',
      description: 'Merancang sistem desain (Design System), membuat prototipe interaktif di Figma, dan mengimplementasikannya ke dalam kode React modern.',
    },
    {
      period: '2021 — 2022',
      role: 'Junior Web Developer',
      company: 'Nexa Digital Solutions',
      description: 'Mengembangkan situs web responsif, mengintegrasikan API backend RESTful, dan mengoptimalkan performa halaman web.',
    },
  ];

  const defaultEducation = [
    {
      period: '2017 — 2021',
      degree: 'Sarjana Ilmu Komputer (S.Kom)',
      institution: 'Universitas Teknologi Indonesia',
      description: 'Fokus studi pada Rekayasa Perangkat Lunak, Interaksi Manusia & Komputer (HCI), dan Algoritma Data Structure.',
    },
    {
      period: '2023',
      degree: 'Sertifikasi Professional UI/UX & React Specialist',
      institution: 'Global Tech Academy',
      description: 'Sertifikasi kompetensi desain antarmuka, aksesibilitas WCAG, dan arsitektur aplikasi React tingkat lanjut.',
    },
  ];

  const experiences = profile?.experiences && profile.experiences.length > 0 ? profile.experiences : defaultExperiences;
  const education = profile?.education && profile.education.length > 0 ? profile.education : defaultEducation;

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-accent-cyan font-display text-sm font-semibold tracking-widest uppercase">
            Mengenal Lebih Dekat
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white">
            Tentang <span className="text-gradient">Saya</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">
            Mengkombinasikan estetika visual dengan logika pemrograman murni untuk membangun produk digital berkelas dunia.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Side Card: Profile Info & Core Values */}
          <motion.div
            className="lg:col-span-5 glass-panel p-8 rounded-3xl border border-white/10 space-y-6 shadow-xl"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="space-y-4">
              <h3 className="font-display font-bold text-2xl text-white">
                Dedikasi pada Kualitas & Inovasi
              </h3>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                {profile?.bio ||
                  'Saya seorang desainer dan pengembang web apasionat yang berfokus menciptakan pengalaman digital modern, interaktif, dan berestetika tinggi.'}
              </p>
            </div>

            {/* Quick Contact & Info Pills */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <div className="w-8 h-8 rounded-lg bg-accent-cyan/10 flex items-center justify-center text-accent-cyan">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>{profile?.location || 'Jakarta, Indonesia'}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <div className="w-8 h-8 rounded-lg bg-accent-violet/10 flex items-center justify-center text-accent-violet">
                  <Mail className="w-4 h-4" />
                </div>
                <span>{profile?.email || 'contact@alexrivera.dev'}</span>
              </div>
            </div>

            {/* Core Competencies List */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <h4 className="font-display font-semibold text-sm text-gray-200 uppercase tracking-wider">
                Prinsip Kerja Utama
              </h4>
              <ul className="space-y-2">
                {[
                  'Desain berpusat pada pengguna (User-Centered)',
                  'Kode bersih, modular & scalable',
                  'Mikro-interaksi & animasi yang halus',
                  'Optimasi performa & SEO komprehensif',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-accent-emerald flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Right Side: Timeline Tabs (Experience vs Education) */}
          <motion.div
            className="lg:col-span-7 glass-panel p-8 rounded-3xl border border-white/10 space-y-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Tab Buttons */}
            <div className="flex items-center gap-4 border-b border-white/10 pb-4">
              <button
                onClick={() => setActiveTab('experience')}
                className={`flex items-center gap-2 pb-2 text-base font-display font-bold transition-all relative ${
                  activeTab === 'experience' ? 'text-accent-electric' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Briefcase className="w-5 h-5 text-accent-cyan" />
                <span>Pengalaman Kerja</span>
                {activeTab === 'experience' && (
                  <motion.div layoutId="aboutTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-electric shadow-glow-cyan" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('education')}
                className={`flex items-center gap-2 pb-2 text-base font-display font-bold transition-all relative ${
                  activeTab === 'education' ? 'text-accent-electric' : 'text-gray-400 hover:text-white'
                }`}
              >
                <GraduationCap className="w-5 h-5 text-accent-violet" />
                <span>Edukasi & Sertifikasi</span>
                {activeTab === 'education' && (
                  <motion.div layoutId="aboutTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-violet shadow-glow-violet" />
                )}
              </button>
            </div>

            {/* Timeline Items */}
            <div className="space-y-8 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
              {activeTab === 'experience'
                ? experiences.map((exp, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="relative pl-10 group"
                    >
                      {/* Timeline Dot */}
                      <div className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-dark-900 border-2 border-accent-cyan group-hover:scale-125 group-hover:bg-accent-cyan transition-all" />
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-cyan/10 text-accent-cyan text-xs font-semibold mb-2">
                        <Calendar className="w-3.5 h-3.5" />
                        {exp.period}
                      </div>
                      <h4 className="font-display font-bold text-lg text-white group-hover:text-accent-electric transition-colors">
                        {exp.role}
                      </h4>
                      <span className="text-xs text-accent-violet font-semibold block mb-2">{exp.company}</span>
                      <p className="text-gray-300 text-sm leading-relaxed">{exp.description}</p>
                    </motion.div>
                  ))
                : education.map((edu, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="relative pl-10 group"
                    >
                      {/* Timeline Dot */}
                      <div className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-dark-900 border-2 border-accent-violet group-hover:scale-125 group-hover:bg-accent-violet transition-all" />
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-violet/10 text-accent-violet text-xs font-semibold mb-2">
                        <Calendar className="w-3.5 h-3.5" />
                        {edu.period}
                      </div>
                      <h4 className="font-display font-bold text-lg text-white group-hover:text-accent-violet transition-colors">
                        {edu.degree}
                      </h4>
                      <span className="text-xs text-accent-cyan font-semibold block mb-2">{edu.institution}</span>
                      <p className="text-gray-300 text-sm leading-relaxed">{edu.description}</p>
                    </motion.div>
                  ))}
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
