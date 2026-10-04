/**
 * paradu'l — Main Header and Top Navigation Bar
 *
 * Implements the 4 core navigation tabs:
 * 1. Gallery
 * 2. Outfit Manager
 * 3. Calendar
 * 4. Analytics
 *
 * Displays active tab indicators, branding, user session, and mock logout.
 */

import {
  IconShirt,
  IconHanger,
  IconCalendar,
  IconAnalytics,
  IconLogOut,
} from './common/Icons.jsx';

export default function Header({ activeTab, onSelectTab, currentUser, onLogout }) {
  const tabs = [
    { id: 'gallery', label: 'Gallery', icon: IconShirt },
    { id: 'outfits', label: 'Outfit Manager', icon: IconHanger },
    { id: 'calendar', label: 'Calendar', icon: IconCalendar },
    { id: 'analytics', label: 'Analytics', icon: IconAnalytics },
  ];

  return (
    <header className="app-header">
      <div className="header-inner">
        {/* Branding */}
        <div className="brand-group">
          <div
            className="brand-logo"
            onClick={() => onSelectTab('gallery')}
            role="button"
            tabIndex={0}
            title="paradu'l — wardrobe & style"
          >
            <img src="/logo.png" alt="paradu'l" className="brand-logo-img" />
            <span className="brand-tagline">wardrobe & style</span>
          </div>
        </div>

        {/* Top 4 Primary Navigation Tabs */}
        <nav className="header-nav" aria-label="Main Navigation">
          <ul className="nav-tabs-list">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <li key={tab.id}>
                  <button
                    type="button"
                    className={`nav-tab-btn ${isActive ? 'active' : ''}`}
                    onClick={() => onSelectTab(tab.id)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                    {isActive && <span className="active-pill-indicator" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Session & Utility Controls */}
        <div className="header-actions">
          {currentUser && (
            <div className="user-profile-menu">
              <div className="user-avatar-badge" title={currentUser.email}>
                {currentUser.avatar || 'U'}
              </div>
              <span className="user-display-name">{currentUser.name}</span>
              <button
                type="button"
                className="btn-ghost-icon logout-btn"
                onClick={onLogout}
                title="Sign Out"
                aria-label="Sign Out"
              >
                <IconLogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
