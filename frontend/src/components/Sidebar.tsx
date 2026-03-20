'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Users, FileText, Wrench, BookOpen, Settings, Plus } from 'lucide-react';
import styles from './Sidebar.module.css';

const navItems = [
  { name: 'Home', icon: LayoutGrid, path: '/' },
  { name: 'My Groups', icon: Users, path: '/groups' },
  { name: 'Assignments', icon: FileText, path: '/assignments' },
  { name: 'AI Teacher\'s Toolkit', icon: Wrench, path: '/toolkit' },
  { name: 'My Library', icon: BookOpen, path: '/library' },
];

interface SidebarProps {
  isMobile?: boolean;
  isOpen?: boolean;
  closeMenu?: () => void;
}

export default function Sidebar({ isMobile, isOpen, closeMenu }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={`${styles.sidebar} ${isMobile ? styles.sidebarMobile : ''} ${isOpen ? styles.open : ''}`}>
      <div className={styles.logoContainer}>
        <div className={styles.logoIcon}>V</div>
        <span className={styles.logoText}>VedaAI</span>
      </div>

      <Link href="/assignments/create" style={{ textDecoration: 'none' }}>
        <button className="btn-primary" style={{ width: '100%', marginBottom: '32px' }}>
          <Plus size={18} /> Create Assignment
        </button>
      </Link>

      <nav className={styles.nav}>
        {navItems.map((item) => {
          const isActive = pathname === item.path || (item.name === 'Assignments' && pathname.includes('/assignments'));
          return (
            <Link key={item.name} href={item.path} className={`${styles.navItem} ${isActive ? styles.active : ''}`}>
              <item.icon size={20} className={styles.navIcon} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.spacer} />

      <div className={styles.footer}>
        <Link href="/settings" className={styles.navItem}>
          <Settings size={20} className={styles.navIcon} />
          <span>Settings</span>
        </Link>
        <Link href="/profile" className={styles.profileSnippet} style={{ textDecoration: 'none' }}>
          <div className={styles.avatar}>D</div>
          <div className={styles.profileText}>
            <strong>Delhi Public School</strong>
            <span>Bokaro Steel City</span>
          </div>
        </Link>
      </div>
    </aside>
  );
}
