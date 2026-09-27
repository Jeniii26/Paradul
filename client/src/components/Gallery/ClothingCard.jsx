/**
 * paradu'l — Clothing Card Component
 *
 * Displays a single clothing item with transparent-safe neutral backdrop,
 * metadata badges (Category, Color, Price, Style), and quick actions
 * (toggle laundry, delete).
 */

import { CategoryBadge, LaundryBadge } from '../common/Badge.jsx';
import { IconTrash, IconLaundry, IconCheck, IconTag } from '../common/Icons.jsx';

export default function ClothingCard({ item, onToggleLaundry, onDelete }) {
  const isLaundry = item.laundryStatus === 'in_laundry';

  return (
    <article className={`clothing-card ${isLaundry ? 'is-laundry-card' : ''}`}>
      {/* Neutral backdrop container designed specifically for transparent PNGs */}
      <div className="clothing-image-container">
        <div className="transparency-checkered-canvas" />
        <img
          src={item.imageUrl}
          alt={item.name}
          className="clothing-image"
          loading="lazy"
        />
        <div className="card-top-badges">
          <CategoryBadge category={item.category} />
          <LaundryBadge status={item.laundryStatus} laundryUntil={item.laundryUntil} />
        </div>
      </div>

      <div className="clothing-info-content">
        <h3 className="clothing-name" title={item.name}>
          {item.name}
        </h3>

        <div className="clothing-meta-row">
          <span className="clothing-price">₱{Number(item.price || 0).toLocaleString()}</span>
          <span className="clothing-meta-bullet">•</span>
          <span className="clothing-style">{item.style || 'Casual'}</span>
        </div>

        <div className="clothing-color-row">
          <span
            className="color-chip-indicator"
            style={{
              backgroundColor: getColorHex(item.color),
              border: item.color?.toLowerCase() === 'white' ? '1px solid #d4d4d8' : 'none',
            }}
            aria-hidden="true"
          />
          <span className="color-name-text">{item.color}</span>
        </div>

        {/* Card actions: manual laundry toggle & delete */}
        <div className="clothing-card-actions">
          <button
            type="button"
            className={`btn-action-small ${isLaundry ? 'btn-available-action' : 'btn-laundry-action'}`}
            onClick={() => onToggleLaundry(item)}
            title={isLaundry ? 'Mark this item as clean and available' : 'Send this item to laundry'}
          >
            {isLaundry ? (
              <>
                <IconCheck size={14} />
                <span>Mark Clean</span>
              </>
            ) : (
              <>
                <IconLaundry size={14} />
                <span>Send to Laundry</span>
              </>
            )}
          </button>

          <button
            type="button"
            className="btn-delete-small"
            onClick={() => onDelete(item.id)}
            title="Remove item from wardrobe"
            aria-label={`Delete ${item.name}`}
          >
            <IconTrash size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}

/**
 * Returns representative hex colors for standard fashion palette
 */
function getColorHex(colorName = '') {
  const map = {
    white: '#fcfcfd',
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
  };
  return map[colorName.toLowerCase()] || '#a1a1aa';
}
