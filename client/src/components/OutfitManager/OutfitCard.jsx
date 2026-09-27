/**
 * paradu'l — Outfit Card Component
 *
 * Displays a 3-part visual stack (Top -> Bottom -> Shoes), outfit metadata,
 * wear history counter, and actions: Schedule, Edit, Delete.
 */

import { IconCalendar, IconEdit, IconTrash, IconShirt, IconPants, IconShoes } from '../common/Icons.jsx';

export default function OutfitCard({
  outfit,
  clothingItems,
  wearCount = 0,
  onSchedule,
  onEdit,
  onDelete,
}) {
  const clothingMap = new Map(clothingItems.map((c) => [String(c.id), c]));

  const topItem = clothingMap.get(String(outfit.topId));
  const bottomItem = clothingMap.get(String(outfit.bottomId));
  const shoesItem = clothingMap.get(String(outfit.shoesId));

  // Check if any piece is currently in laundry
  const isAnyInLaundry =
    topItem?.laundryStatus === 'in_laundry' ||
    bottomItem?.laundryStatus === 'in_laundry' ||
    shoesItem?.laundryStatus === 'in_laundry';

  return (
    <article className="outfit-card">
      {/* 3-Tier Visual Stack: Top, Bottom, Shoes */}
      <div className="outfit-visual-stack">
        {/* Top Slot */}
        <div className="outfit-stack-tier top-tier" title={`Top: ${topItem?.name || 'Missing Top'}`}>
          <div className="transparency-checkered-canvas" />
          {topItem ? (
            <img src={topItem.imageUrl} alt={topItem.name} className="tier-image" />
          ) : (
            <div className="tier-placeholder"><IconShirt size={20} /></div>
          )}
          <span className="tier-label">Top</span>
        </div>

        {/* Bottom Slot */}
        <div className="outfit-stack-tier bottom-tier" title={`Bottom: ${bottomItem?.name || 'Missing Bottom'}`}>
          <div className="transparency-checkered-canvas" />
          {bottomItem ? (
            <img src={bottomItem.imageUrl} alt={bottomItem.name} className="tier-image" />
          ) : (
            <div className="tier-placeholder"><IconPants size={20} /></div>
          )}
          <span className="tier-label">Bottom</span>
        </div>

        {/* Shoes Slot */}
        <div className="outfit-stack-tier shoes-tier" title={`Shoes: ${shoesItem?.name || 'Missing Shoes'}`}>
          <div className="transparency-checkered-canvas" />
          {shoesItem ? (
            <img src={shoesItem.imageUrl} alt={shoesItem.name} className="tier-image" />
          ) : (
            <div className="tier-placeholder"><IconShoes size={20} /></div>
          )}
          <span className="tier-label">Shoes</span>
        </div>
      </div>

      {/* Outfit details and metadata */}
      <div className="outfit-info-panel">
        <div className="outfit-title-row">
          <h3 className="outfit-name">{outfit.name}</h3>
          {wearCount > 0 && (
            <span className="wear-count-badge" title={`Worn ${wearCount} time${wearCount === 1 ? '' : 's'}`}>
              {wearCount} {wearCount === 1 ? 'wear' : 'wears'}
            </span>
          )}
        </div>

        <div className="outfit-meta-tags">
          {outfit.style && <span className="meta-tag">{outfit.style}</span>}
          {outfit.colorTheme && <span className="meta-tag theme-tag">{outfit.colorTheme}</span>}
          {isAnyInLaundry && (
            <span className="meta-tag laundry-alert-tag">Contains pieces in laundry</span>
          )}
        </div>

        {outfit.notes && <p className="outfit-notes-text">{outfit.notes}</p>}

        {/* Actions Toolbar */}
        <div className="outfit-card-actions">
          <button
            type="button"
            className="btn-primary-small"
            onClick={() => onSchedule(outfit)}
            title="Schedule this outfit on your calendar"
          >
            <IconCalendar size={14} />
            <span>Schedule</span>
          </button>

          <div className="aux-actions-group">
            <button
              type="button"
              className="btn-action-icon"
              onClick={() => onEdit(outfit)}
              title="Edit outfit combination"
              aria-label={`Edit ${outfit.name}`}
            >
              <IconEdit size={14} />
            </button>

            <button
              type="button"
              className="btn-action-icon danger"
              onClick={() => onDelete(outfit.id)}
              title="Delete outfit (clothing items will not be deleted)"
              aria-label={`Delete ${outfit.name}`}
            >
              <IconTrash size={14} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
