const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Portfolio = require('./models/Portfolio');
const Category = require('./models/Category');
const Visitor = require('./models/Visitor');
const Message = require('./models/Message');

dotenv.config();

const categoriesData = [
  { name: 'UI/UX Design', slug: 'ui-ux-design', description: 'User Interface & User Experience Design', order: 1 },
  { name: 'Web Development', slug: 'web-development', description: 'Full-stack & Frontend Web Applications', order: 2 },
  { name: 'Branding', slug: 'branding', description: 'Brand Identity & Visual Guidelines', order: 3 },
  { name: 'Mobile App', slug: 'mobile-app', description: 'iOS & Android App Design & Development', order: 4 },
  { name: 'Graphic Design', slug: 'graphic-design', description: 'Visual Assets, Posters, & Digital Art', order: 5 },
  { name: 'Video / Motion Graphic', slug: 'video-motion-graphic', description: '2D/3D Motion Design & Video Editing', order: 6 },
];

const samplePortfolios = [
  {
    title: 'NovaFin — Next-Gen AI Banking App',
    description: 'Platform perbankan digital berbasis AI dengan antarmuka futuristik, manajemen portofolio kripto & fiat, serta transaksi real-time dengan enkripsi end-to-end.',
    category: 'UI/UX Design',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
    mediaType: 'image',
    tools: ['Figma', 'Protopie', 'Principle', 'Design System'],
    demoLink: 'https://dribbble.com',
    githubLink: '',
    date: '2026',
    tags: ['Fintech', 'Mobile UI', 'AI Interface', 'Glassmorphism'],
    isFeatured: true,
    views: 1420,
    order: 1,
  },
  {
    title: 'Aetheria — Minimalist E-Commerce Platform',
    description: 'Situs e-commerce luxury fashion menggunakan React, Next.js 14, Tailwind CSS, dan Stripe integration. Kecepatan load super instan dengan animasi transisi smooth.',
    category: 'Web Development',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
    mediaType: 'image',
    tools: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Node.js', 'MongoDB'],
    demoLink: 'https://example.com',
    githubLink: 'https://github.com',
    date: '2026',
    tags: ['E-Commerce', 'React', 'Full-Stack', 'Responsive'],
    isFeatured: true,
    views: 2150,
    order: 2,
  },
  {
    title: 'Luminary Co. — Brand Identity & Strategy',
    description: 'Identitas visual menyeluruh untuk startup energi terbarukan global. Meliputi desain logo, sistem tipografi, panduan warna, alat promosi, dan stationary set.',
    category: 'Branding',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
    mediaType: 'image',
    tools: ['Adobe Illustrator', 'Photoshop', 'InDesign', 'Brand Guidelines'],
    demoLink: 'https://behance.net',
    githubLink: '',
    date: '2025',
    tags: ['Brand Identity', 'Logo Design', 'Guidelines', 'Eco Friendly'],
    isFeatured: true,
    views: 980,
    order: 3,
  },
  {
    title: 'PulseFit — Smart Fitness & Health Tracker',
    description: 'Aplikasi pelacak kebugaran dengan koneksi smartwatch, rekomendasi latihan cerdas, grafik kalori real-time, dan fitur kompetisi komunitas.',
    category: 'Mobile App',
    thumbnail: 'https://images.unsplash.com/photo-1510519138161-58446231f11c?auto=format&fit=crop&q=80&w=1200',
    mediaType: 'image',
    tools: ['React Native', 'Figma', 'Redux Toolkit', 'HealthKit API'],
    demoLink: 'https://apple.com/app-store',
    githubLink: 'https://github.com',
    date: '2025',
    tags: ['Mobile App', 'Fitness', 'iOS', 'Android'],
    isFeatured: false,
    views: 840,
    order: 4,
  },
  {
    title: 'Cyberpunk City — 3D Cybernetic Poster Series',
    description: 'Serial karya seni digital bertema cyberpunk dengan kombinasi 3D rendering Blender, efek pencahayaan neon kustom, dan komposisi tipografi eksperimental.',
    category: 'Graphic Design',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
    mediaType: 'image',
    tools: ['Blender 3D', 'Photoshop', 'Lightroom', 'Cinema 4D'],
    demoLink: 'https://artstation.com',
    githubLink: '',
    date: '2025',
    tags: ['3D Art', 'Poster', 'Cyberpunk', 'Digital Art'],
    isFeatured: false,
    views: 1100,
    order: 5,
  },
  {
    title: 'Orbit — Futuristic Brand Teaser & Motion Graphic',
    description: 'Video teaser peluncuran produk SaaS dengan gerakan kamera 3D dinamis, efek partikel, dan animasi kinetik tipografi yang menghidupkan narasi brand.',
    category: 'Video / Motion Graphic',
    thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=1200',
    mediaType: 'image',
    tools: ['After Effects', 'Premiere Pro', 'Cinema 4D', 'Octane Render'],
    demoLink: 'https://youtube.com',
    githubLink: '',
    date: '2026',
    tags: ['Motion Graphic', 'Video Editing', '3D Animation', 'Showreel'],
    isFeatured: true,
    views: 1750,
    order: 6,
  },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio');
    console.log('Database connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Portfolio.deleteMany({});
    await Visitor.deleteMany({});
    await Message.deleteMany({});

    // Create Admin User
    const adminUser = new User({
      username: 'admin',
      password: 'admin123', // Will be hashed via pre-save hook
      name: 'Alex Rivera',
      title: 'Creative Designer & Full-Stack Developer',
      bio: 'Saya seorang desainer dan pengembang web apasionat yang berfokus menciptakan pengalaman digital modern, interaktif, dan berestetika tinggi.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
      location: 'Jakarta, Indonesia',
      email: 'contact@alexrivera.dev',
      socialLinks: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        dribbble: 'https://dribbble.com',
        instagram: 'https://instagram.com',
        twitter: 'https://x.com',
      },
      stats: {
        yearsExperience: 5,
        completedProjects: 42,
        happyClients: 30,
      },
      experiences: [
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
      ],
      education: [
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
      ],
      skillCategories: [
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
      ],
      toolsIcons: [
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
      ],
    });

    await adminUser.save();
    console.log('Default Admin created (username: admin, password: admin123)');

    // Seed Categories
    await Category.insertMany(categoriesData);
    console.log('Categories seeded successfully');

    // Seed Portfolios
    await Portfolio.insertMany(samplePortfolios);
    console.log('Sample portfolio items seeded successfully');

    // Seed initial Visitor analytics
    const mockVisitors = [];
    const now = new Date();
    for (let i = 0; i < 40; i++) {
      const daysAgo = Math.floor(Math.random() * 7);
      const logDate = new Date(now);
      logDate.setDate(logDate.getDate() - daysAgo);

      mockVisitors.push({
        path: Math.random() > 0.5 ? '/' : '/portfolio',
        referrer: Math.random() > 0.6 ? 'https://google.com' : Math.random() > 0.5 ? 'https://linkedin.com' : 'Direct',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        createdAt: logDate,
      });
    }
    await Visitor.insertMany(mockVisitors);
    console.log('Visitor analytics seeded successfully');

    // Seed initial Message
    await Message.create({
      name: 'Budi Santoso',
      email: 'budi@techfirm.id',
      subject: 'Penawaran Kerjasama Proyek Redesain Web',
      message: 'Halo Alex, saya sangat terkesan dengan portofolio Anda. Kami ingin menawarkan proyek redesign situs perusahaan kami. Apakah Anda tersedia untuk diskusi minggu ini?',
      isRead: false,
    });
    console.log('Sample contact message seeded');

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
