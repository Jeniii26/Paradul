/**
 * paradu'l — Digital Wardrobe Gallery View (Wireframe Spec)
 *
 * Implements the Figma wireframe Gallery specification:
 * 1. Hero Motivational Quote Banner with Cormorant Garamond quote and laundry basket artwork
 * 2. Ornamental flourish divider: ◇ ꕤ ◇
 * 3. Page title: "Digital Wardrobe" & dynamic curated pieces subtitle
 * 4. Category Pills: All | Tops | Bottoms | Shoes
 * 5. Toolbar with Search and compact STYLE, COLOR, STATUS, MAX PRICE selects
 * 6. Responsive 3-column clothing card grid
 */

import { useState, useMemo } from 'react';
import ClothingCard from './ClothingCard.jsx';
import UploadModal from './UploadModal.jsx';
import EditClothingModal from './EditClothingModal.jsx';
import {
  IconPlus,
  IconFilter,
  IconRefresh,
  IconSearch,
  IconChevronDown,
  FlourishDivider,
} from '../common/Icons.jsx';

export default function GalleryView({
  clothingItems,
  onAddItem,
  onToggleLaundry,
  onDeleteItem,
  onEditItem,
  onNavigateToTab,
}) {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // item being edited

  // Filter state
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all' | 'top' | 'bottom' | 'shoes'
  const [colorFilter, setColorFilter] = useState('all');
  const [styleFilter, setStyleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'available' | 'in_laundry'
  const [maxPriceFilter, setMaxPriceFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Rotating motivational quotes — one picked per login session
  const motivationalQuote = (() => {
    const quotes = [
      "Wear what makes you feel like yourself.",
      "Style is a way to say who you are without having to speak.",
      "Fashion fades, but your personal style is eternal.",
      "Dress how you want to be addressed.",
      "The best outfit is the one that makes you feel confident.",
      "Clothes are the closest thing to who we are.",
      "Simplicity is the ultimate sophistication in style.",
    ];
    const key = 'paradul_quote_index';
    let idx = parseInt(sessionStorage.getItem(key) ?? '-1', 10);
    if (idx < 0) {
      idx = Math.floor(Math.random() * quotes.length);
      sessionStorage.setItem(key, String(idx));
    }
    return quotes[idx % quotes.length];
  })();

  // Extract distinct colors and styles from existing items for dynamic filter options
  const availableColors = useMemo(() => {
    const set = new Set();
    clothingItems.forEach((item) => {
      if (item.color) set.add(item.color.trim());
    });
    return Array.from(set).sort();
  }, [clothingItems]);

  const availableStyles = useMemo(() => {
    const set = new Set();
    clothingItems.forEach((item) => {
      if (item.style) set.add(item.style.trim());
    });
    return Array.from(set).sort();
  }, [clothingItems]);

  // Combined filtering logic
  const filteredItems = useMemo(() => {
    return clothingItems.filter((item) => {
      // 1. Primary category filter
      if (categoryFilter !== 'all' && item.category !== categoryFilter) {
        return false;
      }
      // 2. Status filter (available vs in_laundry)
      if (statusFilter !== 'all' && item.laundryStatus !== statusFilter) {
        return false;
      }
      // 3. Color filter
      if (colorFilter !== 'all' && item.color?.toLowerCase() !== colorFilter.toLowerCase()) {
        return false;
      }
      // 4. Style filter
      if (styleFilter !== 'all' && item.style?.toLowerCase() !== styleFilter.toLowerCase()) {
        return false;
      }
      // 5. Price filter
      if (maxPriceFilter && Number(item.price) > Number(maxPriceFilter)) {
        return false;
      }
      // 6. Text search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name?.toLowerCase().includes(query);
        const matchesColor = item.color?.toLowerCase().includes(query);
        const matchesStyle = item.style?.toLowerCase().includes(query);
        if (!matchesName && !matchesColor && !matchesStyle) {
          return false;
        }
      }

      return true;
    });
  }, [
    clothingItems,
    categoryFilter,
    statusFilter,
    colorFilter,
    styleFilter,
    maxPriceFilter,
    searchQuery,
  ]);

  const hasActiveFilters =
    categoryFilter !== 'all' ||
    statusFilter !== 'all' ||
    colorFilter !== 'all' ||
    styleFilter !== 'all' ||
    Boolean(maxPriceFilter) ||
    Boolean(searchQuery);

  const resetFilters = () => {
    setCategoryFilter('all');
    setStatusFilter('all');
    setColorFilter('all');
    setStyleFilter('all');
    setMaxPriceFilter('');
    setSearchQuery('');
  };

  return (
    <div className="gallery-wireframe-view">
      {/* 1. Hero Motivational Quote Banner */}
      <section className="quote-hero-card">
        <div className="quote-hero-left">
          <h2 className="quote-hero-text">
            {motivationalQuote}
          </h2>
        </div>
        <div className="quote-hero-right">
          <img
            src="/banner.png"
            alt="Laundry Basket Illustration"
            className="quote-basket-artwork"
          />
        </div>
      </section>

      {/* Decorative Flourish Divider */}
      <FlourishDivider className="wireframe-section-sep" />

      {/* 2. Page Title Header & Add Action */}
      <section className="wireframe-page-heading-row">
        <div className="heading-title-group">
          <h1 className="wireframe-main-title">Digital Wardrobe</h1>
          <p className="wireframe-main-subtitle">
            {clothingItems.length} curated pieces • {filteredItems.length} matching view
          </p>
        </div>

        <div className="heading-actions-group">
          <button
            type="button"
            className="btn-wireframe-primary"
            onClick={() => setIsUploadOpen(true)}
          >
            <IconPlus size={15} />
            <span>Add Clothing</span>
          </button>
        </div>
      </section>

      {/* 3. Category Pills: All | Tops | Bottoms | Shoes */}
      <section className="wireframe-category-pills-row" aria-label="Filter by clothing category">
        <button
          type="button"
          className={`wireframe-category-pill ${categoryFilter === 'all' ? 'active' : ''}`}
          onClick={() => setCategoryFilter('all')}
        >
          All
        </button>
        <button
          type="button"
          className={`wireframe-category-pill ${categoryFilter === 'top' ? 'active' : ''}`}
          onClick={() => setCategoryFilter('top')}
        >
          Tops
        </button>
        <button
          type="button"
          className={`wireframe-category-pill ${categoryFilter === 'bottom' ? 'active' : ''}`}
          onClick={() => setCategoryFilter('bottom')}
        >
          Bottoms
        </button>
        <button
          type="button"
          className={`wireframe-category-pill ${categoryFilter === 'shoes' ? 'active' : ''}`}
          onClick={() => setCategoryFilter('shoes')}
        >
          Shoes
        </button>
      </section>

      {/* 4. Secondary Filter Toolbar */}
      <section className="wireframe-filter-toolbar">
        {/* Search input */}
        <div className="wireframe-search-field">
          <IconSearch size={15} className="search-field-icon" />
          <input
            type="text"
            placeholder="SEARCH BY NAME, COLOR, STYLE..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search clothing items"
          />
        </div>

        {/* Dropdowns — order: Status → Color → Style → Max Price */}
        <div className="wireframe-dropdown-controls">
          {/* Status */}
          <div className="wireframe-select-wrap">
            <span className="select-prefix-label">STATUS:</span>
            <div className="select-input-container">
              <select
                id="filter-status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">ALL STATUSES</option>
                <option value="available">CLEAN / AVAILABLE</option>
                <option value="in_laundry">IN LAUNDRY</option>
              </select>
              <IconChevronDown size={13} className="select-arrow-icon" />
            </div>
          </div>

          {/* Color */}
          <div className="wireframe-select-wrap">
            <span className="select-prefix-label">COLOR:</span>
            <div className="select-input-container">
              <select
                id="filter-color"
                value={colorFilter}
                onChange={(e) => setColorFilter(e.target.value)}
              >
                <option value="all">ALL COLORS</option>
                {availableColors.map((col) => (
                  <option key={col} value={col}>
                    {col.toUpperCase()}
                  </option>
                ))}
              </select>
              <IconChevronDown size={13} className="select-arrow-icon" />
            </div>
          </div>

          {/* Style */}
          <div className="wireframe-select-wrap">
            <span className="select-prefix-label">STYLE:</span>
            <div className="select-input-container">
              <select
                id="filter-style"
                value={styleFilter}
                onChange={(e) => setStyleFilter(e.target.value)}
              >
                <option value="all">ALL STYLES</option>
                {availableStyles.map((sty) => (
                  <option key={sty} value={sty}>
                    {sty.toUpperCase()}
                  </option>
                ))}
              </select>
              <IconChevronDown size={13} className="select-arrow-icon" />
            </div>
          </div>

          {/* Max Price */}
          <div className="wireframe-select-wrap">
            <span className="select-prefix-label">MAX PRICE:</span>
            <div className="select-input-container">
              <select
                id="filter-price"
                value={maxPriceFilter}
                onChange={(e) => setMaxPriceFilter(e.target.value)}
              >
                <option value="">ANY PRICE</option>
                <option value="1000">UP TO ₱1,000</option>
                <option value="2000">UP TO ₱2,000</option>
                <option value="3000">UP TO ₱3,000</option>
              </select>
              <IconChevronDown size={13} className="select-arrow-icon" />
            </div>
          </div>

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <button
              type="button"
              className="wireframe-filter-reset-btn"
              onClick={resetFilters}
              title="Reset all active filters"
            >
              <IconRefresh size={13} />
              <span>RESET</span>
            </button>
          )}
        </div>

      </section>

      {/* 5. Main Clothing Grid or Empty State */}
      {filteredItems.length > 0 ? (
        <div className="wireframe-clothing-grid">
          {filteredItems.map((item) => (
            <ClothingCard
              key={item.id}
              item={item}
              onToggleLaundry={onToggleLaundry}
              onDelete={onDeleteItem}
              onEdit={setEditingItem}
            />
          ))}
        </div>
      ) : clothingItems.length === 0 ? (
        <div className="empty-state-card" role="region" aria-label="Empty wardrobe">
          <h2 className="empty-state-title">Your digital wardrobe is empty</h2>
          <p className="empty-state-desc">
            Upload your first clothing item to start mixing and matching outfits.
          </p>
          <button
            type="button"
            className="btn-wireframe-primary"
            onClick={() => setIsUploadOpen(true)}
          >
            <IconPlus size={16} />
            <span>Upload Clothing</span>
          </button>
        </div>
      ) : (
        <div className="empty-state-card" role="region" aria-label="No matching clothing items">
          <div className="empty-icon-circle">
            <IconFilter size={32} />
          </div>
          <h2 className="empty-state-title">No items match your filters</h2>
          <p className="empty-state-desc">
            Try resetting your category, color, or laundry status filters.
          </p>
          <button
            type="button"
            className="btn-wireframe-secondary"
            onClick={resetFilters}
          >
            <IconRefresh size={14} />
            <span>Reset Filters</span>
          </button>
        </div>
      )}

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSaveItem={onAddItem}
      />

      {/* Edit Clothing Modal */}
      {editingItem && (
        <EditClothingModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={async (updates) => {
            if (onEditItem) await onEditItem(editingItem.id, updates);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
}
