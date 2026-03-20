'use client';

import React, { useState } from 'react';
import { Bell, ArrowLeft, ChevronDown, User, LogOut, Menu } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

interface HeaderProps {
  toggleMenu?: () => void;
  isMobile?: boolean;
}

export default function Header({ toggleMenu, isMobile }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  let title = "Dashboard";
  if (pathname.includes('/assignments/create')) title = 'Create Assignment';
  else if (pathname.includes('/assignments')) title = 'Assignments';

  return (
    <header className="header-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {isMobile && (
          <button onClick={toggleMenu} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <Menu size={24} color="var(--text-main)" />
          </button>
        )}
        {!isMobile && pathname !== '/' && (
          <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <ArrowLeft size={20} />
          </button>
        )}
        <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LayoutGridIcon size={18} color="var(--text-muted)" /> {title}
        </h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <Bell size={20} />
          <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: 'var(--accent)', borderRadius: '50%' }} />
        </div>
        <div style={{ position: 'relative' }}>
          <div 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
            <span style={{ fontSize: '14px', fontWeight: 500 }}>John Doe</span>
            <ChevronDown size={16} color="var(--text-muted)" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
          </div>

          {dropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '12px',
              background: '#fff',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-md)',
              minWidth: '200px',
              zIndex: 50,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Link href="/profile" onClick={() => setDropdownOpen(false)} style={{
                padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'var(--text-main)', fontSize: '14px', borderBottom: '1px solid var(--border-color)'
              }}>
                <User size={16} /> My Profile
              </Link>
              <div onClick={() => setDropdownOpen(false)} style={{
                padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', color: '#FF3B30', fontSize: '14px'
              }}>
                <LogOut size={16} /> Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function LayoutGridIcon({ size, color }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
  );
}
