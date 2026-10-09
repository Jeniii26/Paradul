// paradu'l — Outfit Card Component

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

  const isAnyInLaundry =
    topItem?.laundryStatus === 'in_laundry' ||
    bottomItem?.laundryStatus === 'in_laundry' ||
    shoesItem?.laundryStatus === 'in_laundry';

  const microLabel = `${(outfit.style || 'CASUAL').toUpperCase()} · 3-PIECE ENSEMBLE`;

  return (
    <article className="wireframe-outfit-card">
      {/* 3-Trio Side-by-Side Photo Frames */}
      <div className="outfit-wireframe-frames-row">
        {/* Top Slot */}
        <div className="outfit-piece-frame top-frame" title={`Top: ${topItem?.name || 'Top piece'}`}>
          <div className="transparency-checkered-canvas" />
          {topItem ? (
            <img src={topItem.imageUrl} alt={topItem.name} className="piece-frame-img" />
          ) : (
            <div className="piece-placeholder"><IconShirt size={22} /></div>
          )}
        </div>

        {/* Bottom Slot */}
        <div className="outfit-piece-frame bottom-frame" title={`Bottom: ${bottomItem?.name || 'Bottom piece'}`}>
          <div className="transparency-checkered-canvas" />
          {bottomItem ? (
            <img src={bottomItem.imageUrl} alt={bottomItem.name} className="piece-frame-img" />
          ) : (
            <div className="piece-placeholder"><IconPants size={22} /></div>
          )}
        </div>

        {/* Shoes Slot */}
        <div className="outfit-piece-frame shoes-frame" title={`Shoes: ${shoesItem?.name || 'Shoes piece'}`}>
          <div className="transparency-checkered-canvas" />
          {shoesItem ? (
            <img src={shoesItem.imageUrl} alt={shoesItem.name} className="piece-frame-img" />
          ) : (
            <div className="piece-placeholder"><IconShoes size={22} /></div>
          )}
        </div>
      </div>

      {/* Outfit Information */}
      <div className="outfit-wireframe-info">
        <span className="outfit-micro-label">{microLabel}</span>

        <div className="outfit-title-wrap">
          <h3 className="outfit-serif-title" title={outfit.name}>
            {outfit.name}
          </h3>
          {wearCount > 0 && (
            <span className="outfit-wear-badge" title={`Confirmed worn ${wearCount} times`}>
              Worn {wearCount}×
            </span>
          )}
        </div>

        {isAnyInLaundry && (
          <span className="outfit-laundry-notice">
            Note: Contains pieces currently in laundry
          </span>
        )}

        <div className="card-hairline-sep" />

        {/* Bottom Action Bar */}
        <div className="outfit-bottom-action-bar">
          <button
            type="button"
            className="btn-outfit-schedule-wireframe"
            onClick={() => onSchedule(outfit)}
            title="Schedule this outfit on the calendar"
          >
            <span>Schedule</span>
          </button>

          <div className="outfit-aux-buttons-wireframe">
            <button
              type="button"
              className="btn-wireframe-icon-square"
              onClick={() => onEdit(outfit)}
              title="Edit outfit composition"
              aria-label={`Edit ${outfit.name}`}
            >
              <IconEdit size={14} />
            </button>

            <button
              type="button"
              className="btn-wireframe-icon-square danger"
              onClick={() => onDelete(outfit.id)}
              title="Delete outfit"
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
