import React from 'react';
import { motion } from 'framer-motion';
import { Code, Layout, Server, Cpu, Database, Palette, ShieldCheck, Terminal, Layers, Sparkles } from 'lucide-react';

export default function Skills({ profile }) {
  const defaultSkillCategories = [
    {
      title: 'UI/UX & Visual Design',
      accent: 'accent-cyan',
      skills: [
        { name: 'Figma & Design Systems', level: 95 },
        { name: 'Wireframing & Prototyping', level: 90 },
        { name: 'User Research & Personas', level: 85 },
        { name: 'Adobe Creative Cloud', level: 88 },
      ],
    },
    {
      title: 'Frontend Development',
      accent: 'accent-electric',
      skills: [
        { name: 'React.js & Vite', level: 95 },
        { name: 'Tailwind CSS & SCSS', level: 95 },
        { name: 'Framer Motion & GSAP', level: 90 },
        { name: 'JavaScript (ES6+) & TypeScript', level: 92 },
      ],
    },
    {
      title: 'Backend & Database',
      accent: 'accent-violet',
      skills: [
        { name: 'Node.js & Express.js', level: 90 },
        { name: 'MongoDB & Mongoose', level: 88 },
        { name: 'RESTful API Architecture', level: 92 },
        { name: 'JWT Auth & Security', level: 85 },
      ],
    },
    {
      title: 'Tools & Motion Graphics',
      accent: 'accent-pink',
      skills: [
        { name: 'Git & GitHub Workflow', level: 92 },
        { name: 'After Effects & Cinema 4D', level: 80 },
        { name: 'Blender 3D Modeling', level: 75 },
        { name: 'Vercel / Netlify / Render', level: 88 },
      ],
    },
  ];

  const defaultToolsIcons = [
    { name: 'React', icon: '⚛️' },
    { name: 'Figma', icon: '🎨' },
    { name: 'Tailwind', icon: '🌊' },
    { name: 'Node.js', icon: '🟢' },
    { name: 'MongoDB', icon: '🍃' },
    { name: 'Framer Motion', icon: '⚡' },
    { name: 'TypeScript', icon: '📘' },
    { name: 'Blender', icon: '🍊' },
    { name: 'Adobe CC', icon: '🖌️' },
    { name: 'Git', icon: '🚀' },
  ];

  const skillCategories =
    profile?.skillCategories && profile.skillCategories.length > 0
      ? profile.skillCategories
      : defaultSkillCategories;

  const toolsIcons =
    profile?.toolsIcons && profile.toolsIcons.length > 0
      ? profile.toolsIcons
      : defaultToolsIcons;

  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-accent-cyan font-display text-sm font-semibold tracking-widest uppercase flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" /> Kualifikasi Teknikal
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white">
            Keahlian & <span className="text-gradient">Tools</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">
            Kombinasi alat desain modern dan arsitektur pengodingan tingkat lanjut yang saya gunakan setiap hari.
          </p>
        </motion.div>

        {/* Scroll-Reveal Skill Badges Floating Grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, staggerChildren: 0.05 }}
        >
          {toolsIcons.map((tool, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass-card p-4 rounded-2xl border border-white/10 flex items-center gap-3 text-center sm:text-left shadow-lg hover:border-accent-cyan/40"
            >
              <span className="text-2xl">{tool.icon}</span>
              <span className="font-display font-semibold text-sm text-gray-200">{tool.name}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Category Skill Progress Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillCategories.map((category, catIdx) => (
            <motion.div
              key={catIdx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: catIdx * 0.1 }}
              className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6 shadow-xl"
            >
              {/* Category Title */}
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="w-10 h-10 rounded-xl bg-accent-cyan/15 flex items-center justify-center text-accent-cyan">
                  {typeof category.icon === 'function' ? (
                    <category.icon className="w-5 h-5" />
                  ) : (
                    <Cpu className="w-5 h-5" />
                  )}
                </div>
                <h3 className="font-display font-bold text-xl text-white">{category.title}</h3>
              </div>

              {/* Skill Bars */}
              <div className="space-y-4">
                {category.skills.map((skill, skillIdx) => (
                  <div key={skillIdx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-gray-300">{skill.name}</span>
                      <span className="text-accent-cyan">{skill.level}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-dark-900 rounded-full overflow-hidden p-0.5 border border-white/5">
                      <motion.div
                        className="h-full bg-gradient-to-r from-accent-cyan to-accent-violet rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 + skillIdx * 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
