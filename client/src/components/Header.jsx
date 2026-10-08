/**
 * paradu'l — Main Header and Top Navigation Bar
 *
 * Implements the Figma wireframe header specification:
 * 1. Topmost edge-to-edge dark plum banner: "REDISCOVER CLOTHES YOU ALREADY OWN"
 * 2. Centered paradu'l illustration logo with Account access in top-right
 * 3. Ornamental flourish divider: ◇ ꕤ ◇
 * 4. Centered editorial navigation tabs: Gallery | Outfit Manager | Calendar | Analytics
 * 5. Active tab underline indicator
 * 6. Bottom ornamental flourish divider: ◇ ꕤ ◇
 */

import { useState, useRef, useEffect } from 'react';
import {
  IconLogOut,
  FlourishDivider,
} from './common/Icons.jsx';

export default function Header({ activeTab, onSelectTab, currentUser, onLogout }) {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const accountRef = useRef(null);

  const tabs = [
    { id: 'gallery', label: 'Gallery' },
    { id: 'outfits', label: 'Outfit Manager' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'analytics', label: 'Analytics' },
  ];

  // Close account dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setIsAccountOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="app-header-wireframe">
      {/* 1. Top edge-to-edge banner */}
      <div className="top-rediscover-banner">
        <span>REDISCOVER</span>
        <span className="banner-spacer">&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <span>CLOTHES</span>
        <span className="banner-spacer">&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <span>YOU</span>
        <span className="banner-spacer">&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <span>ALREADY</span>
        <span className="banner-spacer">&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <span>OWN</span>
      </div>

      <div className="header-wireframe-inner">
        {/* Top Logo & Account Row */}
        <div className="header-brand-row">
          <div className="header-brand-spacer" aria-hidden="true" />
          
          <div
            className="header-brand-center"
            onClick={() => onSelectTab('gallery')}
            role="button"
            tabIndex={0}
            title="paradu'l — digital wardrobe"
          >
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="paradu'l" className="wireframe-logo-img" />
          </div>

          <div className="header-account-wrap" ref={accountRef}>
            <button
              type="button"
              className="btn-account-nav"
              onClick={() => setIsAccountOpen(!isAccountOpen)}
              aria-expanded={isAccountOpen}
              aria-label="Account Menu"
            >
              <span>Account</span>
            </button>

            {isAccountOpen && currentUser && (
              <div className="account-dropdown-card">
                <div className="account-dropdown-header">
                  <div className="user-avatar-badge">{currentUser.avatar || 'U'}</div>
                  <div className="account-user-meta">
                    <strong>{currentUser.name}</strong>
                    <span className="account-user-email">{currentUser.email}</span>
                  </div>
                </div>
                <hr className="account-dropdown-divider" />
                <button
                  type="button"
                  className="account-dropdown-item signout"
                  onClick={() => {
                    setIsAccountOpen(false);
                    onLogout();
                  }}
                >
                  <IconLogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* First flourish divider */}
        <FlourishDivider className="header-top-flourish" />

        {/* Primary Navigation Tabs */}
        <nav className="header-nav-wireframe" aria-label="Main Navigation">
          <ul className="nav-wireframe-list">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <li key={tab.id} className="nav-wireframe-item">
                  <button
                    type="button"
                    className={`nav-wireframe-btn ${isActive ? 'active' : ''}`}
                    onClick={() => onSelectTab(tab.id)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span>{tab.label}</span>
                    {isActive && <span className="nav-wireframe-underline" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Second flourish divider */}
        <FlourishDivider className="header-bottom-flourish" />
      </div>
    </header>
  );
}
