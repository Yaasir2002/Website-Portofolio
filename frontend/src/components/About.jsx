import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Award, MapPin, Mail, Calendar, CheckCircle2, ExternalLink } from 'lucide-react';

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
      period: '2014 — 2017',
      degree: 'SMA / SMK Jurusan Rekayasa Perangkat Lunak',
      institution: 'SMK Informatika Indonesia',
      description: 'Mempelajari dasar-dasar pemrograman, jaringan komputer, dan perancangan database relational.',
    },
  ];

  const defaultCertifications = [
    {
      year: '2025',
      title: 'Certified Full-Stack Web Architect',
      issuer: 'Global Tech Institute',
      credentialUrl: 'https://credential.example.com',
      description: 'Sertifikasi kompetensi arsitektur cloud, microservices, dan sistem frontend skala besar.',
    },
    {
      year: '2024',
      title: 'Professional UI/UX Design Specialist',
      issuer: 'Figma & Design Academy',
      credentialUrl: 'https://credential.example.com',
      description: 'Sertifikasi keahlian Design System, Aksesibilitas WCAG 2.1, dan User Research.',
    },
  ];

  const experiences = profile?.experiences && profile.experiences.length > 0 ? profile.experiences : defaultExperiences;
  const education = profile?.education && profile.education.length > 0 ? profile.education : defaultEducation;
  const certifications = profile?.certifications && profile.certifications.length > 0 ? profile.certifications : defaultCertifications;

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

          {/* Right Side: Timeline Tabs (Experience vs Education vs Certifications) */}
          <motion.div
            className="lg:col-span-7 glass-panel p-8 rounded-3xl border border-white/10 space-y-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Tab Buttons */}
            <div className="flex items-center gap-2 sm:gap-6 border-b border-white/10 pb-4 overflow-x-auto">
              <button
                onClick={() => setActiveTab('experience')}
                className={`flex items-center gap-2 pb-2 text-sm sm:text-base font-display font-bold transition-all relative whitespace-nowrap ${
                  activeTab === 'experience' ? 'text-accent-cyan' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-accent-cyan" />
                <span>Pengalaman Kerja</span>
                {activeTab === 'experience' && (
                  <motion.div layoutId="aboutTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-cyan shadow-glow-cyan" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('education')}
                className={`flex items-center gap-2 pb-2 text-sm sm:text-base font-display font-bold transition-all relative whitespace-nowrap ${
                  activeTab === 'education' ? 'text-accent-violet' : 'text-gray-400 hover:text-white'
                }`}
              >
                <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-accent-violet" />
                <span>Pendidikan Formal</span>
                {activeTab === 'education' && (
                  <motion.div layoutId="aboutTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-violet shadow-glow-violet" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('certifications')}
                className={`flex items-center gap-2 pb-2 text-sm sm:text-base font-display font-bold transition-all relative whitespace-nowrap ${
                  activeTab === 'certifications' ? 'text-accent-emerald' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-accent-emerald" />
                <span>Sertifikasi</span>
                {activeTab === 'certifications' && (
                  <motion.div layoutId="aboutTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-emerald shadow-glow-emerald" />
                )}
              </button>
            </div>

            {/* Timeline Items */}
            <div className="space-y-8 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
              {activeTab === 'experience' &&
                experiences.map((exp, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="relative pl-10 group"
                  >
                    <div className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-dark-900 border-2 border-accent-cyan group-hover:scale-125 group-hover:bg-accent-cyan transition-all" />
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-cyan/10 text-accent-cyan text-xs font-semibold mb-2">
                      <Calendar className="w-3.5 h-3.5" />
                      {exp.period}
                    </div>
                    <h4 className="font-display font-bold text-lg text-white group-hover:text-accent-cyan transition-colors">
                      {exp.role}
                    </h4>
                    <span className="text-xs text-accent-violet font-semibold block mb-2">{exp.company}</span>
                    <p className="text-gray-300 text-sm leading-relaxed">{exp.description}</p>
                  </motion.div>
                ))}

              {activeTab === 'education' &&
                education.map((edu, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="relative pl-10 group"
                  >
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

              {activeTab === 'certifications' &&
                certifications.map((cert, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="relative pl-10 group"
                  >
                    <div className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-dark-900 border-2 border-accent-emerald group-hover:scale-125 group-hover:bg-accent-emerald transition-all" />
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-emerald/10 text-accent-emerald text-xs font-semibold mb-2">
                      <Award className="w-3.5 h-3.5" />
                      {cert.year}
                    </div>
                    <h4 className="font-display font-bold text-lg text-white group-hover:text-accent-emerald transition-colors flex items-center gap-2">
                      <span>{cert.title}</span>
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-accent-emerald transition-colors"
                          title="Lihat Kredensial Resmi"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </h4>
                    <span className="text-xs text-accent-cyan font-semibold block mb-2">{cert.issuer}</span>
                    <p className="text-gray-300 text-sm leading-relaxed">{cert.description}</p>
                  </motion.div>
                ))}
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
