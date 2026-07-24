import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// DevTools Security & Anti Self-XSS Console Banner
if (typeof window !== 'undefined') {
  console.log(
    '%cBERHENTI! 🛑\n%cIni adalah fitur peramban (Inspect Element) yang ditujukan untuk pengembang. Mengubah tampilan di sini HANYA mengubah tampilan lokal pada layar Anda dan TIDAK AKAN PERNAH mengubah data di server / database.',
    'color: #ef4444; font-size: 22px; font-weight: bold;',
    'color: #06b6d4; font-size: 13px; line-height: 1.5;'
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
