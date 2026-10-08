/**
 * paradu'l — Wardrobe Analytics & Style Insights View (Wireframe Spec)
 *
 * Implements the Figma wireframe Analytics specification:
 * 1. View Header: "Wardrobe Analytics" + subtitle
 * 2. 3 KPI cards: Total Wardrobe Value, Most Used Outfit, Most Used Color
 * 3. Laundry & Availability card
 * 4. Category Distribution with progress bars
 * 5. Recent Wear Logs section
 * 6. Top 3 Most Used Clothing section — cards show rank badge (#1, #2, #3)
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
import ClothingCard from '../Gallery/ClothingCard.jsx';
import {
  IconTag,
  IconHanger,
  IconPalette,
  IconShirt,
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

  const categoryBreakdown = useMemo(
    () => getCategoryBreakdown(clothingItems),
    [clothingItems]
  );

  const laundryBreakdown = useMemo(
    () => getLaundryBreakdown(clothingItems),
    [clothingItems]
  );

  const total = clothingItems.length;
  const availabilityPct = total > 0
    ? Math.round((laundryBreakdown.available / total) * 100)
    : 0;

  // Recent 5 wear records, newest first
  const recentWears = useMemo(() => {
    const outfitMap = new Map(outfits.map((o) => [String(o.id), o]));
    return [...wearRecords]
      .sort((a, b) => new Date(b.wornDate || b.createdAt) - new Date(a.wornDate || a.createdAt))
      .slice(0, 5)
      .map((rec) => ({
        ...rec,
        outfit: outfitMap.get(String(rec.outfitId)) || null,
      }));
  }, [wearRecords, outfits]);

  return (
    <div className="analytics-wireframe-view">
      {/* 1. View Header */}
      <section className="wireframe-page-heading-row">
        <div className="heading-title-group">
          <h1 className="wireframe-main-title">Wardrobe Analytics</h1>
          <p className="wireframe-main-subtitle">
            Data insights derived from {wearRecords.length} recorded wear {wearRecords.length === 1 ? 'event' : 'events'} across {clothingItems.length} clothing items
          </p>
        </div>
      </section>

      {/* 2. Top 3 Metric Summary Cards */}
      <section className="wireframe-metrics-triad-grid">
        {/* Metric 1: Total Wardrobe Value */}
        <div className="wireframe-kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-title-label">Total Wardrobe Value</span>
            <div className="kpi-icon-wrap" aria-hidden="true">
              <IconTag size={18} />
            </div>
          </div>
          <div className="kpi-main-number">
            ₱{totalValue.toLocaleString()}
          </div>
          <p className="kpi-bottom-caption">
            SUM OF ALL {clothingItems.length} ACTIVE CLOTHING ITEMS COUNTED EXACTLY ONCE.
          </p>
        </div>

        {/* Metric 2: Most Used Outfit */}
        <div className="wireframe-kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-title-label">Most Used Outfit</span>
            <div className="kpi-icon-wrap" aria-hidden="true">
              <IconHanger size={18} />
            </div>
          </div>
          {topOutfitData ? (
            <>
              <div className="kpi-main-number truncate" title={topOutfitData.outfit.name}>
                {topOutfitData.outfit.name}
              </div>
              <p className="kpi-bottom-caption">
                {topOutfitData.wearCount} CONFIRMED {topOutfitData.wearCount === 1 ? 'WEAR' : 'WEARS'}
                {topOutfitData.outfit.style ? ` • ${topOutfitData.outfit.style.toUpperCase()}` : ''}
              </p>
            </>
          ) : (
            <>
              <div className="kpi-main-number kpi-empty-text">No outfit worn yet</div>
              <p className="kpi-bottom-caption">
                CONFIRM WEAR ON CALENDAR TO TRACK OUTFIT USAGE
              </p>
            </>
          )}
        </div>

        {/* Metric 3: Most Used Color */}
        <div className="wireframe-kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-title-label">
              Most Used<br />Color
            </span>
            <div className="kpi-icon-wrap" aria-hidden="true">
              <IconPalette size={18} />
            </div>
          </div>
          {topColorData ? (
            <>
              <div className="kpi-main-number">
                {topColorData.color}
              </div>
              <p className="kpi-bottom-caption">
                {topColorData.count} APPEARANCES ACROSS CONFIRMED OUTFITS
              </p>
            </>
          ) : (
            <>
              <div className="kpi-main-number kpi-empty-text">No color data yet</div>
              <p className="kpi-bottom-caption">
                CALCULATED FROM CONFIRMED WORN OUTFITS
              </p>
            </>
          )}
        </div>
      </section>

      {/* 3. Laundry & Availability + Category Distribution — side by side */}
      <section className="analytics-dual-section">
        {/* Laundry & Availability */}
        <div className="analytics-section-card laundry-availability-card">
          <h2 className="analytics-section-title">Laundry &amp; Availability</h2>
          <p className="analytics-section-subtitle">CURRENT WARDROBE READINESS AT A GLANCE</p>

          <div className="laundry-stats-row">
            <div className="laundry-stat-block clean">
              <span className="laundry-stat-number">{laundryBreakdown.available}</span>
              <span className="laundry-stat-label">Clean &amp; Available</span>
            </div>
            <div className="laundry-stat-divider" />
            <div className="laundry-stat-block dirty">
              <span className="laundry-stat-number">{laundryBreakdown.inLaundry}</span>
              <span className="laundry-stat-label">In Laundry</span>
            </div>
          </div>

          <div className="laundry-availability-bar-wrap">
            <div className="laundry-availability-bar-track">
              <div
                className="laundry-availability-bar-fill"
                style={{ width: `${availabilityPct}%` }}
                aria-label={`${availabilityPct}% available`}
              />
            </div>
            <span className="laundry-bar-pct">{availabilityPct}% ready to wear</span>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="analytics-section-card category-dist-card">
          <h2 className="analytics-section-title">Category Distribution</h2>
          <p className="analytics-section-subtitle">BREAKDOWN OF YOUR WARDROBE BY PIECE TYPE</p>

          <div className="category-dist-list">
            {[
              { key: 'top', label: 'Tops' },
              { key: 'bottom', label: 'Bottoms' },
              { key: 'shoes', label: 'Shoes' },
            ].map(({ key, label }) => {
              const count = categoryBreakdown[key] || 0;
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={key} className="category-dist-row">
                  <div className="cat-dist-label-row">
                    <span className="cat-dist-name">{label}</span>
                    <span className="cat-dist-count">{count} items · {pct}%</span>
                  </div>
                  <div className="cat-dist-bar-track">
                    <div
                      className={`cat-dist-bar-fill cat-${key}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Top 3 Most Used Clothing */}
      <section className="wireframe-podium-section-card">
        <div className="podium-section-header">
          <h2 className="podium-section-title">Top 3 Most Used Clothing</h2>
          <p className="podium-section-subtitle">
            STRICTLY COUNTED FROM ACTUAL WORN-OUTFIT RECORDS (SAVED OUTFITS DO NOT COUNT)
          </p>
        </div>

        {topClothing.length > 0 ? (
          <div className="podium-clothing-grid">
            {topClothing.map(({ item, wearCount }, index) => (
              <ClothingCard
                key={item.id}
                item={item}
                wearCount={wearCount}
                rank={index + 1}
              />
            ))}
          </div>
        ) : (
          <div className="analytics-empty-panel">
            <IconShirt size={34} />
            <p>Your top clothing insights will appear here once you start wearing outfits.</p>
            <p className="empty-subtext">
              Go to the Calendar and click "[ Mark as worn ]" on any scheduled look to record wear counts.
            </p>
          </div>
        )}
      </section>

      {/* 5. Recent Wear Logs */}
      <section className="analytics-section-card recent-wearlogs-card">
        <h2 className="analytics-section-title">Recent Wear Logs</h2>
        <p className="analytics-section-subtitle">LAST 5 CONFIRMED OUTFIT WEARS</p>

        {recentWears.length > 0 ? (
          <table className="wear-logs-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Outfit</th>
                <th>Style</th>
              </tr>
            </thead>
            <tbody>
              {recentWears.map((rec, i) => {
                const dateStr = rec.wornDate
                  ? new Date(rec.wornDate).toLocaleDateString('en-PH', {
                      year: 'numeric', month: 'short', day: 'numeric',
                    })
                  : '—';
                return (
                  <tr key={rec.id || i}>
                    <td className="wear-log-date">{dateStr}</td>
                    <td className="wear-log-outfit">{rec.outfit?.name || '—'}</td>
                    <td className="wear-log-style">{rec.outfit?.style || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="analytics-empty-panel">
            <p>No wear records yet. Mark outfits as worn via the Calendar tab.</p>
          </div>
        )}
      </section>
    </div>
  );
}
