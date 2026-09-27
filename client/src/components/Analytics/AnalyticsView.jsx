/**
 * paradu'l — Wardrobe Analytics & Style Insights View
 *
 * Displays:
 * 1. Top 3 Most Used Clothing (strictly derived from confirmed wear logs)
 * 2. Most Used Outfit (or "No outfit usage data yet.")
 * 3. Most Used Color in worn outfits
 * 4. Total Wardrobe Value (sum of active clothing prices in ₱, counted once)
 * 5. Category distribution and laundry status breakdown
 * 6. Historical wear logs table
 */

import { useMemo } from 'react';
import {
  getTopUsedClothing,
  getTopOutfit,
  getTopColor,
  getTotalWardrobeValue,
  getCategoryBreakdown,
  getLaundryBreakdown,
} from '../../services/analyticsService.js';
import { CategoryBadge } from '../common/Badge.jsx';
import {
  IconAnalytics,
  IconShirt,
  IconHanger,
  IconTag,
  IconCheck,
  IconCalendar,
  IconLaundry,
} from '../common/Icons.jsx';

export default function AnalyticsView({
  clothingItems,
  outfits,
  wearRecords,
  onNavigateToTab,
}) {
  // Pure calculations from analyticsService
  const topClothing = useMemo(
    () => getTopUsedClothing(clothingItems, outfits, wearRecords, 3),
    [clothingItems, outfits, wearRecords]
  );

  const topOutfitData = useMemo(
    () => getTopOutfit(outfits, wearRecords),
    [outfits, wearRecords]
  );

  const topColorData = useMemo(
    () => getTopColor(clothingItems, outfits, wearRecords),
    [clothingItems, outfits, wearRecords]
  );

  const totalValue = useMemo(
    () => getTotalWardrobeValue(clothingItems),
    [clothingItems]
  );

  const categoryCounts = useMemo(
    () => getCategoryBreakdown(clothingItems),
    [clothingItems]
  );

  const laundryCounts = useMemo(
    () => getLaundryBreakdown(clothingItems),
    [clothingItems]
  );

  const outfitMap = useMemo(
    () => new Map(outfits.map((o) => [String(o.id), o])),
    [outfits]
  );

  const hasWearData = wearRecords.length > 0;

  return (
    <div className="analytics-view">
      {/* View Header */}
      <section className="view-header">
        <div>
          <h1 className="view-title">Wardrobe Analytics</h1>
          <p className="view-subtitle">
            Data insights derived from {wearRecords.length} recorded wear {wearRecords.length === 1 ? 'event' : 'events'} across {clothingItems.length} clothing items
          </p>
        </div>
      </section>

      {/* Top 4 Key Metric Cards Grid */}
      <section className="analytics-metrics-grid">
        {/* Metric 1: Total Wardrobe Value (Requirement #39) */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Total Wardrobe Value</span>
            <div className="metric-icon-wrap">
              <IconTag size={16} />
            </div>
          </div>
          <div className="metric-main-value">
            ₱{totalValue.toLocaleString()}
          </div>
          <p className="metric-caption">
            Sum of all {clothingItems.length} active clothing items counted exactly once.
          </p>
        </div>

        {/* Metric 2: Top Outfit (Requirement #37) */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Most Used Outfit</span>
            <div className="metric-icon-wrap">
              <IconHanger size={16} />
            </div>
          </div>
          {topOutfitData ? (
            <>
              <div className="metric-main-value truncate" title={topOutfitData.outfit.name}>
                {topOutfitData.outfit.name}
              </div>
              <p className="metric-caption highlight-caption">
                <strong>{topOutfitData.wearCount}</strong> confirmed {topOutfitData.wearCount === 1 ? 'wear' : 'wears'}
                {topOutfitData.outfit.style ? ` • ${topOutfitData.outfit.style}` : ''}
              </p>
            </>
          ) : (
            <>
              <div className="metric-empty-text">No outfit usage data yet.</div>
              <p className="metric-caption">
                Mark outfits as worn in the Calendar to start tracking wear patterns.
              </p>
            </>
          )}
        </div>

        {/* Metric 3: Top Color (Requirement #38) */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Most Used Color</span>
            <div className="metric-icon-wrap">
              <IconShirt size={16} />
            </div>
          </div>
          {topColorData ? (
            <>
              <div className="metric-color-row">
                <span
                  className="metric-color-dot"
                  style={{
                    backgroundColor: getColorHex(topColorData.color),
                    border: topColorData.color?.toLowerCase() === 'white' ? '1px solid #d4d4d8' : 'none',
                  }}
                  aria-hidden="true"
                />
                <span className="metric-main-value">{topColorData.color}</span>
              </div>
              <p className="metric-caption highlight-caption">
                <strong>{topColorData.count}</strong> appearances across confirmed outfits
              </p>
            </>
          ) : (
            <>
              <div className="metric-empty-text">No color data yet.</div>
              <p className="metric-caption">Calculated from confirmed worn outfits.</p>
            </>
          )}
        </div>

        {/* Metric 4: Closet Availability */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Laundry & Availability</span>
            <div className="metric-icon-wrap">
              <IconLaundry size={16} />
            </div>
          </div>
          <div className="metric-main-value">
            {laundryCounts.available} Clean / {laundryCounts.inLaundry} Laundry
          </div>
          <p className="metric-caption">
            {clothingItems.length > 0
              ? `${Math.round((laundryCounts.available / clothingItems.length) * 100)}% of wardrobe ready to wear`
              : 'Add items to view availability'}
          </p>
        </div>
      </section>

      {/* Main Section: Top 3 Most Used Clothing (Requirement #36) */}
      <section className="analytics-section-card">
        <div className="section-card-header">
          <div>
            <h2 className="section-title">Top 3 Most Used Clothing</h2>
            <p className="section-subtitle">
              Strictly counted from actual worn-outfit records (saved outfits do not count)
            </p>
          </div>
        </div>

        {topClothing.length > 0 ? (
          <div className="top-clothing-podium">
            {topClothing.map(({ item, wearCount }, index) => {
              const rankLabel = `#${index + 1}`;
              return (
                <article key={item.id} className="podium-card">
                  <span className={`podium-rank-badge rank-${index + 1}`}>
                    {rankLabel}
                  </span>

                  <div className="podium-image-frame">
                    <div className="transparency-checkered-canvas" />
                    <img src={item.imageUrl} alt={item.name} className="podium-img" />
                  </div>

                  <div className="podium-info">
                    <h3 className="podium-item-name" title={item.name}>
                      {item.name}
                    </h3>
                    <div className="podium-meta">
                      <CategoryBadge category={item.category} size="xs" />
                      <span className="podium-color">{item.color}</span>
                    </div>

                    <div className="podium-wear-banner">
                      <span className="podium-count-num">{wearCount}</span>
                      <span className="podium-count-text">
                        {wearCount === 1 ? 'wear' : 'wears'}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="analytics-empty-panel">
            <IconShirt size={30} />
            <p>Your insights will appear here once you start wearing and recording outfits.</p>
            <p className="empty-subtext">
              Go to the Calendar and click "[ Mark as Worn ]" on any scheduled look to record wear counts.
            </p>
          </div>
        )}
      </section>

      {/* Category Breakdown & Wardrobe Distribution */}
      <section className="analytics-two-col-grid">
        <div className="analytics-section-card">
          <h2 className="section-title">Category Distribution</h2>
          <p className="section-subtitle">Inventory breakdown across primary pieces</p>

          <div className="category-progress-list">
            <div className="progress-item">
              <div className="progress-label-row">
                <span>Tops</span>
                <strong>{categoryCounts.top} items</strong>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill fill-top"
                  style={{
                    width: `${categoryCounts.total ? (categoryCounts.top / categoryCounts.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div className="progress-item">
              <div className="progress-label-row">
                <span>Bottoms</span>
                <strong>{categoryCounts.bottom} items</strong>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill fill-bottom"
                  style={{
                    width: `${categoryCounts.total ? (categoryCounts.bottom / categoryCounts.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div className="progress-item">
              <div className="progress-label-row">
                <span>Shoes</span>
                <strong>{categoryCounts.shoes} items</strong>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill fill-shoes"
                  style={{
                    width: `${categoryCounts.total ? (categoryCounts.shoes / categoryCounts.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Confirmed Wear History Log */}
        <div className="analytics-section-card">
          <h2 className="section-title">Recent Wear Logs</h2>
          <p className="section-subtitle">Chronological record of verified outfit wears</p>

          {wearRecords.length > 0 ? (
            <ul className="wear-log-list">
              {wearRecords.slice(0, 5).map((record) => {
                const outfit = outfitMap.get(String(record.outfitId));
                return (
                  <li key={record.id} className="wear-log-row">
                    <div className="wear-log-date">
                      <IconCalendar size={13} />
                      <span>{record.wornDate}</span>
                    </div>
                    <div className="wear-log-outfit-name">
                      {outfit?.name || 'Custom Outfit'}
                    </div>
                    <span className="wear-verified-badge">
                      <IconCheck size={11} /> Verified
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="muted-notice">No wear logs recorded yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}

function getColorHex(colorName = '') {
  const map = {
    white: '#fcfcfd',
    black: '#18181b',
    navy: '#1e293b',
    blue: '#3b82f6',
    beige: '#e7dfd5',
    brown: '#78350f',
    grey: '#71717a',
    red: '#ef4444',
    green: '#22c55e',
    olive: '#65a30d',
    pink: '#ec4899',
    yellow: '#eab308',
  };
  return map[colorName.toLowerCase()] || '#a1a1aa';
}
