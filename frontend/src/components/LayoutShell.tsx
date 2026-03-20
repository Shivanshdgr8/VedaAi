'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false); // reset
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="layout-container">
      {/* Sidebar logic inside Sidebar itself, or we pass state */}
      <Sidebar isMobile={isMobile} isOpen={mobileMenuOpen} closeMenu={() => setMobileMenuOpen(false)} />
      
      <div className="main-content-wrapper">
        <Header toggleMenu={() => setMobileMenuOpen(!mobileMenuOpen)} isMobile={isMobile} />
        <main className="main-content-area">
          {children}
        </main>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isMobile && mobileMenuOpen && (
        <div 
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
