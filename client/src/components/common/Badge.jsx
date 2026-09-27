/**
 * paradu'l — Badge Components
 * Category badges (Top, Bottom, Shoes) and Laundry status indicators.
 */

import { IconShirt, IconPants, IconShoes, IconLaundry, IconCheck } from './Icons.jsx';
import { formatLaundryTimeRemaining } from '../../services/laundryService.js';

export function CategoryBadge({ category, size = 'sm' }) {
  const normalized = (category || 'top').toLowerCase();

  const config = {
    top: { label: 'Top', icon: IconShirt, className: 'badge-top' },
    bottom: { label: 'Bottom', icon: IconPants, className: 'badge-bottom' },
    shoes: { label: 'Shoes', icon: IconShoes, className: 'badge-shoes' },
  }[normalized] || { label: category, icon: IconShirt, className: 'badge-default' };

  const Icon = config.icon;

  return (
    <span className={`badge category-badge ${config.className} badge-${size}`}>
      <Icon size={size === 'sm' ? 12 : 14} />
      <span>{config.label}</span>
    </span>
  );
}

export function LaundryBadge({ status, laundryUntil, size = 'sm' }) {
  const isLaundry = status === 'in_laundry';

  if (isLaundry) {
    const timeLabel = formatLaundryTimeRemaining(laundryUntil);
    return (
      <span
        className={`badge laundry-badge in-laundry badge-${size}`}
        title={`In Laundry: ${timeLabel}`}
      >
        <IconLaundry size={size === 'sm' ? 12 : 14} />
        <span>In Laundry</span>
        {laundryUntil && <span className="badge-subtext">({timeLabel})</span>}
      </span>
    );
  }

  return (
    <span className={`badge laundry-badge available badge-${size}`}>
      <IconCheck size={size === 'sm' ? 12 : 14} />
      <span>Available</span>
    </span>
  );
}
