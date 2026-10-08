/**
 * paradu'l — Clothing Card Component (Wireframe Spec)
 *
 * Implements the Figma wireframe card layout:
 * - Inset rounded photo frame with clean porcelain/linen background
 * - Top-left: rank badge (#1/#2/#3) when `rank` prop is provided, otherwise status dot badge
 * - Micro category & size line: "BLOUSES · SIZE S"
 * - Cormorant Garamond serif title: "Ivory Linen Blouse"
 * - Subtitle description: "Mandarin collar · Mother-of-pearl buttons"
 * - Hairline divider
 * - Footer: Color dot indicator + name on left, wear count ("Worn 14×") on right
 * - Subtle hover overlay for quick edit, laundry toggle & delete actions
 */

import { IconTrash, IconLaundry, IconCheck, IconEdit } from '../common/Icons.jsx';

export default function ClothingCard({
  item,
  wearCount,
  rank,         // 1 | 2 | 3 — shows rank badge instead of status dot (used in Analytics)
  onToggleLaundry,
  onDelete,
  onEdit,
}) {
  const isLaundry = item.laundryStatus === 'in_laundry';

  // Format micro-category line (e.g. "BLOUSES · SIZE S" or "TOPS · CASUAL")
  const microCategory = formatMicroCategory(item);

  // Fallback description matching the editorial wireframe style
  const description =
    item.description ||
    item.details ||
    getDefaultDescription(item);

  const displayWearCount =
    wearCount !== undefined && wearCount !== null
      ? wearCount
      : item.wearCount !== undefined
      ? item.wearCount
      : 0;

  return (
    <article className={`wireframe-clothing-card ${isLaundry ? 'is-laundry-card' : ''}`}>
      {/* 1. Inset Image Frame */}
      <div className="card-photo-frame">
        {/* Top-left badge: rank badge in analytics, status dot in gallery */}
        {rank ? (
          <span className="card-rank-badge" aria-label={`Rank ${rank}`}>
            #{rank}
          </span>
        ) : (
          <span
            className={`card-status-dot-badge ${isLaundry ? 'status-laundry' : 'status-clean'}`}
            title={isLaundry ? 'In Laundry' : 'Clean and Available'}
            onClick={(e) => {
              if (onToggleLaundry) {
                e.stopPropagation();
                onToggleLaundry(item);
              }
            }}
            role="button"
            tabIndex={0}
          >
            <span className="badge-dot" />
            <span>{isLaundry ? 'In Laundry' : 'Clean'}</span>
          </span>
        )}

        {/* Clothing Image with Transparent Backdrop */}
        <div className="card-photo-wrapper">
          <div className="transparency-checkered-canvas" />
          <img
            src={item.imageUrl}
            alt={item.name}
            className="wireframe-clothing-img"
            loading="lazy"
          />
        </div>

        {/* Quick action buttons overlay (edit, laundry toggle, delete) */}
        <div className="card-hover-actions">
          {onEdit && (
            <button
              type="button"
              className="btn-card-quick-edit"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
              title="Edit clothing details"
              aria-label={`Edit ${item.name}`}
            >
              <IconEdit size={13} />
              <span>Edit</span>
            </button>
          )}

          {onToggleLaundry && (
            <button
              type="button"
              className={`btn-card-quick-laundry ${isLaundry ? 'clean-btn' : 'laundry-btn'}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleLaundry(item);
              }}
              title={isLaundry ? 'Mark item clean' : 'Send item to laundry'}
            >
              {isLaundry ? <IconCheck size={13} /> : <IconLaundry size={13} />}
              <span>{isLaundry ? 'Mark Clean' : 'Laundry'}</span>
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              className="btn-card-quick-delete"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
              title="Remove item from wardrobe"
              aria-label={`Delete ${item.name}`}
            >
              <IconTrash size={13} />
            </button>
          )}
        </div>
      </div>

      {/* 2. Metadata Content */}
      <div className="card-body-content">
        <span className="card-micro-category">{microCategory}</span>

        <h3 className="card-item-title" title={item.name}>
          {item.name}
        </h3>

        <p className="card-item-description" title={description}>
          {description}
        </p>

        <div className="card-hairline-sep" />

        <div className="card-footer-info">
          <div className="card-color-indicator">
            <span
              className="card-color-dot"
              style={{
                backgroundColor: getColorHex(item.color),
                border: item.color?.toLowerCase() === 'white' ? '1px solid #d4d4d8' : 'none',
              }}
              aria-hidden="true"
            />
            <span className="card-color-name">{item.color || 'Neutral'}</span>
          </div>

          <div className="card-wear-stat">
            Worn {displayWearCount}×
          </div>
        </div>
      </div>
    </article>
  );
}

function formatMicroCategory(item) {
  const cat = (item.category || 'top').toLowerCase();
  const label =
    cat === 'top' ? 'TOPS' : cat === 'bottom' ? 'BOTTOMS' : cat === 'shoes' ? 'SHOES' : cat.toUpperCase();
  const sizeOrStyle = item.size ? `SIZE ${item.size}` : item.style ? item.style.toUpperCase() : 'STANDARD';
  return `${label} · ${sizeOrStyle}`;
}

function getDefaultDescription(item) {
  const style = item.style || 'Casual';
  const price = item.price ? `₱${Number(item.price).toLocaleString()}` : null;
  if (price) {
    return `${style} staple · Valued at ${price}`;
  }
  return `${style} staple · Tailored silhouette`;
}

function getColorHex(colorName = '') {
  const map = {
    white: '#fcfcfd',
    ivory: '#fbf9f4',
    black: '#18181b',
    navy: '#1e293b',
    blue: '#3b82f6',
    beige: '#e7dfd5',
    brown: '#78350f',
    grey: '#71717a',
    gray: '#71717a',
    red: '#ef4444',
    green: '#22c55e',
    olive: '#65a30d',
    pink: '#ec4899',
    yellow: '#eab308',
    burgundy: '#881337',
    lilac: '#c4b5d4',
    sage: '#bdc6b7',
    plum: '#472c61',
  };
  return map[colorName.toLowerCase()] || '#a1a1aa';
}
