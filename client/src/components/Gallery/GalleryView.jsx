/**
 * paradu'l — Digital Wardrobe Gallery View
 *
 * Primary wardrobe dashboard supporting:
 * - Filtering by primary category (Top, Bottom, Shoes), color, style, price range, laundry status
 * - Combinable active filters with quick reset
 * - Responsive clothing grid with transparency-safe cards
 * - Real photo upload trigger
 * - Laundry status toggling and item deletion
 * - Meaningful empty states
 */

import { useState, useMemo } from 'react';
import ClothingCard from './ClothingCard.jsx';
import UploadModal from './UploadModal.jsx';
import {
  IconPlus,
  IconFilter,
  IconRefresh,
  IconShirt,
  IconPants,
  IconShoes,
} from '../common/Icons.jsx';

export default function GalleryView({
  clothingItems,
  onAddItem,
  onToggleLaundry,
  onDeleteItem,
  onNavigateToTab,
}) {
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Filter state
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all' | 'top' | 'bottom' | 'shoes'
  const [colorFilter, setColorFilter] = useState('all');
  const [styleFilter, setStyleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'available' | 'in_laundry'
  const [maxPriceFilter, setMaxPriceFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

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
    <div className="gallery-view">
      {/* Top Banner & Action Header */}
      <section className="view-header">
        <div>
          <h1 className="view-title">Digital Wardrobe</h1>
          <p className="view-subtitle">
            {clothingItems.length} curated pieces • {filteredItems.length} matching view
          </p>
        </div>

        <div className="view-header-actions">
          <button
            type="button"
            className="btn-primary-medium"
            onClick={() => setIsUploadOpen(true)}
          >
            <IconPlus size={16} />
            <span>Add Clothing</span>
          </button>
        </div>
      </section>

      {/* Primary Category Quick-Filter Bar */}
      <section className="category-tabs-bar" aria-label="Filter by primary category">
        <button
          type="button"
          className={`category-pill ${categoryFilter === 'all' ? 'active' : ''}`}
          onClick={() => setCategoryFilter('all')}
        >
          All Pieces ({clothingItems.length})
        </button>
        <button
          type="button"
          className={`category-pill ${categoryFilter === 'top' ? 'active' : ''}`}
          onClick={() => setCategoryFilter('top')}
        >
          <IconShirt size={14} />
          <span>Tops ({clothingItems.filter((i) => i.category === 'top').length})</span>
        </button>
        <button
          type="button"
          className={`category-pill ${categoryFilter === 'bottom' ? 'active' : ''}`}
          onClick={() => setCategoryFilter('bottom')}
        >
          <IconPants size={14} />
          <span>Bottoms ({clothingItems.filter((i) => i.category === 'bottom').length})</span>
        </button>
        <button
          type="button"
          className={`category-pill ${categoryFilter === 'shoes' ? 'active' : ''}`}
          onClick={() => setCategoryFilter('shoes')}
        >
          <IconShoes size={14} />
          <span>Shoes ({clothingItems.filter((i) => i.category === 'shoes').length})</span>
        </button>
      </section>

      {/* Secondary Combinable Filters Bar */}
      <section className="filters-toolbar">
        <div className="filters-group-row">
          {/* Search box */}
          <div className="filter-input-wrap search-wrap">
            <input
              type="text"
              placeholder="Search by name, color, style..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search clothing items"
            />
          </div>

          {/* Status selector */}
          <div className="filter-select-wrap">
            <label htmlFor="filter-status" className="filter-label">Status:</label>
            <select
              id="filter-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="available">Available</option>
              <option value="in_laundry">In Laundry</option>
            </select>
          </div>

          {/* Color selector */}
          <div className="filter-select-wrap">
            <label htmlFor="filter-color" className="filter-label">Color:</label>
            <select
              id="filter-color"
              value={colorFilter}
              onChange={(e) => setColorFilter(e.target.value)}
            >
              <option value="all">All Colors</option>
              {availableColors.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          {/* Style selector */}
          <div className="filter-select-wrap">
            <label htmlFor="filter-style" className="filter-label">Style:</label>
            <select
              id="filter-style"
              value={styleFilter}
              onChange={(e) => setStyleFilter(e.target.value)}
            >
              <option value="all">All Styles</option>
              {availableStyles.map((sty) => (
                <option key={sty} value={sty}>
                  {sty}
                </option>
              ))}
            </select>
          </div>

          {/* Price limit filter */}
          <div className="filter-select-wrap">
            <label htmlFor="filter-price" className="filter-label">Max Price:</label>
            <select
              id="filter-price"
              value={maxPriceFilter}
              onChange={(e) => setMaxPriceFilter(e.target.value)}
            >
              <option value="">Any Price</option>
              <option value="1000">Up to ₱1,000</option>
              <option value="2000">Up to ₱2,000</option>
              <option value="3000">Up to ₱3,000</option>
            </select>
          </div>

          {/* Reset button */}
          {hasActiveFilters && (
            <button
              type="button"
              className="btn-filter-reset"
              onClick={resetFilters}
              title="Reset all active filters"
            >
              <IconRefresh size={13} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </section>

      {/* Main Clothing Grid or Empty State */}
      {filteredItems.length > 0 ? (
        <div className="clothing-grid">
          {filteredItems.map((item) => (
            <ClothingCard
              key={item.id}
              item={item}
              onToggleLaundry={onToggleLaundry}
              onDelete={onDeleteItem}
            />
          ))}
        </div>
      ) : clothingItems.length === 0 ? (
        /* Empty State 1: Wardrobe has no items at all */
        <div className="empty-state-card" role="region" aria-label="Empty wardrobe">
          <div className="empty-icon-circle">
            <IconShirt size={38} />
          </div>
          <h2 className="empty-state-title">Your wardrobe is empty</h2>
          <p className="empty-state-desc">
            Upload your first clothing item to get started. You can snap real photos
            and automatically remove the background.
          </p>
          <button
            type="button"
            className="btn-primary-medium"
            onClick={() => setIsUploadOpen(true)}
          >
            <IconPlus size={16} />
            <span>Upload Clothing</span>
          </button>
        </div>
      ) : (
        /* Empty State 2: Filters returned 0 results */
        <div className="empty-state-card" role="region" aria-label="No matching clothing items">
          <div className="empty-icon-circle">
            <IconFilter size={32} />
          </div>
          <h2 className="empty-state-title">No items match your filters</h2>
          <p className="empty-state-desc">
            Try adjusting your category, color, or laundry status filters to see more pieces.
          </p>
          <button
            type="button"
            className="btn-secondary-medium"
            onClick={resetFilters}
          >
            <IconRefresh size={14} />
            <span>Clear Filters</span>
          </button>
        </div>
      )}

      {/* Upload Dialog */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSaveItem={onAddItem}
      />
    </div>
  );
}
